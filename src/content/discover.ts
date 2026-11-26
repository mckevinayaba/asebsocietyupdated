// The Field: a discovery layer that connects the four mandates. Not a pillar.
// Every item points at something that exists today. Formats with no content yet (videos,
// community discussions) are absent rather than shown empty.
import { evidence } from "./evidence";
import { story } from "./institution";
import { mandates, nextSummit } from "./case";
import { photo, assignments } from "./photography";

export type DiscoverType = "knowledge" | "learning" | "opportunity" | "event";
export type DiscoverItem = { key: string; type: DiscoverType; format: string; title: string; summary: string; to: string; meta: string; conditions?: string[] };

export const discoverTypes: { key: DiscoverType; label: string; line: string }[] = [
  { key: "knowledge", label: "Knowledge", line: "Research, datasets and Summit sessions, summarised for practice." },
  { key: "learning", label: "Learning", line: "Frameworks and professional development." },
  { key: "opportunity", label: "Opportunities", line: "Open calls to represent, contribute and collaborate." },
  { key: "event", label: "Events", line: "Convenings of the field." },
];

export const discoverItems: DiscoverItem[] = [
  { key: "event:summit-2027", type: "event", format: "Announced", title: `ASEB Summit and Awards ${nextSummit.year}, ${nextSummit.place}`, summary: nextSummit.line, to: "/summit", meta: `${nextSummit.year} · ${nextSummit.place}` },
  { key: "event:summit-2026", type: "event", format: "Archive", title: "ASEB 2026, Johannesburg: Who Built the Builder?", summary: "The fifth edition, 20 to 22 October 2026, and the public launch of ASEB Society on 21 October.", to: "/summit", meta: "October 2026 · Johannesburg" },
  ...evidence.map((item) => ({ key: `knowledge:${item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60)}`, type: "knowledge" as const, format: item.kind, title: item.title, summary: item.forPractice, to: "/evidence", meta: `${item.authors} · ${item.year}`, conditions: item.conditions })),
  { key: "learning:framework", type: "learning", format: "Framework", title: "The seven conditions entrepreneurs need", summary: "The ASEB Society Framework, aligned with the Africa Entrepreneurial Ecosystem Index, and how practitioners work on each condition.", to: "/framework", meta: "ASEB Society" },
  { key: "learning:academy", type: "learning", format: "Expression of interest", title: "Shape the ASEB Academy", summary: "Tell the Society which learning priorities matter in your practice. Courses and credentials are in development and not yet offered.", to: "/learning", meta: "ASEB Academy" },
  { key: "learning:roles", type: "learning", format: "Guide", title: "Find your role in the field", summary: "Twenty-eight roles across four parts of the field, from mentors to policymakers.", to: "/field", meta: "The Field" },
  { key: "opportunity:country-partner", type: "opportunity", format: "Open call", title: "Become a Country Partner", summary: "Credible organisations can apply to represent the Society in their country under a formal agreement.", to: "/country-partners", meta: "Continental network" },
  { key: "opportunity:ambassador", type: "opportunity", format: "Open call", title: "Apply as an Ambassador", summary: "Individual practitioners with a defined advocacy and mobilisation mandate.", to: "/ambassadors", meta: "Continental network" },
  { key: "opportunity:field-lab", type: "opportunity", format: "Open call", title: "Bring a research or policy question to the Field Lab", summary: "Collaborations begin with an agreed scope, delivery partners and outcomes.", to: "/field-lab", meta: "ASEB Field Lab" },
  { key: "opportunity:insights", type: "opportunity", format: "Editorial call", title: "Pitch a field insight", summary: "Write from your practice for practitioners across the continent.", to: "/insights", meta: "Insights" },
  { key: "opportunity:registry", type: "opportunity", format: "Open call", title: "Propose a Field Registry record", summary: "Submit work and evidence for editorial review.", to: "/registry/submit", meta: "Field Registry" },
];

export type Story = { id: string; kicker: string; title: string; body: string; photo?: string; alt?: string; caption?: string; position?: string; related: { label: string; to: string }; source: { label: string; href: string } };

const editionPhotos: Record<string, { photo: string; alt: string; caption: string; position?: string }> = Object.fromEntries(
  Object.entries(assignments.story.editions).map(([year, key]) => [year, { photo: photo(key).src, alt: photo(key).alt, caption: `${photo(key).city ?? ""}, ${year}` }]),
);

export const stories: Story[] = [
  ...story.map((s) => ({
    id: `edition-${s.year}`,
    kicker: `${s.year} · ${s.city}`,
    title: s.title,
    body: s.line,
    ...editionPhotos[s.year],
    related: { label: "Read Our Story", to: "/about/story" },
    source: { label: "Our Story", href: "/about/story" },
  })),
  { id: "summit-2027", kicker: `${nextSummit.year} · ${nextSummit.place}`, title: "The next convening", body: nextSummit.line, related: { label: "The Summit & Awards", to: "/summit" }, source: { label: "asebs.com", href: nextSummit.href } },
];
