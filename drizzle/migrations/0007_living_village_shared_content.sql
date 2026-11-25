-- ASEB Society: The Living Village. One shared content model for the five digital knowledge
-- products: The Field, the African Ecosystem Building Playbook, ASEB Voices, Ask the Village and
-- State of the Field. Additive only. Depends on 0006 (secretariat_roles, is_secretariat()).
-- Status: prepared in the repository, applied to Lovable Cloud by the project owner after backup.

-- 1. Editorial and moderation roles, added to the existing Secretariat role type.
ALTER TYPE public.secretariat_role ADD VALUE IF NOT EXISTS 'editor';
ALTER TYPE public.secretariat_role ADD VALUE IF NOT EXISTS 'moderator';

-- Role checks compare text so they can be created in the same migration as the new values.
-- Membership records stay limited to administrators and reviewers: editors and moderators work
-- on content only, so is_secretariat() is narrowed to those two roles (least privilege).
CREATE OR REPLACE FUNCTION public.is_secretariat() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.secretariat_roles r JOIN auth.users u ON u.id = r.user_id
    WHERE r.user_id = auth.uid() AND u.email_confirmed_at IS NOT NULL AND r.role::text IN ('secretariat_admin', 'secretariat_reviewer')
  );
$$;
CREATE FUNCTION public.has_staff_role(roles text[]) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.secretariat_roles r JOIN auth.users u ON u.id = r.user_id
    WHERE r.user_id = auth.uid() AND u.email_confirmed_at IS NOT NULL AND r.role::text = ANY (roles)
  );
$$;
CREATE FUNCTION public.can_edit_content() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT public.has_staff_role(ARRAY['secretariat_admin', 'editor']);
$$;
CREATE FUNCTION public.can_moderate() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT public.has_staff_role(ARRAY['secretariat_admin', 'editor', 'moderator']);
$$;
CREATE FUNCTION public.is_verified_user() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email_confirmed_at IS NOT NULL);
$$;
REVOKE ALL ON FUNCTION public.has_staff_role(text[]) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.can_edit_content() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.can_moderate() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_verified_user() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.can_edit_content(), public.can_moderate(), public.is_verified_user() TO authenticated;
-- Visitors evaluate public read policies that mention these checks, so they may call them too.
-- Each returns false without a signed-in staff account.
GRANT EXECUTE ON FUNCTION public.can_edit_content(), public.can_moderate() TO anon;
-- has_staff_role is only called from the SECURITY DEFINER wrappers above, which run as owner.

-- 2. Platform settings. Community publishing starts pre-moderated until community guidelines are
-- approved. Only Secretariat administrators can change it.
CREATE TABLE public.platform_settings (
  key text PRIMARY KEY CHECK (key IN ('community_mode')),
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (key <> 'community_mode' OR value IN ('pre_moderated', 'open'))
);
INSERT INTO public.platform_settings (key, value) VALUES ('community_mode', 'pre_moderated');
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.platform_settings FROM anon, authenticated;
GRANT SELECT ON public.platform_settings TO anon, authenticated;
GRANT UPDATE (value, updated_at) ON public.platform_settings TO authenticated;
GRANT ALL ON public.platform_settings TO service_role;
CREATE POLICY "Anyone reads platform settings" ON public.platform_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins change platform settings" ON public.platform_settings FOR UPDATE TO authenticated USING (public.is_secretariat_admin()) WITH CHECK (public.is_secretariat_admin());

CREATE FUNCTION public.community_mode() RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT coalesce((SELECT value FROM public.platform_settings WHERE key = 'community_mode'), 'pre_moderated');
$$;
REVOKE ALL ON FUNCTION public.community_mode() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.community_mode() TO anon, authenticated;

-- 3. Professional identity. Profiles gain public-facing fields and visibility. No contact details.
ALTER TABLE public.profiles
  ADD COLUMN headline text NOT NULL DEFAULT '' CHECK (char_length(headline) <= 160),
  ADD COLUMN countries_of_operation text[] NOT NULL DEFAULT '{}' CHECK (cardinality(countries_of_operation) <= 60),
  ADD COLUMN expertise text[] NOT NULL DEFAULT '{}' CHECK (cardinality(expertise) <= 20),
  ADD COLUMN participation_paths text[] NOT NULL DEFAULT '{}' CHECK (participation_paths <@ ARRAY['builder','founder','institution','research','finance','policy','expertise','aspiring','connect']::text[]),
  ADD COLUMN links text[] NOT NULL DEFAULT '{}' CHECK (cardinality(links) <= 5),
  ADD COLUMN visibility text NOT NULL DEFAULT 'private' CHECK (visibility IN ('public', 'community', 'private')),
  ADD COLUMN home_preference text NOT NULL DEFAULT 'field' CHECK (home_preference IN ('field', 'institution')),
  ADD COLUMN guidelines_accepted_at timestamptz,
  ADD COLUMN onboarded_at timestamptz;
