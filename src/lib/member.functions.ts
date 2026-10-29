import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
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
  const [{ data: profile, error: profileError }, { data: circles, error: circlesError }] = await Promise.all([
    context.supabase.from("profiles").select("name,country,organisation,primary_role,bio").eq("id", context.userId).maybeSingle(),
    context.supabase.from("circle_memberships").select("circle_key").eq("user_id", context.userId),
  ]);
  if (profileError || circlesError) throw new Error("Your member information could not be loaded.");
  return { profile, circles: circles?.map((circle) => circle.circle_key) || [] };
});

export const saveMemberProfile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => memberProfileSchema.parse(input)).handler(async ({ data, context }) => {
  const { error } = await context.supabase.from("profiles").upsert({ id: context.userId, ...data });
  if (error) throw new Error("Your profile could not be saved.");
  return { success: true };
});

const circleKeys = ["regional:North", "regional:West", "regional:Central", "regional:East", "regional:Southern", "language:fr", "language:pt", "language:ar", "condition:1", "condition:2", "condition:3", "condition:4", "condition:5", "condition:6", "condition:7"];
export const updateCircleMembership = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => z.object({ key: z.string().refine((value) => circleKeys.includes(value)), join: z.boolean() }).parse(input)).handler(async ({ data, context }) => {
  const result = data.join
    ? await context.supabase.from("circle_memberships").upsert({ user_id: context.userId, circle_key: data.key })
    : await context.supabase.from("circle_memberships").delete().eq("user_id", context.userId).eq("circle_key", data.key);
  if (result.error) throw new Error("Your Circle selection could not be saved.");
  return { success: true };
});