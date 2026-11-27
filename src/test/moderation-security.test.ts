// @vitest-environment node
// Security tests for migration 0011: automated publishing can only happen through the trusted
// moderation engine, every decision is recorded, and people keep control of the exceptions.
import { beforeAll, describe, expect, it } from "vitest";
import { asRole, asService, createDatabase, type Db } from "./db-harness";

const ADMIN = "11111111-1111-1111-1111-111111111111";
const MODERATOR = "33333333-3333-3333-3333-333333333333";
const AUTHOR = "44444444-4444-4444-4444-444444444444";
const READER = "55555555-5555-5555-5555-555555555555";
const SPAMMER = "77777777-7777-7777-7777-777777777777";

let db: Db;
const as = (uid: string, sql: string) => asRole(db, "authenticated", uid, sql);
const anon = (sql: string) => asRole(db, "anon", "", sql);
const service = (sql: string) => asService(db, sql);
const setMode = (mode: string) => db.exec(`UPDATE public.platform_settings SET value = '${mode}' WHERE key = 'community_mode'`);
const post = async (uid: string, slug: string, body: string, status = "checking", kind = "post") => {
  const r = await as(uid, `INSERT INTO public.content_items (kind, slug, title, body, consent_publish, status) VALUES ('${kind}', '${slug}', '${kind === "post" ? "" : "A title"}', '${body}', true, '${status}') RETURNING id, status`);
  return { id: (r.rows[0]?.["id"] as string) ?? "", error: r.error };
};
const fingerprint = async (id: string) => ((await service(`SELECT fingerprint FROM public.moderation_snapshot('${id}')`)).rows[0]?.["fingerprint"] as string);
const decide = (id: string, fp: string, decision: string, reason = "") =>
  service(`SELECT public.moderation_record_decision('${id}', '${fp}', '${decision}', ARRAY['test'], '[]'::jsonb, 'test', 'test-model', '{}'::jsonb, '${reason}') AS s`);
const statusOf = async (id: string) => ((await db.query<{ status: string }>(`SELECT status FROM public.content_items WHERE id = '${id}'`)).rows[0]?.status);

beforeAll(async () => {
  db = await createDatabase();
  await db.exec(`
    INSERT INTO auth.users (id, email, email_confirmed_at, raw_user_meta_data) VALUES
      ('${ADMIN}', 'admin@example.org', now(), '{"name":"Admin Person"}'),
      ('${MODERATOR}', 'moderator@example.org', now(), '{"name":"Moderator Person"}'),
      ('${AUTHOR}', 'author@example.org', now(), '{"name":"Amina Author"}'),
      ('${READER}', 'reader@example.org', now(), '{"name":"Reader Person"}'),
      ('${SPAMMER}', 'spam@example.org', now(), '{"name":"Quick Poster"}');
    INSERT INTO public.secretariat_roles (user_id, role) VALUES ('${ADMIN}', 'secretariat_admin'), ('${MODERATOR}', 'moderator');
  `);
}, 60_000);

describe("publishing modes", () => {
  it("retires the uncontrolled open mode and starts pre-moderated", async () => {
    expect((await anon("SELECT public.community_mode() AS m")).rows[0]).toEqual({ m: "pre_moderated" });
    await expect(setMode("open")).rejects.toThrow(/check constraint/);
  });
  it("never lets a browser insert published content, in any mode", async () => {
    for (const mode of ["pre_moderated", "automated"]) {
      await setMode(mode);
      expect((await post(AUTHOR, `direct-${mode.replace("_", "-")}`, "Hello", "published")).error).toMatch(/draft or a submission/);
    }
  });
  it("only allows automated checking for community kinds, and only in automated mode", async () => {
    await setMode("pre_moderated");
    expect((await post(AUTHOR, "checking-while-manual", "Body text", "checking")).error).toMatch(/draft or a submission/);
    await setMode("automated");
    expect((await post(AUTHOR, "a-story-checking", "Story body", "checking", "voice")).error).toBeTruthy();
    expect((await post(AUTHOR, "research-checking", "Research body", "checking", "research")).error).toMatch(/draft or a submission/);
  });
});

