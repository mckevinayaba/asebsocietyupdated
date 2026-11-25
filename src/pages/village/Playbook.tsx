import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@/lib/router";
import { getChapter, listChapters, listLive } from "@/lib/community-data";
import { playbookChapters, products, tagline } from "@/content/products";
import { useCommunity, useEngagement, EngagementProvider } from "@/hooks/use-community";
import { ContentCard } from "@/components/village/ContentCard";
import { NotYetLive, Prose, timeAgo } from "@/components/village/Primitives";
import { Btn } from "@/components/Arrow";

const statusText: Record<string, string> = {
  proposed: "Proposed topic", open: "Open for contributions", drafting: "Being drafted", in_review: "In editorial review", published: "Published edition", archived: "Archived",
};

// The African Ecosystem Building Playbook: a living publication Africa writes together.
export function PlaybookPage() {
  const community = useCommunity();
  const chapters = useQuery({ queryKey: ["village", "chapters"], queryFn: listChapters, enabled: community.available });
  const list = chapters.data?.length ? chapters.data.map((c) => ({ slug: c.slug, title: c.title, call: c.contribution_call, status: c.status, version: c.current_version }))
    : playbookChapters.map((c) => ({ ...c, status: "proposed", version: 0 }));
  return (
    <>
      <header className="on-dark relative isolate overflow-hidden bg-night text-ivory">
        <div className="wrap grid gap-10 pb-14 pt-14 lg:grid-cols-12 lg:pb-20 lg:pt-20">
          <div className="lg:col-span-7">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-sand">A living, collaborative publication</p>
            <h1 className="mt-5 font-display text-hero">The African Ecosystem Building Playbook</h1>
            <p className="mt-4 font-display text-[1.5rem] italic text-sand">{tagline}</p>
          </div>
          <div className="flex flex-col justify-end lg:col-span-5">
            <p className="text-[1.0625rem] leading-relaxed text-ivory/85">{products.playbook.line} Practitioners, founders, researchers and institutions contribute what they know. Editors weave it into chapters, with every contributor credited and every source kept.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row"><Btn to="/contribute?kind=playbook_contribution" variant="signal">Contribute to a chapter</Btn><Btn to="#chapters" variant="line">Read the chapters</Btn></div>
          </div>
        </div>
      </header>
      <section id="chapters" className="section scroll-mt-24">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <p className="eyebrow">How it works</p>
            <ol className="mt-6 space-y-5 text-[0.9875rem] leading-relaxed text-stone">
              <li><span className="block font-semibold text-ink">You contribute</span>Your experience, a case, a method or evidence, against a chapter's open call.</li>
              <li><span className="block font-semibold text-ink">Editors review</span>They may ask for evidence or clarification. Your original contribution is always preserved.</li>
              <li><span className="block font-semibold text-ink">Chapters evolve</span>Approved material informs versioned chapter drafts, with contributors credited and sources cited.</li>
            </ol>
            <p className="mt-6 border-l-2 border-signal pl-4 text-[0.875rem] text-stone">These are proposed editorial topics. No chapter is an institutional standard until it is published as one. The Playbook draws on the 2017 Kauffman ESHIP Playbook only as a historical reference. It is written from African practice.</p>
          </div>
          <ol className="border-t border-ink lg:col-span-7 lg:col-start-6">
            {list.map((c) => (
              <li key={c.slug} className="border-b border-hairline">
                <Link to={`/playbook/${c.slug}`} className="group grid gap-2 py-5 sm:grid-cols-[1fr_auto] sm:items-baseline">
                  <span><span className="block font-display text-[1.375rem] leading-snug group-hover:text-ember">{c.title}</span><span className="mt-1 block text-[0.875rem] text-stone">{c.call}</span></span>
                  <span className="flex items-center gap-2 whitespace-nowrap text-[0.8125rem]"><span className={`status-dot ${c.status === "published" ? "bg-teal" : c.status === "open" ? "bg-signal" : "border border-stone/50"}`} aria-hidden="true" />{statusText[c.status] ?? c.status}</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
        {!community.available && community.ready && <div className="wrap mt-10"><NotYetLive what="Playbook contributions" /></div>}
      </section>
    </>
  );
}

export function PlaybookChapterPage() {
  const { slug = "" } = useParams();
  const community = useCommunity();
  const fallback = playbookChapters.find((c) => c.slug === slug);
  const chapter = useQuery({ queryKey: ["village", "chapter", slug], queryFn: () => getChapter(slug), enabled: community.available });
  const contributions = useQuery({ queryKey: ["village", "chapter-contributions", chapter.data?.chapter.id], queryFn: () => listLive({ kinds: ["playbook_contribution"], chapterId: chapter.data!.chapter.id, limit: 50 }), enabled: !!chapter.data?.chapter.id });
  const engagement = useEngagement([]);
  const data = chapter.data?.chapter;
  const title = data?.title ?? fallback?.title;
  if (!title) return <div className="wrap py-20"><h1 className="text-display-sm">Chapter not found.</h1><Link to="/playbook" className="tlink mt-6">The Playbook <span className="arr" aria-hidden="true">→</span></Link></div>;
  const call = data?.contribution_call ?? fallback?.call ?? "";
  const status = data?.status ?? "proposed";
  const version = chapter.data?.version;
  const following = data ? engagement.following("chapter", data.slug) : false;
  return (
    <div className="pb-20">
      <header className="border-b border-hairline bg-paper">
        <div className="wrap max-w-[52rem] pb-10 pt-10 lg:pt-16">
          <Link to="/playbook" className="text-[0.875rem] text-stone hover:text-ink">← The African Ecosystem Building Playbook</Link>
          <p className="mt-8 flex items-center gap-2 text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-umber"><span className={`status-dot ${status === "published" ? "bg-teal" : "bg-signal"}`} aria-hidden="true" />{statusText[status]}{version ? ` · Version ${version.version}` : ""}</p>
          <h1 className="mt-4 font-display text-[2.25rem] leading-tight lg:text-[3.25rem]">{title}</h1>
          {data?.introduction && <div className="mt-6 text-[1.0625rem] leading-relaxed text-stone"><Prose text={data.introduction} /></div>}
          <div className="mt-8 border-l-2 border-signal bg-ivory p-5">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-ember">Open contribution call</p>
            <p className="mt-2 font-display text-[1.375rem] leading-snug">{call}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Btn to={`/contribute?kind=playbook_contribution&chapter=${slug}`}>Contribute to this chapter</Btn>
              {engagement.signedIn && data && <button type="button" className="btn btn-line" aria-pressed={following} onClick={() => void engagement.toggleFollow("chapter", data.slug, !following)}>{following ? "Following" : "Follow this chapter"}</button>}
            </div>
          </div>
        </div>
      </header>
      <div className="wrap max-w-[52rem]">
        <section className="mt-12" aria-labelledby="draft-title">
          <h2 id="draft-title" className="font-display text-[1.75rem]">Current text</h2>
          {version ? (<><p className="mt-2 text-[0.875rem] text-stone">Version {version.version}, published {timeAgo(version.created_at)}{version.note ? `. ${version.note}` : ""}</p><div className="mt-6 text-[1.0625rem] leading-relaxed"><Prose text={version.body} /></div></>)
            : <p className="mt-3 text-stone">No version of this chapter has been published yet. It is built from the contributions below as editors review them.</p>}
        </section>
        <section className="mt-14" aria-labelledby="contributions-title">
          <h2 id="contributions-title" className="font-display text-[1.75rem]">Published contributions</h2>
          {!community.available ? <div className="mt-4"><NotYetLive what="Playbook contributions" /></div>
            : contributions.data?.length ? <EngagementProvider ids={contributions.data.map((c) => c.id)}><div className="mt-2">{contributions.data.map((c) => <ContentCard key={c.id} item={c} />)}</div></EngagementProvider>
            : <p className="mt-3 text-stone">No contributions have been published for this chapter yet.</p>}
        </section>
      </div>
    </div>
  );
}