-- Other people's profiles are read only through this function, which returns safe public fields
-- and respects each person's visibility choice. Preferences and dates are never exposed.
CREATE FUNCTION public.public_profiles(ids uuid[] DEFAULT NULL, search text DEFAULT NULL, max_rows int DEFAULT 40)
RETURNS TABLE (id uuid, name text, headline text, primary_role text, organisation text, country text, countries_of_operation text[], expertise text[], bio text, links text[])
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT p.id, p.name, p.headline, p.primary_role, p.organisation, p.country, p.countries_of_operation, p.expertise, p.bio, p.links
  FROM public.profiles p
  WHERE (p.visibility = 'public' OR (p.visibility = 'community' AND auth.uid() IS NOT NULL) OR p.id = auth.uid())
    AND (ids IS NULL OR p.id = ANY (ids))
    AND (search IS NULL OR (p.name || ' ' || p.headline || ' ' || p.organisation || ' ' || p.country) ILIKE '%' || replace(replace(search, '%', ''), '_', '') || '%')
    AND char_length(p.name) > 0
  ORDER BY p.name
  LIMIT least(greatest(max_rows, 1), 100);
$$;
REVOKE ALL ON FUNCTION public.public_profiles(uuid[], text, int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.public_profiles(uuid[], text, int) TO anon, authenticated;

-- 4. ASEB Voices editorial categories, managed by editors.
CREATE TABLE public.voices_categories (
  key text PRIMARY KEY CHECK (key ~ '^[a-z][a-z0-9-]{1,40}$'),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 80),
  description text NOT NULL DEFAULT '' CHECK (char_length(description) <= 400),
  position int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true
);
INSERT INTO public.voices_categories (key, name, description, position) VALUES
  ('builders', 'Builders'' Voices', 'The people who design and run entrepreneurship support, in their own words.', 1),
  ('founders', 'Founders'' Voices', 'Founders on the support systems that shaped their journeys: what worked, what did not, and who made a difference.', 2),
  ('institutional', 'Institutional Voices', 'Hubs, agencies and support organisations reflecting on their practice.', 3),
  ('research', 'Research Voices', 'Researchers translating evidence for practitioners.', 4),
  ('policy', 'Policy Voices', 'Policymakers and advocates on the rules that shape enterprise.', 5),
  ('community', 'Community Voices', 'Township, rural, informal and community economies.', 6),
  ('capital', 'Capital Voices', 'Investors and financiers on building capital that fits African enterprise.', 7),
  ('diaspora', 'Diaspora Voices', 'Africans abroad and international supporters building bridges.', 8),
  ('uncomfortable-truth', 'The Uncomfortable Truth', 'Failures, mistakes and lessons the field cannot afford to lose.', 9);
ALTER TABLE public.voices_categories ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.voices_categories FROM anon, authenticated;
GRANT SELECT ON public.voices_categories TO anon, authenticated;
GRANT INSERT, UPDATE ON public.voices_categories TO authenticated;
GRANT ALL ON public.voices_categories TO service_role;
CREATE POLICY "Anyone reads categories" ON public.voices_categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Editors add categories" ON public.voices_categories FOR INSERT TO authenticated WITH CHECK (public.can_edit_content());
CREATE POLICY "Editors change categories" ON public.voices_categories FOR UPDATE TO authenticated USING (public.can_edit_content()) WITH CHECK (public.can_edit_content());