describe("the trusted moderation engine", () => {
  let id = "";
  beforeAll(async () => { await setMode("automated"); id = (await post(AUTHOR, "safe-update", "Our hub opened a rural programme this week.")).id; });

  it("keeps checking content private from everyone but its author", async () => {
    expect(await statusOf(id)).toBe("checking");
    expect((await anon(`SELECT id FROM public.content_items WHERE id = '${id}'`)).rows).toEqual([]);
    expect((await as(READER, `SELECT id FROM public.content_items WHERE id = '${id}'`)).rows).toEqual([]);
    expect((await as(AUTHOR, `SELECT status FROM public.content_items WHERE id = '${id}'`)).rows).toEqual([{ status: "checking" }]);
  });
  it("refuses to let the author publish, restrict or escalate their own work", async () => {
    for (const status of ["published", "under_review", "restricted"]) {
      expect((await as(AUTHOR, `UPDATE public.content_items SET status = '${status}' WHERE id = '${id}'`)).error).toMatch(/cannot be changed now/);
    }
    expect((await as(AUTHOR, `SELECT public.moderation_record_decision('${id}', 'x', 'publish', '{}', '[]', 'x', 'x', '{}', '')`)).error).toMatch(/permission denied/);
    expect((await as(AUTHOR, `SELECT * FROM public.moderation_snapshot('${id}')`)).error).toMatch(/permission denied/);
    expect((await as(AUTHOR, `SELECT set_config('aseb.moderation_engine', 'on', false); UPDATE public.content_items SET status = 'published' WHERE id = '${id}'`)).error).toBeTruthy();
    expect(await statusOf(id)).toBe("checking");
  });
  it("publishes through the engine and records the assessment", async () => {
    const result = await decide(id, await fingerprint(id), "publish");
    expect(result.rows[0]).toEqual({ s: "published" });
    expect((await anon(`SELECT status FROM public.content_items WHERE id = '${id}'`)).rows).toEqual([{ status: "published" }]);
    expect((await db.query(`SELECT decision, applied FROM public.moderation_assessments WHERE content_id = '${id}'`)).rows).toEqual([{ decision: "publish", applied: true }]);
  });
  it("keeps the assessment record away from authors and readers, and append only", async () => {
    expect((await as(AUTHOR, `SELECT count(*)::int AS n FROM public.moderation_assessments`)).rows).toEqual([{ n: 0 }]);
    expect((await as(MODERATOR, `SELECT count(*)::int AS n FROM public.moderation_assessments WHERE content_id = '${id}'`)).rows).toEqual([{ n: 1 }]);
    expect((await as(AUTHOR, `SELECT decision FROM public.my_moderation_outcomes() WHERE content_id = '${id}'`)).rows).toEqual([{ decision: "publish" }]);
    expect((await service(`UPDATE public.moderation_assessments SET decision = 'restrict'`)).error).toMatch(/permission denied/);
    expect((await service(`DELETE FROM public.moderation_assessments`)).error).toMatch(/permission denied/);
    expect((await as(MODERATOR, `DELETE FROM public.moderation_assessments`)).error).toMatch(/permission denied/);
  });
  it("sends an edit of published work back through the checks before it reappears", async () => {
    expect((await as(AUTHOR, `UPDATE public.content_items SET body = 'Edited without checks' WHERE id = '${id}'`)).error).toMatch(/checked again/);
    expect((await as(AUTHOR, `UPDATE public.content_items SET body = 'Our hub opened two rural programmes.', status = 'checking' WHERE id = '${id}' RETURNING status`)).rows).toEqual([{ status: "checking" }]);
    expect((await anon(`SELECT id FROM public.content_items WHERE id = '${id}'`)).rows).toEqual([]);
    expect((await decide(id, await fingerprint(id), "publish")).rows[0]).toEqual({ s: "published" });
  });
  it("ignores a decision made on text that has since changed", async () => {
    const other = (await post(AUTHOR, "changes-during-check", "First version of the text")).id;
    const oldFp = await fingerprint(other);
    await as(AUTHOR, `UPDATE public.content_items SET body = 'Second version of the text', status = 'checking' WHERE id = '${other}'`);
    expect((await decide(other, oldFp, "publish")).rows[0]).toEqual({ s: "stale" });
    expect(await statusOf(other)).toBe("checking");
  });
  it("keeps content private and retryable when the check fails", async () => {
    const other = (await post(AUTHOR, "service-failure", "Text checked while the service is down")).id;
    expect((await decide(other, await fingerprint(other), "error")).rows[0]).toEqual({ s: "checking" });
    expect((await anon(`SELECT id FROM public.content_items WHERE id = '${other}'`)).rows).toEqual([]);
    expect((await decide(other, await fingerprint(other), "publish")).rows[0]).toEqual({ s: "published" });
  });
});

