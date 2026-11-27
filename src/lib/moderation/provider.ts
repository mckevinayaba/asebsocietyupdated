// The OpenAI Moderation API (omni-moderation-latest). Server only: the key is read from the
// server environment and is never sent to a browser. Only the contribution's own text and images
// are sent, never account, profile or institutional records.
import type { ProviderResult } from "./rules";

export class ModerationUnavailable extends Error {}

export const MODERATION_MODEL = "omni-moderation-latest";

export function moderationConfigured(): boolean {
  return Boolean(process.env["OPENAI_API_KEY"]);
}

type Input = { type: "text"; text: string } | { type: "image_url"; image_url: { url: string } };

async function call(input: Input[], timeoutMs: number): Promise<ProviderResult> {
  const key = process.env["OPENAI_API_KEY"];
  if (!key) throw new ModerationUnavailable("The moderation service is not configured.");
  let response: Response;
  try {
    response = await fetch("https://api.openai.com/v1/moderations", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: MODERATION_MODEL, input }),
      signal: AbortSignal.timeout(timeoutMs),
      redirect: "error",
    });
  } catch {
    throw new ModerationUnavailable("The moderation service did not respond.");
  }
  if (!response.ok) throw new ModerationUnavailable(`The moderation service returned ${response.status}.`);
  const json = (await response.json()) as { model?: string; results?: { flagged: boolean; categories: Record<string, boolean>; category_scores: Record<string, number> }[] };
  const results = json.results ?? [];
  if (results.length === 0) throw new ModerationUnavailable("The moderation service returned no result.");
  // Several inputs can return one combined result or one per input. Combine them conservatively.
  const categories: Record<string, boolean> = {};
  const scores: Record<string, number> = {};
  for (const r of results) {
    for (const [k, v] of Object.entries(r.categories ?? {})) categories[k] = categories[k] === true || v === true;
    for (const [k, v] of Object.entries(r.category_scores ?? {})) scores[k] = Math.max(scores[k] ?? 0, v);
  }
  return { provider: "openai", model: json.model ?? MODERATION_MODEL, flagged: results.some((r) => r.flagged), categories, scores };
}

// Text with the first photograph, then any further photographs one at a time, combined.
export async function moderateWithOpenAI(text: string, imageUrls: string[], timeoutMs = 10_000): Promise<ProviderResult> {
  const first: Input[] = [{ type: "text", text: text.slice(0, 32_000) }];
  if (imageUrls[0]) first.push({ type: "image_url", image_url: { url: imageUrls[0] } });
  const results = [await call(first, timeoutMs)];
  for (const url of imageUrls.slice(1)) results.push(await call([{ type: "image_url", image_url: { url } }], timeoutMs));
  return results.reduce((a, b) => ({
    provider: a.provider, model: a.model, flagged: a.flagged || b.flagged,
    categories: Object.fromEntries([...new Set([...Object.keys(a.categories), ...Object.keys(b.categories)])].map((k) => [k, a.categories[k] === true || b.categories[k] === true])),
    scores: Object.fromEntries([...new Set([...Object.keys(a.scores), ...Object.keys(b.scores)])].map((k) => [k, Math.max(a.scores[k] ?? 0, b.scores[k] ?? 0)])),
  }));
}
