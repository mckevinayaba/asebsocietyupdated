// The continental network: Africa's 54 sovereign states plus classified territorial engagement.
// Regions follow the five African Union regions. Representation appears only when confirmed in
// src/content/institution.ts. Every other country reads as "not yet appointed", which is the truth.
import { africanCountries } from "./countries";
import { registry } from "./registry";

export type AuRegion = "North" | "West" | "Central" | "East" | "Southern";

const regionOf: Record<string, AuRegion> = {
  Algeria: "North", Egypt: "North", Libya: "North", Mauritania: "North", Morocco: "North", Tunisia: "North",
  Benin: "West", "Burkina Faso": "West", "Cabo Verde": "West", "Côte d'Ivoire": "West", Gambia: "West", Ghana: "West", Guinea: "West", "Guinea-Bissau": "West", Liberia: "West", Mali: "West", Niger: "West", Nigeria: "West", Senegal: "West", "Sierra Leone": "West", Togo: "West",
  Burundi: "Central", Cameroon: "Central", "Central African Republic": "Central", Chad: "Central", Congo: "Central", "DR Congo": "Central", "Equatorial Guinea": "Central", Gabon: "Central", "São Tomé and Príncipe": "Central",
  Comoros: "East", Djibouti: "East", Eritrea: "East", Ethiopia: "East", Kenya: "East", Madagascar: "East", Mauritius: "East", Rwanda: "East", Seychelles: "East", Somalia: "East", "South Sudan": "East", Sudan: "East", Tanzania: "East", Uganda: "East",
  Angola: "Southern", Botswana: "Southern", Eswatini: "Southern", Lesotho: "Southern", Malawi: "Southern", Mozambique: "Southern", Namibia: "Southern", "South Africa": "Southern", Zambia: "Southern", Zimbabwe: "Southern",
};

export const auRegions: AuRegion[] = ["North", "West", "Central", "East", "Southern"];

export type Representation = { kind: "Country Partner" | "Regional Ambassador"; name: string; profile: string; source: string };

// Confirmed appointments only. Source: src/content/institution.ts (www.asebsociety.org, October 2026).
const confirmed: Record<string, Representation[]> = {
  Angola: [{ kind: "Country Partner", name: "Haymée I. Pérez Cogle", profile: "/people#haymee-perez-cogle", source: "ASEB Society leadership register" }],
};

// The Regional Ambassador for Lusophone Africa covers these states. It is a regional mandate,
// not a national appointment, and is shown as such.
const lusophone = ["Angola", "Mozambique", "Cabo Verde", "Guinea-Bissau", "São Tomé and Príncipe"];

export type CountryProfile = {
  slug: string;
  name: string;
  kind: "Sovereign state" | "Territory";
  region: AuRegion | "Indian Ocean territory";
  registryRecords: number;
  recognitionYears: number[];
  representation: Representation[];
  regionalCoverage: string | null;
  note: string | null;
};

export const slugify = (name: string) => name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const countryProfiles: CountryProfile[] = africanCountries.map((name) => {
  const records = registry.filter((record) => record.country === name);
  return {
    slug: slugify(name),
    name,
    kind: "Sovereign state" as const,
    region: regionOf[name] ?? "East",
    registryRecords: records.length,
    recognitionYears: [...new Set(records.flatMap((record) => record.recognitions.map((r) => r.year)))].sort(),
    representation: confirmed[name] ?? [],
    regionalCoverage: lusophone.includes(name) ? "Covered by the Regional Ambassador for Lusophone Africa" : null,
    note: null,
  };
});

// Territorial engagement is classified separately from the 54 sovereign states.
export const territories: CountryProfile[] = [
  { slug: "mayotte", name: "Mayotte", kind: "Territory", region: "Indian Ocean territory", registryRecords: 0, recognitionYears: [], representation: [], regionalCoverage: null, note: "Announced as the host destination of the ASEB Summit and Awards in 2027. Dates and programme are confirmed on asebs.com." },
];

export const allProfiles = [...countryProfiles, ...territories];
export const profileBySlug = (slug: string) => allProfiles.find((profile) => profile.slug === slug);

export const networkSummary = {
  sovereignStates: countryProfiles.length,
  withCountryPartner: countryProfiles.filter((c) => c.representation.some((r) => r.kind === "Country Partner")).length,
  withArchiveRecords: countryProfiles.filter((c) => c.registryRecords > 0).length,
};
