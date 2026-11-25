import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@/lib/router";
import { supabase } from "@/integrations/supabase/client";
import { contributionSchema, evidenceLabel, kindLabel, type ContentKind, type EvidenceClass, type MediaItem } from "@/lib/community";
import { saveContribution } from "@/lib/community.functions";
import { founderTopics, playbookChapters, voicesCategories } from "@/content/products";
import { africanCountries } from "@/content/countries";
import { useMember } from "@/hooks/use-member";
import { useCommunity } from "@/hooks/use-community";
import { Media, NotYetLive, Prose, SignInPrompt } from "./Primitives";

type Props = { kind: ContentKind; parentId?: string; chapterSlug?: string; category?: string; compact?: boolean; onDone?: (result: { slug: string; status: string }) => void };

const guidance: Partial<Record<ContentKind, { title: string; body: string }>> = {
  post: { title: "", body: "What is happening in your ecosystem?" },
  article: { title: "Title", body: "Write your article. Use a blank line between paragraphs, \"## \" for a heading and \"> \" for a quotation." },
  voice: { title: "Title of your story", body: "Tell your story in your own words: the people, the place, what happened, what you learned." },
  playbook_contribution: { title: "A short title for your contribution", body: "Describe the context and what you did." },
  question: { title: "Your question", body: "Give enough context for people to help: where you work, what you have tried, what is stuck." },
  answer: { title: "", body: "Share what you know from experience. Say what worked, what did not, and why." },
  research: { title: "Title of the evidence or publication", body: "Summarise the findings for practitioners." },
  opportunity: { title: "Name of the opportunity", body: "What is offered, who it is for and how to apply." },
};

const playbookFields = [
  ["perspective", "Your professional perspective"], ["challenge", "The challenge"], ["approach", "The intervention or approach"], ["outcomes", "What you observed"], ["lessons", "Lessons learned"], ["references", "Supporting references (links or citations)"],
] as const;

const DRAFT_KEY = (kind: string, scope: string) => `aseb-draft-${kind}-${scope}`;

