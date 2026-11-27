import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { BackLink } from "@/components/BackLink";
import { Link, useParams, useSearchParams } from "@/lib/router";
import { feedTabs, forYouOrder, kindLabel, type ContentKind, type FeedTab } from "@/lib/community";
import { BackendUnavailable, getBySlug, listLive } from "@/lib/community-data";
import { products } from "@/content/products";
import { useCommunity, useEngagement, EngagementProvider } from "@/hooks/use-community";
import { useMember } from "@/hooks/use-member";
import { Composer, VillagePanel, Workspace } from "@/components/village/Workspace";
import { ContentCard } from "@/components/village/ContentCard";
import { ContributionEditor } from "@/components/village/ContributionEditor";
import { Media, NotYetLive, Prose, timeAgo } from "@/components/village/Primitives";
import { ActionBar } from "@/components/village/ActionBar";
import { productProblems } from "@/content/proposition";

const tabKinds: Record<FeedTab, ContentKind[]> = {
  "for-you": ["post", "article", "voice", "question", "research", "opportunity", "playbook_contribution"],
  following: ["post", "article", "voice", "question", "research", "opportunity", "playbook_contribution"],
  latest: ["post", "article", "voice", "question", "research", "opportunity", "playbook_contribution"],
  research: ["research"],
  opportunities: ["opportunity"],
};

function FeedTabs({ tab }: { tab: FeedTab }) {
  return (
    <nav aria-label="Feed" className="no-scrollbar -mx-5 mt-6 flex gap-6 overflow-x-auto border-b border-hairline px-5 sm:mx-0 sm:px-0">
      {feedTabs.map((t) => (
        <Link key={t.key} to={t.key === "for-you" ? "/the-field" : `/the-field?tab=${t.key}`} aria-current={tab === t.key ? "page" : undefined}
          className={`relative flex min-h-[44px] shrink-0 items-center whitespace-nowrap text-[0.9375rem] ${tab === t.key ? "font-semibold text-ink after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-signal" : "text-ink/60 hover:text-ink"}`}>
          {t.label}
        </Link>
      ))}
    </nav>
  );
}

export function FieldPage() {
  const [params] = useSearchParams();
  const requested = params.get("tab");
  const tab: FeedTab = feedTabs.some((t) => t.key === requested) ? (requested as FeedTab) : "for-you";
  const { user } = useMember();
  const community = useCommunity();
  const feed = useQuery({ queryKey: ["village", "feed", tab], queryFn: () => listLive({ kinds: tabKinds[tab], limit: 40 }), enabled: community.available, retry: false });
  const ids = useMemo(() => (feed.data ?? []).map((i) => i.id), [feed.data]);
  const engagement = useEngagement([]);
  const items = useMemo(() => {
    const all = feed.data ?? [];
    if (tab === "for-you") return forYouOrder(all, engagement.follows);
    if (tab === "following") {
      const f = engagement.follows;
      return all.filter((i) => f.some((x) => (x.target_type === "profile" && x.target_key === i.author?.profile_id) || (x.target_type === "country" && x.target_key === i.country) || (x.target_type === "topic" && i.topics.includes(x.target_key))));
    }
    return all;
  }, [feed.data, tab, engagement.follows]);

  return (
    <Workspace label="The Field" aside={<VillagePanel />}>
      <header className="mb-6">
        <p className="eyebrow">{products.field.name}</p>
        <h1 className="mt-4 font-display text-[2rem] leading-tight lg:text-[2.5rem]">{products.field.line}</h1>
        <p className="mt-3 max-w-prose text-[0.9375rem] leading-relaxed text-stone">{productProblems.field}</p>
      </header>
      <Composer />
      <FeedTabs tab={tab} />
      {tab === "for-you" && <p className="mt-3 text-[0.8125rem] text-stone">For You shows what matches the people, countries and topics you follow first, then everything else by date. {user ? "" : "Sign in to follow."}</p>}
      <div className="mt-2">
        {!community.ready || feed.isLoading ? <p className="py-10 text-stone" role="status">Loading The Field…</p>
          : !community.available || feed.error instanceof BackendUnavailable ? <div className="mt-6"><NotYetLive what="The Field" /></div>
          : feed.isError ? <p className="py-10 text-ember" role="alert">The Field could not load. Please refresh.</p>
          : items.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-display text-[1.5rem]">{tab === "following" ? "Nothing from the people and places you follow yet." : "Nothing published here yet."}</p>
              <p className="mx-auto mt-3 max-w-md text-stone">{tab === "following" ? "Follow practitioners, countries and topics to shape this view." : "Be the first to share what is happening in your ecosystem."}</p>
            </div>
          ) : (
            <EngagementProvider ids={ids}>
              <div>{items.map((item) => <ContentCard key={item.id} item={item} />)}</div>
            </EngagementProvider>
          )}
      </div>
    </Workspace>
  );
}

