// Public, unauthenticated metadata for shareable links. Uses the publishable key, never the
// service role, so row level security returns only live public items. Drafts, submissions and
// community-only items can never leak into social previews.
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { excerpt } from "@/lib/community";

export type PublicMeta = { title: string; description: string; kind: string; author: string; publishedAt: string | null } | null;

export const getPublicMeta = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ slug: z.string().regex(/^[a-z0-9-]{3,120}$/) }).parse(input))
  .handler(async ({ data }): Promise<PublicMeta> => {
    const url = process.env["SUPABASE_URL"];
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
    if (!url || !key) return null;
    try {
      const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
      const { data: row, error } = await client.from("content_items").select("id,kind,title,summary,body,published_at").eq("slug", data.slug).eq("visibility", "public").maybeSingle();
      if (error || !row) return null;
      const { data: authors } = await client.rpc("content_authors", { ids: [row.id] });
      const author = Array.isArray(authors) && authors[0] ? String(authors[0].display_name ?? "") : "";
      return { title: String(row.title || excerpt(String(row.body), 70)), description: String(row.summary || excerpt(String(row.body), 180)), kind: String(row.kind), author, publishedAt: (row.published_at as string | null) ?? null };
    } catch {
      return null;
    }
  });
