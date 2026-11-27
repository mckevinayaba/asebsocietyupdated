import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { liftRestriction, resolveAppeal, restrictAccount, recheckContribution, type Appeal, type Assessment, type Restriction } from "@/lib/community.functions";
import { kindLabel, statusLabel, type ContentRow } from "@/lib/community";
import { timeAgo } from "./Primitives";

type Submitter = { content_id: string; author_id?: string; name: string; email: string };
export type ModerationData = { assessments: Assessment[]; appeals: Appeal[]; restrictions: Restriction[]; indicators: Record<string, number> | null };

const ruleLabel = (rule: string) => rule.replace(/^provider:/, "Model: ").replace(/_/g, " ");

// What the automated engine found, for a moderator. Scores and rules stay staff-only.
export function AssessmentSummary({ assessment }: { assessment?: Assessment }) {
  if (!assessment) return null;
  return (
    <section className="border border-hairline bg-paper p-4 text-[0.875rem]" aria-label="Automated assessment">
      <p className="font-semibold">Automated assessment: {assessment.decision === "error" ? "could not complete" : assessment.decision} · <span className="font-normal text-stone">{assessment.model || assessment.provider} · {timeAgo(assessment.created_at)}</span></p>
      {assessment.rule_hits.length > 0 ? (
        <ul className="mt-2 space-y-1">{assessment.rule_hits.map((h, i) => <li key={i}><span className="font-semibold">{ruleLabel(h.rule)}</span> ({h.outcome}): {h.detail}</li>)}</ul>
      ) : <p className="mt-1 text-stone">No rule or category was triggered.</p>}
      {assessment.public_reason && <p className="mt-2 text-stone">Told the author: “{assessment.public_reason}”</p>}
      <p className="mt-2 text-[0.8125rem] text-stone">An automated classification is not a finding of misconduct. Judge the content in its context.</p>
    </section>
  );
}

function Row({ item, submitter, note, onOpen, children }: { item: ContentRow; submitter?: Submitter | undefined; note?: string | undefined; onOpen: () => void; children?: React.ReactNode }) {
  return (
    <li className="grid gap-2 border-b border-hairline py-4 lg:grid-cols-[1fr_auto] lg:items-start">
      <div className="min-w-0">
        <button type="button" onClick={onOpen} className="text-left font-semibold hover:text-ember hover:underline">{item.title || item.body.slice(0, 90)}</button>
        <p className="text-[0.8125rem] text-stone">{kindLabel[item.kind]} · {statusLabel[item.status]} · {submitter?.name || "Unknown"} · {timeAgo(item.updated_at)}</p>
        {note && <p className="mt-1 text-[0.875rem]">{note}</p>}
      </div>
      {children}
    </li>
  );
}

export function ModerationExceptions({ items, submitters, data, onOpen, onChanged }: { items: ContentRow[]; submitters: Submitter[]; data: ModerationData; onOpen: (id: string) => void; onChanged: () => void }) {
  const resolve = useServerFn(resolveAppeal);
  const recheck = useServerFn(recheckContribution);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const latest = (id: string) => data.assessments.find((a) => a.content_id === id);
  const who = (id: string) => submitters.find((s) => s.content_id === id);
  const escalated = items.filter((i) => i.status === "under_review" && latest(i.id));
  const checking = items.filter((i) => i.status === "checking");
  const openAppeals = data.appeals.filter((a) => a.status === "open");
  const run = async (key: string, fn: () => Promise<unknown>) => { setBusy(key); setError(""); try { await fn(); onChanged(); } catch (e) { setError(e instanceof Error ? e.message : "That action could not be completed."); } finally { setBusy(""); } };
  const ind = data.indicators;
  const button = "btn btn-line min-h-[40px] px-3 text-[0.8125rem] disabled:opacity-40";
  return (
    <div className="mt-6 space-y-10">
      {ind && (
        <dl className="grid grid-cols-2 gap-px border border-hairline bg-hairline sm:grid-cols-4" aria-label="Last 30 days">
          {[["Published automatically", ind["published"]], ["Escalated to people", ind["escalated"]], ["Not published", ind["restricted"]], ["Checks that failed", ind["errors"]], ["Waiting for people", ind["waiting_for_people"]], ["Being checked now", ind["checking_now"]], ["Open reports", ind["open_reports"]], ["Open appeals", ind["open_appeals"]]].map(([k, v]) => (
            <div key={String(k)} className="bg-ivory p-4"><dt className="text-[0.75rem] text-stone">{k}</dt><dd className="mt-1 font-display text-[1.75rem] leading-none">{Number(v ?? 0).toLocaleString()}</dd></div>
          ))}
        </dl>
      )}
      <p className="text-[0.8125rem] text-stone">Counts are for the last 30 days, except the waiting, checking and open figures, which are current. Moderators handle the exceptions. Ordinary contributions publish without a person approving them.</p>
      {error && <p className="text-sm text-ember" role="alert">{error}</p>}

      <section aria-labelledby="escalated-title">
        <h2 id="escalated-title" className="font-display text-[1.5rem]">Escalated for a person to judge</h2>
        <ul className="mt-3 border-t border-ink">
          {escalated.map((i) => <Row key={i.id} item={i} submitter={who(i.id)} note={latest(i.id)?.rule_hits.map((h) => ruleLabel(h.rule)).join(", ")} onOpen={() => onOpen(i.id)} />)}
          {!escalated.length && <li className="py-6 text-stone">Nothing is waiting.</li>}
        </ul>
      </section>

      <section aria-labelledby="appeals-title">
        <h2 id="appeals-title" className="font-display text-[1.5rem]">Review requests</h2>
        <ul className="mt-3 border-t border-ink">
          {openAppeals.map((a) => { const item = items.find((i) => i.id === a.content_id); if (!item) return null; return (
            <Row key={a.id} item={item} submitter={who(item.id)} note={a.message ? `The author wrote: “${a.message}”` : "No message from the author."} onOpen={() => onOpen(item.id)}>
              <div className="flex flex-wrap gap-2">
                <button type="button" disabled={!!busy || !item.consent_publish} className={button} onClick={() => run(a.id, () => resolve({ data: { id: a.id, contentId: item.id, outcome: "overturned" } }))}>Publish it</button>
                <button type="button" disabled={!!busy} className={button} onClick={() => run(a.id, () => resolve({ data: { id: a.id, contentId: item.id, outcome: "upheld" } }))}>Keep it unpublished</button>
              </div>
            </Row>
          ); })}
          {!openAppeals.length && <li className="py-6 text-stone">No open requests.</li>}
        </ul>
      </section>

      <section aria-labelledby="checking-title">
        <h2 id="checking-title" className="font-display text-[1.5rem]">Checks that did not finish</h2>
        <p className="mt-1 text-[0.875rem] text-stone">These stay private. Run the check again once the service responds, or open one to decide yourself.</p>
        <ul className="mt-3 border-t border-ink">
          {checking.map((i) => <Row key={i.id} item={i} submitter={who(i.id)} onOpen={() => onOpen(i.id)}><button type="button" disabled={!!busy} className={button} onClick={() => run(i.id, () => recheck({ data: { id: i.id } }))}>{busy === i.id ? "Checking…" : "Check again"}</button></Row>)}
          {!checking.length && <li className="py-6 text-stone">None.</li>}
        </ul>
      </section>
    </div>
  );
}

