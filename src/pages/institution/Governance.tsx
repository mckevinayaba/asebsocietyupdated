import type { ReactNode } from "react";
import { PageHero, SectionHead } from "@/components/PageHero";
import { Btn, TLink } from "@/components/Arrow";
import { KeyGrid } from "@/components/Rows";
import { governancePrinciples, governanceStructure, stewardshipGoals, summitGovernance, summitPositioning } from "@/content/institution";
import { mandates } from "@/content/case";

const node = (key: string) => governanceStructure.find((g) => g.key === key)!;

// A short vertical rule joining one level of the structure to the next. Decorative only.
function Rule({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`mx-auto block h-8 w-px bg-ink/50 lg:h-10 ${className}`} />;
}

function Node({ k, tone = "plain", children }: { k: string; tone?: "lead" | "plain" | "quiet"; children?: ReactNode }) {
  const g = node(k);
  const surface = tone === "lead" ? "on-dark bg-ink text-ivory" : tone === "quiet" ? "bg-paper" : "bg-ivory";
  return (
    <div className={`relative h-full border border-ink/80 p-6 lg:p-7 ${surface}`}>
      <p className={`text-eyebrow font-semibold uppercase ${tone === "lead" ? "text-sand" : "text-umber"}`}>{g.kind}</p>
      <h3 className={`mt-3 font-display leading-tight ${tone === "lead" ? "text-[1.875rem] lg:text-[2.25rem]" : "text-[1.5rem]"}`}>{g.name}</h3>
      <p className={`mt-3 text-[0.9375rem] leading-relaxed ${tone === "lead" ? "text-ivory/80" : "text-stone"}`}>{g.summary}</p>
      {children}
    </div>
  );
}

