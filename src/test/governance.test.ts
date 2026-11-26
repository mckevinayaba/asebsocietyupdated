import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { governanceStructure, people, summitPositioning } from "@/content/institution";

// One institution. One governing Board. Four pillars. Clear executive accountability.
// Specialist support where necessary. Independent awards assessment. See docs/GOVERNANCE.md.
const walk = (dir: string): string[] => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]));
const publicSources = [...walk("src/pages"), ...walk("src/content"), ...walk("src/components"), ...walk("src/routes"), "public/sitemap.xml"].filter((f) => /\.(tsx?|json|xml)$/.test(f));

describe("unified governance", () => {
  it("has exactly one governing authority, and it is the ASEB Society Board", () => {
    const governing = governanceStructure.filter((g) => g.kind === "Governing authority");
    expect(governing.map((g) => g.name)).toEqual(["ASEB Society Board"]);
  });

  it("presents the six structures in the approved order", () => {
    expect(governanceStructure.map((g) => g.name)).toEqual([
      "ASEB Society Board",
      "Founder & Chief Executive Officer",
      "ASEB Secretariat",
      "Programme Committees and Working Groups",
      "Country Partners and Ambassadors",
      "Independent Awards Jury",
    ]);
  });

  it("keeps the awards jury independent and never a governing body", () => {
    const jury = governanceStructure.find((g) => g.key === "jury")!;
    expect(jury.kind).toBe("Independent assessment");
    expect(jury.doesNot).toMatch(/Govern the Society/);
  });

  it("positions the Summit as a programme of ASEB Society", () => {
    expect(summitPositioning).toMatch(/^The Africa Startup Ecosystem Builders Summit & Awards is the flagship continental convening and recognition programme of ASEB Society/);
  });

  it("never reintroduces the outdated structure in public sources", () => {
    const banned = [/Summit (and|&) Awards Advisory Board/i, /Summit Advisory Board/i, /Awards Advisory Board/i, /Advisory Board Member/i, /Advisory Council/i, /Three layers/i, /Field Councils/i];
    const offenders = publicSources.flatMap((f) => {
      const text = readFileSync(f, "utf8");
      return banned.filter((re) => re.test(text)).map((re) => `${f}: ${re}`);
    });
    expect(offenders).toEqual([]);
  });

  it("lists only Board members under the Board", () => {
    for (const p of people.filter((x) => x.group === "board")) expect(p.role, p.name).toMatch(/Board/);
  });
});
