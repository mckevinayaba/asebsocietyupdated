import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Link, useLocation } from "@/lib/router";
import { useEngagement } from "@/hooks/use-community";
import { reportContent } from "@/lib/community.functions";
import type { FeedItem } from "@/lib/community-data";
import { Sheet } from "@/components/shell/Sheet";
import { AppreciateIcon, DiscussIcon, FlagIcon, SaveIcon, ShareIcon } from "@/components/shell/Icons";

const reasons = [
  { key: "harassment", label: "Harassment or a personal attack" },
  { key: "false_or_misleading", label: "False or misleading" },
  { key: "privacy", label: "Shares someone's private information" },
  { key: "confidential", label: "Confidential information" },
  { key: "spam", label: "Spam or advertising" },
  { key: "other", label: "Something else" },
] as const;

// Appreciate, Discuss, Save, Share and Report. Counts come only from real rows, and nothing is
// shown when there are none. Visitors are sent to sign in and brought back.
export function ActionBar({ item, href, inline = false }: { item: FeedItem; href: string; inline?: boolean }) {
  const engagement = useEngagement([item.id]);
  const { pathname, search } = useLocation();
  const [busy, setBusy] = useState("");
  const [note, setNote] = useState("");
  const [reportOpen, setReportOpen] = useState(false);
  const signInHref = `/auth?redirect=${encodeURIComponent(`${pathname}${search}`)}`;
  const appreciated = engagement.reacted(item.id, "appreciate");
  const saved = engagement.saved(item.id);
  const count = item.engagement?.appreciations ?? 0;
  const responses = item.engagement?.responses ?? 0;

  const run = async (key: string, fn: () => Promise<unknown>) => {
    setBusy(key); setNote("");
    try { await fn(); } catch (error) { setNote(error instanceof Error ? error.message : "That did not work. Please try again."); }
    finally { setBusy(""); }
  };
  const share = async () => {
    const url = `${window.location.origin}${href}`;
    try {
      if (navigator.share) { await navigator.share({ title: item.title || "ASEB Society", url }); return; }
      await navigator.clipboard.writeText(url); setNote("Link copied");
    } catch { /* The visitor cancelled the share sheet. */ }
  };
  const button = `inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-2.5 text-[0.8125rem] font-semibold transition-colors hover:bg-linen disabled:opacity-50`;

  return (
    <div className={inline ? "" : "sm:pt-1"}>
      <div className={`flex ${inline ? "flex-wrap items-center gap-1" : "flex-row flex-wrap gap-1 sm:flex-col sm:items-stretch"}`} aria-label="Actions">
        {engagement.signedIn ? (
          <button type="button" className={`${button} ${appreciated ? "text-ember" : "text-stone"}`} aria-pressed={appreciated} disabled={busy === "a"} onClick={() => run("a", () => engagement.toggleReaction(item.id, "appreciate", !appreciated))}>
            <AppreciateIcon filled={appreciated} width={20} height={20} />{appreciated ? "Appreciated" : "Appreciate"}{count > 0 && <span className="text-stone">· {count}</span>}
          </button>
        ) : (
          <Link to={signInHref} className={`${button} text-stone`}><AppreciateIcon width={20} height={20} />Appreciate{count > 0 && <span>· {count}</span>}</Link>
        )}
        <Link to={href.includes("#") ? href : `${href}#responses`} className={`${button} text-stone`}><DiscussIcon width={20} height={20} />Discuss{responses > 0 && <span>· {responses}</span>}</Link>
        {engagement.signedIn ? (
          <button type="button" className={`${button} ${saved ? "text-ember" : "text-stone"}`} aria-pressed={saved} disabled={busy === "s"} onClick={() => run("s", () => engagement.toggleBookmark(item.id, !saved))}>
            <SaveIcon filled={saved} width={20} height={20} />{saved ? "Saved" : "Save"}
          </button>
        ) : (
          <Link to={signInHref} className={`${button} text-stone`}><SaveIcon width={20} height={20} />Save</Link>
        )}
        <button type="button" className={`${button} text-stone`} onClick={share}><ShareIcon width={20} height={20} />Share</button>
        {engagement.signedIn && <button type="button" className={`${button} text-stone`} onClick={() => setReportOpen(true)}><FlagIcon width={18} height={18} /><span className="sr-only sm:not-sr-only">Report</span></button>}
      </div>
      {note && <p className="mt-1 text-[0.8125rem] text-stone" role="status">{note}</p>}
      <ReportSheet open={reportOpen} onOpenChange={setReportOpen} contentId={item.id} />
    </div>
  );
}

function ReportSheet({ open, onOpenChange, contentId }: { open: boolean; onOpenChange: (open: boolean) => void; contentId: string }) {
  const send = useServerFn(reportContent);
  const [reason, setReason] = useState<(typeof reasons)[number]["key"]>("harassment");
  const [detail, setDetail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  return (
    <Sheet open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setState("idle"); }} title="Report this contribution" description="Moderators review every report. The author is not told who reported it." side="bottom">
      {state === "done" ? <p className="py-6 text-[1rem]" role="status">Thank you. Your report is with the moderators.</p> : (
        <form className="space-y-4 pb-2" onSubmit={async (e) => { e.preventDefault(); setState("busy"); try { await send({ data: { contentId, reason, detail } }); setState("done"); } catch { setState("error"); } }}>
          <fieldset className="space-y-2"><legend className="field-label">What is wrong?</legend>
            {reasons.map((r) => <label key={r.key} className="flex min-h-[44px] items-center gap-3 border-b border-hairline"><input type="radio" name="reason" checked={reason === r.key} onChange={() => setReason(r.key)} />{r.label}</label>)}
          </fieldset>
          <label className="block"><span className="field-label">Anything moderators should know (optional)</span><textarea className="field-input min-h-[88px] py-3" maxLength={1000} value={detail} onChange={(e) => setDetail(e.target.value)} /></label>
          {state === "error" && <p className="text-sm text-ember" role="alert">The report could not be sent. Please try again.</p>}
          <button type="submit" disabled={state === "busy"} className="btn btn-primary w-full">{state === "busy" ? "Sending…" : "Send report"}</button>
        </form>
      )}
    </Sheet>
  );
}
