// Shared community model: types, validation and pure helpers for all five products.
// No network access here, so the rules can be tested on their own.
import { z } from "zod";
import type { ProductKey } from "@/content/products";

export const contentKinds = ["post", "article", "voice", "playbook_contribution", "question", "answer", "research", "opportunity"] as const;
export type ContentKind = (typeof contentKinds)[number];

export const statuses = ["draft", "submitted", "under_review", "revision_requested", "accepted", "scheduled", "published", "declined", "archived"] as const;
export type ContentStatus = (typeof statuses)[number];

export const evidenceClasses = ["practitioner_experience", "founder_perspective", "documented_case", "research_evidence", "observation", "editorial"] as const;
export type EvidenceClass = (typeof evidenceClasses)[number];

export const kindLabel: Record<ContentKind, string> = {
  post: "Update", article: "Article", voice: "ASEB Voices story", playbook_contribution: "Playbook contribution",
  question: "Question", answer: "Answer", research: "Research", opportunity: "Opportunity",
};

export const kindProduct: Record<ContentKind, ProductKey> = {
  post: "field", article: "field", opportunity: "field", voice: "voices", playbook_contribution: "playbook", question: "ask", answer: "ask", research: "state",
};

export const statusLabel: Record<ContentStatus, string> = {
  draft: "Draft", submitted: "Submitted", under_review: "Under review", revision_requested: "Revision requested", accepted: "Accepted",
  scheduled: "Scheduled", published: "Published", declined: "Declined", archived: "Withdrawn or archived",
};

export const evidenceLabel: Record<EvidenceClass, string> = {
  practitioner_experience: "Practitioner experience", founder_perspective: "Founder perspective", documented_case: "Documented case",
  research_evidence: "Research evidence", observation: "Observation", editorial: "Editorial",
};

// Community kinds can publish directly when the Secretariat opens community publishing.
// Everything else always goes through editorial review.
export const communityKinds: ContentKind[] = ["post", "question", "answer"];
export const needsEditor = (kind: ContentKind) => !communityKinds.includes(kind);

export function permalink(kind: ContentKind, slug: string, parentSlug?: string): string {
  switch (kind) {
    case "voice": return `/voices/${slug}`;
    case "question": return `/ask/${slug}`;
    case "answer": return parentSlug ? `/ask/${parentSlug}#${slug}` : `/ask`;
    case "research": return `/state-of-the-field/${slug}`;
    case "playbook_contribution": return `/the-field/${slug}`;
    default: return `/the-field/${slug}`;
  }
}

export function slugify(text: string): string {
  const base = text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80).replace(/-+$/g, "");
  return base.length >= 3 ? base : "contribution";
}

export function uniqueSlug(text: string, random: () => string = () => Math.random().toString(36).slice(2, 8)): string {
  return `${slugify(text)}-${random().replace(/[^a-z0-9]/g, "").slice(0, 6) || "x1"}`;
}

const trimmed = (max: number) => z.string().trim().max(max);

// Photographs are private storage paths ("<user id>/<file>") inside the community-media bucket,
// readable by others only once the item is live. Videos are links to YouTube or Vimeo.
export const mediaItemSchema = z.object({
  kind: z.enum(["image", "video_link"]),
  path: z.string().regex(/^[0-9a-f-]{36}\/[A-Za-z0-9._-]{1,120}$/).optional(),
  url: z.string().url().max(1000).optional(),
  alt: trimmed(300).default(""),
  credit: trimmed(200).default(""),
});
export type MediaItem = z.infer<typeof mediaItemSchema>;

