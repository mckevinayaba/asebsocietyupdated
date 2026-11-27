// Authenticated community writes. Every call runs with the signed-in person's own token, so the
// database enforces ownership, lifecycle, consent and staff roles. See migration 0007.
import { createServerFn } from "@tanstack/react-start";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { communityKinds, contributionSchema, isMissingBackend, publicColumns, statuses, uniqueSlug, type ContentRow } from "@/lib/community";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const untyped = (client: unknown) => client as SupabaseClient<any>;
const unavailable = { available: false as const };
type DbError = { code?: string; message?: string } | null;
function fail(error: DbError, message: string): never {
  if (isMissingBackend(error)) throw new Error("The community service could not be reached. Please try again.");
  // Database rule messages are written for people (for example a missing consent), so pass them on.
  if (error?.code === "42501" && error.message && !/row-level security|permission denied/i.test(error.message)) throw new Error(error.message);
  throw new Error(message);
}

export const saveContribution = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input) => contributionSchema.parse(input))
  .handler(async ({ data, context }) => {
    const client = untyped(context.supabase);
    let chapterId: string | null = null;
    if (data.chapterSlug) {
      const chapter = await client.from("playbook_chapters").select("id").eq("slug", data.chapterSlug).maybeSingle();
      if (chapter.error || !chapter.data) fail(chapter.error, "That Playbook chapter could not be found.");
      chapterId = chapter.data.id as string;
    }
    const mode = await client.rpc("community_mode");
    // Ordinary community contributions publish through automated checks once the Secretariat has
    // switched them on. Stories, Playbook contributions and research always go to editors.
    const automated = data.submit && !mode.error && mode.data === "automated" && communityKinds.includes(data.kind);
    const fields = {
      kind: data.kind, title: data.title, summary: data.summary, body: data.body,
      voices_category: data.kind === "voice" ? data.voicesCategory ?? null : null,
      chapter_id: chapterId, parent_id: data.parentId ?? null, country: data.country, topics: data.topics,
      evidence_class: data.evidenceClass, details: data.chapterSlug ? { ...data.details, chapterSlug: data.chapterSlug } : data.details, media: data.media, visibility: data.visibility,
      attribution: data.attribution, consent_publish: data.consentPublish, consent_edit: data.consentEdit,
      status: automated ? "checking" : data.submit ? "submitted" : "draft",
    };
    const finish = async (saved: { id: string; slug: string; status: string }) => {
      if (saved.status !== "checking") return { ...saved, decision: null as string | null, reason: "" };
      const outcome = await checkSafely(saved.id);
      return { ...saved, status: outcome.status, decision: outcome.decision, reason: outcome.reason };
    };
    if (data.id) {
      const { kind: _kind, ...update } = fields;
      // Row level security limits updates to the author's own work.
      const result = await client.from("content_items").update(update).eq("id", data.id).select("id,slug,status").maybeSingle();
      if (result.error || !result.data) fail(result.error, "Your contribution could not be saved.");
      return finish(result.data as { id: string; slug: string; status: string });
    }
    const slug = uniqueSlug(data.title || data.body.slice(0, 60));
    const result = await client.from("content_items").insert({ ...fields, slug, author_id: context.userId }).select("id,slug,status").single();
    if (result.error) fail(result.error, "Your contribution could not be saved.");
    return finish(result.data as { id: string; slug: string; status: string });
  });

// Runs the trusted engine. If the engine itself cannot run, the contribution stays private in
// 'checking' and the person is told plainly. Nothing is published on failure.
async function checkSafely(id: string): Promise<{ status: string; decision: string; reason: string }> {
  try {
    const { moderateContribution } = await import("@/lib/moderation/engine.server");
    return await moderateContribution(id);
  } catch {
    return { status: "checking", decision: "error", reason: "We could not complete the safety check just now. Your contribution is saved privately and has not been published. Please try again in a moment." };
  }
}

