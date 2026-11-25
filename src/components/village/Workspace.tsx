import { useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "@/lib/router";
import { listChapters, listLive } from "@/lib/community-data";
import { playbookChapters, products } from "@/content/products";
import { useMember } from "@/hooks/use-member";
import { useCommunity } from "@/hooks/use-community";
import { Sheet } from "@/components/shell/Sheet";
import { ContributionEditor } from "./ContributionEditor";
import { investPath } from "@/content/navigation";

const workspaceLinks = [
  { label: "The Field", to: "/the-field" },
  { label: "Explore", to: "/registry" },
  { label: "Circles", to: "/communities" },
  { label: "The Playbook", to: "/playbook" },
  { label: "ASEB Voices", to: "/voices" },
  { label: "Ask the Village", to: "/ask" },
  { label: "State of the Field", to: "/state-of-the-field" },
  { label: "Academy", to: "/learning" },
  { label: "Opportunities", to: "/the-field?tab=opportunities" },
];
const personalLinks = [
  { label: "Saved", to: "/you?tab=saved" },
  { label: "My contributions", to: "/you?tab=contributions" },
  { label: "Profile", to: "/you?tab=profile" },
];

function NavList({ items }: { items: { label: string; to: string }[] }) {
  const { pathname, search } = useLocation();
  return (
    <ul>
      {items.map((item) => {
        const [path, query] = item.to.split("?");
        const current = query ? pathname === path && search.includes(query) : pathname === path || (path !== "/" && pathname.startsWith(`${path}/`) && !search.includes("tab="));
        return (
          <li key={item.to}>
            <Link to={item.to} className={`relative flex min-h-[40px] items-center rounded-sm px-3 text-[0.9375rem] transition-colors hover:bg-linen ${current ? "font-semibold text-ink" : "text-ink/70"}`}>
              {current && <span aria-hidden="true" className="absolute inset-y-2 left-0 w-[3px] bg-signal" />}
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

// The professional workspace frame: left navigation on desktop, centre content, optional right
// panel. Pages that need a different composition (long reading, research) pass no aside.
export function Workspace({ children, aside, label }: { children: ReactNode; aside?: ReactNode; label: string }) {
  const { user } = useMember();
  return (
    <div className="wrap max-w-[1360px] pb-16 pt-6 lg:pt-8">
      <div className={`grid gap-8 lg:grid-cols-[208px_minmax(0,1fr)] ${aside ? "xl:grid-cols-[208px_minmax(0,1fr)_300px]" : ""} lg:gap-10`}>
        <nav aria-label={`${label} navigation`} className="hidden lg:block">
          <div className="sticky top-[calc(var(--app-bar-h)+20px)] space-y-6">
            <NavList items={workspaceLinks} />
            {user && <div className="border-t border-hairline pt-4"><p className="px-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-stone">You</p><div className="mt-2"><NavList items={personalLinks} /></div></div>}
            <ul className="border-t border-hairline pt-3 text-[0.8125rem] text-stone">{[["About ASEB Society", "/"], ["Invest in Our Mission", investPath], ["Partnerships", "/partners"]].map(([label, to]) => <li key={label}><Link to={to ?? "/"} className="flex min-h-[32px] items-center px-3 hover:text-ink">{label}</Link></li>)}</ul>
          </div>
        </nav>
        <div className="min-w-0">{children}</div>
        {aside && <aside className="hidden min-w-0 xl:block" aria-label="Related"><div className="sticky top-[calc(var(--app-bar-h)+20px)] space-y-8">{aside}</div></aside>}
      </div>
    </div>
  );
}

// The central invitation. Visible on every screen size, never hidden behind a menu.
export function Composer() {
  const { user } = useMember();
  const [open, setOpen] = useState(false);
  const name = user && typeof user.user_metadata["name"] === "string" ? String(user.user_metadata["name"]) : "";
  const actions = [
    { label: "Write a post", to: null },
    { label: "Photograph", to: null },
    { label: "Video", to: null },
    { label: "Article", to: "/contribute?kind=article" },
    { label: "The Playbook", to: "/contribute?kind=playbook_contribution" },
    { label: "Your voice", to: "/contribute?kind=voice" },
    { label: "Ask the Village", to: "/contribute?kind=question" },
    { label: "Opportunity", to: "/contribute?kind=opportunity" },
  ];
  const signIn = `/auth?redirect=${encodeURIComponent("/the-field")}`;
  return (
    <section aria-labelledby="composer-title" className="border border-hairline bg-ivory p-4 shadow-[var(--shadow-editorial)] sm:p-5">
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-night font-display text-[1.125rem] text-ivory">{name ? name.slice(0, 1) : "A"}</span>
        {user ? (
          <button type="button" onClick={() => setOpen(true)} className="min-h-[48px] flex-1 rounded-full border border-hairline bg-paper px-5 text-left text-[1rem] text-stone transition-colors hover:border-ink hover:text-ink">
            <span id="composer-title">What is happening in your ecosystem?</span>
          </button>
        ) : (
          <Link to={signIn} className="flex min-h-[48px] flex-1 items-center rounded-full border border-hairline bg-paper px-5 text-[1rem] text-stone hover:border-ink hover:text-ink"><span id="composer-title">What is happening in your ecosystem?</span></Link>
        )}
      </div>
      <ul className="no-scrollbar -mx-1 mt-3 flex gap-1 overflow-x-auto px-1 pb-1" aria-label="Ways to contribute">
        {actions.map((a) => (
          <li key={a.label} className="shrink-0">
            {a.to ? <Link to={user ? a.to : `/auth?redirect=${encodeURIComponent(a.to)}`} className="inline-flex min-h-[40px] items-center rounded-full px-3 text-[0.875rem] font-semibold text-ink/75 hover:bg-linen hover:text-ink">{a.label}</Link>
              : user ? <button type="button" onClick={() => setOpen(true)} className="inline-flex min-h-[40px] items-center rounded-full px-3 text-[0.875rem] font-semibold text-ink/75 hover:bg-linen hover:text-ink">{a.label}</button>
              : <Link to={signIn} className="inline-flex min-h-[40px] items-center rounded-full px-3 text-[0.875rem] font-semibold text-ink/75 hover:bg-linen hover:text-ink">{a.label}</Link>}
          </li>
        ))}
      </ul>
      <Sheet open={open} onOpenChange={setOpen} title="Share with the village" description="A short professional update, a photograph or a video link." side="bottom">
        <ContributionEditor kind="post" compact onDone={() => undefined} />
        <p className="mt-6 border-t border-hairline pt-4 text-[0.875rem] text-stone">Writing something longer? <Link to="/contribute?kind=article" className="font-semibold text-ink underline underline-offset-4">Open the full article editor</Link></p>
      </Sheet>
    </section>
  );
}

// Right panel: real content only. When a product has nothing published yet, it shows the open
// invitation for that product instead of placeholder activity.
export function VillagePanel() {
  const community = useCommunity();
  const voices = useQuery({ queryKey: ["village", "panel-voices"], queryFn: () => listLive({ kinds: ["voice"], limit: 2, featured: true }), enabled: community.available });
  const questions = useQuery({ queryKey: ["village", "panel-questions"], queryFn: () => listLive({ kinds: ["question"], limit: 3 }), enabled: community.available });
  const chapters = useQuery({ queryKey: ["village", "chapters"], queryFn: listChapters, enabled: community.available });
  const calls = (chapters.data ?? []).filter((c) => c.status === "open").slice(0, 3);
  const fallbackCalls = playbookChapters.slice(2, 5);
  const heading = "text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-stone";
  return (
    <>
      <section>
        <p className={heading}>Open Playbook calls</p>
        <ul className="mt-3 space-y-3">{(calls.length ? calls.map((c) => ({ slug: c.slug, title: c.title, call: c.contribution_call })) : fallbackCalls).map((c) => <li key={c.slug}><Link to={`/playbook/${c.slug}`} className="group block border-l-2 border-hairline pl-3 hover:border-signal"><span className="block text-[0.9375rem] font-semibold leading-snug group-hover:text-ember">{c.title}</span><span className="mt-1 block text-[0.8125rem] leading-snug text-stone">{c.call}</span></Link></li>)}</ul>
        <Link to="/playbook" className="tlink mt-3 text-[0.8125rem]">The Playbook <span className="arr" aria-hidden="true">→</span></Link>
      </section>
      <section>
        <p className={heading}>ASEB Voices</p>
        {voices.data?.length ? <ul className="mt-3 space-y-3">{voices.data.map((v) => <li key={v.id}><Link to={`/voices/${v.slug}`} className="block font-display text-[1.125rem] leading-snug hover:text-ember">{v.title}</Link><span className="text-[0.8125rem] text-stone">{v.author?.display_name}</span></li>)}</ul>
          : <p className="mt-3 text-[0.9375rem] leading-relaxed">Every ecosystem has a story. <Link to="/contribute?kind=voice" className="font-semibold text-ember underline underline-offset-4">We want yours.</Link></p>}
      </section>
      <section>
        <p className={heading}>Ask the Village</p>
        {questions.data?.length ? <ul className="mt-3 space-y-2">{questions.data.map((q) => <li key={q.id}><Link to={`/ask/${q.slug}`} className="text-[0.9375rem] font-semibold leading-snug hover:text-ember">{q.title}</Link><span className="block text-[0.8125rem] text-stone">{q.engagement?.responses ? `${q.engagement.responses} answers` : "Not yet answered"}</span></li>)}</ul>
          : <p className="mt-3 text-[0.9375rem] leading-relaxed text-stone">No one has all the answers. <Link to="/contribute?kind=question" className="font-semibold text-ink underline underline-offset-4">Ask the first question.</Link></p>}
      </section>
      <section className="on-dark bg-night p-5 text-ivory">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-sand">It Takes a Village</p>
        <p className="mt-3 font-display text-[1.25rem] leading-snug">Strengthen the infrastructure behind African entrepreneurship.</p>
        <Link to={investPath} className="tlink mt-4 text-[0.875rem]">Invest in Our Mission <span className="arr" aria-hidden="true">→</span></Link>
      </section>
      <p className="text-[0.75rem] leading-relaxed text-stone">{products.field.line} Content here is chosen by date and by what you follow. Nothing is ranked by engagement.</p>
    </>
  );
}
