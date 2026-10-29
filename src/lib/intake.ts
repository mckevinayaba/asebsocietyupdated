import { z } from "zod";
import { africanCountries } from "@/content/countries";
import { roleBySlug } from "@/content/field";

const country = z.string().refine((value) => [...africanCountries, "Diaspora, outside Africa"].includes(value), "Select a country.");
const role = z.string().refine((value) => !!roleBySlug(value), "Select your role.");
const publicUrl = z.string().trim().url("Enter a full website address.").max(1000).refine((value) => /^https?:\/\//i.test(value), "Use an http or https address.");
export const applicationSchema = z.object({
  role,
  type: z.enum(["individual", "organisation"]),
  name: z.string().trim().min(2).max(200),
  email: z.string().trim().email().max(255),
  country,
  organisation: z.string().trim().max(200),
  linkedin: z.union([z.literal(""), publicUrl]),
  jobTitle: z.string().trim().min(2, "Add your title or the representative's title.").max(200),
  phone: z.string().trim().min(7, "Add a phone or WhatsApp number.").max(40).regex(/^[+\d\s()-]+$/, "Use digits, spaces and + only."),
  city: z.string().trim().min(2, "Add the city you operate from.").max(120),
  operatingCountries: z.string().trim().min(2, "List where you operate.").max(1000),
  workDescription: z.string().trim().min(80, "Describe your work in at least 80 characters.").max(4000),
  focusAreas: z.string().trim().max(500),
  code: z.literal(true),
});
export const registrySubmissionSchema = z.object({
  name: z.string().trim().min(2).max(200),
  record_type: z.enum(["individual", "organisation"]),
  country,
  role,
  bio: z.string().trim().min(20, "Add at least 20 characters describing your work.").max(3000),
  source_url: publicUrl,
  contact_name: z.string().trim().min(2).max(200),
  contact_email: z.string().trim().email().max(255),
});