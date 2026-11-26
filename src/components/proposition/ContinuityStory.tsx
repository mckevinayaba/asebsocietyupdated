import { Photo } from "@/components/Photo";
import { continuity } from "@/content/proposition";
import { photo, assignments } from "@/content/photography";

// The human experience behind ecosystem building. A thread that loses strength each time continuity
// breaks: the picture of knowledge leaving the field. The situation is illustrative and is never
// attributed to anyone in the photograph.
export function ContinuityStory() {
  const p = photo(assignments.home.question);
  return (
    <section className="section border-t border-hairline bg-paper" aria-labelledby="continuity-title">
      <div className="wrap">
        <p className="eyebrow">The overlooked problem</p>
        <h2 id="continuity-title" className="mt-5 max-w-[20ch] font-display text-title">{continuity.title}</h2>
        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Photo src={p.src} alt={p.alt} caption="Ecosystem builders at the ASEB Summit & Awards 2024, Accra" ratio="aspect-[4/5]" position="50% center" />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="text-[1.125rem] leading-relaxed">{continuity.opening}</p>
            <figure className="mt-10 border-t border-ink pt-6">
              <figcaption className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-umber">{continuity.label}</figcaption>
              <p className="mt-4 text-[1.0625rem] leading-relaxed text-stone">{continuity.situation}</p>
              <ol className="mt-7" aria-label="Moments when continuity breaks">
                {continuity.breaks.map((line, i) => (
                  <li key={line} className="reveal grid grid-cols-[4.5rem_1fr] items-center gap-4 py-2.5">
                    <span aria-hidden="true" className="flex items-center gap-1">
                      <span className="h-[3px] bg-signal" style={{ width: `${100 - i * 22}%`, opacity: 1 - i * 0.22 }} />
                    </span>
                    <span className="font-display text-[1.375rem] leading-snug lg:text-[1.625rem]">{line}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-8 font-display text-[1.5rem] leading-snug text-ember lg:text-[1.75rem]">{continuity.question}</p>
              <p className="mt-4 text-[1.0625rem] leading-relaxed text-stone">{continuity.consequence}</p>
            </figure>
            <p className="mt-8 border-l-2 border-signal pl-5 text-[1.0625rem] leading-relaxed">{continuity.response}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