// The author (or a moderator) asks for a contribution waiting in 'checking' to be checked again.
export const recheckContribution = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    // Row level security: only the author or a moderator can see an item waiting in 'checking'.
    const visible = await untyped(context.supabase).from("content_items").select("id,status").eq("id", data.id).maybeSingle();
    if (visible.error || !visible.data) fail(visible.error, "This contribution could not be found.");
    if (visible.data.status !== "checking") return { status: visible.data.status as string, decision: "stale", reason: "" };
    return checkSafely(data.id);
  });

export const requestModerationReview = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid(), message: z.string().trim().max(1500).default("") }).parse(input))
  .handler(async ({ data, context }) => {
    const result = await untyped(context.supabase).rpc("request_moderation_review", { p_content: data.id, p_message: data.message });
    if (result.error) fail(result.error, "Your request could not be sent.");
    return { success: true };
  });

export const getMyModeration = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const client = untyped(context.supabase);
  const [outcomes, standing, appeals] = await Promise.all([
    client.rpc("my_moderation_outcomes"),
    client.rpc("my_account_standing"),
    client.from("moderation_appeals").select("content_id,status,resolution_note,created_at").order("created_at", { ascending: false }).limit(50),
  ]);
  if (isMissingBackend(outcomes.error)) return unavailable;
  return {
    available: true as const,
    outcomes: (outcomes.data ?? []) as { content_id: string; decision: string; public_reason: string; created_at: string }[],
    standing: (standing.data ?? []) as { level: string; message_to_user: string; ends_at: string | null; created_at: string }[],
    appeals: (appeals.data ?? []) as { content_id: string; status: string; resolution_note: string; created_at: string }[],
  };
});

export const withdrawContribution = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const result = await untyped(context.supabase).from("content_items").update({ status: "archived" }).eq("id", data.id).select("id");
    if (result.error || !result.data?.length) fail(result.error, "This contribution could not be withdrawn.");
    return { success: true };
  });

export const deleteDraft = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const result = await untyped(context.supabase).from("content_items").delete().eq("id", data.id).eq("status", "draft").select("id");
    if (result.error || !result.data?.length) fail(result.error, "Only drafts can be deleted.");
    return { success: true };
  });

export const getMyWork = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const client = untyped(context.supabase);
  const [items, messages] = await Promise.all([
    client.rpc("my_content"),
    client.rpc("my_editorial_messages"),
  ]);
  if (isMissingBackend(items.error)) return unavailable;
  if (items.error) fail(items.error, "Your contributions could not be loaded.");
  return { available: true as const, items: (items.data ?? []) as ContentRow[], messages: (messages.data ?? []) as { content_id: string; decision: string; message_to_author: string; created_at: string }[] };
});

export const getMyEngagementState = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ ids: z.array(z.string().uuid()).max(100) }).parse(input))
  .handler(async ({ data, context }) => {
    const client = untyped(context.supabase);
    const [reactions, bookmarks, follows] = await Promise.all([
      data.ids.length ? client.from("reactions").select("content_id,kind").eq("user_id", context.userId).in("content_id", data.ids) : Promise.resolve({ data: [], error: null }),
      client.from("bookmarks").select("content_id").eq("user_id", context.userId),
      client.from("follows").select("target_type,target_key").eq("follower_id", context.userId),
    ]);
    if (isMissingBackend(bookmarks.error)) return { available: false as const, reactions: [] as { content_id: string; kind: string }[], bookmarks: [] as string[], follows: [] as { target_type: string; target_key: string }[] };
    return {
      available: true as const,
      reactions: (reactions.data ?? []) as { content_id: string; kind: string }[],
      bookmarks: ((bookmarks.data ?? []) as { content_id: string }[]).map((b) => b.content_id),
      follows: (follows.data ?? []) as { target_type: string; target_key: string }[],
    };
  });

