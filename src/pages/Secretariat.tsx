import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@/lib/router";
import { asset } from "@/lib/asset";
import { addSecretariatNote, getSecretariatNotes, getSecretariatOverview, recordSecretariatExport, setApplicationReviewStage } from "@/lib/secretariat.functions";
import { decisionLabel, matchesQuery, peopleToExportRows, personState, reconcile, reviewStageLabel, reviewStages, toCsv, type NoteSubject, type PersonRow, type ReviewStage } from "@/lib/secretariat";
import { Sheet } from "@/components/shell/Sheet";

type View = "people" | "enquiries" | "interest" | "editorial";
const views: { id: View; label: string }[] = [
  { id: "people", label: "Members and applicants" },
  { id: "enquiries", label: "Partnership enquiries" },
  { id: "interest", label: "Programme interest" },
  { id: "editorial", label: "Pitches and registry" },
];
const enquiryLabel: Record<string, string> = { country_partner_eoi: "Country Partner", ambassador_eoi: "Ambassador", collaboration_eoi: "Programme collaboration", partner_enquiries: "Funding and partnership" };
const fmt = (iso: string | null | undefined) => (iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "");

function download(name: string, csv: string) {
  const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), { href: url, download: name });
  a.click();
  URL.revokeObjectURL(url);
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-30 border-b border-hairline bg-ivory/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-4 px-5 lg:h-16 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5"><img src={asset("images/brand/aseb-society-mark-on-light.png")} alt="" className="h-8 w-auto" /><span className="font-display text-[1.0625rem]">ASEB Society</span><span className="ml-2 hidden border-l border-hairline pl-3 text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-ember sm:inline">Secretariat</span></Link>
          <Link to="/app" className="text-[0.875rem] font-semibold text-stone hover:text-ink">Member app</Link>
        </div>
      </header>
      {children}
    </div>
  );
}

function Notes({ subjectType, subjectId }: { subjectType: NoteSubject; subjectId: string }) {
  const fetchNotes = useServerFn(getSecretariatNotes);
  const saveNote = useServerFn(addSecretariatNote);
  const queryClient = useQueryClient();
  const notes = useQuery({ queryKey: ["secretariat-notes", subjectType, subjectId], queryFn: () => fetchNotes({ data: { subjectType, subjectId } }) });
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <section className="mt-8 border-t border-ink pt-5" aria-label="Internal notes">
      <h3 className="font-semibold">Internal notes</h3>
      <p className="mt-1 text-[0.8125rem] text-stone">Visible to the Secretariat only. Notes cannot be edited or deleted, and each one is recorded in the audit log.</p>
      <form className="mt-4" onSubmit={async (event) => { event.preventDefault(); if (!body.trim() || busy) return; setBusy(true); setError(""); try { await saveNote({ data: { subjectType, subjectId, body } }); setBody(""); await queryClient.invalidateQueries({ queryKey: ["secretariat-notes", subjectType, subjectId] }); } catch { setError("The note could not be saved."); } finally { setBusy(false); } }}>
        <label className="sr-only" htmlFor={`note-${subjectId}`}>Add a note</label>
        <textarea id={`note-${subjectId}`} value={body} onChange={(e) => setBody(e.target.value)} maxLength={4000} rows={3} className="field-input min-h-[96px] py-3" placeholder="Add a note for the review record" />
        {error && <p className="mt-2 text-sm text-ember" role="alert">{error}</p>}
        <button type="submit" disabled={busy || !body.trim()} className="btn btn-primary mt-3 min-h-[44px] disabled:opacity-40">{busy ? "Saving…" : "Add note"}</button>
      </form>
      {notes.isLoading ? <p className="mt-4 text-sm text-stone">Loading notes…</p> : notes.isError ? <p className="mt-4 text-sm text-ember">Notes could not be loaded.</p> : (
        <ul className="mt-5 space-y-3">{(notes.data ?? []).map((note) => <li key={note.id} className="border-l-2 border-hairline pl-4"><p className="whitespace-pre-wrap text-[0.9375rem]">{note.body}</p><p className="mt-1 text-[0.75rem] text-stone">{fmt(note.created_at)}{note.mine ? " · you" : ""}</p></li>)}{!notes.data?.length && <li className="text-sm text-stone">No notes yet.</li>}</ul>
      )}
    </section>
  );
}

