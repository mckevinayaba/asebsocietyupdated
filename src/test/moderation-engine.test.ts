// @vitest-environment node
// The decision engine, attachment checks and pipeline, tested without the network. Provider
// results are simulated, so these tests prove how ASEB Society's rules respond to classifications.
// They do not measure the accuracy of the OpenAI model itself, which must be calibrated with real
// reviewed cases in each language before activation.
import { describe, expect, it } from "vitest";
import { decide, extractLinks, type ProviderResult } from "@/lib/moderation/rules";
import { canonicalVideo, checkMedia, ownsPath, sniffImageType } from "@/lib/moderation/media";
import { runModeration, type PipelineDeps, type Snapshot } from "@/lib/moderation/pipeline";

const clean: ProviderResult = { provider: "openai", model: "omni-moderation-latest", flagged: false, categories: {}, scores: { harassment: 0.01, hate: 0.0, sexual: 0.0 } };
const flagged = (category: string, score = 0.9): ProviderResult => ({ ...clean, flagged: true, categories: { [category]: true }, scores: { ...clean.scores, [category]: score } });

describe("legitimate professional content publishes immediately", () => {
  const posts = [
    "Our hub in Kisumu opened applications for a six-month agritech programme. Details on our website https://example.org/programme",
    "Nous lançons une cohorte d'incubation à Dakar pour les entreprises du secteur agroalimentaire. Candidatures ouvertes jusqu'au 15 janvier.",
    "Estamos a lançar um programa de mentoria em Luanda para empreendedoras do sector tecnológico. Inscrições abertas.",
    "Ask: how do other hubs keep mentors engaged after a programme ends? We lost most of ours when our grant closed.",
  ];
  for (const text of posts) it(text.slice(0, 50), () => expect(decide({ text, provider: clean }).decision).toBe("publish"));
});

describe("criticism is not harm", () => {
  const critiques = [
    "The national startup act has done little for founders outside the capital. Its tax incentives reach almost nobody in rural areas.",
    "ASEB Society should publish its budget. Recognition events are not the same as building a profession, and the field deserves accountability.",
    "Most accelerators here run the same imported curriculum and measure success by demo day attendance. That is not ecosystem building.",
    "Le programme gouvernemental d'appui aux PME est mal conçu : les délais de paiement tuent les petites entreprises.",
    "O banco de desenvolvimento prometeu financiamento às startups e não cumpriu. Precisamos de falar sobre isto.",
  ];
  for (const text of critiques) it(text.slice(0, 50), () => expect(decide({ text, provider: clean }).decision).toBe("publish"));
  it("only escalates, never restricts, when the model reads criticism as harassment", () => {
    const result = decide({ text: critiques[1]!, provider: flagged("harassment", 0.6) });
    expect(result.decision).toBe("escalate");
    expect(result.publicReason).toMatch(/Criticism of work, institutions and policies is welcome/);
  });
});

describe("clear violations are restricted, ambiguous ones escalated", () => {
  it("restricts credible threats and hateful threats", () => {
    expect(decide({ text: "x", provider: flagged("harassment/threatening") }).decision).toBe("restrict");
    expect(decide({ text: "x", provider: flagged("hate/threatening") }).decision).toBe("restrict");
  });
  it("restricts explicit sexual content and anything involving minors", () => {
    expect(decide({ text: "x", provider: flagged("sexual") }).decision).toBe("restrict");
    expect(decide({ text: "x", provider: { ...clean, scores: { "sexual/minors": 0.07 } } }).decision).toBe("escalate");
  });
  it("escalates discriminatory or xenophobic language for a person to judge", () => {
    const r = decide({ text: "x", provider: flagged("hate", 0.7) });
    expect(r.decision).toBe("escalate");
    expect(r.categories).toContain("hate");
  });
  it("handles self-harm with care rather than restriction", () => expect(decide({ text: "x", provider: flagged("self-harm") }).decision).toBe("escalate"));
  it("never publishes when the most serious signal is a restriction", () => {
    const r = decide({ text: "Great programme! https://203.0.113.9/login", provider: clean });
    expect(r.decision).toBe("restrict");
    expect(r.publicReason).toMatch(/not safe to open/);
  });
});

