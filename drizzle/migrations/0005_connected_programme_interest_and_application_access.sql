CREATE TABLE public.programme_interests (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
 source_page text NOT NULL CHECK (source_page IN ('/communities','/learning','/field-lab')),
 inquiry_type text NOT NULL CHECK (inquiry_type IN ('circle_preferences','academy_interest','research_enquiry')),
 contact_email text NOT NULL,
 payload jsonb NOT NULL,
 consent boolean NOT NULL DEFAULT false,
 status text NOT NULL DEFAULT 'pending' CHECK (status = 'pending'),
 submitted_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.programme_interests TO anon;
GRANT SELECT, INSERT ON public.programme_interests TO authenticated;
GRANT ALL ON public.programme_interests TO service_role;
ALTER TABLE public.programme_interests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Submit programme interest" ON public.programme_interests FOR INSERT TO anon, authenticated WITH CHECK (consent AND status = 'pending' AND user_id IS NOT DISTINCT FROM auth.uid());
CREATE POLICY "Read own programme interests" ON public.programme_interests FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE FUNCTION public.validate_programme_interest() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE required_fields text[]; field_name text; selected_keys text[];
BEGIN
 IF NEW.user_id IS DISTINCT FROM auth.uid() THEN RAISE EXCEPTION 'Invalid interest owner'; END IF;
 IF NOT NEW.consent OR NEW.status <> 'pending' THEN RAISE EXCEPTION 'Consent and pending status required'; END IF;
 IF jsonb_typeof(NEW.payload) <> 'object' OR octet_length(NEW.payload::text) > 40000 THEN RAISE EXCEPTION 'Invalid interest details'; END IF;
 IF NEW.contact_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' OR length(NEW.contact_email) > 255 OR NEW.contact_email IS DISTINCT FROM NEW.payload->>'email' THEN RAISE EXCEPTION 'Invalid email'; END IF;
 required_fields := ARRAY['name','email','country','role','organisation','website','description','operatingCountries','focusAreas'];
 CASE NEW.source_page
 WHEN '/communities' THEN
  IF NEW.inquiry_type <> 'circle_preferences' THEN RAISE EXCEPTION 'Invalid category'; END IF;
  required_fields := required_fields || ARRAY['regions','languages','groups'];
  selected_keys := string_to_array(NEW.payload->>'regions', '|') || string_to_array(NEW.payload->>'languages', '|') || string_to_array(NEW.payload->>'groups', '|');
  IF NOT selected_keys <@ ARRAY['regional:North','regional:West','regional:Central','regional:East','regional:Southern','language:en','language:fr','language:pt','language:ar','group:hubs','group:capital','group:university','group:climate','group:policy','group:mentors','condition:1','condition:2','condition:3','condition:4','condition:5','condition:6','condition:7'] THEN RAISE EXCEPTION 'Invalid Circle selections'; END IF;
  IF NOT string_to_array(NEW.payload->>'regions','|') <@ ARRAY['regional:North','regional:West','regional:Central','regional:East','regional:Southern'] OR NOT string_to_array(NEW.payload->>'languages','|') <@ ARRAY['language:en','language:fr','language:pt','language:ar'] OR NOT string_to_array(NEW.payload->>'groups','|') <@ ARRAY['group:hubs','group:capital','group:university','group:climate','group:policy','group:mentors','condition:1','condition:2','condition:3','condition:4','condition:5','condition:6','condition:7'] THEN RAISE EXCEPTION 'Invalid Circle category'; END IF;
 WHEN '/learning' THEN
  IF NEW.inquiry_type <> 'academy_interest' THEN RAISE EXCEPTION 'Invalid category'; END IF;
  required_fields := required_fields || ARRAY['learningPriority','format'];
 WHEN '/field-lab' THEN
  IF NEW.inquiry_type <> 'research_enquiry' THEN RAISE EXCEPTION 'Invalid category'; END IF;
  required_fields := required_fields || ARRAY['challenge','outcomes','partners'];
 END CASE;
 FOREACH field_name IN ARRAY required_fields LOOP
  IF jsonb_typeof(NEW.payload->field_name) IS DISTINCT FROM 'string' OR length(btrim(NEW.payload->>field_name)) = 0 THEN RAISE EXCEPTION 'Required detail missing'; END IF;
 END LOOP;
 IF length(btrim(NEW.payload->>'description')) < 80 OR length(btrim(NEW.payload->>'focusAreas')) < 3 THEN RAISE EXCEPTION 'Describe your work and focus areas'; END IF;
 IF NEW.payload->>'website' !~* '^(https?://[^[:space:]]+\.[^[:space:]]+|@[a-z0-9_.-]{2,})$' THEN RAISE EXCEPTION 'Website or social handle required'; END IF;
 FOR field_name IN SELECT jsonb_object_keys(NEW.payload) LOOP
  IF jsonb_typeof(NEW.payload->field_name) <> 'string' OR length(NEW.payload->>field_name) > 6000 THEN RAISE EXCEPTION 'Invalid field'; END IF;
 END LOOP;
 RETURN NEW;
END;
$$;
CREATE TRIGGER validate_programme_interest BEFORE INSERT ON public.programme_interests FOR EACH ROW EXECUTE FUNCTION public.validate_programme_interest();
ALTER TABLE public.circle_memberships DROP CONSTRAINT circle_memberships_circle_key_check;
ALTER TABLE public.circle_memberships ADD CONSTRAINT circle_memberships_circle_key_check CHECK (circle_key IN ('regional:North','regional:West','regional:Central','regional:East','regional:Southern','language:en','language:fr','language:pt','language:ar','group:hubs','group:capital','group:university','group:climate','group:policy','group:mentors','condition:1','condition:2','condition:3','condition:4','condition:5','condition:6','condition:7'));
CREATE FUNCTION public.sync_circle_interest() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
 IF NEW.source_page = '/communities' AND NEW.user_id IS NOT NULL THEN
  DELETE FROM public.circle_memberships WHERE user_id = NEW.user_id;
  INSERT INTO public.circle_memberships(user_id, circle_key)
   SELECT NEW.user_id, key FROM unnest(string_to_array(NEW.payload->>'regions','|') || string_to_array(NEW.payload->>'languages','|') || string_to_array(NEW.payload->>'groups','|')) AS key ON CONFLICT DO NOTHING;
 END IF;
 RETURN NEW;
END;
$$;
CREATE TRIGGER sync_circle_interest AFTER INSERT ON public.programme_interests FOR EACH ROW EXECUTE FUNCTION public.sync_circle_interest();
CREATE FUNCTION public.is_verified_application_owner(application_email text) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
 SELECT EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email_confirmed_at IS NOT NULL AND lower(email) = lower(application_email));
$$;
REVOKE ALL ON FUNCTION public.is_verified_application_owner(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_verified_application_owner(text) TO authenticated;
GRANT SELECT ON public.membership_applications TO authenticated;
CREATE POLICY "Verified applicants read own applications" ON public.membership_applications FOR SELECT TO authenticated USING (public.is_verified_application_owner(email));