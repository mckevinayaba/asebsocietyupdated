// @vitest-environment node
// Permanent link safeguards. Fails when a navigation destination has no route, when a page links
// to its own domain by full address (how old-site links went unnoticed), or when placeholder or
// preview-environment links appear in public code.
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { contextTabSets, desktopNav, primaryTabs } from "@/content/navigation";
import { footerNav } from "@/content/site";
import { discoverItems, stories } from "@/content/discover";
import { mandates, investmentAreas } from "@/content/case";

const root = path.resolve(__dirname, "../..");
const routeTree = readFileSync(path.join(root, "src/routeTree.gen.ts"), "utf8");
const routes = [...new Set([...routeTree.matchAll(/fullPath: ['"]([^'"]+)['"]/g)].map((m) => m[1]!.replace(/\/$/, "") || "/"))];
const patterns = routes.map((r) => new RegExp(`^${r.replace(/\$[a-zA-Z]+/g, "[^/]+")}/?$`));

function resolves(to: string): boolean {
  if (/^(https?:|mailto:)/.test(to)) return true;
  const pathOnly = (to.split("#")[0] ?? "").split("?")[0] || "/";
  return patterns.some((p) => p.test(pathOnly));
}

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return ["test", "dev", "email-templates", "integrations"].includes(name) ? [] : sourceFiles(full);
    return /\.(ts|tsx)$/.test(name) && !name.endsWith(".gen.ts") ? [full] : [];
  });
}

describe("navigation destinations", () => {
  const destinations = [
    ...desktopNav.flatMap((g) => [g.to, ...g.items.map((i) => i.to)]),
    ...primaryTabs.flatMap((t) => [t.to, t.memberTo ?? t.to]),
    ...contextTabSets.flatMap((s) => s.tabs.map((t) => t.to)),
    ...footerNav.flatMap((c) => c.links.map((l) => l.to)),
    ...discoverItems.map((i) => i.to),
    ...stories.map((s) => s.related.to),
    ...mandates.map((m) => m.pathway.to),
    "/invest", ...investmentAreas.map((a) => `/invest#${a.slug}`),
  ];
  it.each([...new Set(destinations)])("%s resolves to a route", (to) => {
    expect(resolves(to)).toBe(true);
  });
});

describe("public code links", () => {
  const files = sourceFiles(path.join(root, "src"));
  it("never links to its own domain by full address", () => {
    const offenders = files.filter((f) => /href=["{]?[`"']?https?:\/\/(www\.)?asebsociety\.org/.test(readFileSync(f, "utf8")) || /href: "https?:\/\/(www\.)?asebsociety\.org/.test(readFileSync(f, "utf8")));
    expect(offenders.map((f) => path.relative(root, f))).toEqual([]);
  });
  it("contains no placeholder or preview-environment links", () => {
    const offenders = files.filter((f) => {
      const s = readFileSync(f, "utf8");
      return /href=["']#["']/.test(s) || /href=["'](https?:\/\/)?[^"']*(lovable\.app|lovableproject\.com|localhost)/.test(s);
    });
    expect(offenders.map((f) => path.relative(root, f))).toEqual([]);
  });
  it("keeps redirects for the previous website's addresses", () => {
    for (const old of ["/about/team", "/about/goals", "/about/governance", "/founder-voices", "/stories-from-the-field"]) expect(routes).toContain(old);
  });
});