function PersonDetail({ person, onStage, notes }: { person: PersonRow; onStage: (id: string, stage: ReviewStage) => Promise<void>; notes: boolean }) {
  const [saving, setSaving] = useState("");
  const application = person.applications[0];
  return (
    <div className="pb-6">
      <p className="text-[0.8125rem] font-semibold text-teal">{personState(person)}</p>
      <dl className="mt-5 grid grid-cols-[8.5rem_1fr] gap-x-4 gap-y-2.5 text-[0.9375rem]">
        <dt className="text-stone">Email</dt><dd className="break-all">{person.email}</dd>
        <dt className="text-stone">Country</dt><dd>{person.country || "Not given"}</dd>
        {person.account && <><dt className="text-stone">Account</dt><dd>Registered {fmt(person.account.created_at)} · {person.account.email_confirmed ? "email verified" : "email not verified"}{person.account.last_sign_in_at ? ` · last sign in ${fmt(person.account.last_sign_in_at)}` : ""}</dd></>}
        <dt className="text-stone">Circle selections</dt><dd>{person.circles.length ? person.circles.join(", ") : "None"}</dd>
      </dl>
      {person.applications.map((a) => (
        <section key={a.id} className="mt-8 border-t border-ink pt-5" aria-label={`Application submitted ${fmt(a.created_at)}`}>
          <div className="flex flex-wrap items-baseline justify-between gap-2"><h3 className="font-semibold">Application · {fmt(a.created_at)}</h3><span className="text-[0.8125rem] text-stone">{decisionLabel[a.status] ?? a.status}</span></div>
          <dl className="mt-4 grid grid-cols-[8.5rem_1fr] gap-x-4 gap-y-2.5 text-[0.9375rem]">
            {[["Type", a.membership_type], ["Intent", a.intent], ["Role", a.role], ["Job title", a.job_title], ["Organisation", a.organisation], ["City", a.city], ["Operates in", a.operating_countries], ["Focus areas", a.focus_areas], ["Profile", a.profile_url], ["Phone", a.phone]].filter(([, v]) => v).map(([k, v]) => <div key={k} className="contents"><dt className="text-stone">{k}</dt><dd className="break-words">{v}</dd></div>)}
          </dl>
          {a.work_description && <p className="mt-4 whitespace-pre-wrap border-l-2 border-signal pl-4 text-[0.9375rem] leading-relaxed">{a.work_description}</p>}
          <label className="mt-5 block"><span className="field-label">Review stage</span>
            <select className="field-input" value={a.review_stage} disabled={!!saving} onChange={async (e) => { setSaving(a.id); try { await onStage(a.id, e.target.value as ReviewStage); } finally { setSaving(""); } }}>
              {reviewStages.map((s) => <option key={s} value={s}>{reviewStageLabel[s]}</option>)}
            </select>
          </label>
          <p className="mt-2 text-[0.8125rem] text-stone">Approval and decline decisions are not available here until the Society's approval authority is formally established.</p>
        </section>
      ))}
      {!notes ? <p className="mt-8 border-t border-ink pt-5 text-[0.875rem] text-stone">Internal notes are switched off in the demonstration preview.</p> : application ? <Notes subjectType="membership_application" subjectId={application.id} /> : person.account ? <Notes subjectType="account" subjectId={person.account.id} /> : null}
    </div>
  );
}

type Overview = Extract<Awaited<ReturnType<typeof getSecretariatOverview>>, { state: "ready" }>;

