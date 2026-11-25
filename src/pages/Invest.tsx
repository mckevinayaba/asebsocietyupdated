import { asset } from "@/lib/asset";
import { Btn, TLink } from "@/components/Arrow";
import { EoiForm } from "@/components/EoiForm";
import { TheoryOfChange } from "@/components/TheoryOfChange";
import { accountability, investmentAreas, positioning, problemThemes, publishedEvidence } from "@/content/case";
import { partnerTypes } from "@/content/institution";
import { programmeReadiness } from "@/content/platform";

const readinessRows = [
  { k: "ASEB Summit & Awards", v: "Operational since 2022, five editions in four host countries." },
  { k: "Membership applications", v: "Operational. Applications are stored privately for Secretariat review." },
  { k: "Field Registry", v: "Operational. A public archive of recognised practitioners and institutions." },
  { k: "ASEB Circles", v: programmeReadiness.circles.now },
  { k: "ASEB Academy", v: "In development. Learning priorities are being gathered; no courses or credentials are offered yet." },
  { k: "ASEB Field Lab", v: programmeReadiness["field-lab"].now },
];

const documents = ["Institutional concept note", "Programme proposals by mandate", "Governance and conflict of interest framework", "Country network activation plan"];

export default function Invest() {
  return (
    <>
      <section className="cinema cinema-dense on-dark" aria-labelledby="invest-title">
        <div className="cinema-media"><img src={asset("images/events/aseb-2026-recognised-builders.jpg")} alt="" className="object-[55%_center]" fetchPriority="high" /></div>
        <div className="cinema-grade" />
        <div className="wrap relative pb-14 pt-28 lg:pb-24 lg:pt-36">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-sand">Invest in Our Mission</p>
          <h1 id="invest-title" className="mt-5 max-w-[16ch] font-display text-hero">Fund the foundations of African entrepreneurship.</h1>
          <p className="mt-6 max-w-[36rem] text-[1.0625rem] leading-relaxed text-ivory/85 lg:text-[1.1875rem]">{positioning.statement} Investment in the Society reaches the practitioners and institutions that every founder depends on.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#enquire" className="btn btn-signal">Start an institutional conversation <span className="arr" aria-hidden="true">↓</span></a>
            <a href="#areas" className="btn btn-line">See where investment goes</a>
          </div>
          <p className="mt-10 text-[0.75rem] text-ivory/60">Recognised practitioners and institutions, ASEB 2026, Johannesburg · Photo: ASEB Society</p>
        </div>
      </section>

      <section className="section" aria-labelledby="case-title">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="eyebrow">The structural problem</p>
            <h2 id="case-title" className="mt-5 text-title">Entrepreneurs depend on support systems that are rarely funded as systems.</h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="text-[1.0625rem] leading-relaxed">Programmes fund founders and cohorts. Far less reaches the practitioners who design and run those programmes, the coordination between institutions, or the knowledge that should outlast each funding cycle.</p>
            <ul className="mt-8 border-t border-ink">{problemThemes.map((t) => <li key={t.name} className="grid gap-1 border-b border-hairline py-4 sm:grid-cols-[9rem_1fr] sm:gap-6"><span className="font-semibold">{t.name}</span><span className="text-stone">{t.line}</span></li>)}</ul>
            <ul className="mt-8 grid gap-6 sm:grid-cols-3">{publishedEvidence.map((e) => <li key={e.figure}><p className="numeral text-[1.75rem] leading-none text-ember">{e.figure}</p><p className="mt-2 text-[0.875rem] leading-snug text-stone">{e.claim}</p><a className="mt-2 inline-block text-[0.75rem] text-stone underline underline-offset-4 hover:text-ink" href={e.href} target="_blank" rel="noreferrer">{e.source}</a></li>)}</ul>
          </div>
        </div>
      </section>

      <section className="on-dark section bg-night text-ivory" aria-labelledby="logic-title">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5"><p className="eyebrow text-sand">The proposed intervention</p><h2 id="logic-title" className="mt-5 text-title">How investment travels outward.</h2><p className="mt-6 text-ivory/75">Each step is an intended outcome. The Society commits to reporting measured results only when evidence exists, and to separating its contribution from that of other actors.</p></div>
          <div className="lg:col-span-6 lg:col-start-7"><TheoryOfChange /></div>
        </div>
      </section>

      <section id="areas" className="section scroll-mt-28" aria-labelledby="areas-title">
        <div className="wrap">
          <p className="eyebrow">Investment areas</p>
          <h2 id="areas-title" className="mt-5 max-w-3xl text-title">Where support makes the greatest difference.</h2>
          <p className="lede mt-5 max-w-prose">No funding amounts are published. Each conversation starts from your priorities and the Society's operational readiness.</p>
          <ol className="mt-12 border-t border-ink">
            {investmentAreas.map((area) => (
              <li key={area.slug} id={area.slug} className="reveal grid scroll-mt-28 gap-3 border-b border-hairline py-7 lg:grid-cols-12 lg:gap-10">
                <h3 className="font-display text-[1.625rem] leading-tight lg:col-span-4">{area.name}</h3>
                <p className="text-[1rem] leading-relaxed text-stone lg:col-span-4">{area.purpose}</p>
                <p className="text-[1rem] leading-relaxed lg:col-span-4"><span className="block text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-teal">Intended outcome</span>{area.outcome}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section border-y border-hairline bg-paper" aria-labelledby="ready-title">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="eyebrow">Operational readiness</p>
            <h2 id="ready-title" className="mt-5 text-title">What exists today, stated plainly.</h2>
            <p className="lede mt-5">The Society is early in its institutional life, with a small Secretariat and limited resources. That is why founding investment matters, and why this page does not overstate capacity.</p>
            <div className="mt-6"><TLink to="/progress">Read the full progress record</TLink></div>
          </div>
          <dl className="border-t border-ink lg:col-span-6 lg:col-start-7">{readinessRows.map((r) => <div key={r.k} className="grid gap-1 border-b border-hairline py-4 sm:grid-cols-[12rem_1fr] sm:gap-6"><dt className="font-semibold">{r.k}</dt><dd className="text-[0.9375rem] text-stone">{r.v}</dd></div>)}</dl>
        </div>
      </section>

      <section className="section" aria-labelledby="accountability-title">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5"><p className="eyebrow">Accountability</p><h2 id="accountability-title" className="mt-5 text-title">How the Society answers for your investment.</h2></div>
          <dl className="grid gap-px self-start border border-hairline bg-hairline sm:grid-cols-2 lg:col-span-7">{accountability.map((a) => <div key={a.k} className="bg-ivory p-6"><dt className="font-display text-[1.25rem]">{a.k}</dt><dd className="mt-2 text-[0.9375rem] leading-relaxed text-stone">{a.v}</dd></div>)}</dl>
        </div>
      </section>

      <section id="enquire" className="section scroll-mt-28 border-t border-hairline bg-paper" aria-labelledby="enquire-title">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <p className="eyebrow">Institutional enquiry</p>
            <h2 id="enquire-title" className="mt-5 text-display-sm">Start a conversation with the Secretariat.</h2>
            <p className="mt-5 text-[1rem] leading-relaxed text-stone">Tell us where your priorities align. You can also request documents. They are shared on request and only once approved for release.</p>
            <ul className="mt-6 space-y-2 text-[0.9375rem]">{documents.map((d) => <li key={d} className="flex gap-3"><span className="mt-[0.65em] h-px w-4 shrink-0 bg-ember" aria-hidden="true" />{d}</li>)}</ul>
            <div className="mt-8 space-y-3 text-[0.9375rem]">
              <p>Prefer email? <a className="font-semibold underline underline-offset-4" href="mailto:aseb@asebsociety.org">aseb@asebsociety.org</a></p>
              <p><TLink to="/work-with-us">Commission research or delivery instead</TLink></p>
            </div>
          </div>
          <div className="min-w-0 lg:col-span-7 lg:col-start-6">
            <EoiForm
              source="/funders"
              submitLabel="Send institutional enquiry"
              consent="I agree that ASEB Society may contact me about this enquiry."
              done={{ title: "Thank you. Your enquiry is with the Secretariat.", body: "The Secretariat reviews every institutional enquiry and replies by email. Document requests are answered once the material is approved for release." }}
              fields={[
                { name: "partnerType", label: "Type of institution", type: "select", options: partnerTypes.map((p) => p.name), required: true },
                { name: "organisation", label: "Institution", required: true },
                { name: "contact", label: "Your name and title", required: true },
                { name: "email", label: "Email", type: "email", required: true },
                { name: "interest", label: "Area of interest", type: "select", options: [...investmentAreas.map((a) => a.name), "Request institutional documents"], required: true },
                { name: "geography", label: "Countries or regions of focus" },
                { name: "message", label: "Where do your priorities align with the Society's mandate?", type: "textarea", required: true },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="section-tight" aria-label="Other routes">
        <div className="wrap flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <p className="font-display text-[1.5rem]">{positioning.promise}</p>
          <div className="flex flex-col gap-3 sm:flex-row"><Btn to="/partners" variant="line">Institutional partnerships</Btn><Btn to="/funders" variant="line">Funders and DFIs</Btn></div>
        </div>
      </section>
    </>
  );
}
