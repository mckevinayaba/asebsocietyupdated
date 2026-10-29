CREATE TABLE public.insight_pitches (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 inquiry_type text NOT NULL DEFAULT 'insight_pitches' CHECK (inquiry_type = 'insight_pitches'),
 source_page text NOT NULL DEFAULT '/insights' CHECK (source_page = '/insights'),
 contact_email text NOT NULL,
 payload jsonb NOT NULL,
 consent boolean NOT NULL DEFAULT false,
 status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','reviewed','closed')),
 submitted_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.insight_pitches TO anon, authenticated;
GRANT ALL ON public.insight_pitches TO service_role;
ALTER TABLE public.insight_pitches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public may submit pending pitches only" ON public.insight_pitches FOR INSERT TO anon, authenticated WITH CHECK (status = 'pending' AND consent = true);
CREATE FUNCTION public.validate_insight_pitch() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE field_name text;
BEGIN
 IF jsonb_typeof(NEW.payload) <> 'object' OR octet_length(NEW.payload::text) > 40000 THEN RAISE EXCEPTION 'Invalid pitch details'; END IF;
 IF NEW.contact_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' OR length(NEW.contact_email) > 255 OR NEW.contact_email IS DISTINCT FROM NEW.payload->>'email' THEN RAISE EXCEPTION 'Invalid contact email'; END IF;
 FOREACH field_name IN ARRAY ARRAY['category','name','email','country','title','summary'] LOOP
  IF NOT (NEW.payload ? field_name) OR jsonb_typeof(NEW.payload->field_name) <> 'string' OR length(btrim(NEW.payload->>field_name)) = 0 THEN RAISE EXCEPTION 'Required pitch field missing'; END IF;
 END LOOP;
 FOR field_name IN SELECT jsonb_object_keys(NEW.payload) LOOP
  IF jsonb_typeof(NEW.payload->field_name) <> 'string' OR length(NEW.payload->>field_name) > 6000 THEN RAISE EXCEPTION 'Invalid pitch field'; END IF;
 END LOOP;
 IF cardinality(regexp_split_to_array(btrim(NEW.payload->>'summary'), '\s+')) > 200 THEN RAISE EXCEPTION 'Pitch exceeds 200 words'; END IF;
 RETURN NEW;
END;
$$;
CREATE TRIGGER validate_insight_pitch BEFORE INSERT OR UPDATE ON public.insight_pitches FOR EACH ROW EXECUTE FUNCTION public.validate_insight_pitch();