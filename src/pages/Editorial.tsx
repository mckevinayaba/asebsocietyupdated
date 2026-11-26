import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@/lib/router";
import { asset } from "@/lib/asset";
import { decideContent, getEditorialQueue, getReviewHistory, publishChapterVersion, resolveReport, saveCategory, saveChapter, setCommunityMode } from "@/lib/community.functions";
import { evidenceLabel, kindLabel, kindProduct, needsEditor, permalink, statusLabel, type ContentRow } from "@/lib/community";
import { products } from "@/content/products";
import { Sheet } from "@/components/shell/Sheet";
import { Media, Prose, timeAgo } from "@/components/village/Primitives";

type Queue = Extract<Awaited<ReturnType<typeof getEditorialQueue>>, { state: "ready" }>;
type View = "queue" | "published" | "reports" | "chapters" | "categories" | "settings";

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-30 border-b border-hairline bg-ivory/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-4 px-5 lg:h-16 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5"><img src={asset("images/brand/aseb-society-mark-on-light.png")} alt="" className="h-8 w-auto" /><span className="font-display text-[1.0625rem]">ASEB Society</span><span className="ml-2 hidden border-l border-hairline pl-3 text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-ember sm:inline">Editorial</span></Link>
          <nav className="flex gap-5 text-[0.875rem] font-semibold"><Link to="/secretariat" className="text-stone hover:text-ink">Secretariat</Link><Link to="/the-field" className="text-stone hover:text-ink">The Field</Link></nav>
        </div>
      </header>
      {children}
    </div>
  );
}