describe("suspicious funding opportunities are escalated, in three languages", () => {
  const scams = [
    "Grant of $50,000 available for African startups. Pay a small processing fee of $200 to receive your funds.",
    "Investment opportunity with guaranteed returns of 30% per month. Double your money.",
    "Financement garanti pour votre startup. Frais de dossier de 50 000 FCFA à payer avant le déblocage.",
    "Financiamento para empreendedores com retorno garantido. Taxa de inscrição obrigatória.",
    "We have funding for your business, message me on WhatsApp to apply today",
  ];
  for (const text of scams) it(text.slice(0, 50), () => {
    const r = decide({ text, provider: clean });
    expect(r.decision).toBe("escalate");
    expect(r.categories).toContain("suspicious_opportunity");
  });
  it("leaves a genuine call for applications alone", () => expect(decide({ text: "The regional innovation fund is open for applications. There is no fee to apply. Read the official call on https://example.org/fund", provider: clean }).decision).toBe("publish"));
});

describe("links", () => {
  it("finds links, including bare www addresses and script links", () => {
    const links = extractLinks("See www.example.org, https://a.example/x?y=1. And javascript:alert(1)");
    expect(links.slice(0, 2)).toEqual(["www.example.org", "https://a.example/x?y=1"]);
    expect(links[2]).toMatch(/^javascript:/);
  });
  it("restricts script links, credential tricks, raw addresses and program downloads", () => {
    for (const text of ["javascript:alert(1)", "https://user:pass@example.org", "http://192.168.0.1/", "https://example.org/setup.exe", "https://example.org/app.apk?x=1"]) {
      expect(decide({ text, provider: clean }).decision, text).toBe("restrict");
    }
  });
  it("escalates shortened links and lookalike domains", () => {
    expect(decide({ text: "Apply here https://bit.ly/3abc", provider: clean }).decision).toBe("escalate");
    expect(decide({ text: "https://xn--asebsocity-9db.org", provider: clean }).decision).toBe("escalate");
  });
});

describe("privacy, impersonation and spam", () => {
  it("escalates card and identity numbers but allows phone numbers and work emails", () => {
    expect(decide({ text: "My card is 4111 1111 1111 1111", provider: clean }).decision).toBe("escalate");
    expect(decide({ text: "Call our office on +27 11 555 0100 or write to hello@example.org", provider: clean }).decision).toBe("publish");
  });
  it("escalates someone speaking officially for ASEB Society, unless they are staff", () => {
    const text = "Official announcement on behalf of ASEB Society: all members must register again.";
    expect(decide({ text, provider: clean }).decision).toBe("escalate");
    expect(decide({ text, provider: clean, authorIsStaff: true }).decision).toBe("publish");
  });
  it("escalates link farms and repeated links", () => {
    const many = Array.from({ length: 8 }, (_, i) => `https://e${i}.example.org`).join(" ");
    expect(decide({ text: many, provider: clean }).decision).toBe("escalate");
    expect(decide({ text: "https://a.example https://a.example https://a.example buy now", provider: clean }).decision).toBe("escalate");
  });
});

