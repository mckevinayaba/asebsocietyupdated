-- ASEB Society: intelligent community moderation and instant publishing. Depends on 0006 to 0010.
-- Status: prepared in the repository, applied to Lovable Cloud by the project owner after backup.
-- Additive and reversible. No content, review, report or notification row is deleted or rewritten,
-- and no pending contribution is published by this migration.
--
-- How it works. In 'automated' mode an author's ordinary community contribution enters a private
-- 'checking' state. A trusted server pipeline assesses it and records the outcome through
-- moderation_record_decision(), which only the service role can execute. Safe content is
-- published, clear violations are restricted, ambiguous content goes to human review. Nobody else,
-- including the author, can move content out of 'checking'. In 'pre_moderated' mode nothing
-- changes: every contribution waits for a moderator, as before.

-- 1. Publishing modes. The uncontrolled 'open' mode, in which a browser could publish directly
-- without any check, is retired. If production was set to 'open' it returns to 'pre_moderated'
-- (safe default). 'automated' is switched on by a Secretariat administrator once approved.
ALTER TABLE public.platform_settings DROP CONSTRAINT IF EXISTS platform_settings_check;
UPDATE public.platform_settings SET value = 'pre_moderated', updated_at = now() WHERE key = 'community_mode' AND value = 'open';
ALTER TABLE public.platform_settings ADD CONSTRAINT platform_settings_community_mode_check
  CHECK (key <> 'community_mode' OR value IN ('pre_moderated', 'automated'));

-- 2. Two private states: 'checking' (automated assessment in progress, or failed and awaiting a
-- retry) and 'restricted' (did not meet an approved community rule; editable and appealable).
ALTER TABLE public.content_items DROP CONSTRAINT IF EXISTS content_items_status_check;
ALTER TABLE public.content_items ADD CONSTRAINT content_items_status_check
  CHECK (status IN ('draft', 'submitted', 'checking', 'under_review', 'revision_requested', 'accepted', 'scheduled', 'published', 'restricted', 'declined', 'archived'));

-- Which kinds publish through automated checks. Stories, Playbook contributions and research
-- keep full editorial review.
CREATE FUNCTION public.is_community_kind(kind text) RETURNS boolean LANGUAGE sql IMMUTABLE SET search_path = '' AS $$
  SELECT kind IN ('post', 'article', 'question', 'answer', 'opportunity');
$$;
GRANT EXECUTE ON FUNCTION public.is_community_kind(text) TO anon, authenticated, service_role;

-- A stable fingerprint of what was assessed. A decision only applies to the exact text and media
-- it was made on, so an edit during assessment can never inherit an earlier approval.
CREATE FUNCTION public.content_fingerprint(item public.content_items) RETURNS text LANGUAGE sql IMMUTABLE SET search_path = '' AS $$
  SELECT md5(item.title || chr(31) || item.summary || chr(31) || item.body || chr(31) || item.media::text || chr(31) || item.details::text);
$$;
REVOKE ALL ON FUNCTION public.content_fingerprint(public.content_items) FROM PUBLIC, anon, authenticated;

-- 3. Account standing. Warnings, temporary restrictions and suspensions, applied by people.
CREATE TABLE public.account_restrictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  level text NOT NULL CHECK (level IN ('warning', 'temporary', 'suspended')),
  reason text NOT NULL CHECK (char_length(reason) BETWEEN 3 AND 2000),
  message_to_user text NOT NULL DEFAULT '' CHECK (char_length(message_to_user) <= 1000),
  ends_at timestamptz,
  created_by uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE RESTRICT,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (level <> 'temporary' OR ends_at IS NOT NULL)
);
CREATE INDEX account_restrictions_user_idx ON public.account_restrictions (user_id, created_at DESC);
ALTER TABLE public.account_restrictions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.account_restrictions FROM anon, authenticated;
GRANT SELECT, INSERT ON public.account_restrictions TO authenticated;
GRANT UPDATE (revoked_at) ON public.account_restrictions TO authenticated;
GRANT ALL ON public.account_restrictions TO service_role;
CREATE POLICY "Moderators read restrictions" ON public.account_restrictions FOR SELECT TO authenticated USING (public.can_moderate());
-- Moderators warn and restrict temporarily. Only administrators suspend.
CREATE POLICY "Moderators restrict accounts" ON public.account_restrictions FOR INSERT TO authenticated
  WITH CHECK (public.can_moderate() AND created_by = auth.uid() AND user_id <> auth.uid() AND (level <> 'suspended' OR public.is_secretariat_admin()));
