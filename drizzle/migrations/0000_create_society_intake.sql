CREATE TABLE public.membership_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  country text NOT NULL,
  role text NOT NULL,
  membership_type text NOT NULL CHECK (membership_type IN ('individual', 'organisation')),
  organisation text NOT NULL DEFAULT '',
  profile_url text NOT NULL DEFAULT '',
  code_accepted boolean NOT NULL CHECK (code_accepted = true),
  intent text NOT NULL DEFAULT 'member' CHECK (intent IN ('member', 'partner', 'nominate', 'steward', 'claim')),
  registry_slug text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.membership_applications TO anon, authenticated;
GRANT ALL ON public.membership_applications TO service_role;
ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors can submit pending applications" ON public.membership_applications FOR INSERT TO anon, authenticated WITH CHECK (status = 'pending' AND code_accepted = true AND char_length(name) BETWEEN 2 AND 200 AND char_length(email) BETWEEN 3 AND 255 AND char_length(country) BETWEEN 2 AND 100 AND char_length(role) BETWEEN 1 AND 100 AND char_length(organisation) <= 200 AND char_length(profile_url) <= 1000);

CREATE TABLE public.registry_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  record_type text NOT NULL CHECK (record_type IN ('individual', 'organisation')),
  country text NOT NULL,
  role text NOT NULL,
  bio text NOT NULL,
  source_url text NOT NULL,
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.registry_submissions TO anon, authenticated;
GRANT ALL ON public.registry_submissions TO service_role;
ALTER TABLE public.registry_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors can propose pending registry records" ON public.registry_submissions FOR INSERT TO anon, authenticated WITH CHECK (status = 'pending' AND char_length(name) BETWEEN 2 AND 200 AND char_length(country) BETWEEN 2 AND 100 AND char_length(role) BETWEEN 1 AND 100 AND char_length(bio) BETWEEN 20 AND 3000 AND char_length(source_url) BETWEEN 8 AND 1000 AND char_length(contact_name) BETWEEN 2 AND 200 AND char_length(contact_email) BETWEEN 3 AND 255);
CREATE INDEX membership_applications_review_idx ON public.membership_applications (status, created_at DESC);
CREATE INDEX registry_submissions_review_idx ON public.registry_submissions (status, created_at DESC);