function ReviewPanel({ item, submitter, isEditor, onDone }: { item: ContentRow; submitter?: { name: string; email: string }; isEditor: boolean; onDone: () => void }) {
  const decide = useServerFn(decideContent);
  const fetchHistory = useServerFn(getReviewHistory);
  const history = useQuery({ queryKey: ["editorial-history", item.id], queryFn: () => fetchHistory({ data: { contentId: item.id } }) });
  const [message, setMessage] = useState("");
  const [note, setNote] = useState("");
  const [when, setWhen] = useState("");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const editorial = needsEditor(item.kind);
  const canDecide = isEditor || !editorial;
  type Decision = "note" | "revision_requested" | "accepted" | "scheduled" | "published" | "declined" | "archived" | "hidden" | "restored" | "featured" | "unfeatured";
  const act = async (decision: Decision) => {
    setBusy(decision); setError("");
    try {
      await decide({ data: { contentId: item.id, decision, messageToAuthor: message, privateNote: note, ...(decision === "scheduled" && when ? { scheduledFor: new Date(when).toISOString() } : {}) } });
      setMessage(""); setNote(""); onDone(); await history.refetch();
    } catch (e) { setError(e instanceof Error ? e.message : "That decision could not be saved."); }
    finally { setBusy(""); }
  };
  const button = "btn min-h-[44px] px-4 text-[0.875rem] disabled:opacity-40";
  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-[0.8125rem] text-stone">
        <span>{products[kindProduct[item.kind]].name} · {kindLabel[item.kind]}</span><span>{statusLabel[item.status]}</span><span>Updated {timeAgo(item.updated_at)}</span>
      </div>
      <dl className="grid grid-cols-[9rem_1fr] gap-x-4 gap-y-2 border-y border-hairline py-4 text-[0.9375rem]">
        <dt className="text-stone">Submitted by</dt><dd>{submitter ? `${submitter.name || "No name"} · ${submitter.email}` : "Unknown"}</dd>
        <dt className="text-stone">Public credit</dt><dd>{item.attribution === "name" ? "Name and profile" : item.attribution === "initials" ? "Initials only" : "Name withheld"}</dd>
        <dt className="text-stone">Permissions</dt><dd>{item.consent_publish ? "May publish" : "No publication consent"} · {item.consent_edit ? "Light edits allowed" : "No edits without the author"}</dd>
        <dt className="text-stone">Evidence</dt><dd>{evidenceLabel[item.evidence_class]}</dd>
        <dt className="text-stone">Visibility</dt><dd>{item.visibility === "public" ? "Everyone" : "Signed-in members"}{item.country ? ` · ${item.country}` : ""}</dd>
      </dl>
      {item.title && <p className="font-display text-[1.75rem] leading-tight">{item.title}</p>}
      <div className="max-h-[40vh] overflow-y-auto border border-hairline bg-ivory p-4 text-[0.9875rem] leading-relaxed"><Prose text={item.body} /></div>
      {Object.keys(item.details).length > 0 && <dl className="space-y-2 text-[0.9375rem]">{Object.entries(item.details).map(([k, v]) => <div key={k}><dt className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-teal">{k}</dt><dd className="whitespace-pre-wrap">{v}</dd></div>)}</dl>}
      {item.media.length > 0 && <Media items={item.media} compact />}
      {!canDecide && <p className="border-l-2 border-signal pl-3 text-[0.875rem]">Editorial decisions on {kindLabel[item.kind].toLowerCase()}s need an editor. You can add notes, hide content and resolve reports.</p>}
      <label className="block"><span className="field-label">Message to the author (they will see this)</span><textarea className="field-input min-h-[80px] py-3" maxLength={2000} value={message} onChange={(e) => setMessage(e.target.value)} /></label>
      <label className="block"><span className="field-label">Private note (staff only)</span><textarea className="field-input min-h-[64px] py-3" maxLength={4000} value={note} onChange={(e) => setNote(e.target.value)} /></label>
      {error && <p className="text-sm text-ember" role="alert">{error}</p>}
      <div className="flex flex-wrap gap-2">
        {canDecide && item.status !== "published" && <button type="button" disabled={!!busy || !item.consent_publish} className={`${button} btn-primary`} onClick={() => act("published")}>Publish now</button>}
        {canDecide && <button type="button" disabled={!!busy} className={`${button} btn-line`} onClick={() => act("revision_requested")}>Request revision</button>}
        {canDecide && editorial && <button type="button" disabled={!!busy} className={`${button} btn-line`} onClick={() => act("accepted")}>Accept</button>}
        {canDecide && <button type="button" disabled={!!busy} className={`${button} btn-line`} onClick={() => act("declined")}>Decline</button>}
        <button type="button" disabled={!!busy} className={`${button} btn-line`} onClick={() => act(item.hidden_by_moderator ? "restored" : "hidden")}>{item.hidden_by_moderator ? "Restore" : "Hide"}</button>
        {isEditor && item.status === "published" && <button type="button" disabled={!!busy} className={`${button} btn-line`} onClick={() => act(item.featured ? "unfeatured" : "featured")}>{item.featured ? "Remove from featured" : "Feature"}</button>}
        <button type="button" disabled={!!busy || !note} className={`${button} btn-line`} onClick={() => act("note")}>Save note only</button>
      </div>
      {canDecide && editorial && (
        <div className="flex flex-wrap items-end gap-2 border-t border-hairline pt-4">
          <label className="block"><span className="field-label">Schedule publication</span><input type="datetime-local" className="field-input" value={when} onChange={(e) => setWhen(e.target.value)} /></label>
          <button type="button" disabled={!!busy || !when || !item.consent_publish} className={`${button} btn-line`} onClick={() => act("scheduled")}>Schedule</button>
        </div>
      )}
      <section className="border-t border-ink pt-4">
        <h3 className="font-semibold">History</h3>
        {history.data ? (
          <ul className="mt-3 space-y-2 text-[0.875rem]">
            {history.data.reviews.map((r) => <li key={String(r["id"])} className="border-l-2 border-hairline pl-3"><span className="font-semibold">{String(r["decision"]).replace(/_/g, " ")}</span> · {timeAgo(String(r["created_at"]))}{r["message_to_author"] ? <span className="block text-stone">To author: {String(r["message_to_author"])}</span> : null}{r["private_note"] ? <span className="block text-stone">Note: {String(r["private_note"])}</span> : null}</li>)}
            {history.data.revisions.slice(0, 6).map((r) => <li key={`rev-${String(r["id"])}`} className="text-stone">Revision saved as {String(r["status"]).replace(/_/g, " ")} · {timeAgo(String(r["created_at"]))}</li>)}
          </ul>
        ) : <p className="mt-2 text-[0.875rem] text-stone">Loading…</p>}
      </section>
      {item.status === "published" && <Link to={permalink(item.kind, item.slug)} className="tlink text-[0.875rem]">View the published page <span className="arr" aria-hidden="true">→</span></Link>}
    </div>
  );
}

function Chapters({ data, onSaved }: { data: Queue; onSaved: () => void }) {
  const save = useServerFn(saveChapter);
  const publish = useServerFn(publishChapterVersion);
  const [editing, setEditing] = useState<Queue["chapters"][number] | null>(null);
  const [draft, setDraft] = useState({ title: "", introduction: "", contributionCall: "", status: "open", position: 0, version: "", note: "" });
  const [error, setError] = useState("");
  const open = (c: Queue["chapters"][number]) => { setEditing(c); setDraft({ title: c.title, introduction: c.introduction, contributionCall: c.contribution_call, status: c.status, position: c.position, version: "", note: "" }); setError(""); };
  return (
    <div>
      <p className="text-[0.9375rem] text-stone">Reorder by position, change status, edit calls and publish new chapter versions. Unpublished chapters are never presented as institutional standards.</p>
      <ul className="mt-5 border-t border-ink">{data.chapters.map((c) => <li key={c.id} className="flex flex-wrap items-baseline justify-between gap-3 border-b border-hairline py-4"><span><span className="font-semibold">{c.title}</span><span className="block text-[0.8125rem] text-stone">Position {c.position} · {c.status.replace(/_/g, " ")} · version {c.current_version}</span></span>{data.isEditor && <button type="button" className="text-[0.875rem] font-semibold underline underline-offset-4" onClick={() => open(c)}>Edit</button>}</li>)}</ul>
      <Sheet open={!!editing} onOpenChange={(v) => !v && setEditing(null)} title={editing?.title ?? "Chapter"} description="Changes are recorded in the audit log.">
        {editing && (
          <form className="space-y-4 pb-6" onSubmit={async (e) => { e.preventDefault(); setError(""); try {
            await save({ data: { id: editing.id, slug: editing.slug, title: draft.title, position: draft.position, introduction: draft.introduction, contributionCall: draft.contributionCall, status: draft.status as "open" } });
            if (draft.version.trim().length >= 20) await publish({ data: { chapterId: editing.id, body: draft.version, note: draft.note, publish: true } });
            setEditing(null); onSaved();
          } catch (err) { setError(err instanceof Error ? err.message : "Could not save."); } }}>
            <label className="block"><span className="field-label">Title</span><input className="field-input" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></label>
            <div className="grid grid-cols-2 gap-3"><label className="block"><span className="field-label">Position</span><input type="number" className="field-input" value={draft.position} onChange={(e) => setDraft({ ...draft, position: Number(e.target.value) })} /></label><label className="block"><span className="field-label">Status</span><select className="field-input" value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}>{["proposed", "open", "drafting", "in_review", "published", "archived"].map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}</select></label></div>
            <label className="block"><span className="field-label">Introduction</span><textarea className="field-input min-h-[100px] py-3" value={draft.introduction} onChange={(e) => setDraft({ ...draft, introduction: e.target.value })} /></label>
            <label className="block"><span className="field-label">Open contribution call</span><textarea className="field-input min-h-[72px] py-3" value={draft.contributionCall} onChange={(e) => setDraft({ ...draft, contributionCall: e.target.value })} /></label>
            <label className="block"><span className="field-label">Publish a new chapter version (optional)</span><textarea className="field-input min-h-[160px] py-3" placeholder="Leave empty to keep the current version." value={draft.version} onChange={(e) => setDraft({ ...draft, version: e.target.value })} /></label>
            {draft.version && <label className="block"><span className="field-label">Version note</span><input className="field-input" value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} /></label>}
            {error && <p className="text-sm text-ember" role="alert">{error}</p>}
            <button type="submit" className="btn btn-primary">Save chapter</button>
          </form>
        )}
      </Sheet>
    </div>
  );
}

