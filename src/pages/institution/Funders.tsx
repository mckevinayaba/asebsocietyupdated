import { PageHero, SectionHead } from "@/components/PageHero";
import { Btn } from "@/components/Arrow";
import { KeyGrid } from "@/components/Rows";
import { EoiForm } from "@/components/EoiForm";
import { funderNeeds, waysToFund, partnerTypes } from "@/content/institution";
import { proof } from "@/content/site";

export default function Funders() {
  return (
    <>
      <PageHero
        eyebrow="For funders and DFIs"
        title="Fund the builders. Multiply the founders."
        lede="Invest in the people and institutions that help African startups and enterprises begin, survive and grow. Funding their methods, capabilities and evidence strengthens the support available across successive cohorts of founders. ASEB Society connects development finance institutions, foundations and corporates to the practice of ecosystem building: its people, its standards and its priorities."
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a href="#enquire" className="btn btn-primary">Start a funder conversation <span className="arr" aria-hidden="true">↓</span></a>
          <Btn to="/work-with-us" variant="line">Commission work</Btn>
        </div>
      </PageHero>

      <section className="border-b border-hairline">
        <div className="wrap grid grid-cols-2 lg:grid-cols-4">
          {proof.map((p, i) => (
            <div key={p.label} className={`py-10 ${i % 2 ? "border-l border-hairline pl-5 lg:pl-8" : ""} ${i === 2 ? "lg:border-l lg:pl-8" : ""} ${i > 1 ? "border-t border-hairline lg:border-t-0" : ""}`}>
              <p className="numeral text-[2.5rem] leading-none">{p.value}</p>
              <p className="mt-3 text-[0.9375rem]">{p.label}</p>
              <p className="mt-1 text-[0.8125rem] text-stone">{p.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="mb-14 grid gap-6 border-l-2 border-signal pl-6 lg:grid-cols-2 lg:gap-12">
            <h2 className="font-display text-[2rem] leading-tight">Back the infrastructure founders rely on.</h2>
            <p className="text-[1.0625rem] leading-relaxed text-stone">A stronger startup hub can support successive cohorts, not just one venture. Better mentors, investment readiness, market connections and local coordination can benefit many entrepreneurs over time. Assess that leverage through the quality of support, the founders reached and the outcomes achieved, not a promised multiplier.</p>
          </div>
          <SectionHead eyebrow="In your language" title="What a results framework needs, the field already has." />
          <dl className="mt-12 border-t border-ink">
            {funderNeeds.map((f) => (
              <div key={f.need} className="grid gap-2 border-b border-hairline py-6 lg:grid-cols-12 lg:gap-10">
                <dt className="font-display text-[1.375rem] leading-tight lg:col-span-5">{f.need}</dt>
                <dd className="text-[1rem] leading-relaxed text-stone lg:col-span-7">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section border-t border-hairline bg-paper">
        <div className="wrap">
          <SectionHead eyebrow="Ways to fund" title="Six routes, from core infrastructure to a single country." />
          <div className="mt-12"><KeyGrid items={waysToFund.map((w) => ({ k: w.name, v: w.line }))} /></div>
        </div>
      </section>

      <section id="enquire" className="section scroll-mt-24">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <p className="eyebrow">Partner enquiry</p>
            <h2 className="mt-5 text-display-sm">Partnership is not logo placement.</h2>
            <p className="mt-5 text-[1rem] leading-relaxed text-stone">Partners commit to mission alignment, long-term stewardship, resource contribution and knowledge sharing. Tell us what you want the field to be able to do.</p>
          </div>
          <div className="min-w-0 lg:col-span-7 lg:col-start-6">
            <EoiForm
              source="/funders"
              submitLabel="Send enquiry"
              consent="I agree that ASEB Society may contact me about this enquiry."
              done={{ title: "Thank you. A partnership lead will be in touch.", body: "The Secretariat reviews every funder and partner enquiry and replies by email." }}
              fields={[
                { name: "partnerType", label: "Type of institution", type: "select", options: partnerTypes.map((p) => p.name), required: true },
                { name: "organisation", label: "Institution", required: true },
                { name: "contact", label: "Your name and title", required: true },
                { name: "email", label: "Email", type: "email", required: true },
                { name: "interest", label: "Area of interest", type: "select", options: waysToFund.map((w) => w.name), required: true },
                { name: "geography", label: "Countries or regions of focus" },
                { name: "message", label: "What would you like the field to be able to do?", type: "textarea", required: true },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
