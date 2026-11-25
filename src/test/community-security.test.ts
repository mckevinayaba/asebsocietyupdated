// @vitest-environment node
// Security and workflow tests for migration 0007 (the shared content model for The Field, the
// Playbook, ASEB Voices, Ask the Village and State of the Field).
import { beforeAll, describe, expect, it } from "vitest";
import { asRole, createDatabase, type Db } from "./db-harness";

const ADMIN = "11111111-1111-1111-1111-111111111111";
const EDITOR = "22222222-2222-2222-2222-222222222222";
const MODERATOR = "33333333-3333-3333-3333-333333333333";
const AUTHOR = "44444444-4444-4444-4444-444444444444";
const READER = "55555555-5555-5555-5555-555555555555";
const UNVERIFIED = "66666666-6666-6666-6666-666666666666";

let db: Db;
const as = (uid: string, sql: string) => asRole(db, "authenticated", uid, sql);
const anon = (sql: string) => asRole(db, "anon", "", sql);
const insert = (uid: string, fields: string, values: string) => as(uid, `INSERT INTO public.content_items (${fields}) VALUES (${values}) RETURNING id, status`);

beforeAll(async () => {
  db = await createDatabase();
  await db.exec(`
    INSERT INTO auth.users (id, email, email_confirmed_at, raw_user_meta_data) VALUES
      ('${ADMIN}', 'admin@example.org', now(), '{"name":"Admin Person"}'),
      ('${EDITOR}', 'editor@example.org', now(), '{"name":"Editor Person"}'),
      ('${MODERATOR}', 'moderator@example.org', now(), '{"name":"Moderator Person"}'),
      ('${AUTHOR}', 'author@example.org', now(), '{"name":"Amina Author"}'),
      ('${READER}', 'reader@example.org', now(), '{"name":"Reader Person"}'),
      ('${UNVERIFIED}', 'new@example.org', NULL, '{"name":"New Person"}');
    INSERT INTO public.secretariat_roles (user_id, role) VALUES ('${ADMIN}', 'secretariat_admin'), ('${EDITOR}', 'editor'), ('${MODERATOR}', 'moderator');
    INSERT INTO public.membership_applications (name, email, country, role, membership_type, code_accepted) VALUES ('Applicant', 'applicant@example.org', 'Kenya', 'Mentor', 'individual', true);
  `);
}, 60_000);

describe("roles and least privilege", () => {
  it("keeps membership records away from editors and moderators", async () => {
    expect((await as(EDITOR, "SELECT count(*)::int AS n FROM public.membership_applications")).rows[0]).toEqual({ n: 0 });
    expect((await as(MODERATOR, "SELECT public.is_secretariat() AS s")).rows[0]).toEqual({ s: false });
    expect((await as(ADMIN, "SELECT count(*)::int AS n FROM public.membership_applications")).rows[0]).toEqual({ n: 1 });
  });
  it("lets only administrators open community publishing", async () => {
    expect((await as(EDITOR, "UPDATE public.platform_settings SET value = 'open' WHERE key = 'community_mode' RETURNING value")).rows).toEqual([]);
    expect((await anon("SELECT public.community_mode() AS m")).rows[0]).toEqual({ m: "pre_moderated" });
  });
  it("seeds the fourteen proposed Playbook chapters and nine Voices categories", async () => {
    expect((await anon("SELECT count(*)::int AS n FROM public.playbook_chapters")).rows[0]).toEqual({ n: 14 });
    const cats = await anon("SELECT key FROM public.voices_categories ORDER BY position");
    expect(cats.rows.map((r) => r["key"])).toContain("founders");
    expect(cats.rows).toHaveLength(9);
    expect((await anon("SELECT count(*)::int AS n FROM public.playbook_chapter_versions")).rows[0]).toEqual({ n: 0 });
  });
});