-- 5. Playbook chapters and versions. Seeded as proposed topics, never as completed standards.
CREATE TABLE public.playbook_chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' AND char_length(slug) <= 80),
  position int NOT NULL,
  title text NOT NULL CHECK (char_length(title) BETWEEN 3 AND 160),
  introduction text NOT NULL DEFAULT '' CHECK (char_length(introduction) <= 3000),
  contribution_call text NOT NULL DEFAULT '' CHECK (char_length(contribution_call) <= 1500),
  questions text[] NOT NULL DEFAULT '{}' CHECK (cardinality(questions) <= 12),
  status text NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed', 'open', 'drafting', 'in_review', 'published', 'archived')),
  current_version int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.playbook_chapter_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id uuid NOT NULL REFERENCES public.playbook_chapters(id) ON DELETE CASCADE,
  version int NOT NULL,
  body text NOT NULL CHECK (char_length(body) <= 120000),
  note text NOT NULL DEFAULT '' CHECK (char_length(note) <= 1000),
  editor_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE RESTRICT,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (chapter_id, version)
);
INSERT INTO public.playbook_chapters (slug, position, title, status, contribution_call) VALUES
  ('why-entrepreneurship-matters', 1, 'Why entrepreneurship matters to Africa', 'open', 'How has enterprise changed the economy, community or household you know best?'),
  ('understanding-ecosystems', 2, 'Understanding African entrepreneurial ecosystems', 'open', 'Describe the ecosystem you work in: who is in it, who is missing, and how they connect.'),
  ('it-takes-a-village', 3, 'It Takes a Village: interdependence', 'open', 'Share a moment when collaboration between institutions made something possible that none could do alone.'),
  ('who-are-ecosystem-builders', 4, 'Who are ecosystem builders?', 'open', 'What does your work as an ecosystem builder actually involve, day to day?'),
  ('practice-and-profession', 5, 'Building a practice and advancing a profession', 'open', 'What would make ecosystem building a recognised profession in your country?'),
  ('local-conditions', 6, 'Understanding local ecosystem conditions', 'open', 'How do you diagnose the conditions entrepreneurs face where you work?'),
  ('trust-and-coordination', 7, 'Trust and institutional coordination', 'open', 'Where has trust between institutions been built, or broken, and why?'),
  ('informal-rural-emerging', 8, 'Informal, rural and emerging enterprise', 'open', 'What support works for informal, rural and township enterprises?'),
  ('capital-markets-infrastructure-policy', 9, 'Capital, markets, infrastructure and policy', 'open', 'Which barrier in capital, markets, infrastructure or policy matters most where you work?'),
  ('inclusion-and-geography', 10, 'Inclusion and geographic realities', 'open', 'Who is left out of entrepreneurship support in your context, and what has helped include them?'),
  ('sustainability-and-wellbeing', 11, 'Institutional sustainability and practitioner wellbeing', 'open', 'How do support institutions and the people in them last beyond one funding cycle?'),
  ('measuring-development', 12, 'Measuring ecosystem development', 'open', 'How do you know your ecosystem is getting stronger? What do you measure?'),
  ('stories-and-cases', 13, 'African ecosystem building stories and cases', 'open', 'Share a documented case, including what did not work.'),
  ('tools-and-methods', 14, 'Professional tools and methods', 'open', 'Which tool, method or template do you rely on, and how do you use it?');
ALTER TABLE public.playbook_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playbook_chapter_versions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.playbook_chapters, public.playbook_chapter_versions FROM anon, authenticated;
GRANT SELECT ON public.playbook_chapters, public.playbook_chapter_versions TO anon, authenticated;
GRANT INSERT, UPDATE ON public.playbook_chapters TO authenticated;
GRANT INSERT, UPDATE (published) ON public.playbook_chapter_versions TO authenticated;
GRANT ALL ON public.playbook_chapters, public.playbook_chapter_versions TO service_role;
CREATE POLICY "Visible chapters" ON public.playbook_chapters FOR SELECT TO anon, authenticated USING (status <> 'archived' OR public.can_edit_content());
CREATE POLICY "Editors add chapters" ON public.playbook_chapters FOR INSERT TO authenticated WITH CHECK (public.can_edit_content());
CREATE POLICY "Editors change chapters" ON public.playbook_chapters FOR UPDATE TO authenticated USING (public.can_edit_content()) WITH CHECK (public.can_edit_content());
CREATE POLICY "Published versions are public" ON public.playbook_chapter_versions FOR SELECT TO anon, authenticated USING (published OR public.can_edit_content());
CREATE POLICY "Editors write versions" ON public.playbook_chapter_versions FOR INSERT TO authenticated WITH CHECK (public.can_edit_content() AND editor_id = auth.uid());
CREATE POLICY "Editors publish versions" ON public.playbook_chapter_versions FOR UPDATE TO authenticated USING (public.can_edit_content()) WITH CHECK (public.can_edit_content());

