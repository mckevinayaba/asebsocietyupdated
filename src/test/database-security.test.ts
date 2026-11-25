// @vitest-environment node
// Security regression tests for the database migrations. Every migration in drizzle/migrations runs,
// in order, against an in-memory PostgreSQL (PGlite) with a minimal stand-in for the Supabase auth
// schema and API roles, including Supabase's default privileges on new public objects.
// The tests then act as anon, members and Secretariat roles to prove what each may and may not do.
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { beforeAll, describe, expect, it } from "vitest";

const ADMIN = "11111111-1111-1111-1111-111111111111";
const REVIEWER = "22222222-2222-2222-2222-222222222222";
const MEMBER = "33333333-3333-3333-3333-333333333333";
const UNVERIFIED_ADMIN = "44444444-4444-4444-4444-444444444444";

let db: PGlite;
let memberApplicationId = "";

async function as(role: "anon" | "authenticated", uid: string, sql: string) {
  await db.exec(`RESET ROLE; SELECT set_config('request.uid', '${uid}', false); SET ROLE ${role};`);
  try {
    const result = await db.query<Record<string, unknown>>(sql);
    return { rows: result.rows, error: null as string | null };
  } catch (error) {
    return { rows: [] as Record<string, unknown>[], error: (error as Error).message };
  } finally {
    await db.exec("RESET ROLE");
  }
}

beforeAll(async () => {
  db = new PGlite();
  await db.exec(`
    CREATE ROLE anon NOLOGIN; CREATE ROLE authenticated NOLOGIN; CREATE ROLE service_role NOLOGIN BYPASSRLS;
    CREATE SCHEMA auth;
    GRANT USAGE ON SCHEMA auth TO anon, authenticated, service_role;
    GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
    CREATE TABLE auth.users (id uuid PRIMARY KEY, email text, email_confirmed_at timestamptz, created_at timestamptz DEFAULT now(), last_sign_in_at timestamptz, raw_user_meta_data jsonb DEFAULT '{}');
    CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.uid', true), '')::uuid $$;
    GRANT EXECUTE ON FUNCTION auth.uid() TO anon, authenticated;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon, authenticated, service_role;
  `);
  const dir = path.resolve(__dirname, "../../drizzle/migrations");
  for (const file of readdirSync(dir).filter((name) => name.endsWith(".sql")).sort()) {
    await db.exec(readFileSync(path.join(dir, file), "utf8"));
  }
  await db.exec(`
    INSERT INTO auth.users (id, email, email_confirmed_at, raw_user_meta_data) VALUES
      ('${ADMIN}', 'admin@example.org', now(), '{"name":"Admin Person"}'),
      ('${REVIEWER}', 'reviewer@example.org', now(), '{"name":"Reviewer Person"}'),
      ('${MEMBER}', 'member@example.org', now(), '{"name":"Member Person"}'),
      ('${UNVERIFIED_ADMIN}', 'unverified@example.org', NULL, '{"name":"Unverified Person"}');
    INSERT INTO public.secretariat_roles (user_id, role) VALUES
      ('${ADMIN}', 'secretariat_admin'), ('${REVIEWER}', 'secretariat_reviewer'), ('${UNVERIFIED_ADMIN}', 'secretariat_admin');
  `);
  const insert = await as("anon", "", `INSERT INTO public.membership_applications (name, email, country, role, membership_type, code_accepted) VALUES
    ('Member Person', 'member@example.org', 'Kenya', 'Mentor', 'individual', true),
    ('Other Person', 'other@example.org', 'Ghana', 'Hub lead', 'individual', true)`);
  expect(insert.error).toBeNull();
  const found = await db.query<{ id: string }>("SELECT id FROM public.membership_applications WHERE email = 'member@example.org'");
  memberApplicationId = found.rows[0]?.id ?? "";
}, 60_000);

describe("public intake and member privacy", () => {
  it("lets visitors submit applications but never read them", async () => {
    expect((await as("anon", "", "SELECT count(*)::int AS n FROM public.membership_applications")).rows[0]).toEqual({ n: 0 });
  });
  it("lets a verified applicant read only their own application", async () => {
    expect((await as("authenticated", MEMBER, "SELECT email FROM public.membership_applications")).rows).toEqual([{ email: "member@example.org" }]);
  });
  it("keeps other people's profiles and enquiries private from members", async () => {
    expect((await as("authenticated", MEMBER, "SELECT count(*)::int AS n FROM public.profiles")).rows[0]).toEqual({ n: 1 });
    expect((await as("authenticated", MEMBER, "SELECT count(*)::int AS n FROM public.partnership_enquiries")).rows[0]).toEqual({ n: 0 });
  });
  it("still creates a profile for every new account after the trigger hardening", async () => {
    expect((await db.query("SELECT count(*)::int AS n FROM public.profiles")).rows[0]).toEqual({ n: 4 });
  });
  it("removes direct execution of the profile trigger function", async () => {
    expect((await as("anon", "", "SELECT public.create_member_profile()")).error).toMatch(/permission denied/);
  });
});

