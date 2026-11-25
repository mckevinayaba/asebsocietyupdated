import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { circleKeys, programmeFields, type ProgrammeSource } from "@/lib/programme-intake";
import { prepareEnquiry } from "@/lib/eoi";
import { z } from "zod";
import { africanCountries } from "@/content/countries";
import { roleBySlug } from "@/content/field";

export const memberProfileSchema = z.object({
  name: z.string().trim().min(2).max(200),
  country: z.string().refine((value) => [...africanCountries, "Diaspora, outside Africa"].includes(value), "Select a country."),
  organisation: z.string().trim().max(200),
  primary_role: z.string().refine((value) => !!roleBySlug(value), "Select a role."),
  bio: z.string().trim().max(3000),
});

export const getMemberData = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const [{ data: profile, error: profileError }, { data: circles, error: circlesError }, { data: applications, error: applicationError }] = await Promise.all([
    context.supabase.from("profiles").select("name,country,organisation,primary_role,bio").eq("id", context.userId).maybeSingle(),
    context.supabase.from("circle_memberships").select("circle_key").eq("user_id", context.userId),
    context.supabase.from("membership_applications").select("id,name,email,status,created_at,role,country").order("created_at", { ascending: false }),
  ]);
  if (profileError || circlesError || applicationError) throw new Error("Your member information could not be loaded.");
  // Row level security already limits members to their own applications. Secretariat roles can read
  // every application, so the member view is scoped to the caller's own email as well.
  const ownEmail = typeof context.claims.email === "string" ? context.claims.email.trim().toLowerCase() : "";
  const own = (applications || []).filter((application) => ownEmail !== "" && application.email.trim().toLowerCase() === ownEmail).map(({ email: _email, ...application }) => application);
  return { profile, applications: own, circles: circles?.map((circle) => circle.circle_key) || [] };
});

export const saveMemberProfile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => memberProfileSchema.parse(input)).handler(async ({ data, context }) => {
  const { error } = await context.supabase.from("profiles").upsert({ id: context.userId, ...data });
  if (error) throw new Error("Your profile could not be saved.");
  return { success: true };
});

export const updateCircleMembership = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => z.object({ key: z.string().refine((value) => circleKeys.includes(value)), join: z.boolean() }).parse(input)).handler(async ({ data, context }) => {
  const result = data.join
    ? await context.supabase.from("circle_memberships").upsert({ user_id: context.userId, circle_key: data.key }, { ignoreDuplicates: true })
    : await context.supabase.from("circle_memberships").delete().eq("user_id", context.userId).eq("circle_key", data.key);
  if (result.error) throw new Error("Your Circle selection could not be saved.");
  return { success: true };
});
export const submitProgrammeInterest = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
  const data = z.object({ source: z.enum(["/communities", "/learning", "/field-lab"]), values: z.record(z.string(), z.string()), consent: z.boolean() }).parse(input);
  return prepareEnquiry(data.source as ProgrammeSource, programmeFields[data.source], data.values, data.consent);
}).handler(async ({ data, context }) => {
  const { error } = await context.supabase.from("programme_interests").insert({ ...data, user_id: context.userId });
  if (error) throw new Error("Your interest could not be saved. Please try again.");
  return { success: true };
});
