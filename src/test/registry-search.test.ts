import { describe, expect, it } from "vitest";
import { registry } from "@/content/registry";
import { filterRegistry, type RegistryFilters } from "@/lib/registry-search";

const defaults: RegistryFilters = { query: "", type: "all", country: "all", region: "all", condition: "all", year: "all", sort: "name" };

describe("Registry discovery", () => {
  it("combines country and recognition-year filters", () => {
    const results = filterRegistry(registry, { ...defaults, country: "Nigeria", year: "2026" });
    expect(results.map((record) => record.slug)).toContain("accelerate-africa");
    expect(results.every((record) => record.country === "Nigeria" && record.recognitions.some((recognition) => recognition.year === 2026))).toBe(true);
    expect(results.length).toBeLessThan(registry.length);
  });
  it("includes professional roles in search", () => {
    const results = filterRegistry(registry, { ...defaults, query: "Founder & Chief Executive Officer" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((record) => record.role === "Founder & Chief Executive Officer")).toBe(true);
  });
  it("returns no records for incompatible filters", () => {
    expect(filterRegistry(registry, { ...defaults, country: "Nigeria", region: "North" })).toEqual([]);
  });
});