CREATE POLICY "Moderators lift restrictions" ON public.account_restrictions FOR UPDATE TO authenticated
  USING (public.can_moderate() AND (level <> 'suspended' OR public.is_secretariat_admin())) WITH CHECK (public.can_moderate());

-- The signed-in person's own blocking restriction, if any. Used by the lifecycle trigger.
CREATE FUNCTION public.my_active_restriction() RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT r.level FROM public.account_restrictions r
  WHERE r.user_id = auth.uid() AND r.revoked_at IS NULL AND r.level IN ('temporary', 'suspended') AND (r.ends_at IS NULL OR r.ends_at > now())
  ORDER BY CASE r.level WHEN 'suspended' THEN 0 ELSE 1 END LIMIT 1;
$$;
REVOKE ALL ON FUNCTION public.my_active_restriction() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.my_active_restriction() TO authenticated;

-- People see their own standing, including warnings, and the message written for them.
CREATE FUNCTION public.my_account_standing() RETURNS TABLE (level text, message_to_user text, ends_at timestamptz, created_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT r.level, r.message_to_user, r.ends_at, r.created_at FROM public.account_restrictions r
  WHERE r.user_id = auth.uid() AND r.revoked_at IS NULL AND (r.ends_at IS NULL OR r.ends_at > now() OR r.level = 'warning')
  ORDER BY r.created_at DESC LIMIT 10;
$$;
REVOKE ALL ON FUNCTION public.my_account_standing() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.my_account_standing() TO authenticated;

-- Abuse limits for the signed-in author: standing, pace, daily volume and duplicates. Runs with
-- owner rights so it can count the author's own items (author_id is never readable by API roles),
-- and only ever looks at the caller's own activity.
CREATE FUNCTION public.publishing_limit_problem(p_id uuid, p_kind text, p_body text, p_parent uuid) RETURNS text LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE me uuid := auth.uid(); recent int;
BEGIN
  IF me IS NULL THEN RETURN NULL; END IF;
  IF public.my_active_restriction() IS NOT NULL THEN
    RETURN 'Your account cannot publish at the moment. See your account standing for details.';
  END IF;
  SELECT count(*) INTO recent FROM public.content_items c
    WHERE c.author_id = me AND c.id <> p_id AND c.status NOT IN ('draft', 'archived') AND c.updated_at > now() - interval '10 minutes';
  IF recent >= 10 THEN RETURN 'You are publishing very quickly. Please wait a few minutes and try again.'; END IF;
  SELECT count(*) INTO recent FROM public.content_items c
    WHERE c.author_id = me AND c.id <> p_id AND c.status NOT IN ('draft', 'archived') AND c.created_at > now() - interval '1 day';
  IF recent >= 60 THEN RETURN 'You have reached today''s publishing limit. Please continue tomorrow.'; END IF;
  IF EXISTS (SELECT 1 FROM public.content_items c WHERE c.author_id = me AND c.id <> p_id AND c.kind = p_kind
             AND c.status NOT IN ('draft', 'archived') AND c.created_at > now() - interval '1 day' AND md5(c.body) = md5(p_body)
             AND c.parent_id IS NOT DISTINCT FROM p_parent) THEN
    RETURN 'You have already shared this. Duplicate contributions are not published twice.';
  END IF;
  RETURN NULL;
END;
$$;
REVOKE ALL ON FUNCTION public.publishing_limit_problem(uuid, text, text, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.publishing_limit_problem(uuid, text, text, uuid) TO authenticated;

-- 4. The lifecycle, rewritten. Differences from 0007 are marked.
CREATE OR REPLACE FUNCTION public.enforce_content_lifecycle() RETURNS trigger LANGUAGE plpgsql SET search_path = '' AS $$
DECLARE
  editor boolean := public.can_edit_content();
  moderator boolean := public.can_moderate();
  community_kind boolean := public.is_community_kind(NEW.kind);
  automated boolean := public.community_mode() = 'automated';
  -- New: the trusted moderation engine. Set only inside moderation_record_decision(), never by
  -- an API role, so an author can never reach this branch.
  engine boolean := coalesce(current_setting('aseb.moderation_engine', true), '') = 'on' AND current_user NOT IN ('anon', 'authenticated');
  changed boolean;
  problem text;
BEGIN
  NEW.updated_at := now();
  IF TG_OP = 'INSERT' THEN
    NEW.published_at := NULL;
    NEW.featured := false;
    NEW.hidden_by_moderator := false;
    -- New: nothing is ever inserted as published. Community kinds enter 'checking' in automated
    -- mode. Everything else starts as a draft or a submission for review.
    IF NOT (NEW.status IN ('draft', 'submitted') OR (NEW.status = 'checking' AND community_kind AND automated)) THEN
      RAISE EXCEPTION 'New content can only be a draft or a submission' USING ERRCODE = '42501';
    END IF;
  ELSE
    IF NEW.id <> OLD.id OR NEW.author_id <> OLD.author_id OR NEW.kind <> OLD.kind OR NEW.created_at <> OLD.created_at THEN
      RAISE EXCEPTION 'Identity fields cannot change' USING ERRCODE = '42501';
    END IF;
    IF engine THEN
      IF NEW.status = 'published' AND OLD.status <> 'published' THEN
        NEW.published_at := coalesce(OLD.published_at, now());
      END IF;
      RETURN NEW;
    END IF;
  END IF;

  -- New: abuse limits and account standing for authors sending work to be published.
  IF NOT moderator AND NEW.status IN ('submitted', 'checking') AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM NEW.status OR NEW.body IS DISTINCT FROM OLD.body) THEN
    problem := public.publishing_limit_problem(NEW.id, NEW.kind, NEW.body, NEW.parent_id);
    IF problem IS NOT NULL THEN
      RAISE EXCEPTION '%', problem USING ERRCODE = '42501';
    END IF;
  END IF;

  IF TG_OP = 'INSERT' THEN
    RETURN NEW;
  END IF;

  IF NOT moderator THEN
    IF NEW.featured <> OLD.featured OR NEW.hidden_by_moderator <> OLD.hidden_by_moderator OR NEW.published_at IS DISTINCT FROM OLD.published_at OR NEW.slug <> OLD.slug THEN
      RAISE EXCEPTION 'Only the Secretariat can change publication fields' USING ERRCODE = '42501';
    END IF;
    IF NEW.status = 'archived' AND OLD.status <> 'archived' THEN
      RETURN NEW;
    END IF;
    changed := NEW.title IS DISTINCT FROM OLD.title OR NEW.summary IS DISTINCT FROM OLD.summary OR NEW.body IS DISTINCT FROM OLD.body
      OR NEW.media IS DISTINCT FROM OLD.media OR NEW.details IS DISTINCT FROM OLD.details;
    -- New: a published community contribution can be edited, but the revision goes private
    -- until it is checked again (or reviewed, in pre-moderated mode). Metadata edits that do not
    -- change what readers see are not allowed on published work.
    IF OLD.status = 'published' AND community_kind THEN
      IF changed AND ((automated AND NEW.status = 'checking') OR (NOT automated AND NEW.status = 'submitted')) THEN
        RETURN NEW;
      END IF;
      RAISE EXCEPTION 'Edits to published work are checked again before they appear. Publish your changes to continue.' USING ERRCODE = '42501';
    END IF;
    -- Authors edit drafts, submissions, revision requests, and their own checking or restricted
    -- community work. They may only send it on as a draft, a submission, or for checking.
    IF OLD.status NOT IN ('draft', 'submitted', 'revision_requested', 'checking', 'restricted')
       OR NOT (NEW.status IN ('draft', 'submitted') OR (NEW.status = 'checking' AND community_kind AND automated)) THEN
      RAISE EXCEPTION 'This content is with the editors and cannot be changed now' USING ERRCODE = '42501';
    END IF;
    -- A contribution waiting in 'checking' cannot be re-sent unchanged to get a second
    -- assessment without the server: only the engine leaves 'checking'.
    RETURN NEW;
  END IF;

  -- Moderators can publish, hide, restore, restrict and decline community content. Editorial
  -- decisions on stories, Playbook contributions and research need an editor.
  IF NOT editor AND NOT community_kind AND (NEW.status IS DISTINCT FROM OLD.status OR NEW.featured <> OLD.featured) THEN
    RAISE EXCEPTION 'Editorial decisions need an editor' USING ERRCODE = '42501';
  END IF;
  IF (NEW.body IS DISTINCT FROM OLD.body OR NEW.title IS DISTINCT FROM OLD.title) AND NOT OLD.consent_edit THEN
    RAISE EXCEPTION 'The contributor has not allowed editorial changes to their text' USING ERRCODE = '42501';
  END IF;
  IF NEW.status IN ('published', 'scheduled', 'accepted') AND NOT NEW.consent_publish THEN
    RAISE EXCEPTION 'The contributor has not given publication consent' USING ERRCODE = '42501';
  END IF;
  IF NEW.status = 'published' AND OLD.status <> 'published' THEN
    NEW.published_at := coalesce(OLD.published_at, now());
  ELSIF NEW.status = 'scheduled' AND OLD.status <> 'scheduled' THEN
    NEW.published_at := NEW.scheduled_for;
  END IF;
  RETURN NEW;
END;
$$;

-- 5. The record of every automated assessment. Append only: no API role can change or delete it.
CREATE TABLE public.moderation_assessments (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  content_id uuid NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  fingerprint text NOT NULL,
  decision text NOT NULL CHECK (decision IN ('publish', 'restrict', 'escalate', 'error')),
  categories text[] NOT NULL DEFAULT '{}',
  rule_hits jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(rule_hits) = 'array'),
  provider text NOT NULL CHECK (char_length(provider) <= 60),
  model text NOT NULL DEFAULT '' CHECK (char_length(model) <= 80),
  scores jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(scores) = 'object'),
  public_reason text NOT NULL DEFAULT '' CHECK (char_length(public_reason) <= 600),
  applied boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX moderation_assessments_content_idx ON public.moderation_assessments (content_id, created_at DESC);
