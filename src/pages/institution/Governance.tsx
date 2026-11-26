import { PageHero, SectionHead } from "@/components/PageHero";
import { Btn } from "@/components/Arrow";
import { KeyGrid } from "@/components/Rows";
import { governanceLayers, governancePrinciples, stewardshipGoals } from "@/content/institution";

export default function Governance() {
  return (
    <>
      <PageHero
        eyebrow="Governance"
        title="Built to protect the field, not personalities."
        lede="ASEB Society is a pan-African, not-for-profit institution. Its governance is a tool to protect the profession of ecosystem building, safeguard credibility and make sure what we build outlives founders, funders and funding cycles."
      />

      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Structure" title="Three layers, each with a defined mandate." lede="Legal authority, product integrity and field voice are deliberately separated." />
          <div className="mt-14 grid gap-px border-t border-ink bg-hairline lg:grid-cols-3">
            {governanceLayers.map((g) => (
              <div key={g.name} className="bg-ivory py-8 lg:px-8 lg:first:pl-0">
                <span aria-hidden="true" className="mt-3 block h-[2px] w-6 bg-signal" />
                <p className="mt-4 text-eyebrow font-semibold uppercase text-stone">{g.kind}</p>
                <h3 className="mt-2 font-display text-[1.625rem] leading-tight">{g.name}</h3>
                <ul className="mt-5 space-y-3 text-[0.9375rem] leading-relaxed text-stone">
                  {g.points.map((p) => <li key={p} className="border-t border-hairline pt-3">{p}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-hairline bg-paper">
        <div className="wrap">
          <SectionHead eyebrow="Principles" title="How decisions are made." />
          <div className="mt-12"><KeyGrid cols={2} items={governancePrinciples.map((p) => ({ k: p.name, v: p.line }))} /></div>
          <div className="mt-14 grid gap-6 border-t border-hairline pt-10 lg:grid-cols-12">
            <p className="font-display text-[1.5rem] leading-snug lg:col-span-6">The Charter, the Code of Conduct and the Transparency policy are in place. They are published to partners on request and will be made public once approved by the Board.</p>
            <div className="lg:col-span-5 lg:col-start-8 lg:text-right"><Btn to="/get-involved#contact" variant="line">Request the governing documents</Btn></div>
          </div>
        </div>
      </section>

      <section id="goals" className="on-dark section scroll-mt-24 bg-ink text-ivory">
        <div className="wrap">
          <SectionHead
            eyebrow="The Nine Stewardship Goals"
            title="Constraints, not aspirations."
            lede="These goals emerged from years of practice across African ecosystems: repeated conversations about what keeps breaking. They govern our programmes, partnerships, membership decisions and recognition. Anything that contradicts them does not belong within ASEB Society."
          />
          <ol className="mt-14 border-t border-ivory/40">
            {stewardshipGoals.map((g, i) => (
              <li key={g.name} className="grid gap-3 border-b border-hairline-dark py-7 lg:grid-cols-12 lg:gap-10">
                <span aria-hidden="true" className="mt-3 block h-[2px] w-6 bg-signal" />
                <h3 className="font-display text-[1.5rem] leading-tight lg:col-span-4">{g.name}</h3>
                <p className="text-[1rem] leading-relaxed text-stone-light lg:col-span-7">{g.line}</p>
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
            <p className="text-[1.0625rem] leading-relaxed text-stone">Documented decision-making, visible advisory mandates, periodic financial and activity reporting, and clear rules on who can fundraise, decide and sign for the Society.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Btn to="/funders">For funders and DFIs</Btn>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
