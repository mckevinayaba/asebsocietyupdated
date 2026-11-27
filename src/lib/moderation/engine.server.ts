// The trusted moderation engine, wired to the service role and the OpenAI Moderation API.
// Server only (".server.ts"): never imported by browser code, so neither the service role nor the
// OpenAI key can reach a client bundle. It only reads the contribution being checked, never
// account, profile or institutional records.
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { moderateWithOpenAI } from "./provider";
import { runModeration, type PipelineOutcome, type Snapshot } from "./pipeline";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const admin = () => supabaseAdmin as unknown as SupabaseClient<any>;

export async function moderateContribution(id: string): Promise<PipelineOutcome> {
  const db = admin();
  return runModeration(id, {
    snapshot: async (contentId) => {
      const r = await db.rpc("moderation_snapshot", { p_content: contentId });
      if (r.error) throw new Error("snapshot");
      const row = (r.data as Snapshot[] | null)?.[0];
      return row ?? null;
    },
    readImage: async (path) => {
      const r = await db.storage.from("community-media").download(path);
      if (r.error || !r.data) return null;
      const head = new Uint8Array(await r.data.slice(0, 16).arrayBuffer());
      return { size: r.data.size, head };
    },
    // A short-lived address so the moderation service can read a private photograph once.
    signImage: async (path) => {
      const r = await db.storage.from("community-media").createSignedUrl(path, 120);
      return r.error ? null : r.data.signedUrl;
    },
    provider: (text, urls) => moderateWithOpenAI(text, urls),
    authorIsStaff: async (authorId) => {
      const r = await db.from("secretariat_roles").select("user_id").eq("user_id", authorId).limit(1);
      return !r.error && (r.data?.length ?? 0) > 0;
    },
    record: async ({ id: contentId, fingerprint, decision, assessment, provider, reason }) => {
      const r = await db.rpc("moderation_record_decision", {
        p_content: contentId, p_fingerprint: fingerprint, p_decision: decision,
        p_categories: assessment?.categories ?? [], p_rule_hits: assessment?.hits ?? [],
        p_provider: provider?.provider ?? (decision === "error" ? "unavailable" : "aseb-rules"), p_model: provider?.model ?? "",
        p_scores: provider?.scores ?? {}, p_public_reason: reason,
      });
      if (r.error) throw new Error("record");
      return r.data as string;
    },
  });
}
