-- ASEB Society: Secretariat access model and security hardening.
-- Additive only. No existing row is updated, deleted or reseeded.
-- Status: prepared in the repository. It must be applied to Lovable Cloud by the project owner
-- after a verified backup. See docs/DATA_GOVERNANCE.md for provisioning and rollback.

-- 1. Hardening. create_member_profile() is a SECURITY DEFINER trigger function that kept the
-- default EXECUTE grant to PUBLIC. Trigger execution does not check EXECUTE, so revoking it
-- leaves account creation and profile creation unchanged while removing the direct grant.
REVOKE ALL ON FUNCTION public.create_member_profile() FROM PUBLIC, anon, authenticated;
-- is_verified_application_owner(text) keeps EXECUTE for authenticated: the applicant read policy
-- calls it, and it only compares the input with the caller's own verified email.
REVOKE ALL ON FUNCTION public.is_verified_application_owner(text) FROM anon;

-- 2. Secretariat roles. Least privilege: reviewers read and annotate, admins also read the audit log.
-- No role grants approval or decline rights. That authority model has not been approved.
CREATE TYPE public.secretariat_role AS ENUM ('secretariat_admin', 'secretariat_reviewer');

CREATE TABLE public.secretariat_roles (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.secretariat_role NOT NULL,
  granted_at timestamptz NOT NULL DEFAULT now(),
  granted_note text NOT NULL DEFAULT '' CHECK (char_length(granted_note) <= 500),
  PRIMARY KEY (user_id, role)
);
ALTER TABLE public.secretariat_roles ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.secretariat_roles FROM anon, authenticated;
GRANT SELECT ON public.secretariat_roles TO authenticated;
GRANT ALL ON public.secretariat_roles TO service_role;
-- People may see their own roles. There is deliberately no INSERT, UPDATE or DELETE grant or policy:
-- roles are provisioned only by the database owner, so nobody can elevate their own privileges.
CREATE POLICY "Read own secretariat roles" ON public.secretariat_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Parameterless checks so callers cannot probe whether another account holds a role.
CREATE FUNCTION public.is_secretariat() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.secretariat_roles r JOIN auth.users u ON u.id = r.user_id
    WHERE r.user_id = auth.uid() AND u.email_confirmed_at IS NOT NULL
  );
$$;
CREATE FUNCTION public.is_secretariat_admin() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.secretariat_roles r JOIN auth.users u ON u.id = r.user_id
    WHERE r.user_id = auth.uid() AND r.role = 'secretariat_admin' AND u.email_confirmed_at IS NOT NULL
  );
$$;
REVOKE ALL ON FUNCTION public.is_secretariat() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_secretariat_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_secretariat() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_secretariat_admin() TO authenticated;

-- 3. Secretariat read access to existing intake. Public INSERT policies are unchanged.
GRANT SELECT ON public.partnership_enquiries, public.insight_pitches, public.registry_submissions TO authenticated;
CREATE POLICY "Secretariat reads applications" ON public.membership_applications FOR SELECT TO authenticated USING (public.is_secretariat());
CREATE POLICY "Secretariat reads profiles" ON public.profiles FOR SELECT TO authenticated USING (public.is_secretariat());
CREATE POLICY "Secretariat reads circle selections" ON public.circle_memberships FOR SELECT TO authenticated USING (public.is_secretariat());
CREATE POLICY "Secretariat reads programme interest" ON public.programme_interests FOR SELECT TO authenticated USING (public.is_secretariat());
CREATE POLICY "Secretariat reads partnership enquiries" ON public.partnership_enquiries FOR SELECT TO authenticated USING (public.is_secretariat());
CREATE POLICY "Secretariat reads editorial pitches" ON public.insight_pitches FOR SELECT TO authenticated USING (public.is_secretariat());
CREATE POLICY "Secretariat reads registry submissions" ON public.registry_submissions FOR SELECT TO authenticated USING (public.is_secretariat());

-- 4. Review stage, separate from the approval decision. Column level grant: the Secretariat can move an
-- application through review, but cannot change status, contact details or any other column.
ALTER TABLE public.membership_applications
  ADD COLUMN review_stage text NOT NULL DEFAULT 'received'
  CHECK (review_stage IN ('received', 'under_review', 'information_requested', 'incomplete'));
-- Supabase default privileges can grant table wide UPDATE to API roles. Remove it first, so the
-- column grant below is the only update right and status (the approval decision) stays untouchable.
REVOKE UPDATE, DELETE, TRUNCATE ON public.membership_applications FROM anon, authenticated;
GRANT UPDATE (review_stage) ON public.membership_applications TO authenticated;
CREATE POLICY "Secretariat updates review stage" ON public.membership_applications FOR UPDATE TO authenticated
  USING (public.is_secretariat()) WITH CHECK (public.is_secretariat());

