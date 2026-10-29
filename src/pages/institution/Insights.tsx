import { PageHero, SectionHead } from "@/components/PageHero";
import { Btn, TLink } from "@/components/Arrow";
import { EoiForm } from "@/components/EoiForm";
import { insightCategories } from "@/content/institution";
import { evidence } from "@/content/evidence";

export default function Insights() {
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="If we do not document our ecosystems, someone else will define them."
        lede="Insights is the field's own record: research, case studies, tools and practitioner stories, authored by the people embedded in African ecosystems. Every piece carries an author, a date, a country and the conditions and goals it speaks to."
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a href="#contribute" className="btn btn-primary">Contribute an insight <span className="arr" aria-hidden="true">↓</span></a>
          <Btn to="/evidence" variant="line">Evidence Library</Btn>
        </div>
      </PageHero>

      <section className="section">
        <div className="wrap">
          <div className="grid border-t border-ink sm:grid-cols-2 lg:grid-cols-4">
            {insightCategories.map((c, i) => (
              <div key={c.name} className="border-b border-hairline py-7 sm:pr-6">
                <span className="numeral text-sm text-umber">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="mt-3 font-display text-[1.5rem]">{c.name}</h2>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-stone">{c.line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-hairline bg-paper">
        <div className="wrap">
          <SectionHead eyebrow="Now in the library" title="Research the field is using." lede="The first entries come from the Evidence Library, including the open research presented at ASEB 2026." aside={<TLink to="/evidence">Open the Evidence Library</TLink>} />
          <ul className="mt-12 border-t border-ink">
            {evidence.slice(0, 5).map((e) => (
              <li key={e.title} className="grid gap-2 border-b border-hairline py-6 lg:grid-cols-12 lg:gap-10">
                <span className="text-eyebrow font-semibold uppercase text-umber lg:col-span-2">{e.kind === "Summit session" ? "Practitioner Stories" : e.kind === "Dataset" || e.kind === "Paper" || e.kind === "Research programme" ? "Research" : "Tools and Frameworks"}</span>
                <a href={e.href} target="_blank" rel="noreferrer" className="font-display text-[1.375rem] leading-tight hover:text-ember lg:col-span-6">{e.title} <span className="arr text-[1rem]" aria-hidden="true">↗</span></a>
                <p className="text-[0.875rem] text-stone lg:col-span-4">{e.authors}, {e.year}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="contribute" className="section scroll-mt-24">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <p className="eyebrow">Contribute</p>
            <h2 className="mt-5 text-display-sm">Put your practice on the record.</h2>
            <p className="mt-5 text-[1rem] leading-relaxed text-stone">Pitch a case study, a tool or a practitioner story. The editorial team reviews every pitch for evidence, attribution and usefulness to practitioners.</p>
          </div>
          <div className="min-w-0 lg:col-span-7 lg:col-start-6">
            <EoiForm
              table="insight_pitches"
              submitLabel="Send pitch"
              consent="The work is mine or my organisation's to share, and it credits the people and institutions it draws on."
              done={{ title: "Thank you. Your pitch is with the editorial team.", body: "We reply to every pitch within three weeks." }}
              fields={[
                { name: "category", label: "Category", type: "choice", options: insightCategories.map((c) => c.name), required: true },
                { name: "name", label: "Your name", required: true },
                { name: "email", label: "Email", type: "email", required: true },
                { name: "country", label: "Country", type: "country", required: true },
                { name: "organisation", label: "Organisation" },
                { name: "title", label: "Working title", required: true, full: true },
                { name: "summary", label: "What will a practitioner learn? (up to 200 words)", type: "textarea", required: true },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
