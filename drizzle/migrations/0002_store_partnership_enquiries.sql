CREATE TABLE public.partnership_enquiries (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 inquiry_type text NOT NULL CHECK (inquiry_type IN ('country_partner_eoi','ambassador_eoi','collaboration_eoi','partner_enquiries')),
 source_page text NOT NULL CHECK (source_page IN ('/country-partners','/ambassadors','/collaborate','/funders','/work-with-us')),
 contact_email text NOT NULL,
 payload jsonb NOT NULL,
 consent boolean NOT NULL DEFAULT false,
 status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','reviewed','closed')),
 submitted_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.partnership_enquiries TO anon, authenticated;
GRANT ALL ON public.partnership_enquiries TO service_role;
ALTER TABLE public.partnership_enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public may submit pending enquiries only" ON public.partnership_enquiries FOR INSERT TO anon, authenticated WITH CHECK (status = 'pending' AND consent = true);
CREATE FUNCTION public.validate_partnership_enquiry() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE required_fields text[]; field_name text;
BEGIN
 IF jsonb_typeof(NEW.payload) <> 'object' OR octet_length(NEW.payload::text) > 40000 THEN RAISE EXCEPTION 'Invalid enquiry details'; END IF;
 IF NEW.contact_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' OR length(NEW.contact_email) > 255 OR NEW.contact_email IS DISTINCT FROM NEW.payload->>'email' THEN RAISE EXCEPTION 'Invalid contact email'; END IF;
 CASE NEW.source_page
 WHEN '/country-partners' THEN
  IF NEW.inquiry_type <> 'country_partner_eoi' THEN RAISE EXCEPTION 'Invalid enquiry category'; END IF;
  required_fields := ARRAY['applicantType','name','email','country','city','organisation','years','referees','motivation','plan'];
 WHEN '/ambassadors' THEN
  IF NEW.inquiry_type <> 'ambassador_eoi' THEN RAISE EXCEPTION 'Invalid enquiry category'; END IF;
  required_fields := ARRAY['type','name','email','country','city','reach','plan'];
 WHEN '/collaborate' THEN
  IF NEW.inquiry_type <> 'collaboration_eoi' THEN RAISE EXCEPTION 'Invalid enquiry category'; END IF;
  required_fields := ARRAY['programme','leadOrg','contact','email','type','countries','model','summary'];
 WHEN '/funders' THEN
  IF NEW.inquiry_type <> 'partner_enquiries' THEN RAISE EXCEPTION 'Invalid enquiry category'; END IF;
  required_fields := ARRAY['partnerType','organisation','contact','email','interest','message'];
 WHEN '/work-with-us' THEN
  IF NEW.inquiry_type <> 'partner_enquiries' THEN RAISE EXCEPTION 'Invalid enquiry category'; END IF;
  required_fields := ARRAY['requestType','organisation','contact','email','message'];
 ELSE RAISE EXCEPTION 'Invalid enquiry source';
 END CASE;
 FOREACH field_name IN ARRAY required_fields LOOP
  IF NOT (NEW.payload ? field_name) OR jsonb_typeof(NEW.payload->field_name) <> 'string' OR length(btrim(NEW.payload->>field_name)) = 0 THEN RAISE EXCEPTION 'Required enquiry field missing'; END IF;
 END LOOP;
 FOR field_name IN SELECT jsonb_object_keys(NEW.payload) LOOP
  IF jsonb_typeof(NEW.payload->field_name) <> 'string' OR length(NEW.payload->>field_name) > 6000 THEN RAISE EXCEPTION 'Invalid enquiry field'; END IF;
  IF field_name IN ('website','linkedin') AND btrim(NEW.payload->>field_name) <> '' AND NEW.payload->>field_name !~* '^https?://[^[:space:]]+\.[^[:space:]]+' THEN RAISE EXCEPTION 'Invalid website address'; END IF;
 END LOOP;
 RETURN NEW;
END;
$$;
CREATE TRIGGER validate_partnership_enquiry BEFORE INSERT OR UPDATE ON public.partnership_enquiries FOR EACH ROW EXECUTE FUNCTION public.validate_partnership_enquiry();
CREATE INDEX partnership_enquiries_review_idx ON public.partnership_enquiries(status, submitted_at DESC);