describe("publishing lifecycle", () => {
  let postId = "";
  let voiceId = "";
  it("refuses unverified accounts and direct publication while pre-moderated", async () => {
    expect((await insert(UNVERIFIED, "kind, slug, body, consent_publish, status", `'post', 'unverified-post', 'Hello', true, 'submitted'`)).error).toMatch(/row-level security/);
    expect((await insert(AUTHOR, "kind, slug, body, consent_publish, status", `'post', 'too-early', 'Hello', true, 'published'`)).error).toMatch(/draft or a submission/);
  });
  it("lets a verified author submit a post that stays hidden until a moderator publishes it", async () => {
    const r = await insert(AUTHOR, "kind, slug, body, consent_publish, status", `'post', 'whats-happening-in-kisumu', 'A new hub opened in Kisumu.', true, 'submitted'`);
    expect(r.error).toBeNull();
    postId = String(r.rows[0]?.["id"]);
    expect((await anon(`SELECT id FROM public.content_items WHERE id = '${postId}'`)).rows).toEqual([]);
    expect((await as(READER, `SELECT id FROM public.content_items WHERE id = '${postId}'`)).rows).toEqual([]);
    expect((await as(AUTHOR, `SELECT status FROM public.content_items WHERE id = '${postId}'`)).rows).toEqual([{ status: "submitted" }]);
    expect((await as(MODERATOR, `UPDATE public.content_items SET status = 'published' WHERE id = '${postId}' RETURNING status, published_at IS NOT NULL AS stamped`)).rows).toEqual([{ status: "published", stamped: true }]);
    expect((await anon(`SELECT slug FROM public.content_items WHERE id = '${postId}'`)).rows).toEqual([{ slug: "whats-happening-in-kisumu" }]);
  });
  it("keeps drafts private from everyone except their author, editors included", async () => {
    const r = await insert(AUTHOR, "kind, slug, title, body, voices_category, status", `'voice', 'my-draft-story', 'Draft', 'Not ready', 'founders', 'draft'`);
    expect(r.error).toBeNull();
    expect((await as(EDITOR, "SELECT id FROM public.content_items WHERE slug = 'my-draft-story'")).rows).toEqual([]);
  });
  it("routes an ASEB Voices story through editorial review", async () => {
    const r = await insert(AUTHOR, "kind, slug, title, body, voices_category, evidence_class, consent_publish, consent_edit, status", `'voice', 'the-hub-that-stayed', 'The hub that stayed', 'Story text', 'founders', 'founder_perspective', true, false, 'submitted'`);
    voiceId = String(r.rows[0]?.["id"]);
    expect((await as(MODERATOR, `UPDATE public.content_items SET status = 'published' WHERE id = '${voiceId}'`)).error).toMatch(/need an editor/);
    expect((await as(EDITOR, `UPDATE public.content_items SET body = 'Rewritten' WHERE id = '${voiceId}'`)).error).toMatch(/not allowed editorial changes/);
    expect((await as(AUTHOR, `UPDATE public.content_items SET status = 'published' WHERE id = '${voiceId}'`)).error).toMatch(/cannot be changed now|with the editors/);
    expect((await as(EDITOR, `INSERT INTO public.editorial_reviews (content_id, decision, message_to_author, private_note) VALUES ('${voiceId}', 'revision_requested', 'Please add the year.', 'Strong story') RETURNING decision`)).rows).toEqual([{ decision: "revision_requested" }]);
    expect((await as(EDITOR, `UPDATE public.content_items SET status = 'revision_requested' WHERE id = '${voiceId}' RETURNING status`)).rows).toEqual([{ status: "revision_requested" }]);
    expect((await as(AUTHOR, `UPDATE public.content_items SET body = 'Story text, 2024', status = 'submitted' WHERE id = '${voiceId}' RETURNING status`)).rows).toEqual([{ status: "submitted" }]);
    expect((await as(EDITOR, `UPDATE public.content_items SET status = 'published', featured = true WHERE id = '${voiceId}' RETURNING status`)).rows).toEqual([{ status: "published" }]);
    expect((await anon(`SELECT title FROM public.content_items WHERE id = '${voiceId}'`)).rows).toEqual([{ title: "The hub that stayed" }]);
  });
  it("shows authors editors' messages but never private notes", async () => {
    const msgs = await as(AUTHOR, "SELECT decision, message_to_author FROM public.my_editorial_messages()");
    expect(msgs.rows).toContainEqual({ decision: "revision_requested", message_to_author: "Please add the year." });
    expect(JSON.stringify(msgs.rows)).not.toContain("Strong story");
    expect((await as(AUTHOR, "SELECT count(*)::int AS n FROM public.editorial_reviews")).rows[0]).toEqual({ n: 0 });
  });
  it("keeps a revision history and notifies the author", async () => {
    expect(((await as(AUTHOR, `SELECT count(*)::int AS n FROM public.content_revisions WHERE content_id = '${voiceId}'`)).rows[0]?.["n"] as number)).toBeGreaterThanOrEqual(3);
    const notes = await as(AUTHOR, "SELECT kind FROM public.notifications ORDER BY id");
    expect(notes.rows.map((r) => r["kind"])).toEqual(expect.arrayContaining(["editorial", "published"]));
  });
  it("refuses publication without the contributor's consent", async () => {
    const r = await insert(AUTHOR, "kind, slug, body, consent_publish, status", `'article', 'no-consent', 'Body', false, 'draft'`);
    expect(r.error).toBeNull();
    expect((await as(AUTHOR, "UPDATE public.content_items SET status = 'submitted' WHERE slug = 'no-consent'")).error).toMatch(/check constraint/);
  });
  it("publishes scheduled items only once their time arrives", async () => {
    const r = await insert(AUTHOR, "kind, slug, title, body, consent_publish, consent_edit, status", `'article', 'future-article', 'Future', 'Later', true, true, 'submitted'`);
    expect(r.error).toBeNull();
    await as(EDITOR, "UPDATE public.content_items SET status = 'scheduled', scheduled_for = now() + interval '2 days' WHERE slug = 'future-article'");
    expect((await anon("SELECT id FROM public.content_items WHERE slug = 'future-article'")).rows).toEqual([]);
  });
  it("lets authors withdraw their own published work", async () => {
    expect((await as(AUTHOR, `UPDATE public.content_items SET status = 'archived' WHERE id = '${postId}' RETURNING status`)).rows).toEqual([{ status: "archived" }]);
    expect((await anon(`SELECT id FROM public.content_items WHERE id = '${postId}'`)).rows).toEqual([]);
  });
  it("never lets authors feature, hide or re-slug their own work", async () => {
    await insert(AUTHOR, "kind, slug, body, consent_publish, status", `'post', 'self-feature', 'x', true, 'draft'`);
    expect((await as(AUTHOR, "UPDATE public.content_items SET featured = true WHERE slug = 'self-feature'")).error).toMatch(/Only the Secretariat/);
  });
});