export default function Governance() {
  return (
    <>
      <PageHero
        eyebrow="Governance"
        title="One institution. Shared purpose. Clear accountability."
        lede="ASEB Society operates through a unified governance structure that connects institutional oversight, executive leadership, programme delivery and practitioner participation. Every initiative advances a common institutional mandate: strengthening the practice and profession of ecosystem building across Africa."
      />

      <section className="section" aria-labelledby="structure-title">
        <div className="wrap">
          <SectionHead
            eyebrow="The structure"
            title={<span id="structure-title">One governing Board over everything the Society does.</span>}
            lede="Authority flows from the Board, through executive leadership, to the people who deliver the work. Specialist advice supports it. Award recipients are chosen independently of all of it."
          />

          <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-10">
            <ol className="lg:col-span-8" aria-label="Lines of authority in ASEB Society">
              <li><Node k="board" tone="lead" /></li>
              <li aria-hidden="true"><Rule /></li>
              <li><Node k="ceo" /></li>
              <li aria-hidden="true"><Rule /></li>
              <li>
                <div className="grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-ink/50">
                  {["committees", "secretariat", "representation"].map((k, i) => (
                    <div key={k} className={i > 0 ? "mt-6 sm:mt-0" : ""}>
                      <Rule className="!h-6 hidden sm:block" />
                      <Node k={k} tone={k === "secretariat" ? "plain" : "quiet"} />
                    </div>
                  ))}
                </div>
              </li>
              <li aria-hidden="true"><Rule /></li>
              <li>
                <div className="border border-ink/80 bg-mandate-surface p-6 lg:p-7">
                  <p className="text-eyebrow font-semibold uppercase text-teal">Delivered through four institutional pillars</p>
                  <ul className="mt-4 grid gap-px border-t border-hairline sm:grid-cols-2 lg:grid-cols-4">
                    {mandates.map((m) => (
                      <li key={m.key} className="border-b border-hairline py-3 sm:pr-4">
                        <TLink to={m.pathway.to}>{m.name}</TLink>
                        <p className="mt-1 text-[0.8125rem] leading-snug text-stone">{m.role}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </ol>

            <aside className="lg:col-span-4" aria-labelledby="jury-title">
              <div className="border border-dashed border-ink/60 p-6 lg:sticky lg:top-32 lg:p-7">
                <p className="text-eyebrow font-semibold uppercase text-umber">{node("jury").kind}</p>
                <h3 id="jury-title" className="mt-3 font-display text-[1.5rem] leading-tight">{node("jury").name}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-stone">{node("jury").summary}</p>
                <p className="mt-5 border-t border-hairline pt-5 text-[0.9375rem] leading-relaxed">It stands apart from the lines of authority on purpose. It is not a governing Board. Sponsors, institutional leadership and programme committees do not determine award recipients outside the approved assessment process.</p>
                <p className="mt-4 text-[0.875rem] leading-relaxed text-stone">Jurors declare conflicts of interest and step aside from any nominee they are connected to.</p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section border-t border-hairline bg-paper" aria-labelledby="who-decides-title">
        <div className="wrap">
          <SectionHead eyebrow="Who decides what" title={<span id="who-decides-title">Each role knows the limits of its authority.</span>} lede="Governing authority, executive responsibility, operational delivery, advisory participation, representation and independent assessment are kept distinct." />
          <ul className="mt-12 border-t border-ink">
            {governanceStructure.map((g) => (
              <li key={g.key} className="grid gap-3 border-b border-hairline py-7 lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-4">
                  <p className="text-eyebrow font-semibold uppercase text-umber">{g.kind}</p>
                  <h3 className="mt-2 font-display text-[1.375rem] leading-tight">{g.name}</h3>
                </div>
                <p className="text-[0.9875rem] leading-relaxed lg:col-span-4"><span className="block text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-teal">Responsible for</span>{g.holds}</p>
                <p className="text-[0.9875rem] leading-relaxed text-stone lg:col-span-4"><span className="block text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-stone">Does not</span>{g.doesNot}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="summit-governance-title">
        <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="eyebrow">The Summit & Awards</p>
            <h2 id="summit-governance-title" className="mt-5 text-display-sm">A flagship programme, not a separate institution.</h2>
          </div>
          <div className="space-y-5 text-[1.0625rem] leading-relaxed lg:col-span-6 lg:col-start-7">
            <p>{summitPositioning}</p>
            <p className="text-stone">{summitGovernance}</p>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap"><Btn to="/summit" variant="line">The Summit & Awards</Btn></div>
          </div>
        </div>
      </section>

      <section className="section border-t border-hairline bg-paper" aria-labelledby="principles-title">
        <div className="wrap">
          <SectionHead eyebrow="Principles" title={<span id="principles-title">How decisions are made.</span>} />
          <div className="mt-12"><KeyGrid cols={2} items={governancePrinciples.map((p) => ({ k: p.name, v: p.line }))} /></div>
          <div className="mt-14 grid gap-6 border-t border-hairline pt-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="font-display text-[1.5rem] leading-snug">The Charter, the Code of Conduct and the Transparency policy are in place. They are published to partners on request and will be made public once approved by the Board.</p>
              <p className="mt-5 text-[0.9375rem] leading-relaxed text-stone">This page sets out the Society's institutional direction. Where it requires a Board resolution or a change to governing documents, that change is presented to the Board for formal adoption, and existing appointments remain in place until the Board decides otherwise.</p>
            </div>
            <div className="lg:col-span-4 lg:col-start-9 lg:text-right"><Btn to="/get-involved#contact" variant="line">Request the governing documents</Btn></div>
          </div>
        </div>
      </section>

      <section id="goals" className="on-dark section scroll-mt-24 bg-ink text-ivory">
        <div className="wrap">
          <SectionHead
            eyebrow="The Nine Stewardship Goals"
            title="Constraints, not aspirations."
            lede="These goals emerged from years of practice across African ecosystems: repeated conversations about what keeps breaking. They are the Society's published commitments. How each is applied in formal policy is still being set out for Board approval."
          />
          <ol className="mt-14 border-t border-ivory/40">
            {stewardshipGoals.map((g) => (
              <li key={g.name} className="grid gap-3 border-b border-hairline-dark py-7 lg:grid-cols-12 lg:gap-10">
                <span aria-hidden="true" className="mt-3 block h-[2px] w-6 bg-signal" />
                <h3 className="font-display text-[1.5rem] leading-tight lg:col-span-4">{g.name}</h3>
                <div className="lg:col-span-7"><p className="text-[1rem] leading-relaxed text-stone-light">{g.line}</p><p className="mt-3 text-[0.9375rem] leading-relaxed text-ivory"><span className="font-semibold text-sand">In practice. </span>{g.practice}</p><p className="mt-1.5 text-[0.8125rem] text-stone-light">Carried through {g.through}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="eyebrow">For DFIs, foundations and institutional partners</p>
            <h2 className="mt-5 text-display-sm">Governance is not about control. It is about stewardship.</h2>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="text-[1.0625rem] leading-relaxed text-stone">Documented decision making, a written mandate for every committee, periodic financial and activity reporting, and clear rules on who can fundraise, decide and sign for the Society.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Btn to="/invest">Invest in Our Mission</Btn>
              <Btn to="/progress" variant="line">Institutional Progress</Btn>
              <Btn to="/people" variant="line">Leadership</Btn>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
