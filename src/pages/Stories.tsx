import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "@/lib/router";
import { useNavigate } from "@tanstack/react-router";
import { asset } from "@/lib/asset";
import { stories, type Story } from "@/content/discover";
import { useSaved } from "@/hooks/use-saved";
import { Sheet } from "@/components/shell/Sheet";
import { CloseIcon, InfoIcon, RelatedIcon, SaveIcon, ShareIcon } from "@/components/shell/Icons";

// Immersive story viewer. Vertical swipe on touch, arrow keys and visible previous and next
// buttons as alternatives. No autoplay, no audio, no counts. Snapping lives only in this viewer.
function Rail({ story, onInfo }: { story: Story; onInfo: () => void }) {
  const { isSaved, toggle } = useSaved();
  const [shared, setShared] = useState("");
  const key = `story:${story.id}`;
  const saved = isSaved(key);
  const share = async () => {
    const url = `${window.location.origin}/stories?story=${story.id}`;
    try {
      if (navigator.share) { await navigator.share({ title: story.title, text: story.kicker, url }); return; }
      await navigator.clipboard.writeText(url);
      setShared("Link copied");
    } catch { setShared(""); }
    window.setTimeout(() => setShared(""), 2200);
  };
  const action = "flex flex-col items-center gap-1 text-[0.6875rem] font-semibold text-ivory";
  const disc = "grid h-12 w-12 place-items-center rounded-full bg-night/45 backdrop-blur-sm transition-colors hover:bg-night/70";
  return (
    <div className="action-rail flex flex-col items-center gap-5" aria-label="Story actions">
      <button type="button" className={action} aria-pressed={saved} onClick={() => toggle({ key, title: story.title, to: `/stories?story=${story.id}`, kind: "Story" })}>
        <span className={`${disc} ${saved ? "text-signal" : ""}`}><SaveIcon filled={saved} /></span>{saved ? "Saved" : "Save"}
      </button>
      <button type="button" className={action} onClick={share}><span className={disc}><ShareIcon /></span>{shared || "Share"}</button>
      <Link to={story.related.to} className={action}><span className={disc}><RelatedIcon /></span>Related</Link>
      <button type="button" className={action} onClick={onInfo}><span className={disc}><InfoIcon /></span>About</button>
    </div>
  );
}