export const toggleReaction = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ contentId: z.string().uuid(), kind: z.enum(["appreciate", "useful"]), on: z.boolean() }).parse(input))
  .handler(async ({ data, context }) => {
    const table = untyped(context.supabase).from("reactions");
    const result = data.on
      ? await table.upsert({ content_id: data.contentId, user_id: context.userId, kind: data.kind }, { ignoreDuplicates: true })
      : await table.delete().eq("content_id", data.contentId).eq("user_id", context.userId).eq("kind", data.kind);
    if (result.error) fail(result.error, "That could not be saved. Confirm your email address, then try again.");
    return { success: true };
  });

export const toggleBookmark = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ contentId: z.string().uuid(), on: z.boolean() }).parse(input))
  .handler(async ({ data, context }) => {
    const table = untyped(context.supabase).from("bookmarks");
    const result = data.on ? await table.upsert({ content_id: data.contentId, user_id: context.userId }, { ignoreDuplicates: true }) : await table.delete().eq("content_id", data.contentId).eq("user_id", context.userId);
    if (result.error) fail(result.error, "That could not be saved.");
    return { success: true };
  });

export const toggleFollow = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ targetType: z.enum(["profile", "country", "topic", "question", "chapter"]), targetKey: z.string().trim().min(1).max(120), on: z.boolean() }).parse(input))
  .handler(async ({ data, context }) => {
    const table = untyped(context.supabase).from("follows");
    const result = data.on
      ? await table.upsert({ follower_id: context.userId, target_type: data.targetType, target_key: data.targetKey }, { ignoreDuplicates: true })
      : await table.delete().eq("follower_id", context.userId).eq("target_type", data.targetType).eq("target_key", data.targetKey);
    if (result.error) fail(result.error, "That could not be saved.");
    return { success: true };
  });

export const reportContent = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ contentId: z.string().uuid(), reason: z.enum(["spam", "suspicious_opportunity", "harassment", "discrimination", "threat", "privacy", "impersonation", "false_or_misleading", "confidential", "other"]), detail: z.string().trim().max(1000).default("") }).parse(input))
  .handler(async ({ data, context }) => {
    const result = await untyped(context.supabase).from("content_reports").insert({ content_id: data.contentId, reporter_id: context.userId, reason: data.reason, detail: data.detail });
    if (result.error?.code === "23505") return { success: true, duplicate: true };
    if (result.error) fail(result.error, "Your report could not be sent.");
    return { success: true, duplicate: false };
  });

export const getMyBookmarks = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const client = untyped(context.supabase);
  const marks = await client.from("bookmarks").select("content_id,created_at").eq("user_id", context.userId).order("created_at", { ascending: false }).limit(100);
  if (isMissingBackend(marks.error)) return unavailable;
  const ids = ((marks.data ?? []) as { content_id: string }[]).map((m) => m.content_id);
  const items = ids.length ? await client.from("content_items").select("id,kind,slug,title,body,parent_id").in("id", ids) : { data: [], error: null };
  return { available: true as const, items: (items.data ?? []) as Pick<ContentRow, "id" | "kind" | "slug" | "title" | "body" | "parent_id">[] };
});

export const getNotifications = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const result = await untyped(context.supabase).from("notifications").select("id,kind,content_id,message,read_at,created_at").eq("user_id", context.userId).order("created_at", { ascending: false }).limit(40);
  if (isMissingBackend(result.error)) return unavailable;
  if (result.error) fail(result.error, "Notifications could not be loaded.");
  return { available: true as const, items: (result.data ?? []) as { id: number; kind: string; content_id: string | null; message: string; read_at: string | null; created_at: string }[] };
});

export const markNotificationsRead = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const result = await untyped(context.supabase).from("notifications").update({ read_at: new Date().toISOString() }).eq("user_id", context.userId).is("read_at", null);
  if (result.error) fail(result.error, "Notifications could not be updated.");
  return { success: true };
});

