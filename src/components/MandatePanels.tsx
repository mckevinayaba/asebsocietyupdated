import { useState } from "react";
import { mandates, type MandateKey } from "@/content/case";
import { Photo } from "@/components/Photo";
import { TLink } from "@/components/Arrow";

// Four mandates as one connected editorial composition: a selector that reads as an index, and a
// panel that answers the same five questions for each mandate. Not four identical cards.
export function MandatePanels() {
  const [active, setActive] = useState<MandateKey>("summit");
  const index = mandates.findIndex((m) => m.key === active);
  const mandate = mandates[index] ?? mandates[0]!;
  const move = (step: number) => {
    const next = mandates[(index + step + mandates.length) % mandates.length]!;
    setActive(next.key);
    document.getElementById(`mandate-${next.key}`)?.focus();
  };
  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-10">
      <div role="tablist" aria-label="Institutional mandates" aria-orientation="vertical" className="no-scrollbar min-w-0 -mx-5 flex gap-0 overflow-x-auto px-5 lg:col-span-4 lg:mx-0 lg:block lg:overflow-visible lg:border-t lg:border-ink lg:px-0"
        onKeyDown={(event) => { if (["ArrowDown", "ArrowRight"].includes(event.key)) { event.preventDefault(); move(1); } if (["ArrowUp", "ArrowLeft"].includes(event.key)) { event.preventDefault(); move(-1); } }}>
        {mandates.map((m) => {
          const selected = m.key === active;
          return (
            <button key={m.key} id={`mandate-${m.key}`} role="tab" type="button" aria-selected={selected} aria-controls="mandate-detail" tabIndex={selected ? 0 : -1} onClick={() => setActive(m.key)}
              className={`relative shrink-0 border-b-2 px-4 py-3 text-left transition-colors lg:block lg:w-full lg:border-b lg:border-hairline lg:px-0 lg:py-5 ${selected ? "border-signal text-ink lg:border-hairline" : "border-transparent text-stone hover:text-ink"}`}>
              {selected && <span aria-hidden="true" className="absolute -left-4 top-5 bottom-5 hidden w-[3px] bg-signal lg:block" />}
              <span className="block whitespace-nowrap font-display text-[1.125rem] leading-tight lg:whitespace-normal lg:text-[1.625rem]">{m.name}</span>
              <span className="mt-1 hidden text-[0.875rem] lg:block">{m.role}</span>
            </button>
          );
        })}
      </div>
      <article id="mandate-detail" role="tabpanel" aria-labelledby={`mandate-${mandate.key}`} key={mandate.key} className="mandate-enter grid min-w-0 gap-8 lg:col-span-8 lg:grid-cols-2">
        <Photo src={mandate.photo} alt={mandate.alt} caption={mandate.name} ratio="aspect-[4/3] lg:aspect-[4/5]" />
        <div className="flex flex-col">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-teal">{mandate.role}</p>
          <dl className="mt-4 divide-y divide-hairline border-y border-hairline">
            {[["The challenge", mandate.challenge], ["Institutional purpose", mandate.purpose], ["Intended contribution", mandate.contribution]].map(([k, v]) => (
              <div key={k} className="py-4"><dt className="text-[0.8125rem] font-semibold">{k}</dt><dd className="mt-1 text-[0.9875rem] leading-relaxed text-stone">{v}</dd></div>
            ))}
            <div className="py-4">
              <dt className="text-[0.8125rem] font-semibold">Where it stands</dt>
              <dd className="mt-1 flex gap-2.5 text-[0.9375rem] leading-relaxed"><span className={`status-dot mt-[0.55em] ${mandate.status.tone === "operational" ? "bg-teal" : "bg-signal"}`} aria-hidden="true" />{mandate.status.text}</dd>
            </div>
          </dl>
          <div className="mt-6"><TLink to={mandate.pathway.to}>{mandate.pathway.label}</TLink></div>
        </div>
      </article>
    </div>
  );
}
