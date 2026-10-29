import { useState } from "react";
import { ladder } from "@/content/framework";
import { questions, recommendStep, type Answers } from "@/lib/ladder-assessment";
import { Btn } from "@/components/Arrow";

export function LadderAssessment() {
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [i, setI] = useState(0);
  const done = i >= questions.length;
  const step = done ? recommendStep(answers as Answers) : -1;
  const current = questions[i];

  const pick = (v: number) => {
    setAnswers((a) => ({ ...a, [current!.key]: v }));
    setI((n) => n + 1);
  };

  return (
    <div className="border-t border-ink pt-8">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-eyebrow font-semibold uppercase text-umber">Find your place · 2 minutes</p>
        <p className="numeral text-sm text-stone">{Math.min(i + 1, questions.length)} / {questions.length}</p>
      </div>
      <div className="mt-3 h-[3px] bg-linen" aria-hidden="true">
        <div className="h-full bg-signal transition-all duration-500" style={{ width: `${(i / questions.length) * 100}%` }} />
      </div>

      {!done && current && (
        <div className="mt-8" aria-live="polite">
          <p className="font-display text-[1.75rem] leading-snug lg:text-[2rem]">{current.q}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {current.options.map((o, v) => (
              <button key={o} type="button" onClick={() => pick(v)}
                className="border border-hairline bg-ivory px-5 py-4 text-left text-[0.9375rem] transition-colors hover:border-ink hover:bg-paper">
                {o}
              </button>
            ))}
          </div>
          {i > 0 && (
            <button type="button" onClick={() => setI((n) => n - 1)} className="mt-5 text-sm text-stone hover:text-ember">← Back</button>
          )}
        </div>
      )}

      {done && (
        <div className="mt-8" aria-live="polite">
          <p className="text-sm text-stone">Your next step on the path of practice</p>
          <p className="mt-2 font-display text-[2.25rem] leading-tight">{ladder[step]!.name}</p>
          <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-stone">{ladder[step]!.how}</p>
          <ol className="mt-6 flex gap-1.5" aria-label="Ladder of practice">
            {ladder.map((l, n) => (
              <li key={l.step} title={l.name} className={`h-2 flex-1 ${n <= step ? "bg-signal" : "bg-linen"}`} />
            ))}
          </ol>
          <p className="mt-6 text-[0.9375rem]">You already belong to this field. Joining gives your work a name, a record and a path forward.</p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Btn to="/join">Join and begin here</Btn>
            <button type="button" onClick={() => { setAnswers({}); setI(0); }} className="text-sm text-stone hover:text-ember">Start again</button>
          </div>
          <p className="mt-4 text-[0.8125rem] text-stone">An indication only. Designations are confirmed through review of evidence.</p>
        </div>
      )}
    </div>
  );
}
