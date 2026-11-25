// @vitest-environment node
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { contributionSchema, forYouOrder, permalink, slugify, uniqueSlug, needsEditor } from "@/lib/community";
import { playbookChapters, voicesCategories, products } from "@/content/products";
import { primaryTabs, activeTab, desktopNav } from "@/content/navigation";
import { positioning } from "@/content/case";
import { people } from "@/content/institution";

const base = { kind: "post" as const, title: "", summary: "", body: "Hello village", consentPublish: true, submit: true };

describe("contribution rules", () => {
  it("accepts a simple update", () => { expect(contributionSchema.safeParse(base).success).toBe(true); });
  it("requires a Voices category, a Playbook chapter and a parent for answers", () => {
    expect(contributionSchema.safeParse({ ...base, kind: "voice", title: "A story" }).success).toBe(false);
    expect(contributionSchema.safeParse({ ...base, kind: "voice", title: "A story", voicesCategory: "founders" }).success).toBe(true);
    expect(contributionSchema.safeParse({ ...base, kind: "playbook_contribution" }).success).toBe(false);
    expect(contributionSchema.safeParse({ ...base, kind: "answer" }).success).toBe(false);
  });
  it("needs publication consent to submit, but not to save a draft", () => {
    expect(contributionSchema.safeParse({ ...base, kind: "article", title: "Title", consentPublish: false }).success).toBe(false);
    expect(contributionSchema.safeParse({ ...base, kind: "article", title: "Title", consentPublish: false, submit: false }).success).toBe(true);
  });
  it("requires an official source for opportunities", () => {
    expect(contributionSchema.safeParse({ ...base, kind: "opportunity", title: "A grant" }).success).toBe(false);
    expect(contributionSchema.safeParse({ ...base, kind: "opportunity", title: "A grant", details: { source: "https://example.org/call" } }).success).toBe(true);
  });
  it("accepts only YouTube or Vimeo links and requires photo descriptions", () => {
    expect(contributionSchema.safeParse({ ...base, media: [{ kind: "video_link", url: "https://evil.example/v" }] }).success).toBe(false);
    expect(contributionSchema.safeParse({ ...base, media: [{ kind: "video_link", url: "https://www.youtube.com/watch?v=x", alt: "Talk" }] }).success).toBe(true);
    expect(contributionSchema.safeParse({ ...base, media: [{ kind: "image", path: "11111111-1111-1111-1111-111111111111/a.jpg" }] }).success).toBe(false);
    expect(contributionSchema.safeParse({ ...base, media: [{ kind: "image", path: "../../etc/passwd", alt: "x" }] }).success).toBe(false);
  });
  it("keeps updates short and routes editorial kinds to editors", () => {
    expect(contributionSchema.safeParse({ ...base, body: "x".repeat(3001) }).success).toBe(false);
    expect(needsEditor("voice")).toBe(true);
    expect(needsEditor("post")).toBe(false);
  });
});

describe("permanent links and slugs", () => {
  it("gives every kind a shareable URL", () => {
    expect(permalink("voice", "a-story")).toBe("/voices/a-story");
    expect(permalink("question", "q")).toBe("/ask/q");
    expect(permalink("answer", "a1", "q")).toBe("/ask/q#a1");
    expect(permalink("research", "r")).toBe("/state-of-the-field/r");
    expect(permalink("post", "p")).toBe("/the-field/p");
  });
  it("makes safe, unique slugs", () => {
    expect(slugify("Côte d'Ivoire: what works?")).toBe("cote-divoire-what-works");
    expect(uniqueSlug("Hello", () => "abc123")).toBe("hello-abc123");
    expect(slugify("!!")).toBe("contribution");
  });
});

describe("For You is a transparent filter", () => {
  it("puts what you follow first, then the rest by date", () => {
    const items = [
      { id: "a", country: "Ghana", topics: [], published_at: "2026-11-20T00:00:00Z", author: { profile_id: null } },
      { id: "b", country: "Kenya", topics: [], published_at: "2026-11-10T00:00:00Z", author: { profile_id: null } },
      { id: "c", country: "", topics: ["rural hubs"], published_at: "2026-11-01T00:00:00Z", author: { profile_id: null } },
    ];
    const ordered = forYouOrder(items, [{ target_type: "country", target_key: "Kenya" }, { target_type: "topic", target_key: "rural hubs" }]);
    expect(ordered.map((i) => i.id)).toEqual(["b", "c", "a"]);
  });
});

describe("product architecture", () => {
  it("has exactly five knowledge products and keeps five bottom destinations", () => {
    expect(Object.keys(products)).toEqual(["field", "playbook", "voices", "ask", "state"]);
    expect(primaryTabs).toHaveLength(5);
    expect(activeTab("/voices/a-story")).toBe("discover");
    expect(activeTab("/the-field")).toBe("home");
  });
  it("keeps Founders' Voices as a category of ASEB Voices, not a product", () => {
    expect(voicesCategories.map((c) => c.key)).toContain("founders");
    expect(JSON.stringify(products)).not.toMatch(/Founder Voices|Stories from the Field/);
  });
  it("keeps the app's chapters and categories identical to the migration seed", () => {
    const sql = readFileSync(path.resolve(__dirname, "../../drizzle/migrations/0007_living_village_shared_content.sql"), "utf8");
    for (const c of playbookChapters) expect(sql).toContain(`'${c.slug}'`);
    for (const c of voicesCategories) expect(sql).toContain(`'${c.key}'`);
    expect((sql.match(/\('[a-z-]+', \d+, '/g) ?? []).length).toBe(playbookChapters.length);
  });
  it("uses the approved tagline and title, and no Ecosystem Tax", () => {
    expect(positioning.philosophy).toBe("It Takes a Village.");
    expect(people.find((p) => p.slug === "mckevin-ayaba")?.role).toBe("Founder & Chief Executive Officer");
    expect(JSON.stringify(desktopNav).toLowerCase()).not.toContain("ecosystem tax");
  });
});