export const profileSchema = z.object({
  name: z.string().trim().min(2).max(200),
  headline: z.string().trim().max(160),
  country: z.string().trim().max(100),
  organisation: z.string().trim().max(200),
  bio: z.string().trim().max(3000),
  countriesOfOperation: z.array(z.string().trim().min(2).max(100)).max(60),
  expertise: z.array(z.string().trim().min(2).max(60)).max(20),
  participationPaths: z.array(z.enum(["builder", "founder", "institution", "research", "finance", "policy", "expertise", "aspiring", "connect"])).max(9),
  links: z.array(z.string().url().max(300).refine((u) => /^https:\/\//.test(u), "Use https links")).max(5),
  visibility: z.enum(["public", "community", "private"]),
  homePreference: z.enum(["field", "institution"]),
  acceptGuidelines: z.boolean(),
});

export type VillageProfile = { name: string; headline: string; country: string; organisation: string; bio: string; primary_role: string; countries_of_operation: string[]; expertise: string[]; participation_paths: string[]; links: string[]; visibility: string; home_preference: string; guidelines_accepted_at: string | null; onboarded_at: string | null };

export const getMyProfile = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const result = await untyped(context.supabase).from("profiles").select("name,headline,country,organisation,bio,primary_role,countries_of_operation,expertise,participation_paths,links,visibility,home_preference,guidelines_accepted_at,onboarded_at").eq("id", context.userId).maybeSingle();
  if (result.error && (isMissingBackend(result.error) || /column/i.test(result.error.message ?? ""))) return { available: false as const, profile: null };
  if (result.error) fail(result.error, "Your profile could not be loaded.");
  return { available: true as const, profile: (result.data ?? null) as VillageProfile | null };
});

export const saveVillageProfile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input) => profileSchema.parse(input))
  .handler(async ({ data, context }) => {
    const update: Record<string, unknown> = {
      name: data.name, headline: data.headline, country: data.country, organisation: data.organisation, bio: data.bio,
      countries_of_operation: data.countriesOfOperation, expertise: data.expertise, participation_paths: data.participationPaths,
      links: data.links, visibility: data.visibility, home_preference: data.homePreference, onboarded_at: new Date().toISOString(),
    };
    if (data.acceptGuidelines) update["guidelines_accepted_at"] = new Date().toISOString();
    const result = await untyped(context.supabase).from("profiles").update(update).eq("id", context.userId).select("id");
    if (result.error || !result.data?.length) fail(result.error, "Your profile could not be saved.");
    return { success: true };
  });

// ---- Editorial and moderation (enforced by can_edit_content() and can_moderate()) ----

export const getEditorialQueue = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const client = untyped(context.supabase);
  const access = await client.rpc("can_moderate");
  if (isMissingBackend(access.error)) return { state: "not_provisioned" as const };
  if (access.error || access.data !== true) return { state: "forbidden" as const };
  const [editor, items, reports, mode, chapters, categories] = await Promise.all([
    client.rpc("can_edit_content"),
    client.from("content_items").select(publicColumns).neq("status", "draft").order("updated_at", { ascending: false }).limit(200),
    client.from("content_reports").select("id,content_id,reason,detail,status,created_at").order("created_at", { ascending: false }).limit(100),
    client.rpc("community_mode"),
    client.from("playbook_chapters").select("*").order("position"),
    client.from("voices_categories").select("*").order("position"),
  ]);
  if (items.error) fail(items.error, "The editorial queue could not be loaded.");
  const rows = (items.data ?? []) as ContentRow[];
  const authors = rows.length ? await client.rpc("content_submitters", { ids: rows.map((r) => r.id) }) : { data: [] };
  return {
    state: "ready" as const,
    isEditor: editor.data === true,
    items: rows,
    submitters: (authors.data ?? []) as { content_id: string; author_id: string; name: string; email: string }[],
    reports: (reports.data ?? []) as { id: string; content_id: string; reason: string; detail: string; status: string; created_at: string }[],
    communityMode: (mode.data === "automated" ? "automated" : "pre_moderated") as "automated" | "pre_moderated",
    chapters: (chapters.data ?? []) as { id: string; slug: string; position: number; title: string; introduction: string; contribution_call: string; status: string; current_version: number }[],
    categories: (categories.data ?? []) as { key: string; name: string; description: string; position: number; active: boolean }[],
  };
});