// A single contribution with its responses. Used for updates, articles, opportunities and
// Playbook contributions. Stories, questions and research have their own reading pages.
export function FieldItemPage() {
  const { slug = "" } = useParams();
  const community = useCommunity();
  const item = useQuery({ queryKey: ["village", "item", slug], queryFn: () => getBySlug(slug), enabled: community.available, retry: false });
  const responses = useQuery({ queryKey: ["village", "responses", item.data?.id], queryFn: () => listLive({ kinds: ["answer"], parentId: item.data!.id, limit: 100 }), enabled: !!item.data?.id });

  if (!community.ready || item.isLoading) return <Workspace label="The Field"><p className="py-16 text-stone" role="status">Loading…</p></Workspace>;
  if (!community.available) return <Workspace label="The Field"><NotYetLive what="The Field" /></Workspace>;
  const data = item.data;
  if (!data) return <Workspace label="The Field"><div className="py-16"><h1 className="text-display-sm">This contribution is not available.</h1><p className="mt-4 text-stone">It may have been withdrawn by its author, or it is still being reviewed.</p><Link to="/the-field" className="tlink mt-6">Back to The Field <span className="arr" aria-hidden="true">→</span></Link></div></Workspace>;
  const chapter = data.details["chapterSlug"];
  return (
    <Workspace label="The Field">
      <BackLink fallback="/the-field" label="Back" className="mb-6" />
      <article className="max-w-[46rem]">
        <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-umber">{kindLabel[data.kind]}{chapter && <> · <Link to={`/playbook/${chapter}`} className="underline underline-offset-4">Playbook chapter</Link></>}</p>
        {data.title && <h1 className="mt-4 font-display text-[2.25rem] leading-tight lg:text-[3rem]">{data.title}</h1>}
        <p className="mt-4 text-[0.9375rem]"><span className="font-semibold">{data.author?.profile_id ? <Link to={`/members/${data.author.profile_id}`} className="hover:text-ember">{data.author.display_name}</Link> : data.author?.display_name}</span><span className="text-stone"> · {[data.country, timeAgo(data.published_at)].filter(Boolean).join(" · ")}</span></p>
        <div className="mt-8 text-[1.0625rem] leading-relaxed"><Prose text={data.body} /></div>
        {data.kind === "playbook_contribution" && (
          <dl className="mt-8 space-y-5 border-t border-ink pt-6">{["perspective", "challenge", "approach", "outcomes", "lessons", "references"].filter((k) => data.details[k]).map((k) => <div key={k}><dt className="text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-teal">{k}</dt><dd className="mt-1"><Prose text={data.details[k] ?? ""} /></dd></div>)}</dl>
        )}
        {data.kind === "opportunity" && data.details["source"] && <p className="mt-6"><a className="btn btn-primary" href={data.details["source"]} target="_blank" rel="noreferrer">Official source ↗</a></p>}
        {data.media.length > 0 && <div className="mt-8"><Media items={data.media} /></div>}
        <div className="mt-8 border-y border-hairline py-3"><ActionBar item={data} href={`/the-field/${data.slug}`} inline /></div>
        <section id="responses" className="mt-10 scroll-mt-28" aria-labelledby="responses-title">
          <h2 id="responses-title" className="font-display text-[1.75rem]">Responses</h2>
          <EngagementProvider ids={(responses.data ?? []).map((r) => r.id)}>
            {(responses.data ?? []).map((r) => <div key={r.id} id={r.slug}><ContentCard item={r} /></div>)}
          </EngagementProvider>
          {!responses.data?.length && <p className="mt-3 text-stone">No responses yet.</p>}
          <div className="mt-8"><ContributionEditor kind="answer" parentId={data.id} compact /></div>
        </section>
      </article>
    </Workspace>
  );
}
