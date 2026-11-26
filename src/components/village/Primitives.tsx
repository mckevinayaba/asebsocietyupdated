import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "@/lib/router";
import { mediaUrls } from "@/lib/community-data";
import type { MediaItem } from "@/lib/community";

// Plain text with paragraphs, headings ("## "), quotes ("> ") and bullet lists ("- ").
// React escapes everything, so contributor text can never inject markup.
export function Prose({ text, className = "" }: { text: string; className?: string }) {
  const blocks = text.replace(/\r/g, "").split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className={`space-y-5 ${className}`}>
      {blocks.map((block, i) => {
        if (block.startsWith("## ")) return <h2 key={i} className="pt-3 font-display text-[1.625rem] leading-snug">{block.slice(3)}</h2>;
        if (block.startsWith("> ")) return <blockquote key={i} className="border-l-2 border-signal pl-5 font-display text-[1.375rem] italic leading-snug">{block.replace(/^> ?/gm, "")}</blockquote>;
        if (block.split("\n").every((line) => line.startsWith("- "))) return <ul key={i} className="space-y-2">{block.split("\n").map((line, j) => <li key={j} className="flex gap-3"><span className="mt-[0.7em] h-px w-4 shrink-0 bg-ember" aria-hidden="true" />{line.slice(2)}</li>)}</ul>;
        return <p key={i} className="whitespace-pre-line">{block}</p>;
      })}
    </div>
  );
}

export function Media({ items, compact = false }: { items: MediaItem[]; compact?: boolean }) {
  const [urls, setUrls] = useState<Record<string, string>>({});
  const paths = items.filter((m) => m.kind === "image" && m.path).map((m) => m.path as string);
  const key = paths.join("|");
  useEffect(() => { let live = true; if (paths.length) void mediaUrls(paths).then((u) => { if (live) setUrls(u); }); return () => { live = false; }; }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!items.length) return null;
  return (
    <div className={`grid gap-2 ${items.length > 1 ? "grid-cols-2" : ""}`}>
      {items.map((m, i) => m.kind === "image" ? (
        <figure key={i} className={`photo ${compact ? "aspect-[4/3]" : "aspect-[3/2]"}`}>
          {m.path && urls[m.path] ? <img src={urls[m.path]} alt={m.alt} loading="lazy" /> : <div className="grid h-full place-items-center bg-linen text-[0.8125rem] text-stone">Photograph loading</div>}
          {m.credit && <figcaption className="sr-only">Photo: {m.credit}</figcaption>}
        </figure>
      ) : (
        <a key={i} href={m.url} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-4 border border-hairline bg-paper p-4 text-[0.9375rem] hover:border-ink">
          <span><span className="block text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-teal">Video</span><span className="mt-1 block font-semibold group-hover:text-ember">{m.alt || "Watch the video"}</span></span>
          <span aria-hidden="true">↗</span>
        </a>
      ))}
    </div>
  );
}

// Shown only if the community database cannot be reached (migrations 0007 and 0008 are applied in
// Lovable Cloud, so in normal operation this never appears). It is a temporary error with a retry,
// not an "opening soon" promise.
export function NotYetLive({ what, children }: { what: string; children?: ReactNode }) {
  return (
    <div className="border border-hairline bg-paper p-6 lg:p-8" role="alert">
      <p className="font-display text-[1.5rem] leading-snug">{what} could not be loaded just now.</p>
      <p className="mt-3 max-w-prose text-[0.9375rem] leading-relaxed text-stone">This is usually a brief connection problem. Please try again. If it continues, write to <a className="underline underline-offset-4" href="mailto:aseb@asebsociety.org">aseb@asebsociety.org</a>.</p>
      <div className="mt-5 flex flex-wrap gap-3"><button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>Try again</button>{children}</div>
    </div>
  );
}

export function SignInPrompt({ action }: { action: string }) {
  const { pathname, search } = useLocation();
  const redirect = encodeURIComponent(`${pathname}${search}`);
  return (
    <p className="text-[0.9375rem] text-stone">
      <Link to={`/auth?redirect=${redirect}`} className="font-semibold text-ink underline underline-offset-4">Sign in</Link> or{" "}
      <Link to={`/auth?mode=signup&redirect=${redirect}`} className="font-semibold text-ink underline underline-offset-4">create an account</Link> to {action}.
    </p>
  );
}

export function timeAgo(iso: string | null): string {
  if (!iso) return "";
  const seconds = Math.max(0, (Date.now() - Date.parse(iso)) / 1000);
  if (seconds < 3600) return `${Math.max(1, Math.round(seconds / 60))} min ago`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} h ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: seconds > 31_536_000 ? "numeric" : undefined });
}