const decisionStatus: Record<string, (typeof statuses)[number] | null> = {
  note: null, assigned: null, revision_requested: "revision_requested", accepted: "accepted", scheduled: "scheduled",
  published: "published", declined: "declined", archived: "archived", hidden: null, restored: null, featured: null, unfeatured: null, restricted: "restricted",
};

export const decideContent = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({
    contentId: z.string().uuid(),
    decision: z.enum(["note", "revision_requested", "accepted", "scheduled", "published", "declined", "archived", "hidden", "restored", "featured", "unfeatured", "restricted"]),
    messageToAuthor: z.string().trim().max(2000).default(""),
    privateNote: z.string().trim().max(4000).default(""),
    scheduledFor: z.string().datetime().optional(),
  }).parse(input))
  .handler(async ({ data, context }) => {
    const client = untyped(context.supabase);
    const status = decisionStatus[data.decision];
    const update: Record<string, unknown> = {};
    if (status) update["status"] = status;
    if (status === "scheduled") {
      if (!data.scheduledFor || Date.parse(data.scheduledFor) <= Date.now()) throw new Error("Choose a future publication time.");
      update["scheduled_for"] = data.scheduledFor;
    }
    if (data.decision === "hidden") update["hidden_by_moderator"] = true;
    if (data.decision === "restored") update["hidden_by_moderator"] = false;
    if (data.decision === "featured") update["featured"] = true;
    if (data.decision === "unfeatured") update["featured"] = false;
    if (Object.keys(update).length) {
      const result = await client.from("content_items").update(update).eq("id", data.contentId).select("id");
      if (result.error || !result.data?.length) fail(result.error, "That decision could not be saved.");
    }
    const review = await client.from("editorial_reviews").insert({ content_id: data.contentId, reviewer_id: context.userId, decision: data.decision, message_to_author: data.messageToAuthor, private_note: data.privateNote });
    if (review.error) fail(review.error, "The decision was applied, but the review record could not be saved.");
    return { success: true };
  });

export const getReviewHistory = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ contentId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const client = untyped(context.supabase);
    const [reviews, revisions] = await Promise.all([
      client.from("editorial_reviews").select("id,decision,message_to_author,private_note,created_at").eq("content_id", data.contentId).order("created_at", { ascending: false }),
      client.from("content_revisions").select("id,status,title,created_at").eq("content_id", data.contentId).order("created_at", { ascending: false }).limit(20),
    ]);
    if (reviews.error) fail(reviews.error, "The review history could not be loaded.");
    return { reviews: reviews.data ?? [], revisions: revisions.data ?? [] };
  });

export const resolveReport = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid(), status: z.enum(["actioned", "dismissed"]), note: z.string().trim().max(2000).default("") }).parse(input))
  .handler(async ({ data, context }) => {
    const result = await untyped(context.supabase).from("content_reports").update({ status: data.status, resolution_note: data.note }).eq("id", data.id).select("id");
    if (result.error || !result.data?.length) fail(result.error, "The report could not be resolved.");
    await untyped(context.supabase).from("secretariat_audit_log").insert({ actor_id: context.userId, action: "report_resolved", subject_type: "content_report", subject_id: data.id, detail: { status: data.status } });
    return { success: true };
  });

