import { useState } from "react";
import { Link } from "@/lib/router";
import { evidenceLabel, excerpt, kindLabel, permalink, readingMinutes } from "@/lib/community";
import type { FeedItem } from "@/lib/community-data";
import { playbookChapters, voicesCategories } from "@/content/products";
import { Media, Prose, timeAgo } from "./Primitives";
import { ActionBar } from "./ActionBar";

function Byline({ item }: { item: FeedItem }) {
  const a = item.author;
  const name = a?.display_name ?? "ASEB contributor";
  return (
    <p className="text-[0.875rem] leading-snug">
      {a?.profile_id ? <Link to={`/members/${a.profile_id}`} className="font-semibold hover:text-ember">{name}</Link> : <span className="font-semibold">{name}</span>}
      {a?.headline && <span className="text-stone"> · {a.headline}</span>}
      <span className="block text-[0.8125rem] text-stone">{[item.country || a?.country, timeAgo(item.published_at)].filter(Boolean).join(" · ")}</span>
    </p>
  );
}

// Each kind has its own composition. An update reads like a note, a story like an editorial
// piece, research like a citation, an opportunity like a notice with its source and dates.
export function ContentCard({ item, parentSlug }: { item: FeedItem; parentSlug?: string }) {
  const [open, setOpen] = useState(false);
  const href = permalink(item.kind, item.slug, parentSlug);
  const category = voicesCategories.find((c) => c.key === item.voices_category)?.name;

  if (item.kind === "voice") return (
    <article className="grid gap-5 border-b border-hairline py-8 sm:grid-cols-[1fr_auto]">
      <div>
        <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ember">ASEB Voices{category ? ` · ${category}` : ""}</p>
        <h3 className="mt-3 font-display text-[1.75rem] leading-tight"><Link to={href} className="hover:text-ember">{item.title}</Link></h3>
        <p className="mt-3 max-w-prose text-[1rem] leading-relaxed text-stone">{item.summary || excerpt(item.body, 260)}</p>
        <div className="mt-4"><Byline item={item} /></div>
        <p className="mt-2 text-[0.8125rem] text-stone">{readingMinutes(item.body)} min read · {evidenceLabel[item.evidence_class]}</p>
      </div>
      <ActionBar item={item} href={href} />
    </article>
  );

  if (item.kind === "research") return (
    <article className="border-b border-hairline py-7">
      <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-teal">State of the Field · {evidenceLabel[item.evidence_class]}</p>
      <h3 className="mt-3 font-display text-[1.5rem] leading-snug"><Link to={href} className="hover:text-ember">{item.title}</Link></h3>
      <p className="mt-3 max-w-prose text-[0.9875rem] text-stone">{item.summary || excerpt(item.body)}</p>
      <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-[0.8125rem] text-stone">
        {item.details["coverage"] && <div><dt className="inline font-semibold text-ink">Coverage </dt><dd className="inline">{item.details["coverage"]}</dd></div>}
        {item.details["method"] && <div><dt className="inline font-semibold text-ink">Method </dt><dd className="inline">{item.details["method"]}</dd></div>}
        <div><dt className="sr-only">Published</dt><dd>{timeAgo(item.published_at)}</dd></div>
      </dl>
      <div className="mt-4"><ActionBar item={item} href={href} inline /></div>
    </article>
  );

  if (item.kind === "opportunity") return (
    <article className="my-3 grid gap-4 border-l-2 border-signal bg-signal-soft/50 p-5 lg:p-6">
      <div>
        <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ember">Opportunity{item.details["deadline"] ? ` · Closes ${new Date(item.details["deadline"]).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}` : ""}</p>
        <h3 className="mt-2 text-[1.25rem] font-semibold leading-snug"><Link to={href} className="hover:text-ember">{item.title}</Link></h3>
        <p className="mt-2 text-[0.9375rem] text-stone">{excerpt(item.body, 240)}</p>
        <dl className="mt-3 space-y-1 text-[0.8125rem]">
          {item.details["eligibility"] && <div><dt className="inline font-semibold">Eligibility: </dt><dd className="inline text-stone">{item.details["eligibility"]}</dd></div>}
          {item.details["source"] && <div><dt className="inline font-semibold">Source: </dt><dd className="inline"><a href={item.details["source"]} target="_blank" rel="noreferrer" className="break-all underline underline-offset-4">{item.details["source"].replace(/^https?:\/\//, "").slice(0, 60)}</a></dd></div>}
        </dl>
      </div>
      <ActionBar item={item} href={href} inline />
    </article>
  );

  if (item.kind === "question") return (
    <article className="border-b border-hairline py-6">
      <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-teal">Ask the Village</p>
      <h3 className="mt-2 font-display text-[1.5rem] leading-snug"><Link to={href} className="hover:text-ember">{item.title}</Link></h3>
      <p className="mt-2 text-[0.9375rem] text-stone">{excerpt(item.body, 200)}</p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3"><Byline item={item} /><Link to={href} className="tlink text-[0.875rem]">{item.engagement?.responses ? `${item.engagement.responses} answer${item.engagement.responses === 1 ? "" : "s"}` : "Be the first to answer"} <span className="arr" aria-hidden="true">→</span></Link></div>
    </article>
  );

  if (item.kind === "article" || item.kind === "playbook_contribution") return (
    <article className="border-b border-hairline py-7">
      <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-umber">{item.kind === "article" ? "Article" : `Playbook contribution · ${playbookChapters.find((c) => c.slug === item.details["chapterSlug"])?.title ?? "The Playbook"}`}</p>
      <h3 className="mt-2 font-display text-[1.625rem] leading-snug"><Link to={href} className="hover:text-ember">{item.title || excerpt(item.body, 80)}</Link></h3>
      <p className="mt-2 max-w-prose text-[0.9875rem] text-stone">{item.summary || excerpt(item.body, 240)}</p>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4"><Byline item={item} /><ActionBar item={item} href={href} inline /></div>
    </article>
  );

  // Professional updates and responses.
  const long = item.body.length > 420;
  return (
    <article className="border-b border-hairline py-6">
      <Byline item={item} />
      <div className="mt-3 text-[1rem] leading-relaxed">{long && !open ? <p className="whitespace-pre-line">{excerpt(item.body, 400)}</p> : <Prose text={item.body} />}</div>
      {long && <button type="button" onClick={() => setOpen(!open)} className="mt-2 text-[0.875rem] font-semibold text-ember">{open ? "Show less" : "Read more"}</button>}
      {item.media.length > 0 && <div className="mt-4"><Media items={item.media} compact /></div>}
      {item.topics.length > 0 && <p className="mt-3 flex flex-wrap gap-2">{item.topics.map((t) => <span key={t} className="tag">{t}</span>)}</p>}
      <div className="mt-4"><ActionBar item={item} href={href} inline /></div>
      <p className="sr-only">{kindLabel[item.kind]}</p>
    </article>
  );
}