-- 6. Shared content items for all five products.
CREATE TABLE public.content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('post', 'article', 'voice', 'playbook_contribution', 'question', 'answer', 'research', 'opportunity')),
  author_id uuid NOT NULL DEFAULT auth.uid() REFERENCES public.profiles(id) ON DELETE CASCADE,
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' AND char_length(slug) BETWEEN 3 AND 120),
  title text NOT NULL DEFAULT '' CHECK (char_length(title) <= 200),
  summary text NOT NULL DEFAULT '' CHECK (char_length(summary) <= 600),
  body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 60000),
  voices_category text REFERENCES public.voices_categories(key),
  chapter_id uuid REFERENCES public.playbook_chapters(id),
  parent_id uuid REFERENCES public.content_items(id) ON DELETE CASCADE,
  repost_of uuid REFERENCES public.content_items(id) ON DELETE SET NULL,
  country text NOT NULL DEFAULT '' CHECK (char_length(country) <= 100),
  topics text[] NOT NULL DEFAULT '{}' CHECK (cardinality(topics) <= 8),
  evidence_class text NOT NULL DEFAULT 'practitioner_experience' CHECK (evidence_class IN ('practitioner_experience', 'founder_perspective', 'documented_case', 'research_evidence', 'observation', 'editorial')),
  details jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(details) = 'object' AND octet_length(details::text) <= 20000),
  media jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(media) = 'array' AND jsonb_array_length(media) <= 6),
  visibility text NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'community')),
  attribution text NOT NULL DEFAULT 'name' CHECK (attribution IN ('name', 'initials', 'anonymous')),
  consent_publish boolean NOT NULL DEFAULT false,
  consent_edit boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'revision_requested', 'accepted', 'scheduled', 'published', 'declined', 'archived')),
  scheduled_for timestamptz,
  published_at timestamptz,
  featured boolean NOT NULL DEFAULT false,
  hidden_by_moderator boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (kind <> 'voice' OR voices_category IS NOT NULL),
  CHECK (kind <> 'playbook_contribution' OR chapter_id IS NOT NULL),
  CHECK (kind <> 'answer' OR parent_id IS NOT NULL),
  CHECK (status <> 'scheduled' OR scheduled_for IS NOT NULL),
  CHECK (status IN ('draft', 'archived') OR consent_publish)
);
CREATE INDEX content_items_public_idx ON public.content_items (kind, status, published_at DESC);
CREATE INDEX content_items_author_idx ON public.content_items (author_id, updated_at DESC);
CREATE INDEX content_items_parent_idx ON public.content_items (parent_id);
CREATE INDEX content_items_chapter_idx ON public.content_items (chapter_id);

-- Is an item visible to the public right now? Scheduled items appear once their time passes.
CREATE FUNCTION public.content_is_live(item public.content_items) RETURNS boolean LANGUAGE sql STABLE SET search_path = '' AS $$
  SELECT NOT item.hidden_by_moderator AND (item.status = 'published' OR (item.status = 'scheduled' AND item.scheduled_for <= now()));
$$;

ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.content_items FROM anon, authenticated;
GRANT SELECT ON public.content_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.content_items TO authenticated;
GRANT ALL ON public.content_items TO service_role;
CREATE POLICY "Live public content" ON public.content_items FOR SELECT TO anon, authenticated USING (visibility = 'public' AND public.content_is_live(content_items));
CREATE POLICY "Live community content" ON public.content_items FOR SELECT TO authenticated USING (visibility = 'community' AND public.content_is_live(content_items));
CREATE POLICY "Authors read their own work" ON public.content_items FOR SELECT TO authenticated USING (author_id = auth.uid());
-- Drafts stay private to their authors, even from editors.
CREATE POLICY "Staff read submitted work" ON public.content_items FOR SELECT TO authenticated USING (status <> 'draft' AND public.can_moderate());
CREATE POLICY "Verified users create their own work" ON public.content_items FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid() AND public.is_verified_user());
CREATE POLICY "Authors update their own work" ON public.content_items FOR UPDATE TO authenticated USING (author_id = auth.uid()) WITH CHECK (author_id = auth.uid());
CREATE POLICY "Staff update submitted work" ON public.content_items FOR UPDATE TO authenticated USING (status <> 'draft' AND public.can_moderate()) WITH CHECK (public.can_moderate());
CREATE POLICY "Authors delete their own drafts" ON public.content_items FOR DELETE TO authenticated USING (author_id = auth.uid() AND status = 'draft');

