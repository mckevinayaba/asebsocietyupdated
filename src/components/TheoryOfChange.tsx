import { useState } from "react";
import { theoryOfChange } from "@/content/case";

// The intervention logic as a connected path. Each step can be opened, and the path shows how far
// the effect travels from the step in focus. Works fully with keyboard and without motion.
export function TheoryOfChange() {
  const [active, setActive] = useState(0);
  return (
    <div>
      <ol className="space-y-2" aria-label="How investment in ASEB Society travels outward">
        {theoryOfChange.map((step, i) => {
          const open = i === active;
          return (
            <li key={step.label} className="change-step" data-active={i <= active}>
              <button type="button" aria-expanded={open} aria-controls={`change-${i}`} onClick={() => setActive(i)} onFocus={() => setActive(i)}
                className="grid w-full grid-cols-[23px_1fr] items-start gap-4 py-2 text-left">
                <span className="change-dot mt-1" aria-hidden="true" />
                <span>
                  <span className={`block text-[0.6875rem] font-semibold uppercase tracking-[0.14em] ${open ? "text-signal" : "text-ivory/50"}`}>{step.label}</span>
                  <span className={`mt-1 block font-display text-[1.375rem] leading-snug transition-colors lg:text-[1.625rem] ${open ? "text-ivory" : "text-ivory/60 hover:text-ivory/85"}`}>{step.title}</span>
                </span>
              </button>
              <div id={`change-${i}`} hidden={!open} className="pb-4 pl-[39px]">
                <p className="max-w-md text-[0.9875rem] leading-relaxed text-ivory/75">{step.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="mt-6 flex items-center gap-3 border-t border-night-line pt-4 text-[0.8125rem] text-ivory/60">
        <span className="flex gap-1" aria-hidden="true">{theoryOfChange.map((s, i) => <span key={s.label} className={`h-1 w-6 rounded-full transition-colors ${i <= active ? "bg-signal" : "bg-night-line"}`} />)}</span>
        <span>{active === theoryOfChange.length - 1 ? "Long-term contribution, shared with many other actors." : "Select a step to follow the effect outward."}</span>
      </div>
    </div>
  );
}