// One schema for every composer. Kind-specific rules are applied with refinements.
export const contributionSchema = z.object({
  id: z.string().uuid().optional(),
  kind: z.enum(contentKinds),
  title: trimmed(200).default(""),
  summary: trimmed(600).default(""),
  body: z.string().trim().min(1, "Write something first.").max(60000),
  voicesCategory: z.string().regex(/^[a-z][a-z0-9-]{1,40}$/).optional(),
  chapterSlug: z.string().regex(/^[a-z0-9-]{3,80}$/).optional(),
  parentId: z.string().uuid().optional(),
  country: trimmed(100).default(""),
  topics: z.array(z.string().trim().min(1).max(40)).max(8).default([]),
  evidenceClass: z.enum(evidenceClasses).default("practitioner_experience"),
  details: z.record(z.string(), z.string().max(4000)).default({}),
  media: z.array(mediaItemSchema).max(6).default([]),
  visibility: z.enum(["public", "community"]).default("public"),
  attribution: z.enum(["name", "initials", "anonymous"]).default("name"),
  consentPublish: z.boolean(),
  consentEdit: z.boolean().default(false),
  submit: z.boolean(),
}).superRefine((value, ctx) => {
  const needTitle: ContentKind[] = ["article", "voice", "question", "research", "opportunity"];
  if (needTitle.includes(value.kind) && value.title.length < 3) ctx.addIssue({ code: "custom", path: ["title"], message: "Add a title." });
  if (value.kind === "voice" && !value.voicesCategory) ctx.addIssue({ code: "custom", path: ["voicesCategory"], message: "Choose a Voices category." });
  if (value.kind === "playbook_contribution" && !value.chapterSlug) ctx.addIssue({ code: "custom", path: ["chapterSlug"], message: "Choose a chapter." });
  if (value.kind === "answer" && !value.parentId) ctx.addIssue({ code: "custom", path: ["parentId"], message: "Answers belong to a question." });
  if (value.submit && !value.consentPublish) ctx.addIssue({ code: "custom", path: ["consentPublish"], message: "Give publication permission to submit." });
  if (value.kind === "post" && value.body.length > 3000) ctx.addIssue({ code: "custom", path: ["body"], message: "Updates are limited to 3,000 characters. Write an article for longer pieces." });
  for (const item of value.media) {
    if (item.kind === "video_link" && !/^https:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\//.test(item.url ?? "")) ctx.addIssue({ code: "custom", path: ["media"], message: "Video links must come from YouTube or Vimeo." });
    if (item.kind === "image" && !item.path) ctx.addIssue({ code: "custom", path: ["media"], message: "Upload the photograph before publishing." });
    if (item.kind === "image" && !item.alt) ctx.addIssue({ code: "custom", path: ["media"], message: "Describe each photograph for people using screen readers." });
  }
  if (value.kind === "opportunity" && !/^https?:\/\//.test(value.details["source"] ?? "")) ctx.addIssue({ code: "custom", path: ["details"], message: "Add the official source link for the opportunity." });
});
export type Contribution = z.infer<typeof contributionSchema>;

export type ContentRow = {
  id: string; kind: ContentKind; slug: string; title: string; summary: string; body: string;
  voices_category: string | null; chapter_id: string | null; parent_id: string | null; country: string; topics: string[];
  evidence_class: EvidenceClass; details: Record<string, string>; media: MediaItem[]; visibility: "public" | "community";
  attribution: "name" | "initials" | "anonymous"; status: ContentStatus; scheduled_for: string | null; published_at: string | null;
  featured: boolean; hidden_by_moderator: boolean; created_at: string; updated_at: string; consent_publish: boolean; consent_edit: boolean;
};

export type Author = { content_id: string; display_name: string; profile_id: string | null; headline: string; country: string };
export type Engagement = { content_id: string; appreciations: number; useful: number; responses: number };

export const publicColumns = "id,kind,slug,title,summary,body,voices_category,chapter_id,parent_id,country,topics,evidence_class,details,media,visibility,attribution,status,scheduled_for,published_at,featured,hidden_by_moderator,created_at,updated_at,consent_publish,consent_edit";

export function excerpt(text: string, max = 220): string {
  const plain = text.replace(/[#*_>`[\]]/g, "").replace(/\s+/g, " ").trim();
  return plain.length > max ? `${plain.slice(0, max).replace(/\s+\S*$/, "")}…` : plain;
}

export function readingMinutes(text: string): number {
  return Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 220));
}

// Feed filters are transparent and user controlled. No ranking by engagement.
export type FeedTab = "for-you" | "following" | "latest" | "research" | "opportunities";
export const feedTabs: { key: FeedTab; label: string }[] = [
  { key: "for-you", label: "For You" }, { key: "following", label: "Following" }, { key: "latest", label: "Latest" }, { key: "research", label: "Research" }, { key: "opportunities", label: "Opportunities" },
];

// "For You" uses only what a person chose: followed countries, topics and people, then the rest
// by date. It is a filter, not an algorithm, and the interface says so.
export function forYouOrder<T extends { country: string; topics: string[]; published_at: string | null; author?: { profile_id: string | null } | undefined }>(items: T[], follows: { target_type: string; target_key: string }[]): T[] {
  const countries = new Set(follows.filter((f) => f.target_type === "country").map((f) => f.target_key));
  const topics = new Set(follows.filter((f) => f.target_type === "topic").map((f) => f.target_key));
  const people = new Set(follows.filter((f) => f.target_type === "profile").map((f) => f.target_key));
  const matches = (item: T) => (!!item.author?.profile_id && people.has(item.author.profile_id)) || countries.has(item.country) || item.topics.some((t) => topics.has(t));
  const byDate = (a: T, b: T) => Date.parse(b.published_at ?? "") - Date.parse(a.published_at ?? "");
  return [...items.filter(matches).sort(byDate), ...items.filter((i) => !matches(i)).sort(byDate)];
}

export function isMissingBackend(error: { code?: string; message?: string } | null | undefined): boolean {
  return !!error && (error.code === "PGRST202" || error.code === "PGRST205" || error.code === "42P01" || error.code === "42883" || /does not exist|Could not find the (table|function)/i.test(error.message ?? ""));
}