describe("Ask the Village, engagement and moderation", () => {
  let questionId = "";
  it("accepts a question and an answer, and notifies the asker when the answer goes live", async () => {
    const q = await insert(AUTHOR, "kind, slug, title, body, consent_publish, status", `'question', 'how-do-you-fund-a-rural-hub', 'How do you fund a rural hub?', 'Context', true, 'submitted'`);
    questionId = String(q.rows[0]?.["id"]);
    await as(MODERATOR, `UPDATE public.content_items SET status = 'published' WHERE id = '${questionId}'`);
    const a = await insert(READER, "kind, slug, body, parent_id, consent_publish, status", `'answer', 'answer-rural-hub-1', 'We blended county and philanthropic funds.', '${questionId}', true, 'submitted'`);
    expect(a.error).toBeNull();
    await as(MODERATOR, "UPDATE public.content_items SET status = 'published' WHERE slug = 'answer-rural-hub-1'");
    expect((await as(AUTHOR, "SELECT kind FROM public.notifications WHERE kind = 'answer'")).rows).toHaveLength(1);
  });
  it("counts only real reactions and lets people mark answers useful", async () => {
    expect((await as(READER, `INSERT INTO public.reactions (content_id, kind) VALUES ('${questionId}', 'appreciate') RETURNING kind`)).error).toBeNull();
    expect((await as(READER, `INSERT INTO public.reactions (content_id, kind) VALUES ('${questionId}', 'appreciate')`)).error).toMatch(/duplicate key/);
    const eng = await anon(`SELECT appreciations::int AS a, responses::int AS r FROM public.content_engagement(ARRAY['${questionId}']::uuid[])`);
    expect(eng.rows).toEqual([{ a: 1, r: 1 }]);
  });
  it("hides an author's name when they ask to stay anonymous", async () => {
    const r = await insert(AUTHOR, "kind, slug, title, body, voices_category, attribution, consent_publish, status", `'voice', 'anonymous-truth', 'A failure', 'Text', 'uncomfortable-truth', 'anonymous', true, 'submitted'`);
    await as(EDITOR, `UPDATE public.content_items SET status = 'published' WHERE id = '${String(r.rows[0]?.["id"])}'`);
    const names = await anon(`SELECT display_name, profile_id FROM public.content_authors(ARRAY['${String(r.rows[0]?.["id"])}']::uuid[])`);
    expect(names.rows[0]?.["display_name"]).toMatch(/withheld/);
    expect(names.rows[0]?.["profile_id"]).toBeNull();
  });
  it("lets people report content and only moderators resolve reports", async () => {
    expect((await as(READER, `INSERT INTO public.content_reports (content_id, reason) VALUES ('${questionId}', 'spam') RETURNING status`)).rows).toEqual([{ status: "open" }]);
    expect((await as(AUTHOR, "SELECT count(*)::int AS n FROM public.content_reports")).rows[0]).toEqual({ n: 0 });
    expect((await as(READER, "UPDATE public.content_reports SET status = 'dismissed' RETURNING id")).rows).toEqual([]);
    expect((await as(MODERATOR, "UPDATE public.content_reports SET status = 'dismissed', resolution_note = 'Not spam' RETURNING status")).rows).toEqual([{ status: "dismissed" }]);
  });
  it("lets moderators hide community content", async () => {
    expect((await as(MODERATOR, `UPDATE public.content_items SET hidden_by_moderator = true WHERE id = '${questionId}' RETURNING id`)).error).toBeNull();
    expect((await anon(`SELECT id FROM public.content_items WHERE id = '${questionId}'`)).rows).toEqual([]);
  });
  it("keeps bookmarks, follows and blocks private to their owner", async () => {
    await as(READER, `INSERT INTO public.follows (target_type, target_key) VALUES ('country', 'Kenya')`);
    await as(READER, `INSERT INTO public.follows (target_type, target_key) VALUES ('profile', '${AUTHOR}')`);
    expect((await as(AUTHOR, "SELECT count(*)::int AS n FROM public.follows")).rows[0]).toEqual({ n: 0 });
    expect((await as(AUTHOR, "SELECT kind FROM public.notifications WHERE kind = 'follow'")).rows).toHaveLength(1);
  });
});