-- The lifecycle rules, enforced in the database for every writer.
CREATE FUNCTION public.enforce_content_lifecycle() RETURNS trigger LANGUAGE plpgsql SET search_path = '' AS $$
DECLARE
  editor boolean := public.can_edit_content();
  moderator boolean := public.can_moderate();
  community_kind boolean := NEW.kind IN ('post', 'answer', 'question');
BEGIN
  NEW.updated_at := now();
  IF TG_OP = 'INSERT' THEN
    NEW.published_at := NULL;
    NEW.featured := false;
    NEW.hidden_by_moderator := false;
    -- Authors may start as a draft or submit. Community posts, questions and answers publish straight away
    -- only when the Secretariat has opened community publishing.
    IF NEW.status NOT IN ('draft', 'submitted') THEN
      IF community_kind AND NEW.status = 'published' AND public.community_mode() = 'open' THEN
        NEW.published_at := now();
      ELSE
        RAISE EXCEPTION 'New content can only be a draft or a submission' USING ERRCODE = '42501';
      END IF;
    END IF;
    -- Research publications and opportunities enter only as submissions for review.
    RETURN NEW;
  END IF;

  IF NEW.id <> OLD.id OR NEW.author_id <> OLD.author_id OR NEW.kind <> OLD.kind OR NEW.created_at <> OLD.created_at THEN
    RAISE EXCEPTION 'Identity fields cannot change' USING ERRCODE = '42501';
  END IF;

  IF NOT moderator THEN
    -- Authors: may edit drafts, submissions awaiting review and revision requests, may submit,
    -- and may withdraw their own work at any time by archiving it.
    IF NEW.featured <> OLD.featured OR NEW.hidden_by_moderator <> OLD.hidden_by_moderator OR NEW.published_at IS DISTINCT FROM OLD.published_at OR NEW.slug <> OLD.slug THEN
      RAISE EXCEPTION 'Only the Secretariat can change publication fields' USING ERRCODE = '42501';
    END IF;
    IF NEW.status = 'archived' AND OLD.status <> 'archived' THEN
      RETURN NEW;
    END IF;
    IF OLD.status NOT IN ('draft', 'submitted', 'revision_requested') OR NEW.status NOT IN ('draft', 'submitted') THEN
      RAISE EXCEPTION 'This content is with the editors and cannot be changed now' USING ERRCODE = '42501';
    END IF;
    RETURN NEW;
  END IF;

  -- Moderators can hide, restore and decline community content. Editorial decisions on
  -- stories, Playbook contributions, research and opportunities need an editor.
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
    NEW.published_at := now();
  ELSIF NEW.status = 'scheduled' AND OLD.status <> 'scheduled' THEN
    NEW.published_at := NEW.scheduled_for;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER enforce_content_lifecycle BEFORE INSERT OR UPDATE ON public.content_items FOR EACH ROW EXECUTE FUNCTION public.enforce_content_lifecycle();

