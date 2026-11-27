// The automated publishing pipeline. Dependencies are passed in so the whole flow can be tested
// without the database or the network. Order: read the exact snapshot, check attachments, apply
// local rules, ask the provider, decide, record. If anything fails before a decision is recorded,
// the contribution stays private in 'checking' and the author can retry. Nothing is published on
// failure.
import { decide, type Assessment, type ProviderResult, type RuleHit } from "./rules";
import { checkMedia, type StoredImage } from "./media";

export type Snapshot = { id: string; kind: string; status: string; author_id: string; title: string; summary: string; body: string; media: { kind: string; path?: string; url?: string }[]; details: Record<string, string>; fingerprint: string };

export type PipelineDeps = {
  snapshot: (id: string) => Promise<Snapshot | null>;
  readImage: (path: string) => Promise<StoredImage>;
  signImage: (path: string) => Promise<string | null>;
  provider: (text: string, imageUrls: string[]) => Promise<ProviderResult>;
  record: (args: { id: string; fingerprint: string; decision: "publish" | "restrict" | "escalate" | "error"; assessment: Assessment | null; provider: ProviderResult | null; reason: string }) => Promise<string>;
  authorIsStaff: (authorId: string) => Promise<boolean>;
};

export type PipelineOutcome = { status: string; decision: "publish" | "restrict" | "escalate" | "error" | "stale"; reason: string };

export async function runModeration(id: string, deps: PipelineDeps): Promise<PipelineOutcome> {
  const snap = await deps.snapshot(id);
  if (!snap) throw new Error("This contribution could not be found.");
  if (snap.status !== "checking") return { status: snap.status, decision: "stale", reason: "" };
  const text = [snap.title, snap.summary, snap.body, ...Object.entries(snap.details).filter(([k]) => k !== "chapterSlug").map(([, v]) => v)].filter(Boolean).join("\n\n");
  let mediaHits: RuleHit[] = [];
  let imagePaths: string[] = [];
  try {
    ({ hits: mediaHits, imagePaths } = await checkMedia(snap.media, snap.author_id, deps.readImage));
  } catch {
    await deps.record({ id, fingerprint: snap.fingerprint, decision: "error", assessment: null, provider: null, reason: "" });
    return { status: "checking", decision: "error", reason: "We could not check the attachments just now. Your contribution is saved privately. Please try again." };
  }
  const staff = await deps.authorIsStaff(snap.author_id).catch(() => false);
  // A clear local violation needs no external call.
  const local = decide({ text, provider: null, extraHits: mediaHits, authorIsStaff: staff });
  let provider: ProviderResult | null = null;
  if (local.decision !== "restrict") {
    try {
      const urls = (await Promise.all(imagePaths.map((p) => deps.signImage(p)))).filter((u): u is string => Boolean(u));
      if (urls.length !== imagePaths.length) throw new Error("unsigned");
      provider = await deps.provider(text, urls);
    } catch {
      await deps.record({ id, fingerprint: snap.fingerprint, decision: "error", assessment: null, provider: null, reason: "" });
      return { status: "checking", decision: "error", reason: "We could not complete the safety check just now. Your contribution is saved privately and has not been published. Please try again in a moment." };
    }
  }
  const assessment = provider ? decide({ text, provider, extraHits: mediaHits, authorIsStaff: staff }) : local;
  const status = await deps.record({ id, fingerprint: snap.fingerprint, decision: assessment.decision, assessment, provider, reason: assessment.publicReason });
  if (status === "stale") return { status: "checking", decision: "stale", reason: "Your contribution changed while it was being checked. Please publish it again." };
  return { status, decision: assessment.decision, reason: assessment.publicReason };
}
