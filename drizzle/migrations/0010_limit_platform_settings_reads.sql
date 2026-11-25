DROP POLICY "Anyone reads platform settings" ON public.platform_settings;
CREATE POLICY "Anyone reads the community mode" ON public.platform_settings FOR SELECT TO anon, authenticated USING (key = 'community_mode');
CREATE POLICY "Secretariat reads platform settings" ON public.platform_settings FOR SELECT TO authenticated USING (public.is_secretariat());