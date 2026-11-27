import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@/lib/router";
import { supabase } from "@/integrations/supabase/client";
import { contributionSchema, evidenceLabel, kindLabel, needsEditor, type ContentKind, type ContentRow, type EvidenceClass, type MediaItem } from "@/lib/community";
import { getMyProfile, recheckContribution, requestModerationReview, saveContribution } from "@/lib/community.functions";
import { founderTopics, playbookChapters, voicesCategories } from "@/content/products";
import { africanCountries } from "@/content/countries";
import { useMember } from "@/hooks/use-member";
import { useCommunity } from "@/hooks/use-community";
import { Media, NotYetLive, Prose, SignInPrompt } from "./Primitives";

type Outcome = { id: string; slug: string; status: string; decision?: string | null; reason?: string };

// Photographs are re-drawn before upload, which removes embedded metadata such as the location a
// phone records. If the browser cannot re-draw the file, the original is uploaded unchanged.
async function withoutMetadata(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width; canvas.height = bitmap.height;
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, file.type, 0.9));
    return blob && blob.size > 0 && blob.size <= 5 * 1024 * 1024 ? new File([blob], file.name, { type: file.type }) : file;
  } catch { return file; }
}

type Props = { kind: ContentKind; parentId?: string; chapterSlug?: string; category?: string; compact?: boolean; initial?: ContentRow; onDone?: (result: { slug: string; status: string }) => void };

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
export function ContributionEditor({ kind, parentId, chapterSlug, category, compact = false, initial, onDone }: Props) {
  const { user, ready } = useMember();
  const community = useCommunity();
  const save = useServerFn(saveContribution);
  const recheck = useServerFn(recheckContribution);
  const askReview = useServerFn(requestModerationReview);
  const fetchProfile = useServerFn(getMyProfile);
  const me = useQuery({ queryKey: ["village", "my-profile"], queryFn: () => fetchProfile(), enabled: !!user, staleTime: 5 * 60_000, retry: false });
  const [videoOpen, setVideoOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [appeal, setAppeal] = useState("");
  const [appealSent, setAppealSent] = useState(false);
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
  const [result, setResult] = useState<Outcome | null>(null);
  const [savedId, setSavedId] = useState<string | undefined>();
  const restored = useRef(false);
  // Continue editing an existing draft or a submission returned for revision.
  useEffect(() => {
    if (!initial) return;
    restored.current = true;
    setSavedId(initial.id); setTitle(initial.title); setBody(initial.body); setSummary(initial.summary);
    setVoicesCategory(initial.voices_category ?? ""); setChapter(initial.details["chapterSlug"] ?? ""); setCountry(initial.country);
    setTopics(initial.topics.join(", ")); setEvidence(initial.evidence_class); setDetails(initial.details); setMedia(initial.media);
    setVisibility(initial.visibility); setAttribution(initial.attribution); setConsentPublish(initial.consent_publish); setConsentEdit(initial.consent_edit);
  }, [initial]);
  // Editorial kinds always go to editors. Articles and opportunities ask for explicit permission.
  const editorial = needsEditor(kind);
  const asksConsent = !["post", "question", "answer"].includes(kind);
  const automated = community.mode === "automated" && !editorial;

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
      const saved: Outcome = await save({ data: { ...payload, submit: !asDraft } });
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
    const clean = await withoutMetadata(file);
    const { error: uploadError } = await supabase.storage.from("community-media").upload(path, clean, { contentType: file.type, upsert: false });
    setBusy("");
    if (uploadError) { setError("The photograph could not be uploaded. Confirm your email address, then try again."); return; }
    setMedia((m) => [...m, { kind: "image", path, alt: "", credit: "" }]);
  };

  const startAgain = () => { setResult(null); setSavedId(undefined); setTitle(""); setBody(""); setSummary(""); setMedia([]); setDetails({}); setAppeal(""); setAppealSent(false); };
  const retry = async () => {
    if (!result) return;
    setBusy("submit"); setError("");
    try { const r = await recheck({ data: { id: result.id } }); setResult({ ...result, ...r }); await queryClient.invalidateQueries({ queryKey: ["village"] }); }
    catch (e) { setError(e instanceof Error ? e.message : "Please try again in a moment."); }
    finally { setBusy(""); }
  };
  const sendAppeal = async () => {
    if (!result) return;
    setBusy("submit"); setError("");
    try { await askReview({ data: { id: result.id, message: appeal } }); setAppealSent(true); }
    catch (e) { setError(e instanceof Error ? e.message : "Your request could not be sent."); }
    finally { setBusy(""); }
  };

  if (result) {
    const s = result.status;
    const heading = s === "published" ? "Published." : s === "restricted" ? "Not published." : s === "checking" ? "Saved privately. Not published yet." : s === "under_review" && !editorial ? "A moderator is taking a quick look." : editorial ? "Your contribution is with the editors." : "Your contribution is with the moderators.";
    const line = s === "published" ? "Your contribution is live. Thank you for adding your voice to the village."
      : s === "restricted" ? result.reason || "It may not meet the Community Guidelines."
      : s === "checking" ? result.reason || "We could not complete the safety check just now."
      : s === "under_review" && !editorial ? `${result.reason ? `${result.reason} ` : ""}It stays private until then, and you will be notified in the platform.`
      : "You can follow its progress in My contributions. You will be notified in the platform when an editor responds.";
    return (
      <div className="border-t border-ink pt-6" role="status" aria-live="polite">
        <p className="eyebrow">{s === "published" ? "Published" : s === "restricted" ? "Not published" : s === "checking" ? "Not published" : "Received"}</p>
        <p className="mt-4 font-display text-[1.75rem] leading-tight">{heading}</p>
        <p className="mt-3 max-w-prose text-[0.9375rem] leading-relaxed text-stone">{line}</p>
        {s === "restricted" && <p className="mt-2 max-w-prose text-[0.875rem] text-stone">This was an automated assessment, not a judgement about you. You can change your contribution and publish it again, or ask a person to look at it.</p>}
        {error && <p className="mt-3 text-[0.9375rem] text-ember" role="alert">{error}</p>}
        {s === "restricted" && !appealSent && (
          <div className="mt-5 max-w-prose space-y-3">
            <label className="block"><span className="field-label">Ask for a human review (optional note)</span><textarea className="field-input min-h-[80px] py-3" maxLength={1500} value={appeal} onChange={(e) => setAppeal(e.target.value)} placeholder="Add any context that would help a moderator understand your contribution." /></label>
          </div>
        )}
        {appealSent && <p className="mt-4 text-[0.9375rem] text-teal">A moderator will review it. You will be notified in the platform.</p>}
        <div className="mt-5 flex flex-wrap gap-3">
          {s === "published" && <Link to={kind === "answer" ? "/ask" : "/the-field"} className="btn btn-primary">See it in the village</Link>}
          {s === "checking" && <button type="button" disabled={!!busy} className="btn btn-primary" onClick={() => void retry()}>{busy ? "Checking…" : "Try again"}</button>}
          {s === "restricted" && <button type="button" className="btn btn-primary" onClick={() => { setResult(null); setError(""); }}>Edit and publish again</button>}
          {s === "restricted" && !appealSent && <button type="button" disabled={!!busy} className="btn btn-line" onClick={() => void sendAppeal()}>Ask for a human review</button>}
          {s !== "published" && <Link to="/you?tab=contributions" className={s === "checking" || s === "restricted" ? "btn btn-line" : "btn btn-primary"}>My contributions</Link>}
          <button type="button" className="btn btn-line" onClick={startAgain}>Write another</button>
        </div>
      </div>
    );
  }

  const g = guidance[kind] ?? { title: "Title", body: "" };
  const field = (label: string, child: React.ReactNode, hint?: string) => <label className="block"><span className="field-label">{label}</span>{child}{hint && <span className="mt-1.5 block text-[0.8125rem] text-stone">{hint}</span>}</label>;

  return (
    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); void submit(false); }} noValidate>
      {automated && <p className="text-[0.8125rem] text-stone">Publishing follows the <Link to="/community-guidelines" className="underline underline-offset-4">Community Guidelines</Link>. Contributions are checked automatically, and a moderator looks at anything uncertain. Criticism and debate are welcome.</p>}
      {(community.mode === "pre_moderated" || editorial) && <p className="border-l-2 border-signal pl-4 text-[0.875rem] text-stone">{editorial ? "Every contribution of this kind is reviewed by an editor before publication." : "While community guidelines are being finalised, every contribution is reviewed by a moderator before it appears."} <Link to="/community-guidelines" className="underline underline-offset-4">Community guidelines</Link></p>}

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
      {asksConsent && !compact && kind !== "opportunity" && field("Short summary (optional)", <textarea className="field-input min-h-[80px] py-3" maxLength={600} value={summary} onChange={(e) => setSummary(e.target.value)} />, "Shown in previews and when shared.")}

      {(kind === "post" || kind === "article" || kind === "voice") && (
        <div className="space-y-3">
          {media.length > 0 && <ul className="space-y-3">{media.map((m, i) => <li key={i} className="grid gap-3 border border-hairline p-3 sm:grid-cols-[140px_1fr]"><Media items={[m]} compact /><div className="space-y-2"><label className="block"><span className="field-label">{m.kind === "image" ? "Describe the photograph" : "Title of the video"}</span><input className="field-input" maxLength={300} value={m.alt} onChange={(e) => setMedia((all) => all.map((x, j) => j === i ? { ...x, alt: e.target.value } : x))} /></label>{m.kind === "image" && <label className="block"><span className="field-label">Photo credit</span><input className="field-input" maxLength={200} value={m.credit} onChange={(e) => setMedia((all) => all.map((x, j) => j === i ? { ...x, credit: e.target.value } : x))} /></label>}<button type="button" className="text-[0.875rem] text-ember underline underline-offset-4" onClick={() => setMedia((all) => all.filter((_, j) => j !== i))}>Remove</button></div></li>)}</ul>}
          <div className="flex flex-wrap gap-3">
            <label className="btn btn-line cursor-pointer">{busy === "upload" ? "Uploading…" : "Add a photograph"}<input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) void upload(f); e.target.value = ""; }} /></label>
            <button type="button" className="btn btn-line" aria-expanded={videoOpen} onClick={() => setVideoOpen((v) => !v)}>Add a video link</button>
          </div>
          {videoOpen && (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <label className="block flex-1"><span className="field-label">YouTube or Vimeo link</span><input type="url" inputMode="url" className="field-input" placeholder="https://www.youtube.com/watch?v=…" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} /></label>
              <button type="button" className="btn btn-line" onClick={() => { const url = videoUrl.trim(); if (!/^https:\/\/(www\.|m\.)?(youtube\.com|youtu\.be|vimeo\.com)\//.test(url)) { setError("Video links must be YouTube or Vimeo addresses starting with https://"); return; } setMedia((m) => [...m, { kind: "video_link", url, alt: "", credit: "" }]); setVideoUrl(""); setVideoOpen(false); setError(""); }}>Attach</button>
            </div>
          )}
          <p className="text-[0.8125rem] text-stone">Only share photographs you took or have permission to use. Location details stored in photographs are removed before upload. Photographs stay private until your contribution is published.</p>
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

      {asksConsent && (
        <fieldset className="space-y-3 border-t border-hairline pt-5">
          <legend className="sr-only">Permissions</legend>
          <label className="flex gap-3 text-[0.9375rem]"><input type="checkbox" className="mt-1" checked={consentPublish} onChange={(e) => setConsentPublish(e.target.checked)} />I give ASEB Society permission to publish this contribution on its platforms, credited as I chose above. I keep ownership of my work and can withdraw it at any time.</label>
          <label className="flex gap-3 text-[0.9375rem]"><input type="checkbox" className="mt-1" checked={consentEdit} onChange={(e) => setConsentEdit(e.target.checked)} />Editors may make light edits for clarity and length. Without this, any change is sent back to me first.</label>
          <p className="text-[0.8125rem] text-stone">Do not include confidential information or name private individuals without their permission. Serious allegations are reviewed carefully and may not be published.</p>
        </fieldset>
      )}

      {error && <p className={`text-[0.9375rem] ${error.startsWith("Draft saved") ? "text-teal" : "text-ember"}`} role={error.startsWith("Draft saved") ? "status" : "alert"}>{error}</p>}
      <p className="text-[0.8125rem] text-stone">Publishing as <span className="font-semibold text-ink">{attribution === "anonymous" ? "Name withheld" : attribution === "initials" ? "your initials" : (me.data?.available && me.data.profile?.name) || "your account name"}</span>{attribution === "name" && me.data?.available && me.data.profile?.headline ? `, ${me.data.profile.headline}` : ""} · Visible to {visibility === "public" ? "everyone" : "signed-in members"}</p>
      <div className="sticky bottom-[calc(var(--bottom-nav-h)+var(--safe-bottom))] z-10 -mx-1 flex flex-wrap items-center gap-3 bg-ivory/95 px-1 py-3 backdrop-blur-sm lg:bottom-0">
        <button type="submit" disabled={!!busy} className="btn btn-primary">{busy === "submit" ? (automated ? "Publishing…" : "Sending…") : automated ? "Publish" : "Submit for review"}</button>
        <button type="button" disabled={!!busy} className="btn btn-line" onClick={() => void submit(true)}>{busy === "draft" ? "Saving…" : "Save draft"}</button>
        <button type="button" className="text-[0.875rem] font-semibold text-stone underline underline-offset-4" onClick={() => setPreview(!preview)}>{preview ? "Edit" : "Preview"}</button>
      </div>
    </form>
  );
}