// One editor for every contribution type. Drafts are kept on the device while writing so an
// interrupted session is not lost, and can be saved to the account as drafts at any time.
export function ContributionEditor({ kind, parentId, chapterSlug, category, compact = false, onDone }: Props) {
  const { user, ready } = useMember();
  const community = useCommunity();
  const save = useServerFn(saveContribution);
  const queryClient = useQueryClient();
  const scope = parentId ?? chapterSlug ?? category ?? "new";
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [summary, setSummary] = useState("");
  const [voicesCategory, setVoicesCategory] = useState(category ?? "");
  const [chapter, setChapter] = useState(chapterSlug ?? "");
  const [country, setCountry] = useState("");
  const [topics, setTopics] = useState("");
  const [evidence, setEvidence] = useState<EvidenceClass>(kind === "research" ? "research_evidence" : "practitioner_experience");
  const [details, setDetails] = useState<Record<string, string>>({});
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [visibility, setVisibility] = useState<"public" | "community">("public");
  const [attribution, setAttribution] = useState<"name" | "initials" | "anonymous">("name");
  const [consentPublish, setConsentPublish] = useState(false);
  const [consentEdit, setConsentEdit] = useState(false);
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState<"" | "draft" | "submit" | "upload">("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ slug: string; status: string } | null>(null);
  const [savedId, setSavedId] = useState<string | undefined>();
  const restored = useRef(false);
  const editorial = !["post", "question", "answer"].includes(kind);

  // Restore an unfinished draft from this device, then keep saving it as the person types.
  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY(kind, scope));
      if (!raw) return;
      const d = JSON.parse(raw) as Record<string, unknown>;
      if (typeof d["title"] === "string") setTitle(d["title"]);
      if (typeof d["body"] === "string") setBody(d["body"]);
      if (typeof d["summary"] === "string") setSummary(d["summary"]);
      if (d["details"] && typeof d["details"] === "object") setDetails(d["details"] as Record<string, string>);
    } catch { /* Storage can be unavailable; the editor still works. */ }
  }, [kind, scope]);
  useEffect(() => {
    if (!restored.current || result) return;
    const t = window.setTimeout(() => { try { window.localStorage.setItem(DRAFT_KEY(kind, scope), JSON.stringify({ title, body, summary, details })); } catch { /* ignore */ } }, 400);
    return () => window.clearTimeout(t);
  }, [title, body, summary, details, kind, scope, result]);

  const payload = useMemo(() => ({
    id: savedId, kind, title, summary, body,
    voicesCategory: kind === "voice" ? voicesCategory || undefined : undefined,
    chapterSlug: kind === "playbook_contribution" ? chapter || undefined : undefined,
    parentId, country, topics: topics.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 8),
    evidenceClass: kind === "voice" && voicesCategory === "founders" && evidence === "practitioner_experience" ? "founder_perspective" as const : evidence,
    details, media, visibility, attribution, consentPublish: kind === "post" || kind === "answer" ? true : consentPublish, consentEdit,
  }), [savedId, kind, title, summary, body, voicesCategory, chapter, parentId, country, topics, evidence, details, media, visibility, attribution, consentPublish, consentEdit]);

  if (!ready) return null;
  if (!user) return <div className="border border-hairline bg-paper p-6"><SignInPrompt action={kind === "answer" ? "answer" : "contribute"} /></div>;
  if (community.ready && !community.available) return <NotYetLive what={`Contributing to ${kindLabel[kind] === "Update" ? "The Field" : kindLabel[kind]}`} />;

  const submit = async (asDraft: boolean) => {
    setError("");
    const parsed = contributionSchema.safeParse({ ...payload, submit: !asDraft });
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Please check the form."); return; }
    setBusy(asDraft ? "draft" : "submit");
    try {
      const saved = await save({ data: { ...payload, submit: !asDraft } });
      setSavedId(saved.id);
      await queryClient.invalidateQueries({ queryKey: ["village"] });
      if (!asDraft) {
        try { window.localStorage.removeItem(DRAFT_KEY(kind, scope)); } catch { /* ignore */ }
        setResult(saved);
        onDone?.(saved);
      } else setError("Draft saved to your account. Only you can see it.");
    } catch (e) { setError(e instanceof Error ? e.message : "Your contribution could not be saved."); }
    finally { setBusy(""); }
  };

  const upload = async (file: File) => {
    setError("");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { setError("Use a JPEG, PNG or WebP photograph."); return; }
    if (file.size > 5 * 1024 * 1024) { setError("Photographs must be 5 MB or smaller."); return; }
    if (media.length >= 6) { setError("Up to six photographs or videos per contribution."); return; }
    setBusy("upload");
    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("community-media").upload(path, file, { contentType: file.type, upsert: false });
    setBusy("");
    if (uploadError) { setError("The photograph could not be uploaded. Confirm your email address, then try again."); return; }
    setMedia((m) => [...m, { kind: "image", path, alt: "", credit: "" }]);
  };

  if (result) {
    const live = result.status === "published";
    return (
      <div className="border-t border-ink pt-6" role="status">
        <p className="eyebrow">{live ? "Published" : "Received"}</p>
        <p className="mt-4 font-display text-[1.75rem] leading-tight">{live ? "Your contribution is live." : editorial ? "Your contribution is with the editors." : "Your contribution is with the moderators."}</p>
        <p className="mt-3 max-w-prose text-[0.9375rem] leading-relaxed text-stone">{live ? "Thank you for adding your voice to the village." : "You can follow its progress in My contributions. You will be notified in the platform when an editor responds. Email notifications are not active yet."}</p>
        <div className="mt-5 flex flex-wrap gap-3"><Link to="/you?tab=contributions" className="btn btn-primary">My contributions</Link><button type="button" className="btn btn-line" onClick={() => { setResult(null); setSavedId(undefined); setTitle(""); setBody(""); setSummary(""); setMedia([]); setDetails({}); }}>Write another</button></div>
      </div>
    );
  }

  const g = guidance[kind] ?? { title: "Title", body: "" };
  const field = (label: string, child: React.ReactNode, hint?: string) => <label className="block"><span className="field-label">{label}</span>{child}{hint && <span className="mt-1.5 block text-[0.8125rem] text-stone">{hint}</span>}</label>;

  return (
    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); void submit(false); }} noValidate>
      {community.mode === "pre_moderated" && <p className="border-l-2 border-signal pl-4 text-[0.875rem] text-stone">{editorial ? "Every contribution of this kind is reviewed by an editor before publication." : "While community guidelines are being finalised, every contribution is reviewed by a moderator before it appears."} <Link to="/community-guidelines" className="underline underline-offset-4">Community guidelines</Link></p>}

      {kind === "voice" && field("Voices category", <select required className="field-input" value={voicesCategory} onChange={(e) => setVoicesCategory(e.target.value)}><option value="">Choose a category</option>{voicesCategories.map((c) => <option key={c.key} value={c.key}>{c.name}</option>)}</select>, voicesCategories.find((c) => c.key === voicesCategory)?.description)}
      {kind === "voice" && voicesCategory === "founders" && <div className="bg-paper p-4 text-[0.875rem]"><p className="font-semibold">Founders' Voices: you might write about</p><ul className="mt-2 grid gap-1 text-stone sm:grid-cols-2">{founderTopics.map((t) => <li key={t}>{t}</li>)}</ul><p className="mt-3 text-stone">Your account is published as your perspective. It is not presented as independently verified evidence, and institutions are never rated or ranked.</p></div>}
      {kind === "playbook_contribution" && field("Chapter", <select required className="field-input" value={chapter} onChange={(e) => setChapter(e.target.value)}><option value="">Choose a chapter</option>{playbookChapters.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}</select>, playbookChapters.find((c) => c.slug === chapter)?.call)}

      {g.title && field(g.title, <input className="field-input" maxLength={200} value={title} onChange={(e) => setTitle(e.target.value)} />)}

      {preview ? (
        <div className="min-h-[200px] border border-hairline bg-paper p-5"><p className="mb-3 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-stone">Preview</p>{title && <p className="font-display text-[1.75rem] leading-tight">{title}</p>}<div className="mt-3"><Prose text={body || "Nothing written yet."} /></div>{media.length > 0 && <div className="mt-4"><Media items={media} /></div>}</div>
      ) : (
        <label className="block"><span className={g.title ? "field-label" : "sr-only"}>{kind === "post" ? "What is happening in your ecosystem?" : "Your text"}</span>
          <textarea className={`field-input py-3 leading-relaxed ${compact ? "min-h-[140px]" : kind === "post" || kind === "answer" ? "min-h-[180px]" : "min-h-[320px] lg:min-h-[420px]"}`} placeholder={g.body} value={body} onChange={(e) => setBody(e.target.value)} maxLength={kind === "post" ? 3000 : 60000} />
          <span className="mt-1.5 flex justify-between text-[0.8125rem] text-stone"><span>{kind === "post" ? "Up to 3,000 characters." : "Plain text. Blank lines separate paragraphs."}</span><span aria-live="polite">{body.length.toLocaleString()}</span></span>
        </label>
      )}

      {kind === "playbook_contribution" && <div className="grid gap-5 sm:grid-cols-2">{playbookFields.map(([key, label]) => <label key={key} className="block"><span className="field-label">{label}</span><textarea className="field-input min-h-[96px] py-3" maxLength={4000} value={details[key] ?? ""} onChange={(e) => setDetails((d) => ({ ...d, [key]: e.target.value }))} /></label>)}</div>}
      {kind === "opportunity" && <div className="grid gap-5 sm:grid-cols-2">{field("Official source link", <input type="url" className="field-input" placeholder="https://" value={details["source"] ?? ""} onChange={(e) => setDetails((d) => ({ ...d, source: e.target.value }))} />)}{field("Closing date", <input type="date" className="field-input" value={details["deadline"] ?? ""} onChange={(e) => setDetails((d) => ({ ...d, deadline: e.target.value }))} />)}{field("Who is eligible", <input className="field-input" maxLength={400} value={details["eligibility"] ?? ""} onChange={(e) => setDetails((d) => ({ ...d, eligibility: e.target.value }))} />)}{field("Offered by", <input className="field-input" maxLength={200} value={details["organisation"] ?? ""} onChange={(e) => setDetails((d) => ({ ...d, organisation: e.target.value }))} />)}</div>}
      {kind === "research" && <div className="grid gap-5 sm:grid-cols-2">{field("Evidence type", <select className="field-input" value={evidence} onChange={(e) => setEvidence(e.target.value as EvidenceClass)}>{(["research_evidence", "documented_case", "observation", "practitioner_experience"] as const).map((k) => <option key={k} value={k}>{evidenceLabel[k]}</option>)}</select>)}{field("Geographic coverage", <input className="field-input" maxLength={300} value={details["coverage"] ?? ""} onChange={(e) => setDetails((d) => ({ ...d, coverage: e.target.value }))} />)}{field("Method", <input className="field-input" maxLength={400} value={details["method"] ?? ""} onChange={(e) => setDetails((d) => ({ ...d, method: e.target.value }))} />, "For example: survey of 40 hubs, interviews, administrative data.")}{field("Source or publication link", <input type="url" className="field-input" placeholder="https://" value={details["source"] ?? ""} onChange={(e) => setDetails((d) => ({ ...d, source: e.target.value }))} />)}</div>}
      {editorial && !compact && kind !== "opportunity" && field("Short summary (optional)", <textarea className="field-input min-h-[80px] py-3" maxLength={600} value={summary} onChange={(e) => setSummary(e.target.value)} />, "Shown in previews and when shared.")}

      {(kind === "post" || kind === "article" || kind === "voice") && (
        <div className="space-y-3">
          {media.length > 0 && <ul className="space-y-3">{media.map((m, i) => <li key={i} className="grid gap-3 border border-hairline p-3 sm:grid-cols-[140px_1fr]"><Media items={[m]} compact /><div className="space-y-2"><label className="block"><span className="field-label">{m.kind === "image" ? "Describe the photograph" : "Title of the video"}</span><input className="field-input" maxLength={300} value={m.alt} onChange={(e) => setMedia((all) => all.map((x, j) => j === i ? { ...x, alt: e.target.value } : x))} /></label>{m.kind === "image" && <label className="block"><span className="field-label">Photo credit</span><input className="field-input" maxLength={200} value={m.credit} onChange={(e) => setMedia((all) => all.map((x, j) => j === i ? { ...x, credit: e.target.value } : x))} /></label>}<button type="button" className="text-[0.875rem] text-ember underline underline-offset-4" onClick={() => setMedia((all) => all.filter((_, j) => j !== i))}>Remove</button></div></li>)}</ul>}
          <div className="flex flex-wrap gap-3">
            <label className="btn btn-line cursor-pointer">{busy === "upload" ? "Uploading…" : "Add a photograph"}<input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) void upload(f); e.target.value = ""; }} /></label>
            <button type="button" className="btn btn-line" onClick={() => { const url = window.prompt("Paste a YouTube or Vimeo link"); if (url) setMedia((m) => [...m, { kind: "video_link", url: url.trim(), alt: "", credit: "" }]); }}>Add a video link</button>
          </div>
          <p className="text-[0.8125rem] text-stone">Only share photographs you took or have permission to use. Photographs stay private until your contribution is published.</p>
        </div>
      )}

      {!compact && (
        <div className="grid gap-5 sm:grid-cols-2">
          {field("Country or ecosystem", <select className="field-input" value={country} onChange={(e) => setCountry(e.target.value)}><option value="">Continental or not specific</option>{africanCountries.map((c) => <option key={c}>{c}</option>)}<option>Diaspora, outside Africa</option></select>)}
          {field("Topics (comma separated)", <input className="field-input" maxLength={300} value={topics} onChange={(e) => setTopics(e.target.value)} placeholder="investment readiness, rural hubs" />)}
          {field("Who can see it once published", <select className="field-input" value={visibility} onChange={(e) => setVisibility(e.target.value as "public" | "community")}><option value="public">Everyone</option><option value="community">Signed-in members of the community</option></select>)}
          {field("How you are credited", <select className="field-input" value={attribution} onChange={(e) => setAttribution(e.target.value as "name" | "initials" | "anonymous")}><option value="name">My name and profile</option><option value="initials">My initials only</option><option value="anonymous">Name withheld</option></select>, "Editors always know who submitted it.")}
        </div>
      )}

      {editorial && (
        <fieldset className="space-y-3 border-t border-hairline pt-5">
          <legend className="sr-only">Permissions</legend>
          <label className="flex gap-3 text-[0.9375rem]"><input type="checkbox" className="mt-1" checked={consentPublish} onChange={(e) => setConsentPublish(e.target.checked)} />I give ASEB Society permission to publish this contribution on its platforms, credited as I chose above. I keep ownership of my work and can withdraw it at any time.</label>
          <label className="flex gap-3 text-[0.9375rem]"><input type="checkbox" className="mt-1" checked={consentEdit} onChange={(e) => setConsentEdit(e.target.checked)} />Editors may make light edits for clarity and length. Without this, any change is sent back to me first.</label>
          <p className="text-[0.8125rem] text-stone">Do not include confidential information or name private individuals without their permission. Serious allegations are reviewed carefully and may not be published.</p>
        </fieldset>
      )}

      {error && <p className={`text-[0.9375rem] ${error.startsWith("Draft saved") ? "text-teal" : "text-ember"}`} role={error.startsWith("Draft saved") ? "status" : "alert"}>{error}</p>}
      <div className="sticky bottom-[calc(var(--bottom-nav-h)+var(--safe-bottom))] z-10 -mx-1 flex flex-wrap items-center gap-3 bg-ivory/95 px-1 py-3 backdrop-blur-sm lg:bottom-0">
        <button type="submit" disabled={!!busy} className="btn btn-primary">{busy === "submit" ? "Sending…" : editorial || community.mode === "pre_moderated" ? "Submit for review" : "Publish"}</button>
        <button type="button" disabled={!!busy} className="btn btn-line" onClick={() => void submit(true)}>{busy === "draft" ? "Saving…" : "Save draft"}</button>
        <button type="button" className="text-[0.875rem] font-semibold text-stone underline underline-offset-4" onClick={() => setPreview(!preview)}>{preview ? "Edit" : "Preview"}</button>
      </div>
    </form>
  );
}
