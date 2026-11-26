import { conditions, practiceProfession, domains } from "@/content/framework";
import { statements } from "@/content/site";
import { aeeiCredit } from "@/content/evidence";
import { PageHero, SectionHead } from "@/components/PageHero";
import { Btn, TLink } from "@/components/Arrow";

export default function Framework() {
  return (
    <>
      <PageHero
        eyebrow="The ASEB Society Framework"
        title="Seven conditions. One practice."
        lede={statements.definition}
      />

      <section className="section">
        <div className="wrap">
          <SectionHead
            eyebrow="Practice and profession"
            title="Every description of ASEB Society carries both words."
            lede="Practice is the work. Profession is the people who do it, and the standing they hold."
          />
          <div className="mt-14 grid border-t border-ink lg:grid-cols-2">
            {practiceProfession.map((p, i) => (
              <div key={p.term} className={`py-10 ${i === 1 ? "border-t border-hairline lg:border-l lg:border-t-0 lg:pl-12" : "lg:pr-12"}`}>
                <h3 className="text-[2.5rem] leading-none">{p.term}</h3>
                <dl className="mt-8 space-y-6 text-[0.9375rem]">
                  <div><dt className="text-eyebrow font-semibold uppercase text-umber">What it means</dt><dd className="mt-2 leading-relaxed">{p.means}</dd></div>
                  <div><dt className="text-eyebrow font-semibold uppercase text-umber">What ASEB Society builds</dt><dd className="mt-2 leading-relaxed">{p.builds}</dd></div>
                  <div><dt className="text-eyebrow font-semibold uppercase text-umber">Where it shows</dt><dd className="mt-2 leading-relaxed text-stone">{p.shows}</dd></div>
                </dl>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-hairline bg-paper">
        <div className="wrap">
          <SectionHead
            eyebrow="The seven conditions"
            title="What ecosystem builders strengthen."
            lede="Measure with the dimensions of the Africa Entrepreneurial Ecosystem Index. Practise with the ASEB Society Framework's conditions. Future Academy learning and Field Lab projects will be tagged to them."
          />
          <div className="mt-14 overflow-x-auto" tabIndex={0} role="region" aria-label="The seven conditions table">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-ink text-eyebrow font-semibold uppercase text-stone">
                  <th className="w-14 py-4 font-semibold">No.</th>
                  <th className="py-4 font-semibold">Condition</th>
                  <th className="py-4 font-semibold">In practice</th>
                  <th className="py-4 font-semibold">AEEI dimension</th>
                  <th className="py-4 text-right font-semibold">Fit</th>
                </tr>
              </thead>
              <tbody>
                {conditions.map((c) => (
                  <tr key={c.n} className="border-b border-hairline align-top">
                    <td className="w-8 py-6 align-top"><span aria-hidden="true" className="mt-3 block h-[2px] w-4 bg-signal" /></td>
                    <td className="py-6 pr-6">
                      <p className="font-display text-[1.375rem] leading-tight">{c.name}</p>
                      <p className="mt-2 max-w-sm text-[0.875rem] leading-relaxed text-stone">{c.summary}</p>
                    </td>
                    <td className="max-w-xs py-6 pr-6 text-[0.9375rem] leading-relaxed">{c.practice}</td>
                    <td className="py-6 pr-6 text-[0.9375rem] font-medium">{c.aeei}</td>
                    <td className={`py-6 text-right text-[0.875rem] font-semibold ${c.fit === "Direct" ? "text-ember" : "text-stone"}`}>{c.fit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 max-w-3xl text-[0.8125rem] leading-relaxed text-stone">
            {aeeiCredit} The alignment is ASEB Society's own reading and is offered for review by the index authors before it is published as an ASEB Society standard.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="eyebrow">The competency framework</p>
            <h2 className="mt-5 text-display-sm">Eight domains of professional practice.</h2>
            <p className="lede mt-6">Award categories draw on these domains, and future Academy learning and Field Lab work will be organised around them. They describe competence. They are not an accreditation standard.</p>
            <div className="mt-8"><TLink to="/what-we-build#pathway">See the recognition pathway</TLink></div>
          </div>
          <ol className="grid border-t border-ink sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
            {domains.map((d, i) => (
              <li key={d} className={`flex items-baseline gap-4 border-b border-hairline py-5 ${i % 2 === 1 ? "sm:border-l sm:pl-6" : "sm:pr-6"}`}>
                <span aria-hidden="true" className="block h-1.5 w-1.5 shrink-0 -translate-y-[0.2em] rounded-full bg-signal" />
                <span className="text-[1.0625rem] leading-snug">{d}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="on-dark section-tight bg-ink text-ivory">
        <div className="wrap flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-2xl font-display text-[1.75rem] leading-snug lg:text-[2.25rem]">{statements.indexLine}</p>
          <div className="flex flex-col gap-3 sm:flex-row"><Btn to="/evidence" variant="signal">The Evidence Library</Btn><Btn to="/playbook/local-conditions" variant="line">Contribute to the Playbook</Btn></div>
        </div>
      </section>
    </>
  );
}