-- Revision history: every change to the text of a non-draft item is preserved.
CREATE TABLE public.content_revisions (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  content_id uuid NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  editor_id uuid,
  status text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.content_revisions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.content_revisions FROM anon, authenticated;
GRANT SELECT ON public.content_revisions TO authenticated;
GRANT ALL ON public.content_revisions TO service_role;
CREATE POLICY "Authors and staff read revisions" ON public.content_revisions FOR SELECT TO authenticated
  USING (public.can_moderate() OR EXISTS (SELECT 1 FROM public.content_items c WHERE c.id = content_id AND c.author_id = auth.uid()));
CREATE FUNCTION public.record_content_revision() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF TG_OP = 'INSERT' OR NEW.body IS DISTINCT FROM OLD.body OR NEW.title IS DISTINCT FROM OLD.title OR NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.content_revisions (content_id, editor_id, status, title, body) VALUES (NEW.id, auth.uid(), NEW.status, NEW.title, NEW.body);
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.record_content_revision() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER record_content_revision AFTER INSERT OR UPDATE ON public.content_items FOR EACH ROW EXECUTE FUNCTION public.record_content_revision();

-- 7. Editorial reviews: private decisions and notes, visible to staff and, for decisions only,
-- to the author.
CREATE TABLE public.editorial_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE RESTRICT,
  decision text NOT NULL CHECK (decision IN ('note', 'assigned', 'revision_requested', 'accepted', 'scheduled', 'published', 'declined', 'archived', 'hidden', 'restored', 'featured', 'unfeatured')),
  message_to_author text NOT NULL DEFAULT '' CHECK (char_length(message_to_author) <= 2000),
  private_note text NOT NULL DEFAULT '' CHECK (char_length(private_note) <= 4000),
  assignee_id uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.editorial_reviews ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.editorial_reviews FROM anon, authenticated;
GRANT SELECT, INSERT ON public.editorial_reviews TO authenticated;
GRANT ALL ON public.editorial_reviews TO service_role;
CREATE POLICY "Staff read reviews" ON public.editorial_reviews FOR SELECT TO authenticated USING (public.can_moderate());
CREATE POLICY "Staff write reviews" ON public.editorial_reviews FOR INSERT TO authenticated WITH CHECK (public.can_moderate() AND reviewer_id = auth.uid());
-- Authors see decisions and messages about their own work, never private notes.
CREATE FUNCTION public.my_editorial_messages() RETURNS TABLE (content_id uuid, decision text, message_to_author text, created_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT r.content_id, r.decision, r.message_to_author, r.created_at
  FROM public.editorial_reviews r JOIN public.content_items c ON c.id = r.content_id
  WHERE c.author_id = auth.uid() AND r.decision <> 'note' AND r.decision <> 'assigned'
  ORDER BY r.created_at DESC;
$$;
REVOKE ALL ON FUNCTION public.my_editorial_messages() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.my_editorial_messages() TO authenticated;

-- 8. Engagement: reactions, bookmarks, follows, reports. No counts are ever invented. Reaction
-- totals come only from real rows.
CREATE TABLE public.reactions (
  content_id uuid NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES public.profiles(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('appreciate', 'useful')),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (content_id, user_id, kind)
);
CREATE TABLE public.bookmarks (
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_id uuid NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, content_id)
);
CREATE TABLE public.follows (
  follower_id uuid NOT NULL DEFAULT auth.uid() REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type text NOT NULL CHECK (target_type IN ('profile', 'country', 'topic', 'question', 'chapter')),
  target_key text NOT NULL CHECK (char_length(target_key) BETWEEN 1 AND 120),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (follower_id, target_type, target_key)
);
CREATE TABLE public.content_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  reporter_id uuid NOT NULL DEFAULT auth.uid() REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason text NOT NULL CHECK (reason IN ('harassment', 'false_or_misleading', 'privacy', 'spam', 'confidential', 'other')),
  detail text NOT NULL DEFAULT '' CHECK (char_length(detail) <= 1000),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'actioned', 'dismissed')),
  resolution_note text NOT NULL DEFAULT '' CHECK (char_length(resolution_note) <= 2000),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (content_id, reporter_id)
);
CREATE TABLE public.blocks (
  blocker_id uuid NOT NULL DEFAULT auth.uid() REFERENCES public.profiles(id) ON DELETE CASCADE,
  blocked_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (blocker_id, blocked_id),
  CHECK (blocker_id <> blocked_id)
);
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.reactions, public.bookmarks, public.follows, public.content_reports, public.blocks FROM anon, authenticated;
GRANT SELECT, INSERT, DELETE ON public.reactions, public.bookmarks, public.follows, public.blocks TO authenticated;
GRANT SELECT, INSERT ON public.content_reports TO authenticated;
GRANT UPDATE (status, resolution_note) ON public.content_reports TO authenticated;
GRANT ALL ON public.reactions, public.bookmarks, public.follows, public.content_reports, public.blocks TO service_role;
-- Reactions on live content are visible to everyone signed in, so totals are real.
CREATE POLICY "Read reactions on visible content" ON public.reactions FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.content_items c WHERE c.id = content_id));
CREATE POLICY "React as yourself" ON public.reactions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND public.is_verified_user() AND EXISTS (SELECT 1 FROM public.content_items c WHERE c.id = content_id AND public.content_is_live(c)));
CREATE POLICY "Remove your reaction" ON public.reactions FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Own bookmarks" ON public.bookmarks FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Save visible content" ON public.bookmarks FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND EXISTS (SELECT 1 FROM public.content_items c WHERE c.id = content_id));
CREATE POLICY "Remove own bookmarks" ON public.bookmarks FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Own follows" ON public.follows FOR SELECT TO authenticated USING (follower_id = auth.uid());
CREATE POLICY "Follow as yourself" ON public.follows FOR INSERT TO authenticated WITH CHECK (follower_id = auth.uid());
CREATE POLICY "Unfollow" ON public.follows FOR DELETE TO authenticated USING (follower_id = auth.uid());
CREATE POLICY "Report as yourself" ON public.content_reports FOR INSERT TO authenticated WITH CHECK (reporter_id = auth.uid() AND status = 'open');
CREATE POLICY "Reporters and moderators read reports" ON public.content_reports FOR SELECT TO authenticated USING (reporter_id = auth.uid() OR public.can_moderate());
CREATE POLICY "Moderators resolve reports" ON public.content_reports FOR UPDATE TO authenticated USING (public.can_moderate()) WITH CHECK (public.can_moderate());
CREATE POLICY "Own blocks" ON public.blocks FOR SELECT TO authenticated USING (blocker_id = auth.uid());
CREATE POLICY "Block as yourself" ON public.blocks FOR INSERT TO authenticated WITH CHECK (blocker_id = auth.uid());
CREATE POLICY "Unblock" ON public.blocks FOR DELETE TO authenticated USING (blocker_id = auth.uid());

