import { useState } from "react";
import { levels } from "@/content/proposition";

type LevelKey = (typeof levels)[number]["key"];

// Three overlapping strata: entrepreneurs rest on ecosystems, ecosystems rest on the professional
// field that builds them. The layers overlap because the work overlaps. Selecting a stratum reveals
// what that level builds. Every word is also in the page as text, so it reads without interaction.
export function ThreeLevels({ dark = false }: { dark?: boolean }) {
  const [active, setActive] = useState<LevelKey>("field");
  const index = levels.findIndex((l) => l.key === active);
  const level = levels[index] ?? levels[2];
  const move = (step: number) => {
    const next = levels[(index + step + levels.length) % levels.length]!;
    setActive(next.key);
    document.getElementById(`level-${next.key}`)?.focus();
  };
  const widths = ["w-[72%]", "w-[86%]", "w-full"];
  const quiet = dark ? "text-ivory/70" : "text-stone";
  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-6">
        <div role="tablist" aria-label="Three levels of intervention" aria-orientation="vertical" className="flex flex-col items-center"
          onKeyDown={(e) => { if (["ArrowDown", "ArrowRight"].includes(e.key)) { e.preventDefault(); move(1); } if (["ArrowUp", "ArrowLeft"].includes(e.key)) { e.preventDefault(); move(-1); } }}>
          {levels.map((l, i) => {
            const selected = l.key === active;
            const foundation = l.key === "field";
            const surface = foundation
              ? dark ? "bg-ivory text-ink" : "bg-ink text-ivory"
              : dark ? "bg-night-line/60 text-ivory" : "bg-mandate-surface text-ink";
            return (
              <button key={l.key} id={`level-${l.key}`} role="tab" type="button" aria-selected={selected} aria-controls="level-detail" tabIndex={selected ? 0 : -1} onClick={() => setActive(l.key)}
                style={{ zIndex: i + 1 }}
                className={`relative ${widths[i]} ${i > 0 ? "-mt-3" : ""} min-h-[84px] px-5 pb-5 pt-6 text-left shadow-[0_-1px_0_var(--color-hairline)] transition-[transform,box-shadow] duration-300 ${surface} ${selected ? "outline outline-2 outline-offset-0 outline-signal" : "hover:-translate-y-0.5"}`}>
                <span className={`block text-[0.6875rem] font-semibold uppercase tracking-[0.14em] ${foundation ? (dark ? "text-ember" : "text-sand") : dark ? "text-sand" : "text-umber"}`}>{l.builds}</span>
                <span className="mt-1.5 block font-display text-[1.25rem] leading-tight lg:text-[1.5rem]">{l.name}</span>
              </button>
            );
          })}
        </div>
        <p className={`mt-5 text-center text-[0.8125rem] leading-relaxed ${quiet}`}>The three levels overlap and reinforce one another. None replaces the others.</p>
      </div>
      <div id="level-detail" role="tabpanel" aria-labelledby={`level-${level.key}`} key={level.key} className="mandate-enter self-center lg:col-span-5 lg:col-start-8">
        <p className={`text-[0.75rem] font-semibold uppercase tracking-[0.14em] ${dark ? "text-sand" : "text-teal"}`}>{level.builds}</p>
        <h3 className="mt-3 font-display text-[1.75rem] leading-tight lg:text-[2.125rem]">{level.name}</h3>
        <p className="mt-4 text-[1.0625rem] leading-relaxed">{level.line}</p>
        <p className={`mt-4 border-t pt-4 text-[0.9375rem] leading-relaxed ${dark ? "border-night-line text-ivory/75" : "border-hairline text-stone"}`}>{level.who}</p>
        {level.key === "field" && <p className={`mt-5 border-l-2 border-signal pl-4 text-[0.9375rem] font-semibold ${dark ? "text-ivory" : "text-ink"}`}>This is ASEB Society's distinctive focus.</p>}
      </div>
    </div>
  );
}
