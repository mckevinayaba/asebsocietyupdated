ALTER TABLE public.membership_applications
  ADD COLUMN job_title text NOT NULL DEFAULT '',
  ADD COLUMN phone text NOT NULL DEFAULT '',
  ADD COLUMN city text NOT NULL DEFAULT '',
  ADD COLUMN operating_countries text NOT NULL DEFAULT '',
  ADD COLUMN work_description text NOT NULL DEFAULT '',
  ADD COLUMN focus_areas text NOT NULL DEFAULT '';
ALTER TABLE public.membership_applications
  ADD CONSTRAINT membership_applications_detail_lengths CHECK (
    char_length(job_title) <= 200 AND char_length(phone) <= 40 AND char_length(city) <= 120
    AND char_length(operating_countries) <= 1000 AND char_length(work_description) <= 4000
    AND char_length(focus_areas) <= 500);