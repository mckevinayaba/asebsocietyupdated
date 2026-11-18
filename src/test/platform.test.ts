import { describe, expect, it } from "vitest";
import { programmeReadiness, societyLaunchDate, personas } from "@/content/platform";
import { pillars } from "@/content/pillars";

describe("public programme readiness", () => {
  it("uses the supplied public launch date", () => {
    expect(societyLaunchDate).toBe("2026-10-21");
  });
  it("keeps Academy learning planned, not available credentials", () => {
    expect(programmeReadiness.academy.status).toBe("Planned");
  });
  it("presents the four pillars as mandates, led by the Summit, without readiness labels or numbering", () => {
    expect(pillars.map((pillar) => pillar.slug)).toEqual(["summit", "circles", "academy", "field-lab"]);
    for (const pillar of pillars) {
      expect(pillar).not.toHaveProperty("n");
      for (const programme of pillar.programmes) expect(programme).not.toHaveProperty("status");
    }
  });
  it("does not advertise developing Circles as active communities", () => {
    expect(programmeReadiness.circles.status).toBe("Launching");
  });
  it("offers Field Lab partnership proposals rather than live projects", () => {
    expect(programmeReadiness["field-lab"].status).toBe("Open for Partnership");
  });
  it("provides distinct pathways for all seven requested audiences", () => {
    expect(personas.map((person) => person.key)).toEqual(["practitioner", "organisation", "funder", "investor", "researcher", "university", "government"]);
    expect(personas.find((person) => person.key === "practitioner")?.to).toBe("/join");
    expect(personas.find((person) => person.key === "funder")?.to).toBe("/funders");
    expect(personas.find((person) => person.key === "government")?.to).toBe("/work-with-us");
  });
});
