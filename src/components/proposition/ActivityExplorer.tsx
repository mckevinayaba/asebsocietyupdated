import { useState } from "react";
import { activities } from "@/content/proposition";
import { TLink } from "@/components/Arrow";

type Key = (typeof activities)[number]["key"];

// Not every activity builds an ecosystem. One editorial comparison: what was done, and what it can
// leave behind. It respects the activity and asks about the lasting change.
export function ActivityExplorer() {
  const [active, setActive] = useState<Key>("conference");
  const index = activities.findIndex((a) => a.key === active);
  const a = activities[index] ?? activities[0];
  const move = (step: number) => {
    const next = activities[(index + step + activities.length) % activities.length]!;
    setActive(next.key);
    document.getElementById(`activity-${next.key}`)?.focus();
  };
  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-10">
      <div role="tablist" aria-label="Examples of ecosystem activity" aria-orientation="vertical" className="no-scrollbar -mx-5 flex min-w-0 overflow-x-auto px-5 lg:col-span-4 lg:mx-0 lg:block lg:overflow-visible lg:border-t lg:border-ink lg:px-0"
        onKeyDown={(e) => { if (["ArrowDown", "ArrowRight"].includes(e.key)) { e.preventDefault(); move(1); } if (["ArrowUp", "ArrowLeft"].includes(e.key)) { e.preventDefault(); move(-1); } }}>
        {activities.map((x) => {
          const selected = x.key === active;
          return (
            <button key={x.key} id={`activity-${x.key}`} role="tab" type="button" aria-selected={selected} aria-controls="activity-detail" tabIndex={selected ? 0 : -1} onClick={() => setActive(x.key)}
              className={`relative shrink-0 border-b-2 px-4 py-3 text-left transition-colors lg:block lg:w-full lg:border-b lg:border-hairline lg:px-0 lg:py-4 ${selected ? "border-signal text-ink" : "border-transparent text-stone hover:text-ink"}`}>
              {selected && <span aria-hidden="true" className="absolute -left-4 bottom-4 top-4 hidden w-[3px] bg-signal lg:block" />}
              <span className="block whitespace-nowrap font-display text-[1.0625rem] leading-tight lg:whitespace-normal lg:text-[1.375rem]">{x.name}</span>
            </button>
          );
        })}
      </div>
      <article id="activity-detail" role="tabpanel" aria-labelledby={`activity-${a.key}`} key={a.key} className="mandate-enter min-w-0 lg:col-span-8">
        <div className="grid gap-px border border-hairline bg-hairline sm:grid-cols-[minmax(0,0.8fr)_auto_minmax(0,1.2fr)]">
          <div className="bg-ivory p-6 lg:p-8">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-stone">The activity</p>
            <p className="mt-3 font-display text-[1.5rem] leading-snug">{a.activity}</p>
          </div>
          <div aria-hidden="true" className="hidden items-center bg-ivory px-2 text-[1.5rem] text-ember sm:flex">→</div>
          <div className="bg-teal-soft p-6 lg:p-8">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-teal">The potential ecosystem contribution</p>
            <p className="mt-3 text-[1.125rem] leading-relaxed">{a.contribution}</p>
          </div>
        </div>
        <div className="mt-6"><TLink to={a.next.to}>{a.next.label}</TLink></div>
      </article>
    </div>
  );
}
