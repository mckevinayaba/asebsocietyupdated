import type { RegistryRecord } from "@/content/registry";

export type RegistryFilters = {
  query: string;
  type: string;
  country: string;
  region: string;
  condition: string;
  year: string;
  sort: string;
};

export function filterRegistry(records: RegistryRecord[], filters: RegistryFilters) {
  const term = filters.query.trim().toLocaleLowerCase();
  const results = records.filter((record) => {
    if (filters.type !== "all" && record.type !== filters.type) return false;
    if (filters.country !== "all" && (record.country || "continental") !== filters.country) return false;
    if (filters.region !== "all" && record.region !== filters.region) return false;
    if (filters.condition !== "all" && record.condition !== filters.condition) return false;
    if (filters.year !== "all" && !record.recognitions.some((recognition) => String(recognition.year) === filters.year)) return false;
    return !term || [record.name, record.country, record.role, record.organisation, record.bio, record.condition, ...record.recognitions.map((recognition) => recognition.award)].join(" ").toLocaleLowerCase().includes(term);
  });
  return results.sort((a, b) => filters.sort === "recent"
    ? Math.max(0, ...b.recognitions.map((item) => item.year)) - Math.max(0, ...a.recognitions.map((item) => item.year)) || a.name.localeCompare(b.name)
    : a.name.localeCompare(b.name));
}