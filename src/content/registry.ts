import data from "./registry.json";

// Field Registry seed: 180 verified records exported from the ASEB awards archive.
// In production this moves to the database (Lovable Cloud); the shape stays the same.

export type Recognition = { year: number; award: string; result: string; edition?: string };
export type RegistryRecord = {
  slug: string;
  name: string;
  type: "organisation" | "individual";
  country: string;
  region: string;
  role: string;
  organisation: string;
  bio: string;
  condition: string;
  source_url: string;
  linkedin: string;
  website: string;
  recognitions: Recognition[];
};

export const registry = data as RegistryRecord[];
export const recordBySlug = (s: string) => registry.find((r) => r.slug === s);
export const countries = Array.from(new Set(registry.map((r) => r.country).filter(Boolean))).sort();
export const regions = ["North", "West", "Central", "East", "Southern"];
export const registryConditions = Array.from(new Set(registry.map((r) => r.condition).filter(Boolean))).sort();
