// @vitest-environment node
// The public institutional narrative, as set by the Founding Organisational Profile 2026/2027.
// See docs/INSTITUTIONAL_BLUEPRINT.md, "Public narrative".
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { activities, annualCycle, campaigns, levels, standing } from "@/content/proposition";
import { story } from "@/content/institution";
import { investmentAreas } from "@/content/case";

const root = path.resolve(__dirname, "../..");
const routeTree = readFileSync(path.join(root, "src/routeTree.gen.ts"), "utf8");
const patterns = [...new Set([...routeTree.matchAll(/fullPath: ['"]([^'"]+)['"]/g)].map((m) => m[1]!.replace(/\/$/, "") || "/"))].map((r) => new RegExp(`^${r.replace(/\$[a-zA-Z]+/g, "[^/]+")}/?$`));
const resolves = (to: string) => patterns.some((p) => p.test((to.split("#")[0] ?? "").split("?")[0] || "/"));

const walk = (dir: string): string[] => readdirSync(dir).flatMap((name) => {
  const full = path.join(dir, name);
  if (statSync(full).isDirectory()) return ["test", "dev", "integrations"].includes(name) ? [] : walk(full);
  return /\.(ts|tsx|json)$/.test(name) && !name.endsWith(".gen.ts") ? [full] : [];
});
const publicFiles = [...walk(path.join(root, "src")), ...["public/sitemap.xml", "public/robots.txt", "public/manifest.webmanifest"].map((f) => path.join(root, f)).filter((f) => { try { statSync(f); return true; } catch { return false; } })];
const scan = (patternsToFind: RegExp[]) => publicFiles.flatMap((f) => {
  const text = readFileSync(f, "utf8");
  return patternsToFind.filter((re) => re.test(text)).map((re) => `${path.relative(root, f)}: ${re}`);
});

describe("public narrative independence", () => {
  it("never names a closed or competing organisation to justify the Society", () => {
    expect(scan([/\bANDE\b/, /andeglobal/i, /Aspen Network/i, /USAID/, /wind[- ]down/i])).toEqual([]);
  });

  it("keeps the approved brand statements and title", () => {
    expect(scan([/Chief Ecosystem Officer/i, /It Takes an Ecosystem/i, /Stronger African Economies/i])).toEqual([]);
  });

  it("never uses ASEB alone where it means the Society", () => {
    expect(scan([/\bASEB Framework\b/, /\bASEB account\b/i, /\bASEB Code of Practice\b/, /\bASEB designations?\b/, /\bASEB Fellow\b/, /Research Council/, /partner council/i])).toEqual([]);
  });
});

describe("founding proposition", () => {
  it("names three levels of intervention, with the professional field as the Society's focus", () => {
    expect(levels.map((l) => l.name)).toEqual(["Entrepreneurship development", "Ecosystem development", "Professional field development"]);
  });

  it("never offers accreditation, certification or designations as operational", () => {
    const accredited = standing.find((s) => s.name === "Accredited professional")!;
    expect(accredited.status).not.toBe("Operational");
    expect(scan([/certified ecosystem builder/i, /accredited by ASEB/i])).toEqual([]);
  });

  it("keeps the corrected chronology: intention announced in 2025, launch on 21 October 2026", () => {
    expect(story.map((s) => s.year)).toEqual(["2022", "2023", "2024", "2025", "2026"]);
    expect(story.find((s) => s.year === "2025")!.line).toMatch(/intention to establish/);
    expect(story.find((s) => s.year === "2025")!.line).not.toMatch(/launched/);
    expect(story.find((s) => s.year === "2026")!.line).toMatch(/21 October 2026/);
  });

  it("presents the annual cycle in order, with the Summit as the convening stage", () => {
    expect(annualCycle.map((s) => s.name)).toEqual(["Listen", "Develop", "Convene", "Follow through"]);
  });

  it("separates institutional funding areas from Summit sponsorship", () => {
    expect(investmentAreas.map((a) => a.name)).not.toContain("Summit sponsorship");
    expect(investmentAreas).toHaveLength(6);
  });

  it("links every example and campaign to a functioning destination", () => {
    for (const a of activities) expect(resolves(a.next.to), a.next.to).toBe(true);
    for (const c of campaigns) expect(resolves(c.to), c.to).toBe(true);
  });
});
