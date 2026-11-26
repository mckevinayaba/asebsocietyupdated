import { describe, expect, it } from "vitest";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { assignments, photos, type PhotoKey } from "@/content/photography";

// Photographs are chosen deliberately. These checks stop accidental repetition from creeping back.
const flatten = (value: unknown): string[] =>
  typeof value === "string" ? [value] : Array.isArray(value) ? value.flatMap(flatten) : value && typeof value === "object" ? Object.values(value).flatMap(flatten) : [];

describe("photographic collection", () => {
  it("every assigned photograph exists in the registry", () => {
    for (const key of flatten(assignments)) expect(photos, key).toHaveProperty(key);
  });

  it("every repository photograph is present in public/", () => {
    for (const [key, p] of Object.entries(photos)) {
      if (p.src.startsWith("images/")) expect(existsSync(join("public", p.src)), key).toBe(true);
    }
  });

  it("every photograph has meaningful alternative text", () => {
    for (const [key, p] of Object.entries(photos)) expect(p.alt.length, key).toBeGreaterThan(20);
  });

  it("no photograph repeats within a page", () => {
    const pages: Record<string, unknown> = {
      home: [assignments.home],
      story: [assignments.story],
      summit: [assignments.summit],
      whatWeBuild: [assignments.pillars],
    };
    for (const [page, value] of Object.entries(pages)) {
      const keys = flatten(value);
      expect(new Set(keys).size, `${page}: ${keys.join(", ")}`).toBe(keys.length);
    }
  });

  it("no two pages open with the same photograph", () => {
    const heroes = [assignments.home.hero, assignments.story.hero, assignments.invest.hero, assignments.summit.hero];
    expect(new Set(heroes).size).toBe(heroes.length);
  });

  it("low resolution photographs are never used as a page opening", () => {
    const heroes: PhotoKey[] = [assignments.home.hero, assignments.story.hero, assignments.invest.hero, assignments.summit.hero];
    for (const h of heroes) expect(photos[h].width ?? 1200, h).toBeGreaterThanOrEqual(1200);
  });

  it("public pages take event photographs from the registry, not hardcoded paths", () => {
    const walk = (dir: string): string[] => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]));
    const offenders = walk("src/pages")
      .filter((f) => !f.endsWith("AppShell.tsx"))
      .filter((f) => /images\/events\//.test(readFileSync(f, "utf8")));
    expect(offenders).toEqual([]);
  });
});
