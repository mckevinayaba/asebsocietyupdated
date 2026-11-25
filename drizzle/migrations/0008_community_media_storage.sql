-- ASEB Society: private storage for community photographs. Depends on 0007.
-- Uploads are private. Others can read a photograph only once an item that uses it is live.
-- Size and type limits are enforced by the storage service, not only by the browser.

-- The bucket row below is created with the storage tool (private, 5 MB, jpeg/png/webp), not SQL.
-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES ('community-media', 'community-media', false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
-- ON CONFLICT (id) DO NOTHING;

-- Verified people upload only into their own folder: "<user id>/<file>".
CREATE POLICY "Upload own community media" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'community-media' AND (storage.foldername(name))[1] = auth.uid()::text AND public.is_verified_user());

CREATE POLICY "Remove own community media" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'community-media' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Owners and staff can always read. Everyone else only when a live item references the file.
CREATE FUNCTION public.media_is_public(object_name text) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.content_items c, jsonb_array_elements(c.media) m
    WHERE m->>'path' = object_name AND public.content_is_live(c) AND c.visibility = 'public'
  );
$$;
REVOKE ALL ON FUNCTION public.media_is_public(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.media_is_public(text) TO anon, authenticated;

CREATE POLICY "Read community media" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'community-media' AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR public.can_moderate()
    OR public.media_is_public(name)
  ));