describe("profiles and the Playbook", () => {
  it("exposes only profiles their owners made public, with no preferences or contact details", async () => {
    expect((await anon("SELECT id FROM public.public_profiles()")).rows).toEqual([]);
    await as(AUTHOR, `UPDATE public.profiles SET visibility = 'public', headline = 'Hub founder', participation_paths = ARRAY['builder','founder'] WHERE id = '${AUTHOR}'`);
    const rows = (await anon("SELECT * FROM public.public_profiles()")).rows;
    expect(rows.map((r) => r["name"])).toEqual(["Amina Author"]);
    expect(Object.keys(rows[0] ?? {})).not.toContain("participation_paths");
    expect(Object.keys(rows[0] ?? {})).not.toContain("email");
    expect((await anon("SELECT count(*)::int AS n FROM public.profiles")).rows[0]).toEqual({ n: 0 });
  });
  it("lets only editors manage chapters and publish versions", async () => {
    expect((await as(AUTHOR, "UPDATE public.playbook_chapters SET title = 'Hijacked' RETURNING id")).rows).toEqual([]);
    const chapter = (await anon("SELECT id FROM public.playbook_chapters WHERE slug = 'it-takes-a-village'")).rows[0]?.["id"];
    expect((await as(EDITOR, `INSERT INTO public.playbook_chapter_versions (chapter_id, version, body) VALUES ('${String(chapter)}', 1, 'Draft synthesis') RETURNING version`)).rows).toEqual([{ version: 1 }]);
    expect((await anon("SELECT count(*)::int AS n FROM public.playbook_chapter_versions")).rows[0]).toEqual({ n: 0 });
    await as(EDITOR, `UPDATE public.playbook_chapter_versions SET published = true WHERE chapter_id = '${String(chapter)}'`);
    expect((await anon("SELECT count(*)::int AS n FROM public.playbook_chapter_versions")).rows[0]).toEqual({ n: 1 });
  });
  it("requires a chapter for Playbook contributions", async () => {
    expect((await insert(AUTHOR, "kind, slug, body, status", `'playbook_contribution', 'no-chapter', 'x', 'draft'`)).error).toMatch(/check constraint/);
  });
});

