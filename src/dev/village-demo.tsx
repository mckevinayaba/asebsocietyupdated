// DEVELOPMENT ONLY. Demonstration content for reviewing the community design before migration
// 0007 is applied. None of these people or contributions exist. Loaded only when
// import.meta.env.DEV is true, so production builds never include it.
import { useQueryClient } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import type { FeedItem } from "@/lib/community-data";
import { FieldPage } from "@/pages/village/Field";
import { VoicesPage } from "@/pages/village/Voices";
import { AskPage } from "@/pages/village/Ask";

const day = (n: number) => new Date(Date.now() - n * 3_600_000).toISOString();
const base = { summary: "", voices_category: null, chapter_id: null, parent_id: null, topics: [], evidence_class: "practitioner_experience" as const, details: {}, media: [], visibility: "public" as const, attribution: "name" as const, status: "published" as const, scheduled_for: null, featured: false, hidden_by_moderator: false, consent_publish: true, consent_edit: true };
const author = (id: string, name: string, headline: string, country: string) => ({ content_id: id, display_name: name, profile_id: null, headline, country });
const eng = (id: string, a: number, r: number) => ({ content_id: id, appreciations: a, useful: 0, responses: r });
const item = (o: Partial<FeedItem> & { id: string; kind: FeedItem["kind"]; slug: string; body: string }): FeedItem => ({ ...base, title: "", country: "", created_at: day(30), updated_at: day(2), published_at: day(2), ...o } as FeedItem);

export const demoFeed: FeedItem[] = [
  item({ id: "d1", kind: "post", slug: "demo-post", body: "Demonstration update. A county innovation hub opened its second rural satellite this week, run with the local cooperative union. The first cohort is twelve agri-processing enterprises.", country: "Kenya", topics: ["rural hubs"], published_at: day(1), author: author("d1", "Sample Practitioner", "Programme lead, demonstration hub", "Kenya"), engagement: eng("d1", 4, 2) }),
  item({ id: "d2", kind: "voice", slug: "demo-voice", title: "The hub that stayed when the funding left", summary: "Demonstration story summary. How one team kept a programme alive through two funding gaps.", body: "Demonstration story text.", voices_category: "uncomfortable-truth", published_at: day(5), author: author("d2", "Sample Contributor", "Founder, demonstration incubator", "Ghana"), engagement: eng("d2", 9, 3) }),
  item({ id: "d3", kind: "opportunity", slug: "demo-opportunity", title: "Demonstration call for ecosystem support organisations", body: "Demonstration opportunity text describing a grant for support organisations working with informal enterprises.", details: { source: "https://example.org/call", deadline: "2027-02-28", eligibility: "Registered support organisations in East Africa" }, published_at: day(8), author: author("d3", "Sample Secretariat member", "", ""), engagement: eng("d3", 0, 0) }),
  item({ id: "d4", kind: "question", slug: "demo-question", title: "How do you keep mentors engaged after the first cohort?", body: "Demonstration question text with context about a volunteer mentor network.", published_at: day(12), author: author("d4", "Sample Practitioner", "Mentor network coordinator", "Rwanda"), engagement: eng("d4", 2, 0) }),
  item({ id: "d5", kind: "research", slug: "demo-research", title: "Demonstration survey of support organisations in three cities", summary: "Demonstration research summary.", body: "Demonstration research text.", evidence_class: "research_evidence", details: { coverage: "Three cities, demonstration", method: "Survey, demonstration" }, published_at: day(20), author: author("d5", "Sample Researcher", "University research centre", "Senegal"), engagement: eng("d5", 1, 0) }),
];

function Seed({ children }: { children: ReactNode }) {
  const client = useQueryClient();
  const [ready] = useState(() => {
    client.setQueryDefaults(["village"], { staleTime: Infinity, retry: false });
    client.setQueryDefaults(["community-mode"], { staleTime: Infinity, retry: false });
    client.setQueryData(["community-mode"], { available: true, mode: "pre_moderated" });
    for (const tab of ["for-you", "latest", "following"]) client.setQueryData(["village", "feed", tab], demoFeed);
    client.setQueryData(["village", "feed", "research"], demoFeed.filter((i) => i.kind === "research"));
    client.setQueryData(["village", "feed", "opportunities"], demoFeed.filter((i) => i.kind === "opportunity"));
    client.setQueryData(["village", "panel-voices"], demoFeed.filter((i) => i.kind === "voice"));
    client.setQueryData(["village", "panel-questions"], demoFeed.filter((i) => i.kind === "question"));
    client.setQueryData(["village", "voices-featured"], demoFeed.filter((i) => i.kind === "voice"));
    client.setQueryData(["village", "voices", ""], demoFeed.filter((i) => i.kind === "voice"));
    client.setQueryData(["village", "questions"], demoFeed.filter((i) => i.kind === "question"));
    return true;
  });
  return ready ? <><p className="bg-signal px-5 py-2 text-center text-[0.8125rem] font-semibold text-ink" role="note">Development preview with demonstration content. These are not real people or contributions.</p>{children}</> : null;
}

export default function VillageDemo({ page }: { page: "field" | "voices" | "ask" }) {
  return <Seed>{page === "field" ? <FieldPage /> : page === "voices" ? <VoicesPage /> : <AskPage />}</Seed>;
}