export const setCommunityMode = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ mode: z.enum(["pre_moderated", "automated"]) }).parse(input))
  .handler(async ({ data, context }) => {
    // Automated publishing needs a working moderation service. Without it every contribution would
    // wait privately, so the switch is refused until the key is configured on the server.
    if (data.mode === "automated") {
      const { moderationConfigured } = await import("@/lib/moderation/provider");
      if (!moderationConfigured()) throw new Error("Automated publishing cannot be switched on until the moderation service key (OPENAI_API_KEY) is configured on the server.");
    }
    const result = await untyped(context.supabase).from("platform_settings").update({ value: data.mode, updated_at: new Date().toISOString() }).eq("key", "community_mode").select("value");
    if (result.error || !result.data?.length) fail(result.error, "Only Secretariat administrators can change this setting.");
    await untyped(context.supabase).from("secretariat_audit_log").insert({ actor_id: context.userId, action: "setting_changed", subject_type: "community_mode", detail: { value: data.mode } });
    return { success: true };
  });

export const saveChapter = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({
    id: z.string().uuid().optional(),
    slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/).max(80),
    title: z.string().trim().min(3).max(160),
    position: z.number().int().min(0).max(999),
    introduction: z.string().trim().max(3000),
    contributionCall: z.string().trim().max(1500),
    status: z.enum(["proposed", "open", "drafting", "in_review", "published", "archived"]),
  }).parse(input))
  .handler(async ({ data, context }) => {
    const client = untyped(context.supabase);
    const fields = { slug: data.slug, title: data.title, position: data.position, introduction: data.introduction, contribution_call: data.contributionCall, status: data.status, updated_at: new Date().toISOString() };
    const result = data.id ? await client.from("playbook_chapters").update(fields).eq("id", data.id).select("id") : await client.from("playbook_chapters").insert(fields).select("id");
    if (result.error || !result.data?.length) fail(result.error, "The chapter could not be saved. Only editors can manage chapters.");
    await client.from("secretariat_audit_log").insert({ actor_id: context.userId, action: "chapter_changed", subject_type: "playbook_chapter", subject_id: (result.data?.[0] as { id: string }).id, detail: { status: data.status } });
    return { success: true };
  });

export const publishChapterVersion = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ chapterId: z.string().uuid(), body: z.string().trim().min(20).max(120000), note: z.string().trim().max(1000).default(""), publish: z.boolean() }).parse(input))
  .handler(async ({ data, context }) => {
    const client = untyped(context.supabase);
    const chapter = await client.from("playbook_chapters").select("current_version").eq("id", data.chapterId).maybeSingle();
    if (chapter.error || !chapter.data) fail(chapter.error, "Chapter not found.");
    const version = Number(chapter.data.current_version ?? 0) + 1;
    const insert = await client.from("playbook_chapter_versions").insert({ chapter_id: data.chapterId, version, body: data.body, note: data.note, editor_id: context.userId, published: data.publish });
    if (insert.error) fail(insert.error, "The chapter version could not be saved. Only editors can do this.");
    const update = await client.from("playbook_chapters").update({ current_version: version, updated_at: new Date().toISOString() }).eq("id", data.chapterId);
    if (update.error) fail(update.error, "The version was saved, but the chapter could not be updated.");
    return { success: true, version };
  });

export const saveCategory = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ key: z.string().regex(/^[a-z][a-z0-9-]{1,40}$/), name: z.string().trim().min(2).max(80), description: z.string().trim().max(400), position: z.number().int().min(0).max(999), active: z.boolean(), isNew: z.boolean() }).parse(input))
  .handler(async ({ data, context }) => {
    const client = untyped(context.supabase);
    const fields = { key: data.key, name: data.name, description: data.description, position: data.position, active: data.active };
    const result = data.isNew ? await client.from("voices_categories").insert(fields).select("key") : await client.from("voices_categories").update(fields).eq("key", data.key).select("key");
    if (result.error || !result.data?.length) fail(result.error, "The category could not be saved. Only editors can manage categories.");
    return { success: true };
  });

// ---- Community moderation: the exceptions people handle (migration 0011) ----