export default function Secretariat() {
  const fetchOverview = useServerFn(getSecretariatOverview);
  const changeStage = useServerFn(setApplicationReviewStage);
  const logExport = useServerFn(recordSecretariatExport);
  const queryClient = useQueryClient();
  const overview = useQuery({ queryKey: ["secretariat-overview"], queryFn: () => fetchOverview(), staleTime: 0, refetchOnWindowFocus: true });

  if (overview.isLoading) return <Frame><p className="mx-auto max-w-[1400px] px-5 py-16 text-stone lg:px-8" role="status">Checking Secretariat access…</p></Frame>;
  if (overview.isError) return <Frame><div className="mx-auto max-w-2xl px-5 py-16"><h1 className="text-display-sm">The Secretariat workspace could not load.</h1><p className="mt-4 text-stone">Please refresh. If it persists, the database may be unavailable.</p></div></Frame>;
  if (overview.data?.state === "not_provisioned") return <Frame><div className="mx-auto max-w-2xl px-5 py-16"><p className="eyebrow">Setup required</p><h1 className="mt-5 text-display-sm">Secretariat access has not been switched on yet.</h1><p className="mt-4 leading-relaxed text-stone">The database migration that creates Secretariat roles, notes and the audit log has been prepared but not yet applied to Lovable Cloud. Once it is applied and a role is provisioned for your verified account, this workspace will show live membership records. No records are shown until then.</p><p className="mt-4 text-[0.875rem] text-stone">Reference: drizzle/migrations/0006 and docs/DATA_GOVERNANCE.md.</p></div></Frame>;
  if (!overview.data || overview.data.state !== "ready") return <Frame><div className="mx-auto max-w-2xl px-5 py-16"><h1 className="text-display-sm">This workspace is for the ASEB Secretariat.</h1><p className="mt-4 text-stone">Your account does not hold a Secretariat role. Access is granted by the Society's database owner, never through the website.</p><Link to="/app" className="tlink mt-6">Back to the member app <span className="arr" aria-hidden="true">→</span></Link></div></Frame>;

  return (
    <Workspace
      data={overview.data}
      onRefresh={() => void queryClient.invalidateQueries({ queryKey: ["secretariat-overview"] })}
      onStage={async (id, stage) => { await changeStage({ data: { id, stage } }); await queryClient.invalidateQueries({ queryKey: ["secretariat-overview"] }); }}
      onExport={async (rows) => { await logExport({ data: { dataset: "people", rows } }); }}
    />
  );
}

