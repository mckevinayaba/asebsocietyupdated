import { useQuery } from "@tanstack/react-query";
import { Link, useParams, useSearchParams } from "@/lib/router";
import { getBySlug, listLive } from "@/lib/community-data";
import { products } from "@/content/products";
import { useCommunity, useEngagement, EngagementProvider } from "@/hooks/use-community";
import { ContentCard } from "@/components/village/ContentCard";
import { ContributionEditor } from "@/components/village/ContributionEditor";
import { ActionBar } from "@/components/village/ActionBar";
import { NotYetLive, Prose, timeAgo } from "@/components/village/Primitives";
import { Workspace, VillagePanel } from "@/components/village/Workspace";
import { Btn } from "@/components/Arrow";
import { UsefulIcon } from "@/components/shell/Icons";

export function AskPage() {
  const [params] = useSearchParams();
  const unanswered = params.get("view") === "unanswered";
  const community = useCommunity();
  const questions = useQuery({ queryKey: ["village", "questions"], queryFn: () => listLive({ kinds: ["question"], limit: 60 }), enabled: community.available });
  const list = (questions.data ?? []).filter((q) => !unanswered || !(q.engagement?.responses ?? 0));
  return (
    <Workspace label="Ask the Village" aside={<VillagePanel />}>
      <header>
        <p className="eyebrow">{products.ask.name}</p>
        <h1 className="mt-4 font-display text-[2.25rem] leading-tight lg:text-[3rem]">{products.ask.line}</h1>
        <p className="lede mt-4 max-w-prose">Ask a practical question about ecosystem building and learn from people who have faced it. Answers are community experience, not official ASEB guidance.</p>
        <div className="mt-6"><Btn to="/contribute?kind=question">Ask a question</Btn></div>
      </header>
      <nav aria-label="Questions" className="mt-8 flex gap-6 border-b border-hairline">
        <Link to="/ask" aria-current={!unanswered ? "page" : undefined} className={`relative min-h-[44px] pt-3 text-[0.9375rem] ${!unanswered ? "font-semibold after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-signal" : "text-ink/60"}`}>Latest</Link>
        <Link to="/ask?view=unanswered" aria-current={unanswered ? "page" : undefined} className={`relative min-h-[44px] pt-3 text-[0.9375rem] ${unanswered ? "font-semibold after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-signal" : "text-ink/60"}`}>Unanswered</Link>
      </nav>
      {!community.ready ? <p className="py-10 text-stone">Loading…</p> : !community.available ? <div className="mt-6"><NotYetLive what="Ask the Village" /></div>
        : list.length ? <EngagementProvider ids={list.map((q) => q.id)}><div>{list.map((q) => <ContentCard key={q.id} item={q} />)}</div></EngagementProvider>
        : <div className="py-12 text-center"><p className="font-display text-[1.5rem]">{unanswered ? "Every published question has an answer." : "No questions published yet."}</p><p className="mt-2 text-stone">Ask what you are stuck on. Someone in the village has probably faced it.</p></div>}
    </Workspace>
  );
}

export function QuestionPage() {
  const { slug = "" } = useParams();
  const community = useCommunity();
  const question = useQuery({ queryKey: ["village", "item", slug], queryFn: () => getBySlug(slug), enabled: community.available, retry: false });
  const answers = useQuery({ queryKey: ["village", "responses", question.data?.id], queryFn: () => listLive({ kinds: ["answer"], parentId: question.data!.id, limit: 100 }), enabled: !!question.data?.id });
  const engagement = useEngagement([]);
  if (!community.ready || question.isLoading) return <Workspace label="Ask the Village"><p className="py-16 text-stone">Loading…</p></Workspace>;
  if (!community.available) return <Workspace label="Ask the Village"><NotYetLive what="Ask the Village" /></Workspace>;
  const q = question.data;
  if (!q || q.kind !== "question") return <Workspace label="Ask the Village"><div className="py-16"><h1 className="text-display-sm">This question is not available.</h1><Link to="/ask" className="tlink mt-6">Ask the Village <span className="arr" aria-hidden="true">→</span></Link></div></Workspace>;
  const sorted = [...(answers.data ?? [])].sort((a, b) => (b.engagement?.useful ?? 0) - (a.engagement?.useful ?? 0) || Date.parse(a.published_at ?? "") - Date.parse(b.published_at ?? ""));
  const following = engagement.following("question", q.slug);
  return (
    <Workspace label="Ask the Village">
      <article className="max-w-[46rem]">
        <Link to="/ask" className="text-[0.875rem] text-stone hover:text-ink">← Ask the Village</Link>
        <h1 className="mt-6 font-display text-[2rem] leading-tight lg:text-[2.75rem]">{q.title}</h1>
        <p className="mt-3 text-[0.9375rem]"><span className="font-semibold">{q.author?.display_name}</span><span className="text-stone"> · {[q.country, timeAgo(q.published_at)].filter(Boolean).join(" · ")}</span></p>
        <div className="mt-6 text-[1.0625rem] leading-relaxed"><Prose text={q.body} /></div>
        <div className="mt-6 flex flex-wrap items-center gap-3 border-y border-hairline py-3">
          <ActionBar item={q} href={`/ask/${q.slug}`} inline />
          {engagement.signedIn && <button type="button" className="btn btn-line min-h-[40px]" aria-pressed={following} onClick={() => void engagement.toggleFollow("question", q.slug, !following)}>{following ? "Following" : "Follow this question"}</button>}
        </div>
        <section id="responses" className="mt-10 scroll-mt-28" aria-labelledby="answers-title">
          <h2 id="answers-title" className="font-display text-[1.75rem]">{sorted.length ? `${sorted.length} answer${sorted.length === 1 ? "" : "s"}` : "No answers yet"}</h2>
          <p className="mt-2 text-[0.875rem] text-stone">Answers marked useful by readers rise to the top. Community answers are not official ASEB guidance.</p>
          <EngagementProvider ids={sorted.map((a) => a.id)}>
            {sorted.map((a) => (
              <div key={a.id} id={a.slug} className="relative">
                <ContentCard item={a} parentSlug={q.slug} />
                <UsefulButton id={a.id} count={a.engagement?.useful ?? 0} />
              </div>
            ))}
          </EngagementProvider>
          <div className="mt-8"><ContributionEditor kind="answer" parentId={q.id} compact /></div>
          <p className="mt-8 text-[0.875rem] text-stone">Questions that matter to many practitioners may be taken up by a Circle, a Playbook contribution call or a Field Lab investigation.</p>
        </section>
      </article>
    </Workspace>
  );
}

function UsefulButton({ id, count }: { id: string; count: number }) {
  const engagement = useEngagement([id]);
  const on = engagement.reacted(id, "useful");
  if (!engagement.signedIn) return count ? <p className="-mt-3 mb-4 flex items-center gap-1.5 text-[0.8125rem] text-teal"><UsefulIcon width={16} height={16} />{count} found this useful</p> : null;
  return (
    <button type="button" aria-pressed={on} onClick={() => void engagement.toggleReaction(id, "useful", !on)} className={`-mt-3 mb-4 inline-flex min-h-[36px] items-center gap-1.5 rounded-full border px-3 text-[0.8125rem] font-semibold ${on ? "border-teal bg-teal-soft text-teal" : "border-hairline text-stone hover:border-ink"}`}>
      <UsefulIcon width={16} height={16} />{on ? "Marked useful" : "Useful"}{count > 0 && <span>· {count}</span>}
    </button>
  );
}