describe("restrictions, escalations and appeals", () => {
  let restricted = "";
  let escalated = "";
  beforeAll(async () => {
    await setMode("automated");
    restricted = (await post(AUTHOR, "restricted-post", "Text that breaks a rule")).id;
    escalated = (await post(AUTHOR, "escalated-opportunity", "Funding with a processing fee", "checking", "opportunity")).id;
    await decide(restricted, await fingerprint(restricted), "restrict", "It appears to contain a link that is not safe to open.");
    await decide(escalated, await fingerprint(escalated), "escalate");
  });
  it("tells the author respectfully and keeps restricted and escalated work private", async () => {
    expect(await statusOf(restricted)).toBe("restricted");
    expect(await statusOf(escalated)).toBe("under_review");
    expect((await anon(`SELECT id FROM public.content_items WHERE id IN ('${restricted}', '${escalated}')`)).rows).toEqual([]);
    const notes = (await as(AUTHOR, `SELECT message FROM public.notifications WHERE kind = 'moderation' ORDER BY id`)).rows.map((r) => r["message"] as string);
    expect(notes.some((m) => /not published.*not safe to open.*human review/.test(m))).toBe(true);
    expect(notes.some((m) => /with a moderator/.test(m))).toBe(true);
  });
  it("lets the author edit restricted work and send it to be checked again", async () => {
    const fresh = (await post(AUTHOR, "fix-and-retry", "Needs a fix")).id;
    await decide(fresh, await fingerprint(fresh), "restrict");
    expect((await as(AUTHOR, `UPDATE public.content_items SET body = 'Fixed text', status = 'checking' WHERE id = '${fresh}' RETURNING status`)).rows).toEqual([{ status: "checking" }]);
  });
  it("lets moderators publish escalated community work, and nobody else", async () => {
    expect((await as(READER, `UPDATE public.content_items SET status = 'published' WHERE id = '${escalated}' RETURNING id`)).rows).toEqual([]);
    expect((await as(MODERATOR, `UPDATE public.content_items SET status = 'published' WHERE id = '${escalated}' RETURNING status`)).rows).toEqual([{ status: "published" }]);
  });
  it("lets an author appeal their own restricted work once, and only that", async () => {
    expect((await as(READER, `SELECT public.request_moderation_review('${restricted}', 'Please look again')`)).error).toMatch(/your own contribution/);
    expect((await as(AUTHOR, `SELECT public.request_moderation_review('${escalated}', 'x')`)).error).toMatch(/not published/);
    expect((await as(AUTHOR, `SELECT public.request_moderation_review('${restricted}', 'The link is our official site.') AS id`)).error).toBeNull();
    expect((await as(AUTHOR, `SELECT public.request_moderation_review('${restricted}', 'Again')`)).error).toMatch(/already been requested/);
    expect((await as(READER, `SELECT count(*)::int AS n FROM public.moderation_appeals`)).rows).toEqual([{ n: 0 }]);
  });
  it("records a moderator's appeal decision and tells the author", async () => {
    expect((await as(READER, `UPDATE public.moderation_appeals SET status = 'overturned', resolved_by = '${READER}' RETURNING id`)).rows).toEqual([]);
    expect((await as(MODERATOR, `UPDATE public.moderation_appeals SET status = 'overturned', resolved_by = '${MODERATOR}', resolved_at = now() WHERE content_id = '${restricted}' RETURNING status`)).rows).toEqual([{ status: "overturned" }]);
    expect((await db.query(`SELECT action FROM public.secretariat_audit_log WHERE action = 'appeal_resolved'`)).rows).toHaveLength(1);
    expect((await as(AUTHOR, `SELECT count(*)::int AS n FROM public.notifications WHERE message LIKE 'A moderator reviewed%'`)).rows).toEqual([{ n: 1 }]);
  });
});

