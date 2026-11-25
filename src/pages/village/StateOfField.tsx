import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@/lib/router";
import { evidenceLabel } from "@/lib/community";
import { getBySlug, listLive } from "@/lib/community-data";
import { products } from "@/content/products";
import { evidence as libraryEvidence } from "@/content/evidence";
import { useCommunity, EngagementProvider } from "@/hooks/use-community";
import { ContentCard } from "@/components/village/ContentCard";
import { ActionBar } from "@/components/village/ActionBar";
import { NotYetLive, Prose, timeAgo } from "@/components/village/Primitives";
import { Btn, TLink } from "@/components/Arrow";

const classes = [
  ["Research evidence", "Peer-reviewed or methodologically documented research."],
  ["Documented case", "A described intervention with sources."],
  ["Observation", "A practitioner's observation of conditions, not a measured finding."],
  ["Practitioner experience", "Lived professional experience, clearly attributed."],
];

// State of the Field: evidence and ecosystem intelligence. Every item states its evidence class,
// coverage and method. Observations are never presented as measured outcomes.
export function StateOfFieldPage() {
  const community = useCommunity();
  const research = useQuery({ queryKey: ["village", "research"], queryFn: () => listLive({ kinds: ["research"], limit: 50 }), enabled: community.available });
  return (
    <>
      <header className="border-b border-ink">
        <div className="wrap grid gap-10 pb-12 pt-12 lg:grid-cols-12 lg:pb-16 lg:pt-16">
          <div className="lg:col-span-7"><p className="eyebrow">{products.state.name}</p><h1 className="mt-5 text-display-lg">{products.state.line}</h1></div>
          <div className="flex flex-col justify-end lg:col-span-5"><p className="lede">ASEB Society's evidence and ecosystem intelligence destination. Research, surveys, country observations and cases, each with its source, method and coverage stated.</p><div className="mt-6 flex flex-col gap-3 sm:flex-row"><Btn to="/contribute?kind=research">Submit evidence</Btn><Btn to="/evidence" variant="line">Evidence Library</Btn></div></div>
        </div>
      </header>
      <section className="section-tight border-b border-hairline bg-paper" aria-labelledby="classes-title">
        <div className="wrap">
          <h2 id="classes-title" className="text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-stone">How evidence is classified</h2>
          <dl className="mt-5 grid gap-px border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">{classes.map(([k, v]) => <div key={k} className="bg-ivory p-5"><dt className="font-semibold">{k}</dt><dd className="mt-1 text-[0.9375rem] text-stone">{v}</dd></div>)}</dl>
          <p className="mt-4 text-[0.875rem] text-stone">No national statistics are estimated here. The first continental State of the Field report will be published when its research is complete.</p>
        </div>
      </section>
      <section className="section-tight">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <h2 className="font-display text-[1.75rem]">Published evidence</h2>
            {!community.ready ? <p className="py-8 text-stone">Loading…</p> : !community.available ? <div className="mt-4"><NotYetLive what="State of the Field publishing" /></div>
              : research.data?.length ? <EngagementProvider ids={research.data.map((r) => r.id)}><div className="mt-2">{research.data.map((r) => <ContentCard key={r.id} item={r} />)}</div></EngagementProvider>
              : <p className="mt-3 text-stone">No evidence has been published through State of the Field yet. Submissions are reviewed by an editor before they appear.</p>}
          </div>
          <aside className="lg:col-span-4" aria-label="Evidence Library">
            <h2 className="text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-stone">From the Evidence Library</h2>
            <ul className="mt-4 border-t border-ink">{libraryEvidence.slice(0, 5).map((e) => <li key={e.title} className="border-b border-hairline py-4"><p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-teal">{e.kind} · {e.year}</p><a href={e.href} target="_blank" rel="noreferrer" className="mt-1 block font-semibold leading-snug hover:text-ember">{e.title} ↗</a><p className="mt-1 text-[0.8125rem] text-stone">{e.authors}</p></li>)}</ul>
            <div className="mt-4"><TLink to="/evidence">The full Evidence Library</TLink></div>
          </aside>
        </div>
      </section>
    </>
  );
}

export function ResearchItemPage() {
  const { slug = "" } = useParams();
  const community = useCommunity();
  const item = useQuery({ queryKey: ["village", "item", slug], queryFn: () => getBySlug(slug), enabled: community.available, retry: false });
  if (!community.ready || item.isLoading) return <div className="wrap py-20 text-stone">Loading…</div>;
  if (!community.available) return <div className="wrap max-w-3xl py-16"><NotYetLive what="State of the Field" /></div>;
  const r = item.data;
  if (!r || r.kind !== "research") return <div className="wrap max-w-3xl py-20"><h1 className="text-display-sm">This publication is not available.</h1><Link to="/state-of-the-field" className="tlink mt-6">State of the Field <span className="arr" aria-hidden="true">→</span></Link></div>;
  return (
    <article className="wrap max-w-[52rem] pb-20 pt-10 lg:pt-16">
      <Link to="/state-of-the-field" className="text-[0.875rem] text-stone hover:text-ink">← State of the Field</Link>
      <p className="mt-8 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-teal">{evidenceLabel[r.evidence_class]}</p>
      <h1 className="mt-4 font-display text-[2.25rem] leading-tight lg:text-[3rem]">{r.title}</h1>
      <dl className="mt-8 grid gap-px border border-hairline bg-hairline sm:grid-cols-2">
        {[["Contributed by", r.author?.display_name ?? ""], ["Published", timeAgo(r.published_at)], ["Coverage", r.details["coverage"] ?? "Not stated"], ["Method", r.details["method"] ?? "Not stated"]].map(([k, v]) => <div key={k} className="bg-ivory p-4"><dt className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-stone">{k}</dt><dd className="mt-1">{v}</dd></div>)}
      </dl>
      {r.summary && <p className="mt-8 text-[1.25rem] leading-relaxed">{r.summary}</p>}
      <div className="mt-8 text-[1.0625rem] leading-relaxed"><Prose text={r.body} /></div>
      {r.details["source"] && <p className="mt-8"><a className="btn btn-line" href={r.details["source"]} target="_blank" rel="noreferrer">Original source ↗</a></p>}
      <p className="mt-8 border-l-2 border-signal pl-4 text-[0.875rem] text-stone">Published after editorial review. Classification and method are stated by the contributor and checked by an editor. This is not an ASEB Society finding unless it says so.</p>
      <div className="mt-6 border-y border-hairline py-3"><ActionBar item={r} href={`/state-of-the-field/${r.slug}`} inline /></div>
    </article>
  );
}
