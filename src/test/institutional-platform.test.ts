import { describe, expect, it } from "vitest";
import { activeTab, contextTabsFor, isTabCurrent, primaryTabs, safeRedirect } from "@/content/navigation";
import { countryProfiles, networkSummary, territories } from "@/content/continent";
import { economicEvidence, publishedEvidence, mandates, investmentAreas } from "@/content/case";
import { reconcile, personState, toCsv, matchesQuery, type ApplicationRecord, type AccountRecord } from "@/lib/secretariat";
import { searchSite } from "@/lib/site-search";
import { discoverItems } from "@/content/discover";
import { progressRegister } from "@/content/progress";

describe("application navigation", () => {
  it("has exactly five persistent destinations", () => {
    expect(primaryTabs.map((t) => t.label)).toEqual(["Home", "Explore", "Circles", "Discover", "You"]);
  });
  it("selects the right bottom tab for each section", () => {
    expect(activeTab("/")).toBe("home");
    expect(activeTab("/summit")).toBeNull();
    expect(activeTab("/why-aseb")).toBeNull();
    expect(activeTab("/registry/some-record")).toBe("explore");
    expect(activeTab("/countries/kenya")).toBe("explore");
    expect(activeTab("/communities")).toBe("circles");
    expect(activeTab("/evidence")).toBe("discover");
    expect(activeTab("/secretariat")).toBe("you");
  });
  it("marks query-specific contextual tabs as current", () => {
    const set = contextTabsFor("/registry");
    expect(set?.id).toBe("explore");
    const people = set!.tabs.find((t) => t.label === "Recognised people")!;
    const all = set!.tabs.find((t) => t.label === "Field Registry")!;
    expect(isTabCurrent(people, "/registry", "?type=individual", set!.tabs)).toBe(true);
    expect(isTabCurrent(all, "/registry", "?type=individual", set!.tabs)).toBe(false);
    expect(isTabCurrent(all, "/registry", "", set!.tabs)).toBe(true);
  });
  it("only allows same-origin redirects after sign in", () => {
    expect(safeRedirect("/secretariat")).toBe("/secretariat");
    expect(safeRedirect("//evil.example")).toBe("/app");
    expect(safeRedirect("https://evil.example")).toBe("/app");
    expect(safeRedirect("/\\evil.example")).toBe("/app");
    expect(safeRedirect("/auth?redirect=/app")).toBe("/app");
    expect(safeRedirect(undefined)).toBe("/app");
  });
});

describe("continental network", () => {
  it("covers the 54 sovereign states and classifies Mayotte separately", () => {
    expect(countryProfiles).toHaveLength(54);
    expect(new Set(countryProfiles.map((c) => c.slug)).size).toBe(54);
    expect(countryProfiles.every((c) => c.kind === "Sovereign state")).toBe(true);
    expect(territories.map((t) => t.name)).toEqual(["Mayotte"]);
  });
  it("shows representation only where confirmed", () => {
    const represented = countryProfiles.filter((c) => c.representation.length > 0).map((c) => c.name);
    expect(represented).toEqual(["Angola"]);
    expect(networkSummary.withCountryPartner).toBe(1);
  });
});

describe("institutional case integrity", () => {
  it("never publishes an unverified figure", () => {
    expect(economicEvidence.some((e) => !e.verified)).toBe(true);
    expect(publishedEvidence.every((e) => e.verified && e.href.startsWith("https://"))).toBe(true);
  });
  it("keeps the four mandates intact and publishes no funding amounts", () => {
    expect(mandates.map((m) => m.name)).toEqual(["ASEB Summit & Awards", "ASEB Circles", "ASEB Academy", "ASEB Field Lab"]);
    expect(investmentAreas.some((a) => /\$|USD|ZAR|R\d|\d{4,}/.test(`${a.purpose} ${a.outcome}`))).toBe(false);
  });
  it("never claims Academy courses or credentials are offered", () => {
    const academy = mandates.find((m) => m.key === "academy")!;
    expect(academy.status.tone).toBe("developing");
    expect(progressRegister.find((p) => p.name === "Courses and professional credentials")?.status).not.toBe("Operational");
  });
  it("has no Ecosystem Tax framing in discovery content", () => {
    expect(JSON.stringify(discoverItems).toLowerCase()).not.toContain("ecosystem tax");
  });
});

const application = (over: Partial<ApplicationRecord>): ApplicationRecord => ({ id: "a1", name: "Applicant", email: "Person@Example.org", country: "Kenya", city: "", role: "", job_title: "", organisation: "", membership_type: "individual", intent: "member", operating_countries: "", focus_areas: "", work_description: "", profile_url: "", phone: "", status: "pending", review_stage: "received", created_at: "2026-11-20T10:00:00Z", ...over });
const account = (over: Partial<AccountRecord>): AccountRecord => ({ id: "u1", email: "person@example.org", email_confirmed: true, created_at: "2026-11-21T10:00:00Z", last_sign_in_at: null, name: "", country: "", organisation: "", primary_role: "", ...over });

describe("Secretariat reconciliation", () => {
  it("matches applications and accounts on email, case-insensitively", () => {
    const rows = reconcile([application({})], [account({})], [{ user_id: "u1", circle_key: "regional:East" }]);
    expect(rows).toHaveLength(1);
    expect(rows[0]!.applications).toHaveLength(1);
    expect(rows[0]!.circles).toEqual(["regional:East"]);
    expect(personState(rows[0]!)).toBe("Applicant with verified account");
  });
  it("never treats an account as approved membership", () => {
    const rows = reconcile([], [account({ email: "only@example.org" })], []);
    expect(personState(rows[0]!)).toBe("Registered account, no application");
    const unmatched = reconcile([application({ email: "solo@example.org" })], [], []);
    expect(personState(unmatched[0]!)).toBe("Applicant without an account");
  });
  it("searches across names, organisations and countries", () => {
    const rows = reconcile([application({ organisation: "Example Hub" })], [], []);
    expect(matchesQuery(rows[0]!, "example hub kenya")).toBe(true);
    expect(matchesQuery(rows[0]!, "ghana")).toBe(false);
  });
  it("protects CSV exports from spreadsheet formula injection", () => {
    const csv = toCsv([{ name: "=HYPERLINK(\"x\")", note: "a,b" }]);
    expect(csv).toContain("\"'=HYPERLINK(\"\"x\"\")\"");
    expect(csv).toContain("\"a,b\"");
  });
});

describe("site search", () => {
  it("finds pages, countries and registry records", () => {
    expect(searchSite("invest").some((r) => r.to === "/invest")).toBe(true);
    expect(searchSite("mayotte").some((r) => r.to === "/countries/mayotte")).toBe(true);
    expect(searchSite("cote divoire").some((r) => r.kind === "Country")).toBe(true);
    expect(searchSite("")).toEqual([]);
  });
});
