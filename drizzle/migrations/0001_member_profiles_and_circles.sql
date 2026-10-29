CREATE TABLE public.profiles (
 id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 name text NOT NULL DEFAULT '', country text NOT NULL DEFAULT '', organisation text NOT NULL DEFAULT '', primary_role text NOT NULL DEFAULT '', bio text NOT NULL DEFAULT '',
 created_at timestamptz NOT NULL DEFAULT now(),
 CHECK (char_length(name) <= 200 AND char_length(country) <= 100 AND char_length(organisation) <= 200 AND char_length(primary_role) <= 100 AND char_length(bio) <= 3000)
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Create own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "Update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE FUNCTION public.create_member_profile() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 INSERT INTO public.profiles (id, name) VALUES (NEW.id, left(coalesce(NEW.raw_user_meta_data ->> 'name', NEW.raw_user_meta_data ->> 'full_name', ''), 200)) ON CONFLICT (id) DO NOTHING;
 RETURN NEW;
END;
$$;
CREATE TRIGGER create_member_profile_on_signup AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.create_member_profile();
CREATE TABLE public.circle_memberships (
 user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
 circle_key text NOT NULL CHECK (circle_key IN ('regional:North','regional:West','regional:Central','regional:East','regional:Southern','language:fr','language:pt','language:ar','condition:1','condition:2','condition:3','condition:4','condition:5','condition:6','condition:7')),
 joined_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY (user_id, circle_key)
);
GRANT SELECT, INSERT, DELETE ON public.circle_memberships TO authenticated;
GRANT ALL ON public.circle_memberships TO service_role;
ALTER TABLE public.circle_memberships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own circles" ON public.circle_memberships FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Join own circles" ON public.circle_memberships FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Leave own circles" ON public.circle_memberships FOR DELETE TO authenticated USING (user_id = auth.uid());