export function AccountStanding({ submitters, data, onChanged }: { submitters: Submitter[]; data: ModerationData; onChanged: () => void }) {
  const restrict = useServerFn(restrictAccount);
  const lift = useServerFn(liftRestriction);
  const people = [...new Map(submitters.filter((s) => s.author_id).map((s) => [s.author_id!, s])).values()];
  const [userId, setUserId] = useState("");
  const [level, setLevel] = useState<"warning" | "temporary" | "suspended">("warning");
  const [days, setDays] = useState(7);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const name = (id: string) => people.find((p) => p.author_id === id)?.name || "A member";
  const active = data.restrictions.filter((r) => !r.revoked_at && (!r.ends_at || Date.parse(r.ends_at) > Date.now()));
  const submit = async () => {
    setBusy(true); setError("");
    try { await restrict({ data: { userId, level, reason, message, ...(level === "temporary" ? { days } : {}) } }); setReason(""); setMessage(""); onChanged(); }
    catch (e) { setError(e instanceof Error ? e.message : "The restriction could not be saved."); }
    finally { setBusy(false); }
  };
  return (
    <div className="mt-6 grid gap-10 lg:grid-cols-2">
      <section aria-labelledby="active-title">
        <h2 id="active-title" className="font-display text-[1.5rem]">Current account standing</h2>
        <ul className="mt-3 border-t border-ink">
          {active.map((r) => (
            <li key={r.id} className="grid gap-2 border-b border-hairline py-4 sm:grid-cols-[1fr_auto]">
              <div><p className="font-semibold">{name(r.user_id)} · {r.level === "warning" ? "Warning" : r.level === "temporary" ? `Paused until ${new Date(r.ends_at!).toLocaleDateString("en-GB")}` : "Suspended"}</p><p className="text-[0.875rem] text-stone">{r.reason} · {timeAgo(r.created_at)}</p></div>
              {r.level !== "warning" && <button type="button" className="btn btn-line min-h-[40px] px-3 text-[0.8125rem]" onClick={async () => { await lift({ data: { id: r.id } }); onChanged(); }}>Lift</button>}
            </li>
          ))}
          {!active.length && <li className="py-6 text-stone">No current warnings or restrictions.</li>}
        </ul>
      </section>
      <section aria-labelledby="new-restriction-title" className="space-y-4">
        <h2 id="new-restriction-title" className="font-display text-[1.5rem]">Respond to repeated or serious harm</h2>
        <p className="text-[0.875rem] text-stone">Use the lightest response that protects the community. Warnings and pauses can be set by moderators. Only administrators can suspend. Every action is recorded in the audit log, and the person is told.</p>
        <label className="block"><span className="field-label">Person</span><select className="field-input" value={userId} onChange={(e) => setUserId(e.target.value)}><option value="">Choose someone who has contributed</option>{people.map((p) => <option key={p.author_id} value={p.author_id}>{p.name || p.email}</option>)}</select></label>
        <label className="block"><span className="field-label">Response</span><select className="field-input" value={level} onChange={(e) => setLevel(e.target.value as typeof level)}><option value="warning">Warning (can still publish)</option><option value="temporary">Pause publishing for a period</option><option value="suspended">Suspend publishing (administrators)</option></select></label>
        {level === "temporary" && <label className="block"><span className="field-label">Days</span><input type="number" min={1} max={365} className="field-input" value={days} onChange={(e) => setDays(Number(e.target.value))} /></label>}
        <label className="block"><span className="field-label">Reason (staff only)</span><textarea className="field-input min-h-[72px] py-3" maxLength={2000} value={reason} onChange={(e) => setReason(e.target.value)} /></label>
        <label className="block"><span className="field-label">Message to the person (they will see this)</span><textarea className="field-input min-h-[72px] py-3" maxLength={1000} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Explain which guideline applies and what happens next, respectfully." /></label>
        {error && <p className="text-sm text-ember" role="alert">{error}</p>}
        <button type="button" disabled={busy || !userId || reason.length < 3} className="btn btn-primary disabled:opacity-40" onClick={() => void submit()}>{busy ? "Saving…" : "Record response"}</button>
      </section>
    </div>
  );
}