-- 5. Registered accounts, reconciled with profiles. Guarded inside the function as well as by grants.
CREATE FUNCTION public.secretariat_list_accounts()
RETURNS TABLE (id uuid, email text, email_confirmed boolean, created_at timestamptz, last_sign_in_at timestamptz, name text, country text, organisation text, primary_role text)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF NOT public.is_secretariat() THEN
    RAISE EXCEPTION 'Not authorised' USING ERRCODE = '42501';
  END IF;
  RETURN QUERY
    SELECT u.id, u.email::text, u.email_confirmed_at IS NOT NULL, u.created_at, u.last_sign_in_at,
           coalesce(p.name, ''), coalesce(p.country, ''), coalesce(p.organisation, ''), coalesce(p.primary_role, '')
    FROM auth.users u LEFT JOIN public.profiles p ON p.id = u.id
    ORDER BY u.created_at DESC;
END;
$$;
REVOKE ALL ON FUNCTION public.secretariat_list_accounts() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.secretariat_list_accounts() TO authenticated;

-- 6. Internal notes. Append only: no UPDATE or DELETE, so the review history is preserved.
CREATE TABLE public.secretariat_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_type text NOT NULL CHECK (subject_type IN ('membership_application', 'account', 'partnership_enquiry', 'programme_interest', 'insight_pitch', 'registry_submission')),
  subject_id uuid NOT NULL,
  author_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE RESTRICT,
  body text NOT NULL CHECK (char_length(btrim(body)) BETWEEN 1 AND 4000),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.secretariat_notes ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.secretariat_notes FROM anon, authenticated;
GRANT SELECT, INSERT ON public.secretariat_notes TO authenticated;
GRANT ALL ON public.secretariat_notes TO service_role;
CREATE POLICY "Secretariat reads notes" ON public.secretariat_notes FOR SELECT TO authenticated USING (public.is_secretariat());
CREATE POLICY "Secretariat adds own notes" ON public.secretariat_notes FOR INSERT TO authenticated WITH CHECK (public.is_secretariat() AND author_id = auth.uid());
CREATE INDEX secretariat_notes_subject_idx ON public.secretariat_notes (subject_type, subject_id, created_at DESC);

-- 7. Audit log for sensitive actions. Secretariat members may only write rows as themselves.
-- Only Secretariat admins may read it.
CREATE TABLE public.secretariat_audit_log (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE RESTRICT,
  action text NOT NULL CHECK (action IN ('note_added', 'review_stage_changed', 'records_exported')),
  subject_type text CHECK (subject_type IS NULL OR char_length(subject_type) <= 60),
  subject_id uuid,
  detail jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(detail) = 'object' AND octet_length(detail::text) <= 4000),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.secretariat_audit_log ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.secretariat_audit_log FROM anon, authenticated;
GRANT SELECT, INSERT ON public.secretariat_audit_log TO authenticated;
GRANT ALL ON public.secretariat_audit_log TO service_role;
CREATE POLICY "Secretariat writes own audit entries" ON public.secretariat_audit_log FOR INSERT TO authenticated WITH CHECK (public.is_secretariat() AND actor_id = auth.uid());
CREATE POLICY "Secretariat admins read audit log" ON public.secretariat_audit_log FOR SELECT TO authenticated USING (public.is_secretariat_admin());
CREATE INDEX secretariat_audit_log_created_idx ON public.secretariat_audit_log (created_at DESC);

-- Automatic audit entries, written with the caller's own rights so the policies above still apply.
CREATE FUNCTION public.audit_secretariat_note() RETURNS trigger LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
  INSERT INTO public.secretariat_audit_log (actor_id, action, subject_type, subject_id)
  VALUES (auth.uid(), 'note_added', NEW.subject_type, NEW.subject_id);
  RETURN NEW;
END;
$$;
CREATE TRIGGER audit_secretariat_note AFTER INSERT ON public.secretariat_notes FOR EACH ROW EXECUTE FUNCTION public.audit_secretariat_note();

CREATE FUNCTION public.audit_review_stage() RETURNS trigger LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
  IF NEW.review_stage IS DISTINCT FROM OLD.review_stage THEN
    INSERT INTO public.secretariat_audit_log (actor_id, action, subject_type, subject_id, detail)
    VALUES (auth.uid(), 'review_stage_changed', 'membership_application', NEW.id, jsonb_build_object('from', OLD.review_stage, 'to', NEW.review_stage));
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER audit_review_stage AFTER UPDATE OF review_stage ON public.membership_applications FOR EACH ROW EXECUTE FUNCTION public.audit_review_stage();
REVOKE ALL ON FUNCTION public.audit_secretariat_note() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.audit_review_stage() FROM PUBLIC, anon, authenticated;
