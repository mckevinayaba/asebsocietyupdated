import { useQuery } from "@tanstack/react-query";
import { Link, useParams, useSearchParams } from "@/lib/router";
import { asset } from "@/lib/asset";
import { evidenceLabel, excerpt, readingMinutes } from "@/lib/community";
import { getBySlug, listCategories, listLive } from "@/lib/community-data";
import { founderTopics, products, voicesCategories } from "@/content/products";
import { stories } from "@/content/discover";
import { useCommunity, EngagementProvider } from "@/hooks/use-community";
import { ContentCard } from "@/components/village/ContentCard";
import { ContributionEditor } from "@/components/village/ContributionEditor";
import { ActionBar } from "@/components/village/ActionBar";
import { Media, NotYetLive, Prose, timeAgo } from "@/components/village/Primitives";
import { Btn } from "@/components/Arrow";

// ASEB Voices: a premium editorial publication. Warm paper, generous serif typography and a
// masthead identity distinct from The Field, while clearly part of ASEB Society.
export function VoicesPage() {
  const [params] = useSearchParams();
  const community = useCommunity();
  const categoryParam = params.get("category") ?? "";
  const dbCategories = useQuery({ queryKey: ["village", "categories"], queryFn: listCategories, enabled: community.available });
  const categories = dbCategories.data?.length ? dbCategories.data : voicesCategories.map((c, i) => ({ ...c, position: i, active: true }));
  const category = categories.find((c) => c.key === categoryParam);
  const featured = useQuery({ queryKey: ["village", "voices-featured"], queryFn: () => listLive({ kinds: ["voice"], featured: true, limit: 1 }), enabled: community.available && !category });
  const recent = useQuery({ queryKey: ["village", "voices", categoryParam], queryFn: () => listLive({ kinds: ["voice"], limit: 30, ...(category ? { category: category.key } : {}) }), enabled: community.available });
  const lead = featured.data?.[0];
  const list = (recent.data ?? []).filter((v) => v.id !== lead?.id);

  return (
    <div className="bg-[color-mix(in_oklab,var(--color-paper)_70%,var(--color-sand)_8%)]">
      <header className="border-b border-ink/80">
        <div className="wrap pb-10 pt-12 lg:pb-14 lg:pt-16">
          <div className="flex items-end justify-between gap-6 border-b border-ink pb-4">
            <p className="font-display text-[2.5rem] italic leading-none tracking-[-0.01em] sm:text-[3.5rem] lg:text-[5rem]">ASEB Voices</p>
            <p className="hidden text-right text-[0.8125rem] uppercase tracking-[0.14em] text-stone sm:block">The editorial home<br />of African ecosystem building</p>
          </div>
          <div className="mt-8 grid gap-8 lg:grid-cols-12">
            <h1 className="font-display text-[1.875rem] leading-tight lg:col-span-7 lg:text-[2.5rem]">{products.voices.line}</h1>
            <div className="lg:col-span-5">
              <p className="text-[1.0625rem] leading-relaxed text-stone">Behind every ecosystem are stories the world has never heard. The people who built institutions, the founders whose lives were changed, the communities that created opportunities, the failures nobody talks about and the lessons Africa cannot afford to lose.</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row"><Btn to="/contribute?kind=voice">We want your story</Btn><Btn to="/voices?category=founders" variant="line">Founders' Voices</Btn></div>
            </div>
          </div>
        </div>
      </header>

      <nav aria-label="Voices categories" className="sticky top-[calc(var(--app-bar-h)+var(--context-tabs-h)+var(--safe-top))] z-20 border-b border-hairline bg-paper/95 backdrop-blur-sm">
        <div className="no-scrollbar wrap flex h-12 gap-6 overflow-x-auto">
          <Link to="/voices" aria-current={!category ? "page" : undefined} className={`flex shrink-0 items-center whitespace-nowrap text-[0.875rem] ${!category ? "font-semibold" : "text-ink/60 hover:text-ink"}`}>All voices</Link>
          {categories.map((c) => <Link key={c.key} to={`/voices?category=${c.key}`} aria-current={category?.key === c.key ? "page" : undefined} className={`flex shrink-0 items-center whitespace-nowrap text-[0.875rem] ${category?.key === c.key ? "font-semibold" : "text-ink/60 hover:text-ink"}`}>{c.name}</Link>)}
        </div>
      </nav>

      <section className="section-tight">
        <div className="wrap">
          {category && (
            <div className="mb-10 max-w-3xl">
              <h2 className="font-display text-[2.25rem] leading-tight">{category.name}</h2>
              <p className="mt-3 text-[1.0625rem] text-stone">{category.description}</p>
              {category.key === "founders" && (
                <div className="mt-6 border-l-2 border-signal pl-5">
                  <p className="font-semibold">Founders: tell us about the support systems in your journey.</p>
                  <ul className="mt-3 grid gap-1.5 text-[0.9375rem] text-stone sm:grid-cols-2">{founderTopics.map((t) => <li key={t}>{t}</li>)}</ul>
                  <p className="mt-4 text-[0.875rem] text-stone">Founders' accounts are published as perspectives, not as verified evidence. ASEB Voices never rates institutions or names and shames. Sensitive claims are reviewed by an editor.</p>
                  <div className="mt-4"><Btn to="/contribute?kind=voice&category=founders" variant="accent">Share your founder story</Btn></div>
                </div>
              )}
            </div>
          )}

          {!community.ready ? <p className="py-10 text-stone">Loading…</p> : !community.available ? <NotYetLive what="ASEB Voices publishing"><Btn to="/stories" variant="line">Read stories from the ASEB archive</Btn></NotYetLive> : (
            <>
              {lead && (
                <article className="mb-14 grid gap-8 lg:grid-cols-12">
                  <div className="lg:col-span-7">
                    {lead.media[0] ? <Media items={[lead.media[0]]} /> : <div className="grid aspect-[3/2] place-items-center bg-night p-8 text-ivory"><p className="max-w-md text-center font-display text-[1.75rem] italic leading-snug">“{excerpt(lead.body, 140)}”</p></div>}
                  </div>
                  <div className="flex flex-col justify-center lg:col-span-5">
                    <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ember">Featured · {voicesCategories.find((c) => c.key === lead.voices_category)?.name}</p>
                    <h2 className="mt-3 font-display text-[2.25rem] leading-tight"><Link to={`/voices/${lead.slug}`} className="hover:text-ember">{lead.title}</Link></h2>
                    <p className="mt-4 text-[1.0625rem] leading-relaxed text-stone">{lead.summary || excerpt(lead.body, 260)}</p>
                    <p className="mt-4 text-[0.875rem]"><span className="font-semibold">{lead.author?.display_name}</span><span className="text-stone"> · {readingMinutes(lead.body)} min read</span></p>
                  </div>
                </article>
              )}
              {list.length ? (
                <EngagementProvider ids={list.map((i) => i.id)}><div className="border-t border-ink">{list.map((v) => <ContentCard key={v.id} item={v} />)}</div></EngagementProvider>
              ) : !lead && (
                <div className="border-y border-ink py-12 text-center">
                  <p className="font-display text-[1.75rem]">{category ? `No ${category.name} published yet.` : "The first ASEB Voices stories are being edited."}</p>
                  <p className="mx-auto mt-3 max-w-md text-stone">Every published story has been read by an editor. Yours could be among the first.</p>
                  <div className="mt-6"><Btn to={`/contribute?kind=voice${category ? `&category=${category.key}` : ""}`}>Share your story</Btn></div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section className="on-dark section bg-night text-ivory" aria-labelledby="archive-title">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow text-sand">From the ASEB archive</p><h2 id="archive-title" className="mt-4 font-display text-[2rem]">Five editions, told in pictures.</h2></div><Link to="/stories" className="tlink">Open full screen <span className="arr" aria-hidden="true">→</span></Link></div>
          <ul className="no-scrollbar -mx-5 mt-8 flex snap-x gap-3 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0">
            {stories.filter((s) => s.photo).slice(0, 8).map((s) => (
              <li key={s.id} className="w-[44vw] max-w-[220px] shrink-0 snap-start sm:w-[200px]">
                <Link to={`/stories?story=${s.id}`} className="group relative block aspect-[9/16] overflow-hidden bg-night-2">
                  <img src={asset(s.photo!)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ objectPosition: s.position ?? "center" }} />
                  <span className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,color-mix(in_oklab,var(--color-night)_92%,transparent))]" aria-hidden="true" />
                  <span className="absolute inset-x-0 bottom-0 p-3.5"><span className="block text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-sand">{s.kicker}</span><span className="mt-1 block font-display text-[1.125rem] leading-tight">{s.title}</span></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export function VoiceStoryPage() {
  const { slug = "" } = useParams();
  const community = useCommunity();
  const item = useQuery({ queryKey: ["village", "item", slug], queryFn: () => getBySlug(slug), enabled: community.available, retry: false });
  const responses = useQuery({ queryKey: ["village", "responses", item.data?.id], queryFn: () => listLive({ kinds: ["answer"], parentId: item.data!.id, limit: 100 }), enabled: !!item.data?.id });
  if (!community.ready || item.isLoading) return <div className="wrap py-20 text-stone" role="status">Loading…</div>;
  if (!community.available) return <div className="wrap max-w-3xl py-16"><NotYetLive what="ASEB Voices" /></div>;
  const story = item.data;
  if (!story || story.kind !== "voice") return <div className="wrap max-w-3xl py-20"><h1 className="text-display-sm">This story is not available.</h1><p className="mt-4 text-stone">It may still be with the editors, or its author may have withdrawn it.</p><Link to="/voices" className="tlink mt-6">ASEB Voices <span className="arr" aria-hidden="true">→</span></Link></div>;
  const cat = voicesCategories.find((c) => c.key === story.voices_category);
  return (
    <article className="pb-20">
      <header className="border-b border-hairline bg-paper">
        <div className="wrap max-w-[48rem] pb-12 pt-12 lg:pt-20">
          <Link to="/voices" className="font-display text-[1.25rem] italic">ASEB Voices</Link>
          {cat && <p className="mt-8 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ember"><Link to={`/voices?category=${cat.key}`}>{cat.name}</Link></p>}
          <h1 className="mt-4 font-display text-[2.5rem] leading-[1.05] lg:text-[3.75rem]">{story.title}</h1>
          {story.summary && <p className="mt-6 text-[1.25rem] leading-relaxed text-stone">{story.summary}</p>}
          <p className="mt-8 text-[0.9375rem]">By <span className="font-semibold">{story.author?.profile_id ? <Link to={`/members/${story.author.profile_id}`} className="hover:text-ember">{story.author.display_name}</Link> : story.author?.display_name}</span>{story.author?.headline && <span className="text-stone">, {story.author.headline}</span>}</p>
          <p className="mt-1 text-[0.875rem] text-stone">{[story.country, timeAgo(story.published_at), `${readingMinutes(story.body)} min read`].filter(Boolean).join(" · ")}</p>
        </div>
      </header>
      <div className="wrap max-w-[48rem]">
        {story.media.length > 0 && <div className="mt-10"><Media items={story.media} /></div>}
        <div className="mt-10 font-display text-[1.25rem] leading-[1.65] [&_p]:text-ink"><Prose text={story.body} /></div>
        <p className="mt-10 border-l-2 border-signal pl-4 text-[0.875rem] leading-relaxed text-stone">{evidenceLabel[story.evidence_class]}. Published by ASEB Voices after editorial review. Accounts reflect the contributor's own experience and are not independently verified unless stated. The contributor retains ownership of this work.</p>
        <div className="mt-6 border-y border-hairline py-3"><ActionBar item={story} href={`/voices/${story.slug}`} inline /></div>
        <section id="responses" className="mt-12 scroll-mt-28" aria-labelledby="voice-responses">
          <h2 id="voice-responses" className="font-display text-[1.75rem]">Responses and corroboration</h2>
          <p className="mt-2 text-[0.9375rem] text-stone">Were you part of this story? Founders, practitioners and institutions can add their perspective. Responses are moderated.</p>
          <EngagementProvider ids={(responses.data ?? []).map((r) => r.id)}>{(responses.data ?? []).map((r) => <ContentCard key={r.id} item={r} />)}</EngagementProvider>
          <div className="mt-8"><ContributionEditor kind="answer" parentId={story.id} compact /></div>
        </section>
      </div>
    </article>
  );
}