export type Assessment = { content_id: string; decision: string; categories: string[]; rule_hits: { rule: string; outcome: string; detail: string }[]; provider: string; model: string; public_reason: string; applied: boolean; created_at: string };
export type Appeal = { id: string; content_id: string; message: string; status: string; resolution_note: string; created_at: string };
export type Restriction = { id: string; user_id: string; level: string; reason: string; message_to_user: string; ends_at: string | null; revoked_at: string | null; created_at: string };

export const getModerationWorkspace = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const client = untyped(context.supabase);
  const [assessments, appeals, restrictions, indicators] = await Promise.all([
    client.from("moderation_assessments").select("content_id,decision,categories,rule_hits,provider,model,public_reason,applied,created_at").order("created_at", { ascending: false }).limit(400),
    client.from("moderation_appeals").select("id,content_id,message,status,resolution_note,created_at").order("created_at", { ascending: false }).limit(100),
    client.from("account_restrictions").select("id,user_id,level,reason,message_to_user,ends_at,revoked_at,created_at").order("created_at", { ascending: false }).limit(100),
    client.rpc("moderation_indicators", { days: 30 }),
  ]);
  if (isMissingBackend(assessments.error)) return unavailable;
  const latest = new Map<string, Assessment>();
  for (const a of (assessments.data ?? []) as Assessment[]) if (!latest.has(a.content_id)) latest.set(a.content_id, a);
  return {
    available: true as const,
    assessments: [...latest.values()],
    appeals: (appeals.data ?? []) as Appeal[],
    restrictions: (restrictions.data ?? []) as Restriction[],
    indicators: ((indicators.data ?? []) as Record<string, number>[])[0] ?? null,
  };
});

export const resolveAppeal = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid(), contentId: z.string().uuid(), outcome: z.enum(["upheld", "overturned"]), note: z.string().trim().max(2000).default("") }).parse(input))
  .handler(async ({ data, context }) => {
    const client = untyped(context.supabase);
    if (data.outcome === "overturned") {
      const publish = await client.from("content_items").update({ status: "published" }).eq("id", data.contentId).select("id");
      if (publish.error || !publish.data?.length) fail(publish.error, "The contribution could not be published.");
      await client.from("editorial_reviews").insert({ content_id: data.contentId, reviewer_id: context.userId, decision: "published", private_note: `Appeal overturned. ${data.note}`.trim() });
    }
    const result = await client.from("moderation_appeals").update({ status: data.outcome, resolution_note: data.note, resolved_by: context.userId, resolved_at: new Date().toISOString() }).eq("id", data.id).select("id");
    if (result.error || !result.data?.length) fail(result.error, "The appeal could not be resolved.");
    return { success: true };
  });

export const restrictAccount = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ userId: z.string().uuid(), level: z.enum(["warning", "temporary", "suspended"]), reason: z.string().trim().min(3).max(2000), message: z.string().trim().max(1000).default(""), days: z.number().int().min(1).max(365).optional() }).parse(input))
  .handler(async ({ data, context }) => {
    if (data.level === "temporary" && !data.days) throw new Error("Choose how many days the pause lasts.");
    const endsAt = data.level === "temporary" && data.days ? new Date(Date.now() + data.days * 86_400_000).toISOString() : null;
    const result = await untyped(context.supabase).from("account_restrictions").insert({ user_id: data.userId, level: data.level, reason: data.reason, message_to_user: data.message, ends_at: endsAt, created_by: context.userId }).select("id");
    if (result.error || !result.data?.length) fail(result.error, data.level === "suspended" ? "Only Secretariat administrators can suspend an account." : "The restriction could not be saved.");
    return { success: true };
  });

export const liftRestriction = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const result = await untyped(context.supabase).from("account_restrictions").update({ revoked_at: new Date().toISOString() }).eq("id", data.id).select("id");
    if (result.error || !result.data?.length) fail(result.error, "The restriction could not be lifted.");
    return { success: true };
  });