describe("Secretariat access model", () => {
  it("denies the account list to members and visitors", async () => {
    expect((await as("authenticated", MEMBER, "SELECT * FROM public.secretariat_list_accounts()")).error).toMatch(/Not authorised/);
    expect((await as("anon", "", "SELECT * FROM public.secretariat_list_accounts()")).error).toMatch(/permission denied/);
  });
  it("prevents anyone, administrators included, from granting roles through the API", async () => {
    expect((await as("authenticated", MEMBER, `INSERT INTO public.secretariat_roles (user_id, role) VALUES ('${MEMBER}', 'secretariat_admin')`)).error).toMatch(/permission denied/);
    expect((await as("authenticated", ADMIN, `INSERT INTO public.secretariat_roles (user_id, role) VALUES ('${MEMBER}', 'secretariat_reviewer')`)).error).toMatch(/permission denied/);
  });
  it("ignores a role held by an account with an unverified email", async () => {
    expect((await as("authenticated", UNVERIFIED_ADMIN, "SELECT public.is_secretariat() AS s")).rows[0]).toEqual({ s: false });
  });
  it("lets a reviewer read every application and reconcile registered accounts", async () => {
    expect((await as("authenticated", REVIEWER, "SELECT count(*)::int AS n FROM public.membership_applications")).rows[0]).toEqual({ n: 2 });
    const accounts = await as("authenticated", REVIEWER, "SELECT name, email_confirmed FROM public.secretariat_list_accounts() ORDER BY name");
    expect(accounts.rows).toHaveLength(4);
  });
  it("allows review stage changes but never the approval status, contact details or deletion", async () => {
    expect((await as("authenticated", REVIEWER, `UPDATE public.membership_applications SET review_stage = 'under_review' WHERE id = '${memberApplicationId}' RETURNING review_stage`)).rows).toEqual([{ review_stage: "under_review" }]);
    expect((await as("authenticated", REVIEWER, `UPDATE public.membership_applications SET status = 'approved' WHERE id = '${memberApplicationId}'`)).error).toMatch(/permission denied/);
    expect((await as("authenticated", ADMIN, "UPDATE public.membership_applications SET email = 'changed@example.org'")).error).toMatch(/permission denied/);
    expect((await as("authenticated", ADMIN, "DELETE FROM public.membership_applications")).error).toMatch(/permission denied/);
    expect((await as("authenticated", MEMBER, `UPDATE public.membership_applications SET review_stage = 'incomplete' WHERE id = '${memberApplicationId}' RETURNING id`)).rows).toEqual([]);
  });
  it("keeps notes append only and attributed to their real author", async () => {
    const note = await as("authenticated", REVIEWER, `INSERT INTO public.secretariat_notes (subject_type, subject_id, body) VALUES ('membership_application', '${memberApplicationId}', 'Checked the public profile') RETURNING author_id`);
    expect(note.rows).toEqual([{ author_id: REVIEWER }]);
    expect((await as("authenticated", REVIEWER, `INSERT INTO public.secretariat_notes (subject_type, subject_id, author_id, body) VALUES ('membership_application', '${memberApplicationId}', '${ADMIN}', 'forged')`)).error).toMatch(/row-level security/);
    expect((await as("authenticated", REVIEWER, "DELETE FROM public.secretariat_notes")).error).toMatch(/permission denied/);
    expect((await as("authenticated", MEMBER, "SELECT count(*)::int AS n FROM public.secretariat_notes")).rows[0]).toEqual({ n: 0 });
  });
  it("records sensitive actions in an audit log only administrators can read", async () => {
    expect((await as("authenticated", REVIEWER, "SELECT count(*)::int AS n FROM public.secretariat_audit_log")).rows[0]).toEqual({ n: 0 });
    const log = await as("authenticated", ADMIN, "SELECT action FROM public.secretariat_audit_log ORDER BY id");
    expect(log.rows.map((row) => row["action"])).toEqual(["review_stage_changed", "note_added"]);
  });
});
