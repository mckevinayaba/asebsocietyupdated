import { useMemo } from "react";
import { Link, useSearchParams } from "@/lib/router";
import { asset } from "@/lib/asset";
import { discoverItems, discoverTypes, stories, type DiscoverItem, type DiscoverType } from "@/content/discover";
import { conditions } from "@/content/framework";
import { useSaved } from "@/hooks/use-saved";
import { SaveIcon } from "@/components/shell/Icons";

function SaveButton({ item }: { item: DiscoverItem }) {
  const { isSaved, toggle } = useSaved();
  const saved = isSaved(item.key);
  return (
    <button type="button" onClick={() => toggle({ key: item.key, title: item.title, to: item.to, kind: item.format })} aria-pressed={saved} aria-label={saved ? `Remove ${item.title} from saved` : `Save ${item.title}`}
      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full transition-colors hover:bg-linen ${saved ? "text-ember" : "text-stone"}`}>
      <SaveIcon filled={saved} width={20} height={20} />
    </button>
  );
}

// Distinct treatments per format: events read as dated notices, knowledge as citations,
// opportunities as calls, learning as guides.
function Item({ item }: { item: DiscoverItem }) {
  if (item.type === "event") return (
    <li className="on-dark grid gap-4 bg-night p-6 text-ivory sm:grid-cols-[9rem_1fr_auto] sm:items-start lg:p-8">
      <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-sand">{item.format}<span className="mt-2 block font-display text-[1.5rem] normal-case tracking-normal text-ivory">{item.meta}</span></p>
      <Link to={item.to} className="group"><h3 className="font-display text-[1.5rem] leading-tight group-hover:text-signal">{item.title}</h3><p className="mt-2 text-[0.9375rem] text-ivory/75">{item.summary}</p></Link>
      <div className="text-ivory"><SaveButton item={item} /></div>
    </li>
  );
  if (item.type === "opportunity") return (
    <li className="grid grid-cols-[1fr_auto] gap-4 border-l-2 border-signal bg-signal-soft/60 p-5 lg:p-6">
      <Link to={item.to} className="group"><p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-ember">{item.format} · {item.meta}</p><h3 className="mt-2 text-[1.25rem] font-semibold leading-snug group-hover:text-ember">{item.title} →</h3><p className="mt-2 text-[0.9375rem] text-stone">{item.summary}</p></Link>
      <SaveButton item={item} />
    </li>
  );
  return (
    <li className="grid grid-cols-[1fr_auto] gap-4 border-b border-hairline py-6">
      <Link to={item.to} className="group">
        <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-teal">{item.format}</p>
        <h3 className="mt-2 font-display text-[1.375rem] leading-snug group-hover:text-ember">{item.title}</h3>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-stone">{item.summary}</p>
        <p className="mt-3 text-[0.8125rem] text-stone">{item.meta}</p>
      </Link>
      <SaveButton item={item} />
    </li>
  );
}

export default function Discover() {
  const [params] = useSearchParams();
  const typeParam = params.get("type");
  const type = discoverTypes.some((t) => t.key === typeParam) ? (typeParam as DiscoverType) : null;
  const conditionParam = params.get("condition") ?? "";
  const condition = conditions.some((c) => c.name === conditionParam) ? conditionParam : "";
  const items = useMemo(() => discoverItems.filter((item) => (!type || item.type === type) && (!condition || item.conditions?.includes(condition))), [type, condition]);
  const groups = (type ? discoverTypes.filter((t) => t.key === type) : discoverTypes).map((t) => ({ ...t, items: items.filter((i) => i.type === t.key) })).filter((g) => g.items.length);
  const query = (next: Record<string, string>) => { const p = new URLSearchParams(); if (type) p.set("type", type); if (condition) p.set("condition", condition); Object.entries(next).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k))); const s = p.toString(); return `/discover${s ? `?${s}` : ""}`; };

  return (
    <>
      <header className="border-b border-hairline">
        <div className="wrap pb-10 pt-10 lg:pb-14 lg:pt-16">
          <p className="eyebrow">Discover · The Field</p>
          <h1 className="mt-5 max-w-[20ch] text-display-lg">Knowledge, people and opportunities across the field.</h1>
          <p className="lede mt-6 max-w-prose">A discovery layer connecting the Society's four mandates. You choose the filters. Nothing is ranked by engagement.</p>
        </div>
      </header>

      {!type && (
        <section className="section-tight border-b border-hairline" aria-labelledby="stories-title">
          <div className="wrap">
            <div className="flex items-baseline justify-between gap-4"><h2 id="stories-title" className="font-display text-[1.75rem]">Field stories</h2><Link to="/stories" className="tlink">Open full screen <span className="arr" aria-hidden="true">→</span></Link></div>
            <ul className="no-scrollbar -mx-5 mt-6 flex snap-x gap-3 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0">
              {stories.map((s) => (
                <li key={s.id} className="w-[44vw] max-w-[220px] shrink-0 snap-start sm:w-[200px]">
                  <Link to={`/stories?story=${s.id}`} className="group relative block aspect-[9/16] overflow-hidden bg-night text-ivory">
                    {s.photo && <img src={asset(s.photo)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ objectPosition: s.position ?? "center" }} />}
                    <span className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,color-mix(in_oklab,var(--color-night)_92%,transparent))]" aria-hidden="true" />
                    <span className="absolute inset-x-0 bottom-0 p-3.5"><span className="block text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-sand">{s.kicker}</span><span className="mt-1 block font-display text-[1.125rem] leading-tight">{s.title}</span></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="section-tight">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <aside className="min-w-0 lg:col-span-3" aria-label="Filters">
            <div className="lg:sticky lg:top-[calc(var(--app-bar-h)+var(--context-tabs-h)+24px)]">
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-stone">Ecosystem condition</p>
              <ul className="no-scrollbar mt-3 flex gap-2 overflow-x-auto lg:block lg:space-y-1">
                <li className="shrink-0"><Link to={query({ condition: "" })} className={`block whitespace-nowrap border px-3 py-2 text-[0.875rem] lg:border-0 lg:px-0 lg:py-1.5 ${!condition ? "border-ink font-semibold" : "border-hairline text-stone hover:text-ink"}`}>All conditions</Link></li>
                {conditions.map((c) => <li key={c.name} className="shrink-0"><Link to={query({ condition: c.name })} className={`block whitespace-nowrap border px-3 py-2 text-[0.875rem] lg:whitespace-normal lg:border-0 lg:px-0 lg:py-1.5 ${condition === c.name ? "border-ink font-semibold" : "border-hairline text-stone hover:text-ink"}`}>{c.name}</Link></li>)}
              </ul>
              <p className="mt-6 hidden text-[0.8125rem] leading-relaxed text-stone lg:block">Filtering by country, role and Circle will follow as members contribute content. Saved items stay on this device for now.</p>
            </div>
          </aside>
          <div className="min-w-0 space-y-14 lg:col-span-9">
            {groups.map((group) => (
              <section key={group.key} aria-labelledby={`group-${group.key}`}>
                <div className="flex items-baseline justify-between gap-4 border-b border-ink pb-3"><h2 id={`group-${group.key}`} className="font-display text-[1.75rem]">{group.label}</h2><p className="hidden text-[0.875rem] text-stone sm:block">{group.line}</p></div>
                <ul className={group.key === "knowledge" || group.key === "learning" ? "" : "mt-5 grid gap-3"}>{group.items.map((item) => <Item key={item.key} item={item} />)}</ul>
              </section>
            ))}
            {!groups.length && <p className="py-10 text-stone" role="status">Nothing matches these filters yet. <Link to="/discover" className="underline">Clear filters</Link></p>}
          </div>
        </div>
      </section>
    </>
  );
}