ALTER TABLE public.moderation_assessments ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.moderation_assessments FROM PUBLIC, anon, authenticated, service_role;
GRANT SELECT ON public.moderation_assessments TO authenticated, service_role;
CREATE POLICY "Moderators read assessments" ON public.moderation_assessments FOR SELECT TO authenticated USING (public.can_moderate());
CREATE POLICY "Service reads assessments" ON public.moderation_assessments FOR SELECT TO service_role USING (true);

-- What the trusted server needs to assess an item: its content and fingerprint, nothing about the
-- author's account or profile. Service role only.
CREATE FUNCTION public.moderation_snapshot(p_content uuid)
RETURNS TABLE (id uuid, kind text, status text, author_id uuid, title text, summary text, body text, media jsonb, details jsonb, fingerprint text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT c.id, c.kind, c.status, c.author_id, c.title, c.summary, c.body, c.media, c.details, public.content_fingerprint(c)
  FROM public.content_items c WHERE c.id = p_content;
$$;
REVOKE ALL ON FUNCTION public.moderation_snapshot(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.moderation_snapshot(uuid) TO service_role;

-- The only route out of 'checking'. Service role only. Records the assessment, then applies it
-- if the item is still checking and unchanged since it was assessed.
CREATE FUNCTION public.moderation_record_decision(p_content uuid, p_fingerprint text, p_decision text, p_categories text[], p_rule_hits jsonb, p_provider text, p_model text, p_scores jsonb, p_public_reason text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  item public.content_items;
  current_fp text;
  target text;
  assessment bigint;
BEGIN
  IF p_decision NOT IN ('publish', 'restrict', 'escalate', 'error') THEN
    RAISE EXCEPTION 'Unknown moderation decision' USING ERRCODE = '22023';
  END IF;
  SELECT * INTO item FROM public.content_items WHERE id = p_content FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Content not found' USING ERRCODE = 'P0002';
  END IF;
  current_fp := public.content_fingerprint(item);
  INSERT INTO public.moderation_assessments (content_id, fingerprint, decision, categories, rule_hits, provider, model, scores, public_reason)
  VALUES (p_content, p_fingerprint, p_decision, coalesce(p_categories, '{}'), coalesce(p_rule_hits, '[]'::jsonb), p_provider, coalesce(p_model, ''), coalesce(p_scores, '{}'::jsonb), left(coalesce(p_public_reason, ''), 600))
  RETURNING id INTO assessment;
  -- Stale or already decided: keep the record, change nothing.
  IF item.status <> 'checking' THEN RETURN item.status; END IF;
  IF current_fp <> p_fingerprint THEN RETURN 'stale'; END IF;
  IF p_decision = 'error' THEN RETURN 'checking'; END IF;
  target := CASE p_decision WHEN 'publish' THEN 'published' WHEN 'restrict' THEN 'restricted' ELSE 'under_review' END;
  PERFORM set_config('aseb.moderation_engine', 'on', true);
  UPDATE public.content_items SET status = target WHERE id = p_content;
  PERFORM set_config('aseb.moderation_engine', 'off', true);
  UPDATE public.moderation_assessments SET applied = true WHERE id = assessment;
  IF p_decision = 'restrict' THEN
    INSERT INTO public.notifications (user_id, kind, content_id, message)
    VALUES (item.author_id, 'moderation', p_content, left('Your contribution was not published. ' || coalesce(nullif(p_public_reason, ''), 'It may not meet the Community Guidelines.') || ' You can edit it or ask for a human review.', 300));
  ELSIF p_decision = 'escalate' THEN
    INSERT INTO public.notifications (user_id, kind, content_id, message)
    VALUES (item.author_id, 'moderation', p_content, 'Your contribution is with a moderator for a quick review. It stays private until then.');
  END IF;
  RETURN target;
END;
$$;
REVOKE ALL ON FUNCTION public.moderation_record_decision(uuid, text, text, text[], jsonb, text, text, jsonb, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.moderation_record_decision(uuid, text, text, text[], jsonb, text, text, jsonb, text) TO service_role;

-- Authors see the outcome and the reason written for them, never scores or internal rule names.
CREATE FUNCTION public.my_moderation_outcomes() RETURNS TABLE (content_id uuid, decision text, public_reason text, created_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT DISTINCT ON (a.content_id) a.content_id, a.decision, a.public_reason, a.created_at
  FROM public.moderation_assessments a JOIN public.content_items c ON c.id = a.content_id
  WHERE c.author_id = auth.uid()
  ORDER BY a.content_id, a.created_at DESC;
$$;
REVOKE ALL ON FUNCTION public.my_moderation_outcomes() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.my_moderation_outcomes() TO authenticated;

-- 6. Notifications gain a moderation kind.
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_kind_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_kind_check CHECK (kind IN ('reply', 'answer', 'reaction', 'follow', 'editorial', 'published', 'moderation'));

-- 7. Appeals: an author asks a person to look again at a restricted contribution.
CREATE TABLE public.moderation_appeals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message text NOT NULL DEFAULT '' CHECK (char_length(message) <= 1500),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'upheld', 'overturned')),
  resolution_note text NOT NULL DEFAULT '' CHECK (char_length(resolution_note) <= 2000),
  resolved_by uuid REFERENCES auth.users(id),
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX moderation_appeals_one_open ON public.moderation_appeals (content_id) WHERE status = 'open';
ALTER TABLE public.moderation_appeals ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.moderation_appeals FROM anon, authenticated;
GRANT SELECT ON public.moderation_appeals TO authenticated;
GRANT UPDATE (status, resolution_note, resolved_by, resolved_at) ON public.moderation_appeals TO authenticated;
GRANT ALL ON public.moderation_appeals TO service_role;
CREATE POLICY "Authors and moderators read appeals" ON public.moderation_appeals FOR SELECT TO authenticated USING (author_id = auth.uid() OR public.can_moderate());
CREATE POLICY "Moderators resolve appeals" ON public.moderation_appeals FOR UPDATE TO authenticated USING (public.can_moderate()) WITH CHECK (public.can_moderate() AND resolved_by = auth.uid());

CREATE FUNCTION public.request_moderation_review(p_content uuid, p_message text) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE item public.content_items; created uuid;
BEGIN
  SELECT * INTO item FROM public.content_items WHERE id = p_content;
  IF NOT FOUND OR item.author_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'You can only ask for a review of your own contribution' USING ERRCODE = '42501';
  END IF;
  IF item.status <> 'restricted' THEN
    RAISE EXCEPTION 'Only a contribution that was not published can be sent for review' USING ERRCODE = '42501';
  END IF;
  IF (SELECT count(*) FROM public.moderation_appeals a WHERE a.author_id = auth.uid() AND a.created_at > now() - interval '1 day') >= 5 THEN
    RAISE EXCEPTION 'You have asked for several reviews today. Please wait for the moderators to respond.' USING ERRCODE = '42501';
  END IF;
  INSERT INTO public.moderation_appeals (content_id, author_id, message) VALUES (p_content, auth.uid(), left(coalesce(p_message, ''), 1500)) RETURNING id INTO created;
  RETURN created;
EXCEPTION WHEN unique_violation THEN
  RAISE EXCEPTION 'A review of this contribution has already been requested' USING ERRCODE = '42501';
END;
$$;
REVOKE ALL ON FUNCTION public.request_moderation_review(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.request_moderation_review(uuid, text) TO authenticated;

-- 8. Reports: wider categories, abuse limits. A report never changes a contribution by itself.
ALTER TABLE public.content_reports DROP CONSTRAINT IF EXISTS content_reports_reason_check;
ALTER TABLE public.content_reports ADD CONSTRAINT content_reports_reason_check
  CHECK (reason IN ('spam', 'suspicious_opportunity', 'harassment', 'discrimination', 'threat', 'privacy', 'impersonation', 'false_or_misleading', 'confidential', 'other'));
CREATE FUNCTION public.limit_reports() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF (SELECT count(*) FROM public.content_reports r WHERE r.reporter_id = NEW.reporter_id AND r.created_at > now() - interval '1 day') >= 20 THEN
    RAISE EXCEPTION 'You have sent many reports today. The moderators will review them.' USING ERRCODE = '42501';
  END IF;
  IF public.is_content_author(NEW.content_id) THEN
    RAISE EXCEPTION 'You cannot report your own contribution' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.limit_reports() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER limit_reports BEFORE INSERT ON public.content_reports FOR EACH ROW EXECUTE FUNCTION public.limit_reports();

-- 9. Audit: moderation actions by people are recorded alongside editorial decisions.
ALTER TABLE public.secretariat_audit_log DROP CONSTRAINT secretariat_audit_log_action_check;
ALTER TABLE public.secretariat_audit_log ADD CONSTRAINT secretariat_audit_log_action_check
  CHECK (action IN ('note_added', 'review_stage_changed', 'records_exported', 'editorial_decision', 'report_resolved', 'setting_changed', 'chapter_changed', 'account_restricted', 'restriction_lifted', 'appeal_resolved'));
CREATE FUNCTION public.audit_account_restriction() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.secretariat_audit_log (actor_id, action, subject_type, subject_id, detail) VALUES (auth.uid(), 'account_restricted', 'account', NEW.user_id, jsonb_build_object('level', NEW.level, 'ends_at', NEW.ends_at));
    INSERT INTO public.notifications (user_id, kind, message) VALUES (NEW.user_id, 'moderation', CASE NEW.level WHEN 'warning' THEN 'A moderator has sent you a message about the Community Guidelines.' ELSE 'Your ability to publish has been paused. See your account standing for details.' END);
  ELSIF NEW.revoked_at IS NOT NULL AND OLD.revoked_at IS NULL THEN
    INSERT INTO public.secretariat_audit_log (actor_id, action, subject_type, subject_id, detail) VALUES (auth.uid(), 'restriction_lifted', 'account', NEW.user_id, jsonb_build_object('level', NEW.level));
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.audit_account_restriction() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER audit_account_restriction AFTER INSERT OR UPDATE ON public.account_restrictions FOR EACH ROW EXECUTE FUNCTION public.audit_account_restriction();
CREATE FUNCTION public.audit_appeal() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF NEW.status <> 'open' AND OLD.status = 'open' THEN
    INSERT INTO public.secretariat_audit_log (actor_id, action, subject_type, subject_id, detail) VALUES (auth.uid(), 'appeal_resolved', 'moderation_appeal', NEW.id, jsonb_build_object('outcome', NEW.status));
    INSERT INTO public.notifications (user_id, kind, content_id, message) VALUES (NEW.author_id, 'moderation', NEW.content_id,
      CASE NEW.status WHEN 'overturned' THEN 'A moderator reviewed your contribution and published it.' ELSE 'A moderator reviewed your contribution. It remains unpublished.' END);
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.audit_appeal() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER audit_appeal AFTER UPDATE ON public.moderation_appeals FOR EACH ROW EXECUTE FUNCTION public.audit_appeal();

-- 9b. People can restrict escalated community work (editable and appealable), and the author is told.
ALTER TABLE public.editorial_reviews DROP CONSTRAINT IF EXISTS editorial_reviews_decision_check;
ALTER TABLE public.editorial_reviews ADD CONSTRAINT editorial_reviews_decision_check
  CHECK (decision IN ('note', 'assigned', 'revision_requested', 'accepted', 'scheduled', 'published', 'declined', 'archived', 'hidden', 'restored', 'featured', 'unfeatured', 'restricted'));
CREATE OR REPLACE FUNCTION public.notify_on_review() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE author uuid;
BEGIN
  IF NEW.decision IN ('revision_requested', 'accepted', 'scheduled', 'declined', 'restricted') THEN
    SELECT author_id INTO author FROM public.content_items WHERE id = NEW.content_id;
    INSERT INTO public.notifications (user_id, kind, content_id, message) VALUES (author, CASE WHEN NEW.decision = 'restricted' THEN 'moderation' ELSE 'editorial' END, NEW.content_id,
      CASE WHEN NEW.decision = 'restricted' THEN 'A moderator reviewed your contribution and did not publish it. You can edit it or ask for another review.' ELSE 'An editor has responded to your submission' END);
  END IF;
  RETURN NEW;
END;
$$;

-- 10. Indicators for moderators: real counts only.
CREATE FUNCTION public.moderation_indicators(days int DEFAULT 30)
RETURNS TABLE (published bigint, restricted bigint, escalated bigint, errors bigint, waiting_for_people bigint, checking_now bigint, open_reports bigint, open_appeals bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT
    (SELECT count(*) FROM public.moderation_assessments WHERE decision = 'publish' AND applied AND created_at > now() - make_interval(days => days)),
    (SELECT count(*) FROM public.moderation_assessments WHERE decision = 'restrict' AND applied AND created_at > now() - make_interval(days => days)),
    (SELECT count(*) FROM public.moderation_assessments WHERE decision = 'escalate' AND applied AND created_at > now() - make_interval(days => days)),
    (SELECT count(*) FROM public.moderation_assessments WHERE decision = 'error' AND created_at > now() - make_interval(days => days)),
    (SELECT count(*) FROM public.content_items WHERE status IN ('submitted', 'under_review')),
    (SELECT count(*) FROM public.content_items WHERE status = 'checking'),
    (SELECT count(*) FROM public.content_reports WHERE status = 'open'),
    (SELECT count(*) FROM public.moderation_appeals WHERE status = 'open')
  WHERE public.can_moderate();
$$;
REVOKE ALL ON FUNCTION public.moderation_indicators(int) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.moderation_indicators(int) TO authenticated;

-- Rollback (keeps every content row): set community_mode to 'pre_moderated', move any 'checking'
-- or 'restricted' items to 'submitted', then restore the 0007 versions of
-- enforce_content_lifecycle and the status, reason and kind constraints, and drop the objects
-- created above. Export moderation_assessments, moderation_appeals and account_restrictions first.