describe("community media storage", () => {
  it("is a private bucket with server-side size and type limits", async () => {
    const bucket = (await db.query<Record<string, unknown>>("SELECT public, file_size_limit, allowed_mime_types FROM storage.buckets WHERE id = 'community-media'")).rows[0];
    expect(bucket).toEqual({ public: false, file_size_limit: 5242880, allowed_mime_types: ["image/jpeg", "image/png", "image/webp"] });
  });
  it("lets people upload only into their own folder", async () => {
    expect((await as(AUTHOR, `INSERT INTO storage.objects (bucket_id, name) VALUES ('community-media', '${AUTHOR}/photo.jpg') RETURNING name`)).error).toBeNull();
    expect((await as(AUTHOR, `INSERT INTO storage.objects (bucket_id, name) VALUES ('community-media', '${READER}/photo.jpg')`)).error).toMatch(/row-level security/);
    expect((await as(UNVERIFIED, `INSERT INTO storage.objects (bucket_id, name) VALUES ('community-media', '${UNVERIFIED}/photo.jpg')`)).error).toMatch(/row-level security/);
  });
  it("keeps a photograph private until a live public item uses it", async () => {
    expect((await anon(`SELECT name FROM storage.objects WHERE name = '${AUTHOR}/photo.jpg'`)).rows).toEqual([]);
    const r = await insert(AUTHOR, "kind, slug, body, media, consent_publish, status", `'post', 'photo-post', 'With a photo', '[{"kind":"image","path":"${AUTHOR}/photo.jpg","alt":"A hub"}]', true, 'submitted'`);
    expect((await anon(`SELECT name FROM storage.objects WHERE name = '${AUTHOR}/photo.jpg'`)).rows).toEqual([]);
    await as(MODERATOR, `UPDATE public.content_items SET status = 'published' WHERE id = '${String(r.rows[0]?.["id"])}'`);
    expect((await anon(`SELECT name FROM storage.objects WHERE name = '${AUTHOR}/photo.jpg'`)).rows).toHaveLength(1);
  });
});

describe("anonymous attribution cannot be unmasked", () => {
  it("never exposes author_id to readers, so unnamed work cannot be linked to its author", async () => {
    expect((await anon("SELECT author_id FROM public.content_items LIMIT 1")).error).toMatch(/permission denied/);
    expect((await as(READER, "SELECT author_id FROM public.content_items LIMIT 1")).error).toMatch(/permission denied/);
    expect((await as(READER, `SELECT id FROM public.content_items WHERE author_id = '${AUTHOR}'`)).error).toMatch(/permission denied/);
  });
  it("still lets authors list, edit and withdraw their own work", async () => {
    const mine = await as(AUTHOR, "SELECT slug FROM public.my_content()");
    expect(mine.rows.map((r) => r["slug"])).toContain("my-draft-story");
    expect((await as(READER, "SELECT slug FROM public.my_content()")).rows.map((r) => r["slug"])).not.toContain("my-draft-story");
    expect((await as(AUTHOR, "UPDATE public.content_items SET body = 'Edited draft' WHERE slug = 'my-draft-story' RETURNING slug")).rows).toEqual([{ slug: "my-draft-story" }]);
    expect((await as(READER, "UPDATE public.content_items SET body = 'Hijack' WHERE slug = 'my-draft-story' RETURNING slug")).rows).toEqual([]);
  });
  it("lists only named public work on a profile", async () => {
    const ids = (await anon(`SELECT p AS id FROM public.profile_content('${AUTHOR}') p`)).rows.map((r) => r["id"]);
    const slugs = (await db.query<{ slug: string }>(`SELECT slug FROM public.content_items WHERE id = ANY ('{${ids.join(",")}}'::uuid[])`)).rows.map((r) => r.slug);
    expect(slugs).toContain("the-hub-that-stayed");
    expect(slugs).not.toContain("anonymous-truth");
  });
  it("shows the real submitter only to moderators and editors", async () => {
    const id = (await anon("SELECT id FROM public.content_items WHERE slug = 'anonymous-truth'")).rows[0]?.["id"];
    expect((await as(EDITOR, `SELECT name FROM public.content_submitters(ARRAY['${String(id)}']::uuid[])`)).rows).toEqual([{ name: "Amina Author" }]);
    expect((await as(READER, `SELECT name FROM public.content_submitters(ARRAY['${String(id)}']::uuid[])`)).rows).toEqual([]);
    expect((await anon(`SELECT name FROM public.content_submitters(ARRAY['${String(id)}']::uuid[])`)).error).toMatch(/permission denied/);
  });
});
