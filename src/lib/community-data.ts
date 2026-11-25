// Browser reads for public and community content. Uses the shared browser client, so row level
// security decides what each visitor sees: visitors get public live content, signed-in people
// also get community content and their own work.
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { isMissingBackend, publicColumns, type Author, type ContentKind, type ContentRow, type Engagement } from "@/lib/community";

// The community tables are added by migration 0007. Until Lovable regenerates the database types,
// they are reached through an untyped view of the same client. Row level security is unchanged.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const db = () => supabase as unknown as SupabaseClient<any>;

export class BackendUnavailable extends Error {
  constructor() { super("The community features are not switched on yet."); }
}

function check<T>(result: { data: T | null; error: { code?: string; message?: string } | null }): T {
  if (isMissingBackend(result.error)) throw new BackendUnavailable();
  if (result.error) throw new Error(result.error.message || "The request could not be completed.");
  return result.data as T;
}

export type FeedItem = ContentRow & { author?: Author | undefined; engagement?: Engagement | undefined };

async function decorate(rows: ContentRow[]): Promise<FeedItem[]> {
  if (!rows.length) return [];
  const ids = rows.map((r) => r.id);
  const [authors, engagement] = await Promise.all([
    db().rpc("content_authors", { ids }),
    db().rpc("content_engagement", { ids }),
  ]);
  const byAuthor = new Map((check<Author[]>(authors) ?? []).map((a) => [a.content_id, a]));
  const byEngagement = new Map((check<Engagement[]>(engagement) ?? []).map((e) => [e.content_id, { ...e, appreciations: Number(e.appreciations), useful: Number(e.useful), responses: Number(e.responses) }]));
  return rows.map((row) => ({ ...row, author: byAuthor.get(row.id), engagement: byEngagement.get(row.id) }));
}

export async function listLive(options: { kinds: ContentKind[]; limit?: number; category?: string; chapterId?: string; parentId?: string; featured?: boolean; country?: string }): Promise<FeedItem[]> {
  let query = db().from("content_items").select(publicColumns).in("kind", options.kinds).in("status", ["published", "scheduled"]).eq("hidden_by_moderator", false)
    .lte("published_at", new Date().toISOString()).order("published_at", { ascending: false }).limit(options.limit ?? 30);
  if (options.category) query = query.eq("voices_category", options.category);
  if (options.chapterId) query = query.eq("chapter_id", options.chapterId);
  if (options.parentId) query = query.eq("parent_id", options.parentId);
  else query = query.is("parent_id", null);
  if (options.featured) query = query.eq("featured", true);
  if (options.country) query = query.eq("country", options.country);
  return decorate(check<ContentRow[]>(await query) ?? []);
}

export async function getBySlug(slug: string): Promise<FeedItem | null> {
  const row = check<ContentRow | null>(await db().from("content_items").select(publicColumns).eq("slug", slug).maybeSingle());
  if (!row) return null;
  return (await decorate([row]))[0] ?? null;
}

export async function getById(id: string): Promise<FeedItem | null> {
  const row = check<ContentRow | null>(await db().from("content_items").select(publicColumns).eq("id", id).maybeSingle());
  return row ? (await decorate([row]))[0] ?? null : null;
}

export type Chapter = { id: string; slug: string; position: number; title: string; introduction: string; contribution_call: string; questions: string[]; status: string; current_version: number; updated_at: string };
export async function listChapters(): Promise<Chapter[]> {
  return check<Chapter[]>(await db().from("playbook_chapters").select("*").neq("status", "archived").order("position")) ?? [];
}
export async function getChapter(slug: string): Promise<{ chapter: Chapter; version: { version: number; body: string; note: string; created_at: string } | null } | null> {
  const chapter = check<Chapter | null>(await db().from("playbook_chapters").select("*").eq("slug", slug).maybeSingle());
  if (!chapter) return null;
  const version = check<{ version: number; body: string; note: string; created_at: string } | null>(await db().from("playbook_chapter_versions").select("version,body,note,created_at").eq("chapter_id", chapter.id).eq("published", true).order("version", { ascending: false }).limit(1).maybeSingle());
  return { chapter, version };
}

export type Category = { key: string; name: string; description: string; position: number; active: boolean };
export async function listCategories(): Promise<Category[]> {
  return check<Category[]>(await db().from("voices_categories").select("*").eq("active", true).order("position")) ?? [];
}

export async function communityMode(): Promise<"pre_moderated" | "open"> {
  const result = await db().rpc("community_mode");
  return check<string>(result) === "open" ? "open" : "pre_moderated";
}

export type PublicProfile = { id: string; name: string; headline: string; primary_role: string; organisation: string; country: string; countries_of_operation: string[]; expertise: string[]; bio: string; links: string[] };
export async function publicProfiles(options: { ids?: string[]; search?: string; limit?: number } = {}): Promise<PublicProfile[]> {
  return check<PublicProfile[]>(await db().rpc("public_profiles", { ids: options.ids ?? null, search: options.search || null, max_rows: options.limit ?? 40 })) ?? [];
}
export async function profileContent(profileId: string): Promise<FeedItem[]> {
  const ids = check<string[]>(await db().rpc("profile_content", { profile: profileId, max_rows: 40 })) ?? [];
  if (!ids.length) return [];
  const rows = check<ContentRow[]>(await db().from("content_items").select(publicColumns).in("id", ids).order("published_at", { ascending: false })) ?? [];
  return decorate(rows);
}
export async function followerCount(profileId: string): Promise<number> {
  return Number(check<number>(await db().rpc("follower_count", { profile_id: profileId })) ?? 0);
}

// Signed URLs for private photographs. Row level security on storage decides whether one can
// be created: owners and staff always, others only once a live public item uses the file.
export async function mediaUrls(paths: string[]): Promise<Record<string, string>> {
  if (!paths.length) return {};
  const { data, error } = await supabase.storage.from("community-media").createSignedUrls(paths, 60 * 60 * 6);
  if (error || !data) return {};
  return Object.fromEntries(data.filter((d) => d.signedUrl && d.path).map((d) => [d.path as string, d.signedUrl as string]));
}