// Presentational workspace. The live page passes database-backed callbacks; the development
// preview passes inert ones and is labelled as demonstration data throughout.
export function Workspace({ data, onRefresh, onStage, onExport, demo = false }: { data: Overview; onRefresh: () => void; onStage: (id: string, stage: ReviewStage) => Promise<void>; onExport: (rows: number) => Promise<void>; demo?: boolean }) {
  const [view, setView] = useState<View>("people");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "applicants" | "accounts-only" | "unmatched">("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [exportError, setExportError] = useState("");
  const people = useMemo(() => reconcile(data.applications, data.accounts, data.circles), [data]);
  const shown = people.filter((p) => matchesQuery(p, query) && (filter === "all" || (filter === "applicants" && p.applications.length > 0) || (filter === "accounts-only" && p.applications.length === 0) || (filter === "unmatched" && p.applications.length > 0 && !p.account)));
  const person = people.find((p) => p.key === selected) ?? null;
  const counts = { applications: data.applications.length, accounts: data.accounts.length, verified: data.accounts.filter((a) => a.email_confirmed).length, circles: new Set(data.circles.map((c) => c.user_id)).size, enquiries: data.enquiries.length };
  const exportPeople = async () => {
    setExportError("");
    const rows = peopleToExportRows(shown);
    try { await onExport(rows.length); download(`aseb-members-and-applicants-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(rows)); } catch { setExportError("The export could not be recorded in the audit log, so it was not started."); }
  };
  return (
    <Frame>
      {demo && <p className="bg-signal px-5 py-2 text-center text-[0.8125rem] font-semibold text-ink" role="note">Development preview with demonstration data. These are not real people or records.</p>}
      <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-8 lg:px-8 lg:pt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="eyebrow">Secretariat</p><h1 className="mt-4 text-display-sm">Membership and enquiries</h1></div>
          <p className="text-[0.8125rem] text-stone">{demo ? "Demonstration data" : "Live from the database"} · loaded {new Date(data.loadedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} · <button type="button" className="underline underline-offset-4 hover:text-ink" onClick={onRefresh}>Refresh</button></p>
        </div>
        <dl className="mt-8 grid grid-cols-2 gap-px border border-hairline bg-hairline sm:grid-cols-5">
          {[["Applications", counts.applications], ["Registered accounts", counts.accounts], ["Verified emails", counts.verified], ["Accounts with Circles", counts.circles], ["Enquiries", counts.enquiries]].map(([k, v]) => <div key={k} className="flex flex-col bg-ivory p-4 last:col-span-2 sm:last:col-span-1"><dt className="order-2 mt-1 text-[0.8125rem] text-stone">{k}</dt><dd className="numeral text-[1.75rem] leading-none">{v}</dd></div>)}
        </dl>

        <div className="no-scrollbar mt-8 flex gap-6 overflow-x-auto border-b border-hairline" role="tablist" aria-label="Secretariat views">
          {views.map((v) => <button key={v.id} role="tab" type="button" aria-selected={view === v.id} onClick={() => setView(v.id)} className={`relative min-h-[44px] shrink-0 whitespace-nowrap text-[0.9375rem] ${view === v.id ? "font-semibold after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-signal" : "text-stone hover:text-ink"}`}>{v.label}</button>)}
        </div>

        {view === "people" && (
          <section className="mt-6" aria-label="Members and applicants">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
              <label className="block flex-1"><span className="field-label">Search names, emails, countries, organisations</span><input type="search" className="field-input bg-ivory" value={query} onChange={(e) => setQuery(e.target.value)} /></label>
              <label className="block lg:w-64"><span className="field-label">Show</span><select className="field-input bg-ivory" value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}><option value="all">Everyone</option><option value="applicants">Applicants</option><option value="unmatched">Applicants without an account</option><option value="accounts-only">Accounts without an application</option></select></label>
              <button type="button" onClick={exportPeople} className="btn btn-line min-h-[48px] bg-ivory">Export CSV</button>
            </div>
            {exportError && <p className="mt-3 text-sm text-ember" role="alert">{exportError}</p>}
            <p className="mt-3 text-[0.8125rem] text-stone">{shown.length} of {people.length} people. Matched on email: one row per person, whether they applied, registered or both.</p>
            <div className="mt-4 overflow-x-auto border border-hairline bg-ivory">
              <table className="w-full min-w-[760px] text-left text-[0.9375rem]">
                <thead className="border-b border-ink text-[0.75rem] uppercase tracking-[0.08em] text-stone"><tr><th className="px-4 py-3 font-semibold">Name</th><th className="px-4 py-3 font-semibold">Country</th><th className="px-4 py-3 font-semibold">State</th><th className="px-4 py-3 font-semibold">Review stage</th><th className="px-4 py-3 font-semibold">Latest activity</th></tr></thead>
                <tbody>
                  {shown.map((p) => {
                    const a = p.applications[0];
                    return (
                      <tr key={p.key} className="border-b border-hairline last:border-0 hover:bg-paper">
                        <td className="px-4 py-3"><button type="button" onClick={() => setSelected(p.key)} className="text-left font-semibold underline-offset-4 hover:text-ember hover:underline">{p.name || "Name not given"}</button><span className="block text-[0.8125rem] text-stone">{p.email}</span></td>
                        <td className="px-4 py-3">{p.country}</td>
                        <td className="px-4 py-3 text-[0.875rem]">{personState(p)}</td>
                        <td className="px-4 py-3 text-[0.875rem]">{a ? reviewStageLabel[a.review_stage as ReviewStage] ?? a.review_stage : "–"}</td>
                        <td className="px-4 py-3 text-[0.875rem] text-stone">{fmt(a?.created_at ?? p.account?.created_at)}</td>
                      </tr>
                    );
                  })}
                  {!shown.length && <tr><td colSpan={5} className="px-4 py-10 text-center text-stone">{people.length ? "No one matches these filters." : "No applications or accounts yet."}</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {view === "enquiries" && (
          <ul className="mt-6 border-t border-ink" aria-label="Partnership enquiries">
            {data.enquiries.map((e) => <li key={e.id} className="grid gap-2 border-b border-hairline py-4 lg:grid-cols-[12rem_1fr_9rem]"><p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-teal">{enquiryLabel[e.kind] ?? e.kind}<span className="block font-normal normal-case tracking-normal text-stone">{e.source}</span></p><div><p className="font-semibold">{e.organisation || e.name || e.email}</p><p className="text-[0.875rem] text-stone">{[e.name, e.email, e.country].filter(Boolean).join(" · ")}</p>{e.summary && <p className="mt-2 line-clamp-3 text-[0.9375rem]">{e.summary}</p>}</div><p className="text-[0.875rem] text-stone">{fmt(e.submittedAt)} · {e.status}</p></li>)}
            {!data.enquiries.length && <li className="py-10 text-stone">No enquiries yet.</li>}
          </ul>
        )}
        {view === "interest" && (
          <ul className="mt-6 border-t border-ink" aria-label="Programme interest">
            {data.interests.map((i) => <li key={i.id} className="grid gap-2 border-b border-hairline py-4 lg:grid-cols-[12rem_1fr_9rem]"><p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-teal">{i.kind.replace(/_/g, " ")}</p><div><p className="font-semibold">{i.name || i.email}</p><p className="text-[0.875rem] text-stone">{[i.organisation, i.country, i.email].filter(Boolean).join(" · ")}{i.linkedAccount ? " · linked to an account" : ""}</p></div><p className="text-[0.875rem] text-stone">{fmt(i.submittedAt)}</p></li>)}
            {!data.interests.length && <li className="py-10 text-stone">No programme interest yet.</li>}
          </ul>
        )}
        {view === "editorial" && (
          <div className="mt-6 grid gap-10 lg:grid-cols-2">
            <section aria-label="Editorial pitches"><h2 className="font-display text-[1.5rem]">Editorial pitches</h2><ul className="mt-4 border-t border-ink">{data.pitches.map((p) => <li key={p.id} className="border-b border-hairline py-4"><p className="font-semibold">{p.title}</p><p className="text-[0.875rem] text-stone">{p.name} · {p.email} · {fmt(p.submittedAt)} · {p.status}</p></li>)}{!data.pitches.length && <li className="py-6 text-stone">No pitches yet.</li>}</ul></section>
            <section aria-label="Registry submissions"><h2 className="font-display text-[1.5rem]">Registry submissions</h2><ul className="mt-4 border-t border-ink">{data.submissions.map((s) => <li key={s.id} className="border-b border-hairline py-4"><p className="font-semibold">{s.name} <span className="font-normal text-stone">· {s.record_type}</span></p><p className="text-[0.875rem] text-stone">{s.country} · {s.role} · from {s.contact_name} · {fmt(s.created_at)} · {s.status}</p></li>)}{!data.submissions.length && <li className="py-6 text-stone">No submissions yet.</li>}</ul></section>
          </div>
        )}
        <p className="mt-12 max-w-3xl text-[0.8125rem] leading-relaxed text-stone">Confidential. Personal information here is protected under the Society's data governance policy. Exports are recorded in the audit log. {data.isAdmin ? "You hold the Secretariat administrator role." : "You hold the Secretariat reviewer role."}</p>
      </div>

      <Sheet open={!!person} onOpenChange={(open) => !open && setSelected(null)} title={person?.name || "Person"} description="Membership record">
        {person && <PersonDetail person={person} onStage={onStage} notes={!demo} />}
      </Sheet>
    </Frame>
  );
}
