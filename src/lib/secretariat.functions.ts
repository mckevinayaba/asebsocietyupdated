// Secretariat server functions. Every call runs with the signed-in user's own token, so database
// row level security decides what is returned. The role check here only shapes the response;
// it is not the security boundary. See drizzle/migrations/0006 and docs/DATA_GOVERNANCE.md.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { noteSubjects, reviewStages, type AccountRecord, type ApplicationRecord } from "@/lib/secretariat";


const applicationColumns = "id,name,email,country,city,role,job_title,organisation,membership_type,intent,operating_countries,focus_areas,work_description,profile_url,phone,status,review_stage,created_at";

// PostgREST answers PGRST202 when a function is missing, so a missing migration reads as
// "not provisioned" instead of crashing the page.
function isMissing(error: { code?: string; message?: string } | null) {
  return !!error && (error.code === "PGRST202" || error.code === "42883" || error.code === "42P01" || error.code === "42703" || /does not exist|Could not find/i.test(error.message ?? ""));
}

export const getSecretariatOverview = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const role = await context.supabase.rpc("is_secretariat");
  if (isMissing(role.error)) return { state: "not_provisioned" as const };
  if (role.error) throw new Error("Secretariat access could not be checked.");
  if (!role.data) return { state: "forbidden" as const };

  const [admin, applications, accounts, circles, enquiries, interests, pitches, submissions] = await Promise.all([
    context.supabase.rpc("is_secretariat_admin"),
    context.supabase.from("membership_applications").select(applicationColumns).order("created_at", { ascending: false }),
    context.supabase.rpc("secretariat_list_accounts"),
    context.supabase.from("circle_memberships").select("user_id,circle_key"),
    context.supabase.from("partnership_enquiries").select("id,inquiry_type,source_page,contact_email,payload,status,submitted_at").order("submitted_at", { ascending: false }),
    context.supabase.from("programme_interests").select("id,inquiry_type,source_page,contact_email,payload,user_id,submitted_at").order("submitted_at", { ascending: false }),
    context.supabase.from("insight_pitches").select("id,contact_email,payload,status,submitted_at").order("submitted_at", { ascending: false }),
    context.supabase.from("registry_submissions").select("id,name,record_type,country,role,source_url,contact_name,contact_email,status,created_at").order("created_at", { ascending: false }),
  ]);
  const failed = [applications, accounts, circles, enquiries, interests, pitches, submissions].find((result) => result.error);
  if (failed?.error) throw new Error("Secretariat records could not be loaded.");

  const text = (payload: unknown, key: string) => (payload && typeof payload === "object" && typeof (payload as Record<string, unknown>)[key] === "string" ? String((payload as Record<string, unknown>)[key]) : "");
  return {
    state: "ready" as const,
    isAdmin: admin.data === true,
    loadedAt: new Date().toISOString(),
    applications: (applications.data ?? []) as ApplicationRecord[],
    accounts: (accounts.data ?? []) as AccountRecord[],
    circles: circles.data ?? [],
    enquiries: (enquiries.data ?? []).map((row) => ({
      id: row.id,
      kind: row.inquiry_type,
      source: row.source_page,
      email: row.contact_email,
      name: text(row.payload, "name") || text(row.payload, "contact"),
      organisation: text(row.payload, "organisation") || text(row.payload, "leadOrg"),
      country: text(row.payload, "country") || text(row.payload, "countries") || text(row.payload, "geography"),
      summary: text(row.payload, "message") || text(row.payload, "motivation") || text(row.payload, "summary") || text(row.payload, "plan"),
      status: row.status,
      submittedAt: row.submitted_at,
    })),
    interests: (interests.data ?? []).map((row) => ({
      id: row.id,
      kind: row.inquiry_type,
      source: row.source_page,
      email: row.contact_email,
      name: text(row.payload, "name"),
      organisation: text(row.payload, "organisation"),
      country: text(row.payload, "country"),
      linkedAccount: !!row.user_id,
      submittedAt: row.submitted_at,
    })),
    pitches: (pitches.data ?? []).map((row) => ({ id: row.id, email: row.contact_email, name: text(row.payload, "name"), title: text(row.payload, "title"), status: row.status, submittedAt: row.submitted_at })),
    submissions: submissions.data ?? [],
  };
});

export const getSecretariatNotes = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ subjectType: z.enum(noteSubjects), subjectId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: notes, error } = await context.supabase.from("secretariat_notes").select("id,body,author_id,created_at").eq("subject_type", data.subjectType).eq("subject_id", data.subjectId).order("created_at", { ascending: false });
    if (error) throw new Error("Notes could not be loaded.");
    return (notes ?? []).map((note) => ({ ...note, mine: note.author_id === context.userId }));
  });

export const addSecretariatNote = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ subjectType: z.enum(noteSubjects), subjectId: z.string().uuid(), body: z.string().trim().min(1).max(4000) }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("secretariat_notes").insert({ subject_type: data.subjectType, subject_id: data.subjectId, body: data.body, author_id: context.userId });
    if (error) throw new Error("The note could not be saved.");
    return { success: true };
  });

export const setApplicationReviewStage = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid(), stage: z.enum(reviewStages) }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase.from("membership_applications").update({ review_stage: data.stage }).eq("id", data.id).select("id");
    if (error || !rows?.length) throw new Error("The review stage could not be updated.");
    return { success: true };
  });

export const recordSecretariatExport = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ dataset: z.enum(["people", "enquiries"]), rows: z.number().int().min(0).max(100000) }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("secretariat_audit_log").insert({ action: "records_exported", actor_id: context.userId, detail: { dataset: data.dataset, rows: data.rows } });
    if (error) throw new Error("The export could not be recorded, so it was not started.");
    return { success: true };
  });

// Lightweight access check for navigation. Reads as "no access" if the migration is not applied.
export const getMyAccess = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data, error } = await context.supabase.rpc("is_secretariat");
  return { secretariat: !error && data === true };
});
