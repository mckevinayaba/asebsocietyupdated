// Client-side site search over public content only. No private data, no external service.
import { desktopNav } from "@/content/navigation";
import { registry } from "@/content/registry";
import { evidence } from "@/content/evidence";
import { allProfiles } from "@/content/continent";

export type SearchEntry = { kind: "Page" | "Practitioner" | "Institution" | "Evidence" | "Country"; title: string; detail: string; to: string; text: string };

let index: SearchEntry[] | null = null;

export function searchIndex(): SearchEntry[] {
  if (index) return index;
  const pages: SearchEntry[] = desktopNav.flatMap((group) => group.items.map((item) => ({ kind: "Page" as const, title: item.label, detail: item.note ?? group.label, to: item.to, text: `${item.label} ${item.note ?? ""} ${group.label}` })));
  pages.push(
    { kind: "Page", title: "Invest in Our Mission", detail: "Fund the foundations of African entrepreneurship", to: "/invest", text: "invest fund funding donor foundation dfi philanthropy partnership" },
    { kind: "Page", title: "Discover", detail: "Knowledge, learning, opportunities and events", to: "/discover", text: "discover knowledge learning events opportunities research" },
    { kind: "Page", title: "Member sign in", detail: "Your account, profile and Circle selections", to: "/auth", text: "sign in login account member" },
  );
  const people: SearchEntry[] = registry.map((record) => ({
    kind: record.type === "organisation" ? "Institution" as const : "Practitioner" as const,
    title: record.name,
    detail: [record.role, record.organisation, record.country].filter(Boolean).join(" · "),
    to: `/registry/${record.slug}`,
    text: `${record.name} ${record.role} ${record.organisation} ${record.country} ${record.condition}`,
  }));
  const research: SearchEntry[] = evidence.map((item) => ({ kind: "Evidence" as const, title: item.title, detail: `${item.kind} · ${item.authors}`, to: "/evidence", text: `${item.title} ${item.authors} ${item.summary} ${item.conditions.join(" ")}` }));
  const places: SearchEntry[] = allProfiles.map((profile) => ({ kind: "Country" as const, title: profile.name, detail: `${profile.kind} · ${profile.region}`, to: `/countries/${profile.slug}`, text: `${profile.name} ${profile.region} ${profile.kind}` }));
  index = [...pages, ...places, ...people, ...research].map((entry) => ({ ...entry, text: entry.text.toLowerCase() }));
  return index;
}

// Lower case, no accents, no punctuation: "Côte d'Ivoire" matches "cote divoire".
const fold = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/['\u2019`.]/g, "").replace(/[^a-z0-9]+/g, " ");

export function searchSite(query: string, limit = 24): SearchEntry[] {
  const terms = fold(query).split(" ").filter(Boolean);
  if (!terms.length) return [];
  const scored = searchIndex()
    .map((entry) => {
      const haystack = fold(entry.text);
      const title = fold(entry.title);
      if (!terms.every((term) => haystack.includes(term))) return null;
      const score = terms.reduce((sum, term) => sum + (title.startsWith(term) ? 6 : title.includes(term) ? 3 : 1), 0) + (entry.kind === "Page" ? 2 : 0);
      return { entry, score };
    })
    .filter((item): item is { entry: SearchEntry; score: number } => item !== null)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title));
  return scored.slice(0, limit).map((item) => item.entry);
}