describe("abuse limits and account standing", () => {
  beforeAll(() => setMode("automated"));
  it("refuses a duplicate of something already shared", async () => {
    expect((await post(SPAMMER, "dup-one", "Join our programme today")).error).toBeNull();
    expect((await post(SPAMMER, "dup-two", "Join our programme today")).error).toMatch(/already shared this/);
  });
  it("slows down someone publishing very quickly", async () => {
    let last: string | null = null;
    for (let i = 0; i < 11; i++) last = (await post(SPAMMER, `quick-${i}`, `Distinct update number ${i}`)).error;
    expect(last).toMatch(/very quickly/);
  });
  it("lets moderators pause an account, and only administrators suspend", async () => {
    expect((await as(MODERATOR, `INSERT INTO public.account_restrictions (user_id, level, reason, created_by) VALUES ('${READER}', 'suspended', 'Test', '${MODERATOR}')`)).error).toMatch(/row-level security/);
    expect((await as(READER, `INSERT INTO public.account_restrictions (user_id, level, reason, created_by) VALUES ('${AUTHOR}', 'temporary', 'Test', '${READER}')`)).error).toMatch(/row-level security/);
    expect((await as(MODERATOR, `INSERT INTO public.account_restrictions (user_id, level, reason, ends_at, created_by, message_to_user) VALUES ('${READER}', 'temporary', 'Repeated abuse in replies', now() + interval '3 days', '${MODERATOR}', 'Publishing is paused for three days.') RETURNING level`)).rows).toEqual([{ level: "temporary" }]);
    expect((await post(READER, "while-paused", "Trying to post")).error).toMatch(/cannot publish at the moment/);
    expect((await as(READER, `SELECT level, message_to_user FROM public.my_account_standing()`)).rows).toEqual([{ level: "temporary", message_to_user: "Publishing is paused for three days." }]);
    expect((await as(AUTHOR, `SELECT count(*)::int AS n FROM public.account_restrictions`)).rows).toEqual([{ n: 0 }]);
    expect((await as(MODERATOR, `UPDATE public.account_restrictions SET revoked_at = now() WHERE user_id = '${READER}' RETURNING id`)).rows).toHaveLength(1);
    expect((await post(READER, "after-pause", "Back to posting")).error).toBeNull();
  });
  it("accepts the new report categories, limits report abuse and never acts on reports alone", async () => {
    const target = (await post(AUTHOR, "reported-post", "A post someone dislikes")).id;
    await decide(target, await fingerprint(target), "publish");
    expect((await as(READER, `INSERT INTO public.content_reports (content_id, reporter_id, reason) VALUES ('${target}', '${READER}', 'impersonation') RETURNING status`)).rows).toEqual([{ status: "open" }]);
    expect((await as(AUTHOR, `INSERT INTO public.content_reports (content_id, reporter_id, reason) VALUES ('${target}', '${AUTHOR}', 'spam')`)).error).toMatch(/your own contribution/);
    expect(await statusOf(target)).toBe("published");
    expect((await as(AUTHOR, `SELECT count(*)::int AS n FROM public.content_reports WHERE content_id = '${target}'`)).rows).toEqual([{ n: 0 }]);
  });
  it("gives moderators real indicators and nobody else", async () => {
    expect((await as(READER, `SELECT * FROM public.moderation_indicators(30)`)).rows).toEqual([]);
    const row = (await as(MODERATOR, `SELECT * FROM public.moderation_indicators(30)`)).rows[0]!;
    expect(Number(row["published"])).toBeGreaterThan(0);
    expect(Number(row["errors"])).toBeGreaterThan(0);
  });
});

describe("existing editorial review is untouched", () => {
  it("still sends stories, Playbook contributions and research to editors in automated mode", async () => {
    await setMode("automated");
    const r = await as(AUTHOR, `INSERT INTO public.content_items (kind, slug, title, body, voices_category, consent_publish, status) VALUES ('voice', 'a-story-for-editors', 'A story', 'Story text', 'builders', true, 'submitted') RETURNING status`);
    expect(r.rows).toEqual([{ status: "submitted" }]);
    expect((await as(MODERATOR, `UPDATE public.content_items SET status = 'published' WHERE slug = 'a-story-for-editors'`)).error).toMatch(/need an editor/);
  });
});