describe("attachments", () => {
  const author = "44444444-4444-4444-4444-444444444444";
  const own = `${author}/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa.jpg`;
  const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0]);
  it("recognises real image bytes and rejects disguised files", () => {
    expect(sniffImageType(jpeg)).toBe("image/jpeg");
    expect(sniffImageType(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))).toBe("image/png");
    expect(sniffImageType(new TextEncoder().encode("RIFF....WEBPVP8 "))).toBe("image/webp");
    expect(sniffImageType(new TextEncoder().encode("MZ executable"))).toBeNull();
  });
  it("accepts only photographs in the author's own folder", () => {
    expect(ownsPath(own, author)).toBe(true);
    expect(ownsPath(`55555555-5555-5555-5555-555555555555/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa.jpg`, author)).toBe(false);
    expect(ownsPath(`${author}/../secret.jpg`, author)).toBe(false);
  });
  it("normalises YouTube and Vimeo links and refuses everything else", () => {
    expect(canonicalVideo("https://youtu.be/dQw4w9WgXcQ?t=3")).toEqual({ provider: "youtube", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" });
    expect(canonicalVideo("https://vimeo.com/123456789")).toEqual({ provider: "vimeo", url: "https://vimeo.com/123456789" });
    for (const bad of ["http://youtube.com/watch?v=dQw4w9WgXcQ", "https://youtube.com.evil.example/watch?v=dQw4w9WgXcQ", "https://user@youtube.com/watch?v=dQw4w9WgXcQ", "https://example.org/video.mp4"]) expect(canonicalVideo(bad), bad).toBeNull();
  });
  it("restricts a file that is not really an image, or too large, or missing", async () => {
    const check = (head: Uint8Array, size: number) => checkMedia([{ kind: "image", path: own }], author, async () => ({ size, head }));
    expect((await check(jpeg, 1000)).hits).toEqual([]);
    expect((await check(new TextEncoder().encode("MZ"), 1000)).hits[0]?.outcome).toBe("restrict");
    expect((await check(jpeg, 6 * 1024 * 1024)).hits[0]?.outcome).toBe("restrict");
    expect((await checkMedia([{ kind: "image", path: own }], author, async () => null)).hits[0]?.detail).toMatch(/could not be found/);
  });
});

describe("the pipeline", () => {
  const author = "44444444-4444-4444-4444-444444444444";
  const snap = (overrides: Partial<Snapshot> = {}): Snapshot => ({ id: "c1", kind: "post", status: "checking", author_id: author, title: "", summary: "", body: "Our hub opened a new programme.", media: [], details: {}, fingerprint: "fp", ...overrides });
  const deps = (overrides: Partial<PipelineDeps> = {}) => {
    const recorded: { decision: string; reason: string }[] = [];
    let providerCalls = 0;
    const d: PipelineDeps = {
      snapshot: async () => snap(),
      readImage: async () => ({ size: 100, head: new Uint8Array([0xff, 0xd8, 0xff]) }),
      signImage: async (p) => `https://signed.example/${p}`,
      provider: async () => { providerCalls++; return clean; },
      record: async ({ decision, reason }) => { recorded.push({ decision, reason }); return decision === "publish" ? "published" : decision === "restrict" ? "restricted" : decision === "escalate" ? "under_review" : "checking"; },
      authorIsStaff: async () => false,
      ...overrides,
    };
    return { d, recorded, calls: () => providerCalls };
  };
  it("publishes safe content and records the decision", async () => {
    const { d, recorded } = deps();
    expect(await runModeration("c1", d)).toEqual({ status: "published", decision: "publish", reason: "" });
    expect(recorded).toEqual([{ decision: "publish", reason: "" }]);
  });
  it("never publishes when the moderation service fails, and records the failure", async () => {
    const { d, recorded } = deps({ provider: async () => { throw new Error("timeout"); } });
    const outcome = await runModeration("c1", d);
    expect(outcome.status).toBe("checking");
    expect(outcome.decision).toBe("error");
    expect(outcome.reason).toMatch(/has not been published/);
    expect(recorded).toEqual([{ decision: "error", reason: "" }]);
  });
  it("does not call the external service for a clear local violation", async () => {
    const { d, calls } = deps({ snapshot: async () => snap({ body: "Download https://example.org/tool.exe" }) });
    expect((await runModeration("c1", d)).decision).toBe("restrict");
    expect(calls()).toBe(0);
  });
  it("restricts a disguised attachment", async () => {
    const { d } = deps({ snapshot: async () => snap({ media: [{ kind: "image", path: `${author}/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa.jpg` }] }), readImage: async () => ({ size: 100, head: new TextEncoder().encode("<?php") }) });
    expect((await runModeration("c1", d)).decision).toBe("restrict");
  });
  it("does nothing to content that is no longer waiting for a check", async () => {
    const { d, recorded } = deps({ snapshot: async () => snap({ status: "published" }) });
    expect((await runModeration("c1", d)).decision).toBe("stale");
    expect(recorded).toEqual([]);
  });
});
