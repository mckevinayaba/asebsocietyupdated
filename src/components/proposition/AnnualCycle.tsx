import { annualCycle, cycleStatement } from "@/content/proposition";

// Beyond the annual gathering: Listen, Develop, Convene, Follow through, and back to the start.
// Four stages on one line, joined by arrows, with a return path beneath them: what the field
// learns in one cycle shapes the next. The ordered list carries the meaning; the lines are drawn.
export function AnnualCycle({ dark = false }: { dark?: boolean }) {
  const quiet = dark ? "text-ivory/70" : "text-stone";
  return (
    <div>
      <ol className="grid gap-0 md:grid-cols-4 md:gap-6" aria-label="The proposed annual institutional cycle">
        {annualCycle.map((s, i) => {
          const summit = s.key === "convene";
          return (
            <li key={s.key} className={`relative border-l-2 py-5 pl-6 md:border-l-0 md:border-t-2 md:py-0 md:pl-0 md:pt-6 ${summit ? "border-signal" : dark ? "border-night-line" : "border-ink/70"}`}>
              {i < annualCycle.length - 1 && <span aria-hidden="true" className="absolute -right-5 -top-[0.7rem] hidden text-[1rem] text-signal md:block">→</span>}
              <p className={`text-[0.75rem] font-semibold uppercase tracking-[0.14em] ${summit ? (dark ? "text-signal" : "text-ember") : dark ? "text-sand" : "text-umber"}`}>{summit ? "The Summit & Awards" : "Throughout the year"}</p>
              <h3 className="mt-2 font-display text-[1.75rem] leading-tight lg:text-[2.125rem]">{s.name}</h3>
              <p className={`mt-2 text-[0.9875rem] leading-relaxed ${quiet}`}>{s.line}</p>
              <p className={`mt-3 text-[0.8125rem] leading-relaxed ${quiet}`}><span className="font-semibold">Through</span> {s.through}</p>
            </li>
          );
        })}
      </ol>
      <div className="mt-8 md:mt-10">
        <svg aria-hidden="true" viewBox="0 0 1000 40" preserveAspectRatio="none" className="hidden h-10 w-full md:block">
          <path d="M875 0 V24 H125 V6" fill="none" className="stroke-signal" strokeWidth="1.5" strokeDasharray="5 5" vectorEffect="non-scaling-stroke" />
          <path d="M119 12 L125 2 L131 12" fill="none" className="stroke-signal" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className={`border-t pt-6 md:border-t-0 md:pt-2 md:text-center ${dark ? "border-night-line" : "border-hairline"}`}>
          <p className={`text-[0.8125rem] ${quiet}`}>What the field learns in one cycle shapes the next.</p>
          <p className="mt-3 font-display text-[1.375rem] leading-snug lg:text-[1.625rem]">{cycleStatement}</p>
        </div>
      </div>
    </div>
  );
}