-- Follower counts for a public profile come from real rows only.
CREATE FUNCTION public.follower_count(profile_id uuid) RETURNS bigint LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT count(*) FROM public.follows f JOIN public.profiles p ON p.id = profile_id
  WHERE f.target_type = 'profile' AND f.target_key = profile_id::text AND p.visibility = 'public';
$$;
REVOKE ALL ON FUNCTION public.follower_count(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.follower_count(uuid) TO anon, authenticated;

-- 9. In-app notifications. A notification row records that something happened. It is not proof
-- that an email or push message was delivered, and no external delivery exists yet.
CREATE TABLE public.notifications (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('reply', 'answer', 'reaction', 'follow', 'editorial', 'published')),
  content_id uuid REFERENCES public.content_items(id) ON DELETE CASCADE,
  actor_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  message text NOT NULL DEFAULT '' CHECK (char_length(message) <= 300),
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX notifications_user_idx ON public.notifications (user_id, created_at DESC);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.notifications FROM anon, authenticated;
GRANT SELECT ON public.notifications TO authenticated;
GRANT UPDATE (read_at) ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
CREATE POLICY "Read own notifications" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Mark own notifications read" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE FUNCTION public.notify_on_content() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE parent_author uuid;
BEGIN
  -- Replies and answers notify the parent's author once the reply is live.
  IF NEW.parent_id IS NOT NULL AND public.content_is_live(NEW) AND (TG_OP = 'INSERT' OR NOT public.content_is_live(OLD)) THEN
    SELECT author_id INTO parent_author FROM public.content_items WHERE id = NEW.parent_id;
    IF parent_author IS NOT NULL AND parent_author <> NEW.author_id THEN
      INSERT INTO public.notifications (user_id, kind, content_id, actor_id, message) VALUES (parent_author, CASE WHEN NEW.kind = 'answer' THEN 'answer' ELSE 'reply' END, NEW.parent_id, NEW.author_id, 'New response to your contribution');
    END IF;
  END IF;
  -- Authors hear when their own work goes live.
  IF TG_OP = 'UPDATE' AND NEW.status IN ('published', 'scheduled') AND OLD.status NOT IN ('published', 'scheduled') AND auth.uid() IS DISTINCT FROM NEW.author_id THEN
    INSERT INTO public.notifications (user_id, kind, content_id, message) VALUES (NEW.author_id, 'published', NEW.id, 'Your contribution has been published');
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.notify_on_content() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER notify_on_content AFTER INSERT OR UPDATE ON public.content_items FOR EACH ROW EXECUTE FUNCTION public.notify_on_content();

CREATE FUNCTION public.notify_on_review() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE author uuid;
BEGIN
  IF NEW.decision IN ('revision_requested', 'accepted', 'scheduled', 'declined') THEN
    SELECT author_id INTO author FROM public.content_items WHERE id = NEW.content_id;
    INSERT INTO public.notifications (user_id, kind, content_id, message) VALUES (author, 'editorial', NEW.content_id, 'An editor has responded to your submission');
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.notify_on_review() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER notify_on_review AFTER INSERT ON public.editorial_reviews FOR EACH ROW EXECUTE FUNCTION public.notify_on_review();

CREATE FUNCTION public.notify_on_follow() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF NEW.target_type = 'profile' AND NEW.target_key <> NEW.follower_id::text AND EXISTS (SELECT 1 FROM public.profiles WHERE id::text = NEW.target_key) THEN
    INSERT INTO public.notifications (user_id, kind, actor_id, message) VALUES (NEW.target_key::uuid, 'follow', NEW.follower_id, 'Someone started following you');
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.notify_on_follow() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER notify_on_follow AFTER INSERT ON public.follows FOR EACH ROW EXECUTE FUNCTION public.notify_on_follow();

-- 10. Public author names. Respects each item's attribution choice and each profile's visibility,
-- and never exposes email addresses.
CREATE FUNCTION public.content_authors(ids uuid[]) RETURNS TABLE (content_id uuid, display_name text, profile_id uuid, headline text, country text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT c.id,
    CASE c.attribution
      WHEN 'anonymous' THEN 'Name withheld at the contributor''s request'
      WHEN 'initials' THEN coalesce(nullif(regexp_replace(initcap(p.name), '[^A-Z]', '', 'g'), ''), 'Contributor')
      ELSE coalesce(nullif(p.name, ''), 'ASEB contributor')
    END,
    CASE WHEN c.attribution = 'name' AND p.visibility = 'public' THEN p.id END,
    CASE WHEN c.attribution = 'name' THEN p.headline ELSE '' END,
    CASE WHEN c.attribution = 'name' THEN p.country ELSE '' END
  FROM public.content_items c JOIN public.profiles p ON p.id = c.author_id
  WHERE c.id = ANY (ids) AND (public.content_is_live(c) OR c.author_id = auth.uid() OR public.can_moderate());
$$;
REVOKE ALL ON FUNCTION public.content_authors(uuid[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.content_authors(uuid[]) TO anon, authenticated;

-- Real engagement totals for live items: never estimated, never padded.
CREATE FUNCTION public.content_engagement(ids uuid[]) RETURNS TABLE (content_id uuid, appreciations bigint, useful bigint, responses bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT c.id,
    (SELECT count(*) FROM public.reactions r WHERE r.content_id = c.id AND r.kind = 'appreciate'),
    (SELECT count(*) FROM public.reactions r WHERE r.content_id = c.id AND r.kind = 'useful'),
    (SELECT count(*) FROM public.content_items a WHERE a.parent_id = c.id AND public.content_is_live(a))
  FROM public.content_items c WHERE c.id = ANY (ids) AND public.content_is_live(c);
$$;
REVOKE ALL ON FUNCTION public.content_engagement(uuid[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.content_engagement(uuid[]) TO anon, authenticated;

-- 11. The audit log accepts the new editorial actions.
ALTER TABLE public.secretariat_audit_log DROP CONSTRAINT secretariat_audit_log_action_check;
ALTER TABLE public.secretariat_audit_log ADD CONSTRAINT secretariat_audit_log_action_check
  CHECK (action IN ('note_added', 'review_stage_changed', 'records_exported', 'editorial_decision', 'report_resolved', 'setting_changed', 'chapter_changed'));
CREATE FUNCTION public.audit_editorial_review() RETURNS trigger LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
  INSERT INTO public.secretariat_audit_log (actor_id, action, subject_type, subject_id, detail)
  VALUES (auth.uid(), 'editorial_decision', 'content_item', NEW.content_id, jsonb_build_object('decision', NEW.decision));
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.audit_editorial_review() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER audit_editorial_review AFTER INSERT ON public.editorial_reviews FOR EACH ROW EXECUTE FUNCTION public.audit_editorial_review();
-- Moderators and editors may write their own audit rows too.
DROP POLICY "Secretariat writes own audit entries" ON public.secretariat_audit_log;
CREATE POLICY "Staff write own audit entries" ON public.secretariat_audit_log FOR INSERT TO authenticated WITH CHECK ((public.is_secretariat() OR public.can_moderate()) AND actor_id = auth.uid());
