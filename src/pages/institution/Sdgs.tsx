import { useState } from "react";
import { PageHero } from "@/components/PageHero";
import { Btn } from "@/components/Arrow";
import { Source, Ext } from "@/components/Rows";
import { sdgs } from "@/content/institution";

export default function Sdgs() {
  const [primaryOnly, setPrimaryOnly] = useState(false);
  const list = primaryOnly ? sdgs.filter((s) => s.primary) : sdgs;
  return (
    <>
      <PageHero
        eyebrow="The Sustainable Development Goals"
        title="Ecosystem building is how the goals reach founders."
        lede="Entrepreneurs carry much of the work of the 2030 Agenda: jobs, innovation, energy, food and inclusion. The people who build the conditions for those entrepreneurs contribute to all 17 goals. Every programme, project and insight on the platform is tagged to the goals it serves, so funders and practitioners can see the field by goal."
      />

      <section className="section">
        <div className="wrap">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <p className="text-[0.9375rem] text-stone">{list.length} of 17 goals shown. Primary goals anchor ASEB Society's own results framework.</p>
            <div className="inline-flex border border-ink" role="radiogroup" aria-label="Filter goals">
              {[false, true].map((p) => (
                <button key={String(p)} type="button" role="radio" aria-checked={primaryOnly === p} onClick={() => setPrimaryOnly(p)} className={`min-h-[44px] px-5 text-[0.875rem] font-semibold ${primaryOnly === p ? "bg-ink text-ivory" : ""}`}>
                  {p ? "Primary goals" : "All 17 goals"}
                </button>
              ))}
            </div>
          </div>
          <ol className="mt-8 border-t border-ink">
            {list.map((s) => (
              <li key={s.n} className="grid gap-3 border-b border-hairline py-7 lg:grid-cols-12 lg:items-baseline lg:gap-10">
                <span className={`numeral text-[2.5rem] leading-none lg:col-span-1 ${s.primary ? "text-ember" : "text-ink/40"}`}>{s.n}</span>
                <h2 className="font-display text-[1.5rem] leading-tight lg:col-span-4">{s.name}{s.primary && <span className="ml-3 align-middle text-eyebrow font-semibold uppercase text-umber">Primary</span>}</h2>
                <p className="text-[1rem] leading-relaxed lg:col-span-4">{s.how}</p>
                <p className="text-[0.875rem] text-stone lg:col-span-3"><span className="block text-eyebrow font-semibold uppercase">Condition</span>{s.condition}</p>
              </li>
            ))}
          </ol>
          <Source>Goal titles: <Ext href="https://sdgs.un.org/goals">United Nations, Sustainable Development Goals</Ext>. ASEB Society is not affiliated with the United Nations. The mapping of goals to conditions is ASEB Society's own, for review by the Field Lab working groups.</Source>
          <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Btn to="/collaborate">Register an aligned programme</Btn>
            <Btn to="/climate" variant="line">Green and climate economy</Btn>
          </div>
        </div>
      </section>
    </>
  );
}
