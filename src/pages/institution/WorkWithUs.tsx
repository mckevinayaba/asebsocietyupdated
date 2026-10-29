import { PageHero, SectionHead } from "@/components/PageHero";
import { Btn } from "@/components/Arrow";
import { EoiForm } from "@/components/EoiForm";
import { serviceLines, readiness, tenderSources } from "@/content/institution";

const steps = [
  { k: "Alert", v: "The Secretariat logs relevant funder tenders. Members see them filtered by country, service line, condition and SDG." },
  { k: "Interest", v: "Members and organisations mark interest as lead, partner or expert." },
  { k: "Consortium", v: "The Secretariat proposes a lead, the Country Partner and experts from the verified Expert Bench." },
  { k: "Integrity check", v: "Conflict-of-interest screening under the Code of Practice, then a go or no-go decision." },
  { k: "Bid and record", v: "The bid is prepared and submitted. Every award becomes a past-performance record for the field." },
];

export default function WorkWithUs() {
  return (
    <>
      <PageHero
        eyebrow="Work with us"
        title="Commission the field, not a single consultant."
        lede="ASEB Society designs, delivers and evaluates entrepreneurship, innovation and ecosystem-building work across Africa through its Secretariat, its Country Partners and a verified bench of practitioners. Governments, development finance institutions, foundations and corporates can commission us directly, invite us to tender, or bring us into a consortium."
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a href="#request" className="btn btn-primary">Request a capability statement <span className="arr" aria-hidden="true">↓</span></a>
          <Btn to="/funders" variant="line">For funders and DFIs</Btn>
        </div>
      </PageHero>

      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Service lines" title="Nine areas of delivery." lede="Each line is described in the language procurement teams use, with the evidence behind it." />
          <div className="mt-12 border-t border-ink">
            <div className="hidden grid-cols-12 gap-10 border-b border-hairline py-3 text-eyebrow font-semibold uppercase text-stone lg:grid">
              <span className="col-span-1">No.</span><span className="col-span-4">Service line</span><span className="col-span-4">Typical tender titles</span><span className="col-span-3">Evidence</span>
            </div>
            {serviceLines.map((s, i) => (
              <div key={s.name} className="grid gap-2 border-b border-hairline py-6 lg:grid-cols-12 lg:gap-10">
                <span className="numeral text-sm text-umber lg:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-display text-[1.375rem] leading-tight lg:col-span-4">{s.name}</h3>
                <p className="text-[0.9375rem] leading-relaxed lg:col-span-4">{s.titles}</p>
                <p className="text-[0.875rem] leading-relaxed text-stone lg:col-span-3">{s.evidence}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="on-dark section bg-ink text-ivory">
        <div className="wrap">
          <SectionHead eyebrow="The tenders desk" title="A source of paid work for the field." lede="Most African support organisations are too small to win large funder tenders alone. Together, through the Society, they can. A published management share goes to the Society; the rest goes to the members who deliver." />
          <ol className="mt-14 grid gap-px bg-hairline-dark sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((s, i) => (
              <li key={s.k} className="bg-ink py-7 sm:pr-6">
                <span className="numeral text-[2rem] leading-none text-signal">{i + 1}</span>
                <h3 className="mt-4 font-display text-[1.375rem]">{s.k}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-stone-light">{s.v}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid gap-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow">Procurement readiness</p>
            <h2 className="mt-5 text-display-sm">What we hold for every bid.</h2>
            <ul className="mt-8 border-t border-ink">
              {readiness.map((r, i) => (
                <li key={r} className="grid grid-cols-[2.5rem_1fr] border-b border-hairline py-4 text-[1rem] leading-relaxed">
                  <span className="numeral text-sm text-umber">{String(i + 1).padStart(2, "0")}</span>{r}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[0.8125rem] text-stone">Documents are shared with contracting authorities on request.</p>
          </div>
          <div>
            <p className="eyebrow">Where we monitor opportunities</p>
            <h2 className="mt-5 text-display-sm">Funder procurement channels.</h2>
            <ul className="mt-8 border-t border-ink">
              {tenderSources.map((t) => (
                <li key={t.name} className="border-b border-hairline py-5">
                  <a href={t.href} target="_blank" rel="noreferrer" className="font-display text-[1.25rem] hover:text-ember">{t.name} <span className="arr" aria-hidden="true">↗</span></a>
                  <p className="mt-1 text-[0.9375rem] leading-relaxed text-stone">{t.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="request" className="section scroll-mt-24 border-t border-hairline bg-paper">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <p className="eyebrow">Commission or invite to tender</p>
            <h2 className="mt-5 text-display-sm">Request the capability statement.</h2>
            <p className="mt-5 text-[1rem] leading-relaxed text-stone">Contracting authorities, lead bidders and consortium partners receive the capability statement, past-performance summary and compliance documents.</p>
          </div>
          <div className="min-w-0 lg:col-span-7 lg:col-start-6">
            <EoiForm
              table="partner_enquiries"
              submitLabel="Send request"
              consent="I agree that ASEB Society may contact me about this request."
              done={{ title: "Thank you. Your request is with the Secretariat.", body: "We will send the capability statement and reply on the opportunity within three working days." }}
              fields={[
                { name: "requestType", label: "Request", type: "choice", options: ["Capability statement", "Invitation to tender", "Consortium partnership", "Direct commission"], required: true },
                { name: "organisation", label: "Organisation", required: true },
                { name: "contact", label: "Your name and title", required: true },
                { name: "email", label: "Email", type: "email", required: true },
                { name: "service", label: "Service line", type: "select", options: serviceLines.map((s) => s.name) },
                { name: "deadline", label: "Submission deadline, if any" },
                { name: "message", label: "About the opportunity", type: "textarea", required: true },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