export default function Stories() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const viewer = useRef<HTMLDivElement>(null);
  const requested = Math.max(0, stories.findIndex((s) => s.id === params.get("story")));
  const [index, setIndex] = useState(requested);
  const [info, setInfo] = useState(false);
  const current = stories[index] ?? stories[0]!;

  useEffect(() => {
    const el = viewer.current?.children[requested] as HTMLElement | undefined;
    if (el && viewer.current) viewer.current.scrollTop = el.offsetTop;
  }, [requested]);
  useEffect(() => {
    const root = viewer.current;
    if (!root) return;
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) setIndex(Number((e.target as HTMLElement).dataset["index"])); }), { root, threshold: 0.6 });
    Array.from(root.children).forEach((child) => io.observe(child));
    return () => io.disconnect();
  }, []);
  const go = (step: number) => {
    const next = Math.min(stories.length - 1, Math.max(0, index + step));
    const el = viewer.current?.children[next] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (info) return;
      if (event.key === "ArrowDown" || event.key === "PageDown") { event.preventDefault(); go(1); }
      if (event.key === "ArrowUp" || event.key === "PageUp") { event.preventDefault(); go(-1); }
      if (event.key === "Escape") void navigate({ href: "/discover" });
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  });

  return (
    <main className="fixed inset-0 bg-night text-ivory" aria-roledescription="story viewer" aria-label="Field stories">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 pt-[calc(12px+var(--safe-top))]">
        <p className="pointer-events-auto text-[0.8125rem] font-semibold text-ivory/80" aria-live="polite">Field stories · {index + 1} of {stories.length}</p>
        <Link to="/discover" className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full bg-night/45 backdrop-blur-sm" aria-label="Close stories"><CloseIcon /></Link>
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-[calc(4px+var(--safe-top))] z-20 flex gap-1 px-4" aria-hidden="true">
        {stories.map((s, i) => <span key={s.id} className={`h-[2px] flex-1 rounded-full ${i <= index ? "bg-ivory" : "bg-ivory/25"}`} />)}
      </div>

      <div ref={viewer} className="story-viewer no-scrollbar">
        {stories.map((s, i) => (
          <section key={s.id} data-index={i} className="story-slide relative isolate flex flex-col justify-end overflow-hidden" aria-label={`${s.kicker}: ${s.title}`}>
            {s.photo ? (
              <img src={asset(s.photo)} alt={s.alt ?? ""} loading={Math.abs(i - requested) < 2 ? "eager" : "lazy"} className="absolute inset-0 -z-20 h-full w-full object-cover" style={{ objectPosition: s.position ?? "center" }} />
            ) : (
              <div className="absolute inset-0 -z-20 bg-[radial-gradient(90%_60%_at_70%_25%,color-mix(in_oklab,var(--color-signal)_30%,transparent),transparent_70%)]" aria-hidden="true"><p className="absolute left-5 top-[22%] font-display text-[7rem] leading-none text-ivory/10 sm:text-[10rem]">{s.kicker.split(" ")[0]}</p></div>
            )}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-night)_55%,transparent)_0%,transparent_28%,transparent_45%,var(--color-night)_96%)]" aria-hidden="true" />
            <div className="mx-auto grid w-full max-w-3xl grid-cols-[1fr_auto] items-end gap-5 px-5 pb-[calc(28px+var(--safe-bottom))] sm:px-8">
              <div className="max-w-xl">
                <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-sand">{s.kicker}</p>
                <h2 className="mt-3 font-display text-[2rem] leading-[1.05] sm:text-[2.75rem]">{s.title}</h2>
                <p className="mt-4 text-[0.9875rem] leading-relaxed text-ivory/85">{s.body}</p>
                {s.caption && <p className="mt-4 text-[0.75rem] text-ivory/60">{s.caption} · Photo: ASEB Society</p>}
              </div>
              <Rail story={s} onInfo={() => setInfo(true)} />
            </div>
          </section>
        ))}
      </div>

      <div className="absolute bottom-[calc(28px+var(--safe-bottom))] left-1/2 z-20 hidden -translate-x-1/2 gap-2 md:flex">
        <button type="button" onClick={() => go(-1)} disabled={index === 0} className="h-11 rounded-full bg-night/50 px-4 text-[0.875rem] font-semibold backdrop-blur-sm disabled:opacity-30">↑ Previous</button>
        <button type="button" onClick={() => go(1)} disabled={index === stories.length - 1} className="h-11 rounded-full bg-night/50 px-4 text-[0.875rem] font-semibold backdrop-blur-sm disabled:opacity-30">Next ↓</button>
      </div>
      <p className="sr-only">Use the arrow keys or swipe to move between stories. Press Escape to close.</p>

      <Sheet open={info} onOpenChange={setInfo} title={current.title} description={current.kicker} tone="night" side="bottom">
        <p className="text-[1rem] leading-relaxed text-ivory/85">{current.body}</p>
        <dl className="mt-6 space-y-3 border-t border-night-line pt-5 text-[0.875rem]">
          <div><dt className="font-semibold text-sand">Source</dt><dd className="mt-1"><a className="underline underline-offset-4" href={current.source.href} target={current.source.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{current.source.label}</a></dd></div>
          {current.caption && <div><dt className="font-semibold text-sand">Photograph</dt><dd className="mt-1 text-ivory/75">{current.caption}. Photo: ASEB Society.</dd></div>}
          <div><dt className="font-semibold text-sand">Go further</dt><dd className="mt-1"><Link to={current.related.to} className="underline underline-offset-4">{current.related.label}</Link></dd></div>
        </dl>
      </Sheet>
    </main>
  );
}