function Categories({ data, onSaved }: { data: Queue; onSaved: () => void }) {
  const save = useServerFn(saveCategory);
  const [draft, setDraft] = useState({ key: "", name: "", description: "" });
  const [error, setError] = useState("");
  return (
    <div className="space-y-6">
      <ul className="border-t border-ink">{data.categories.map((c) => <li key={c.key} className="flex flex-wrap items-baseline justify-between gap-3 border-b border-hairline py-4"><span><span className="font-semibold">{c.name}</span><span className="block text-[0.8125rem] text-stone">{c.description}</span></span>{data.isEditor && <button type="button" className="text-[0.875rem] underline underline-offset-4" onClick={async () => { await save({ data: { key: c.key, name: c.name, description: c.description, position: c.position, active: !c.active, isNew: false } }); onSaved(); }}>{c.active ? "Deactivate" : "Activate"}</button>}</li>)}</ul>
      {data.isEditor && (
        <form className="grid gap-3 border border-hairline bg-ivory p-4 sm:grid-cols-3" onSubmit={async (e) => { e.preventDefault(); setError(""); try { await save({ data: { ...draft, position: data.categories.length + 1, active: true, isNew: true } }); setDraft({ key: "", name: "", description: "" }); onSaved(); } catch (err) { setError(err instanceof Error ? err.message : "Could not save."); } }}>
          <label className="block"><span className="field-label">Key</span><input className="field-input" pattern="[a-z][a-z0-9-]{1,40}" value={draft.key} onChange={(e) => setDraft({ ...draft, key: e.target.value })} /></label>
          <label className="block"><span className="field-label">Name</span><input className="field-input" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></label>
          <label className="block"><span className="field-label">Description</span><input className="field-input" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></label>
          {error && <p className="text-sm text-ember sm:col-span-3">{error}</p>}
          <button type="submit" className="btn btn-primary sm:col-span-3 sm:justify-self-start">Add category</button>
        </form>
      )}
    </div>
  );
}

export default function Editorial() {
  const fetchQueue = useServerFn(getEditorialQueue);
  const resolve = useServerFn(resolveReport);
  const setMode = useServerFn(setCommunityMode);
  const queryClient = useQueryClient();
  const queue = useQuery({ queryKey: ["editorial-queue"], queryFn: () => fetchQueue(), refetchOnWindowFocus: true });
  const [view, setView] = useState<View>("queue");
  const [product, setProduct] = useState<string>("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [modeError, setModeError] = useState("");
  const refresh = () => void queryClient.invalidateQueries({ queryKey: ["editorial-queue"] });
  const qd = queue.data;
  const data = (qd && qd.state === "ready" ? qd : null) as Queue | null;
  const rows = useMemo(() => {
    if (!data) return [];
    const base = data.items.filter((i) => product === "all" || kindProduct[i.kind] === product);
    return view === "published" ? base.filter((i) => i.status === "published" || i.status === "scheduled") : base.filter((i) => ["submitted", "under_review", "revision_requested", "accepted"].includes(i.status));
  }, [data, product, view]);

  if (queue.isLoading) return <Frame><p className="mx-auto max-w-[1400px] px-5 py-16 text-stone lg:px-8">Checking editorial access…</p></Frame>;
  if (queue.data?.state === "not_provisioned") return <Frame><div className="mx-auto max-w-2xl px-5 py-16"><p className="eyebrow">Setup required</p><h1 className="mt-5 text-display-sm">The editorial workspace is not switched on yet.</h1><p className="mt-4 text-stone">It needs migrations 0007 and 0008 to be applied to Lovable Cloud, and an editor or moderator role provisioned. See docs/DATA_GOVERNANCE.md.</p></div></Frame>;
  if (!data) return <Frame><div className="mx-auto max-w-2xl px-5 py-16"><h1 className="text-display-sm">This workspace is for ASEB Society editors and moderators.</h1><p className="mt-4 text-stone">Roles are granted by the Society's database owner, never through the website.</p></div></Frame>;
  const item = data.items.find((i) => i.id === selected) ?? null;
  const openReports = data.reports.filter((r) => r.status === "open");
  const views: [View, string][] = [["queue", `Review queue (${data.items.filter((i) => ["submitted", "under_review", "revision_requested", "accepted"].includes(i.status)).length})`], ["published", "Published"], ["reports", `Reports (${openReports.length})`], ["chapters", "Playbook chapters"], ["categories", "Voices categories"], ["settings", "Community settings"]];

  return (
    <Frame>
      <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-8 lg:px-8 lg:pt-10">
        <p className="eyebrow">Editorial</p>
        <h1 className="mt-4 text-display-sm">Review, publish and moderate</h1>
        <p className="mt-2 text-[0.9375rem] text-stone">Community publishing is <strong>{data.communityMode === "open" ? "open" : "pre-moderated"}</strong>. You are {data.isEditor ? "an editor" : "a moderator"}.</p>
        <div className="no-scrollbar mt-8 flex gap-6 overflow-x-auto border-b border-hairline" role="tablist">
          {views.map(([key, label]) => <button key={key} role="tab" type="button" aria-selected={view === key} onClick={() => setView(key)} className={`relative min-h-[44px] shrink-0 whitespace-nowrap text-[0.9375rem] ${view === key ? "font-semibold after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-signal" : "text-stone hover:text-ink"}`}>{label}</button>)}
        </div>

        {(view === "queue" || view === "published") && (
          <section className="mt-6">
            <div className="no-scrollbar flex gap-2 overflow-x-auto" role="group" aria-label="Product">{["all", "field", "voices", "playbook", "ask", "state"].map((p) => <button key={p} type="button" aria-pressed={product === p} onClick={() => setProduct(p)} className={`min-h-[40px] shrink-0 border px-3.5 text-[0.8125rem] font-semibold ${product === p ? "border-ink bg-ink text-ivory" : "border-hairline bg-ivory text-stone"}`}>{p === "all" ? "All products" : products[p as keyof typeof products].name}</button>)}</div>
            <div className="mt-4 overflow-x-auto border border-hairline bg-ivory">
              <table className="w-full min-w-[720px] text-left text-[0.9375rem]">
                <thead className="border-b border-ink text-[0.75rem] uppercase tracking-[0.08em] text-stone"><tr><th className="px-4 py-3 font-semibold">Contribution</th><th className="px-4 py-3 font-semibold">Submitted by</th><th className="px-4 py-3 font-semibold">Status</th><th className="px-4 py-3 font-semibold">Updated</th></tr></thead>
                <tbody>
                  {rows.map((r) => { const s = data.submitters.find((x) => x.content_id === r.id); return (
                    <tr key={r.id} className="border-b border-hairline last:border-0 hover:bg-paper">
                      <td className="px-4 py-3"><button type="button" onClick={() => setSelected(r.id)} className="text-left font-semibold hover:text-ember hover:underline">{r.title || r.body.slice(0, 70)}</button><span className="block text-[0.8125rem] text-stone">{products[kindProduct[r.kind]].name} · {kindLabel[r.kind]}{r.hidden_by_moderator ? " · hidden" : ""}{r.featured ? " · featured" : ""}</span></td>
                      <td className="px-4 py-3 text-[0.875rem]">{s?.name || "Unknown"}</td>
                      <td className="px-4 py-3 text-[0.875rem]">{statusLabel[r.status]}</td>
                      <td className="px-4 py-3 text-[0.875rem] text-stone">{timeAgo(r.updated_at)}</td>
                    </tr>
                  ); })}
                  {!rows.length && <tr><td colSpan={4} className="px-4 py-10 text-center text-stone">{view === "queue" ? "Nothing is waiting for review." : "Nothing published yet."}</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {view === "reports" && (
          <ul className="mt-6 border-t border-ink">
            {data.reports.map((r) => { const target = data.items.find((i) => i.id === r.content_id); return (
              <li key={r.id} className="grid gap-2 border-b border-hairline py-4 lg:grid-cols-[1fr_auto]">
                <div><p className="font-semibold">{r.reason.replace(/_/g, " ")} · <span className="font-normal text-stone">{r.status} · {timeAgo(r.created_at)}</span></p>{r.detail && <p className="mt-1 text-[0.9375rem]">{r.detail}</p>}{target && <button type="button" className="mt-1 text-[0.875rem] underline underline-offset-4" onClick={() => setSelected(target.id)}>Open: {target.title || target.body.slice(0, 60)}</button>}</div>
                {r.status === "open" && <div className="flex gap-2"><button type="button" className="btn btn-line min-h-[40px] px-3 text-[0.8125rem]" onClick={async () => { await resolve({ data: { id: r.id, status: "actioned" } }); refresh(); }}>Mark actioned</button><button type="button" className="btn btn-line min-h-[40px] px-3 text-[0.8125rem]" onClick={async () => { await resolve({ data: { id: r.id, status: "dismissed" } }); refresh(); }}>Dismiss</button></div>}
              </li>
            ); })}
            {!data.reports.length && <li className="py-10 text-stone">No reports.</li>}
          </ul>
        )}
        {view === "chapters" && <div className="mt-6"><Chapters data={data} onSaved={refresh} /></div>}
        {view === "categories" && <div className="mt-6"><Categories data={data} onSaved={refresh} /></div>}
        {view === "settings" && (
          <section className="mt-6 max-w-2xl">
            <h2 className="font-display text-[1.5rem]">Community publishing</h2>
            <p className="mt-2 text-[0.9375rem] text-stone">While pre-moderated, community posts, questions and answers appear only after a moderator publishes them. Open publishing should be switched on only after the Society approves its community guidelines, contributor terms and privacy notice. Stories, Playbook contributions, research and opportunities always need an editor.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" className={`btn ${data.communityMode === "pre_moderated" ? "btn-primary" : "btn-line"}`} onClick={async () => { setModeError(""); try { await setMode({ data: { mode: "pre_moderated" } }); refresh(); } catch (e) { setModeError(e instanceof Error ? e.message : "Not allowed."); } }}>Pre-moderated</button>
              <button type="button" className={`btn ${data.communityMode === "open" ? "btn-primary" : "btn-line"}`} onClick={async () => { if (!window.confirm("Open community publishing? Confirm the community guidelines have been approved.")) return; setModeError(""); try { await setMode({ data: { mode: "open" } }); refresh(); } catch (e) { setModeError(e instanceof Error ? e.message : "Not allowed."); } }}>Open</button>
            </div>
            {modeError && <p className="mt-3 text-sm text-ember" role="alert">{modeError}</p>}
            <p className="mt-3 text-[0.8125rem] text-stone">Only Secretariat administrators can change this. Every change is recorded in the audit log.</p>
          </section>
        )}
      </div>
      <Sheet open={!!item} onOpenChange={(v) => !v && setSelected(null)} title={item ? kindLabel[item.kind] : ""} description="Editorial review">
        {item && <ReviewPanel item={item} {...(data.submitters.find((s) => s.content_id === item.id) ? { submitter: data.submitters.find((s) => s.content_id === item.id)! } : {})} isEditor={data.isEditor} onDone={refresh} />}
      </Sheet>
    </Frame>
  );
}
