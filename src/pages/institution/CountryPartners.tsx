import { Link } from "@/lib/router";
import { PageHero, SectionHead } from "@/components/PageHero";
import { KeyGrid } from "@/components/Rows";
import { EoiForm } from "@/components/EoiForm";
import { Arr } from "@/components/Arrow";
import { countryPartnerDuties, countryPartnerCriteria, countryLadder } from "@/content/institution";
import { asset } from "@/lib/asset";

export default function CountryPartners() {
  return (
    <>
      <PageHero
        eyebrow="Country Partners"
        title="One continental institution. Fifty-four countries of practice."
        lede="A Country Partner is the institution or senior practitioner who carries ASEB Society's work in one country: hosting the Country Circle, verifying the field's records, convening locally and connecting government, funders and builders. Country Partners are not franchises. Convenings stay locally led."
      >
        <a href="#apply" className="btn btn-primary">Express interest <Arr dir="down" /></a>
      </PageHero>

      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Proposed responsibilities" title="What a Country Partner would do." lede="Each appointment is agreed in writing, with a defined mandate, reporting and renewal. These are the responsibilities the Society proposes. The exact terms of each mandate are approved case by case." />
          <div className="mt-12"><KeyGrid items={countryPartnerDuties.map((d) => ({ k: d.k, v: d.v }))} /></div>
        </div>
      </section>

      <section className="section border-t border-hairline bg-paper">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <div className="photo aspect-square max-w-[300px]"><img src={asset("images/people/haymee-perez-cogle.jpg")} alt="Haymée I. Pérez Cogle, Country Partner for Angola" loading="lazy" /></div>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <p className="eyebrow">The first Country Partner</p>
            <h2 className="mt-5 text-display-sm">Angola, and the Lusophone corridor.</h2>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-stone">Haymée I. Pérez Cogle, Managing Director of Founder Institute Luanda, serves as Country Partner for Angola and Regional Ambassador for Lusophone Africa. Her role makes sure Portuguese-speaking ecosystems in Angola, Mozambique, Cabo Verde, Guinea-Bissau and São Tomé and Príncipe are not left at the margins of Africa's startup story.</p>
            <p className="mt-4 text-[0.9375rem]"><Link to="/people#haymee-perez-cogle" className="tlink">Read her profile <span className="arr" aria-hidden="true">→</span></Link></p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="presence-title">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="eyebrow">Where the Society stands today</p>
            <h2 id="presence-title" className="mt-5 text-display-sm">Reach is not representation.</h2>
            <p className="mt-5 text-[1rem] leading-relaxed text-stone">The ambition is credible representation across Africa. Today the Society distinguishes five different things, and only the first is representation. Nobody becomes a Country Partner or Ambassador by registering or applying.</p>
          </div>
          <dl className="border-t border-ink lg:col-span-6 lg:col-start-7">
            {[
              ["Appointed representatives", "One. Haymée I. Pérez Cogle, Country Partner for Angola and Regional Ambassador for Lusophone Africa."],
              ["Applicants", "Applications are stored privately for Secretariat review. They are not published and confer no role."],
              ["Emerging local mobilisation", "In Ethiopia, stakeholders began assembling a team after the 2025 Summit in Addis Ababa. It is an expression of interest, not an appointment."],
              ["Proposed country relationships", "Discussed only once agreed. None is announced before it is confirmed."],
              ["Historical event reach", "The ASEB Summit & Awards received nominations from 52 countries in 2026. That is reach, not national representation."],
            ].map(([k, v]) => <div key={k} className="grid gap-1 border-b border-hairline py-5 sm:grid-cols-[13rem_1fr] sm:gap-6"><dt className="font-semibold">{k}</dt><dd className="text-[0.9375rem] leading-relaxed text-stone">{v}</dd></div>)}
          </dl>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid gap-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow">Selection criteria</p>
            <ol className="mt-6 border-t border-ink">
              {countryPartnerCriteria.map((c, i) => (
                <li key={c} className="grid grid-cols-[2.5rem_1fr] border-b border-hairline py-5 text-[1rem] leading-relaxed">
                  <span aria-hidden="true" className="mt-3 block h-[2px] w-6 bg-signal" />{c}
                </li>
              ))}
            </ol>
          </div>
          <div>
            <p className="eyebrow">The ladder</p>
            <ol className="mt-6 border-t border-ink">
              {countryLadder.map((l) => (
                <li key={l.name} className="grid grid-cols-[2.5rem_1fr] border-b border-hairline py-5">
                  <span aria-hidden="true" className="mt-3 block h-[2px] w-6 bg-signal" />
                  <span><span className="block font-display text-[1.25rem]">{l.name}</span><span className="mt-1 block text-[0.9375rem] text-stone">{l.line}</span></span>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-[0.9375rem] leading-relaxed text-stone">An appointed Country Partner holds the role under a written agreement that sets its mandate, reporting, renewal and any right to co-deliver ASEB Society work in the country.</p>
          </div>
        </div>
      </section>

      <section id="apply" className="section scroll-mt-24 border-t border-hairline bg-paper">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <p className="eyebrow">Expression of interest</p>
            <h2 className="mt-5 text-display-sm">Carry the work in your country.</h2>
            <p className="mt-5 text-[1rem] leading-relaxed text-stone">The Secretariat reviews every expression of interest against the criteria and speaks to both referees. Expect a reply within four weeks.</p>
          </div>
          <div className="min-w-0 lg:col-span-7 lg:col-start-6">
            <EoiForm
              source="/country-partners"
              submitLabel="Submit expression of interest"
              consent="I have read the Country Partner obligations and commit to the ASEB Society Code of Practice."
              done={{ title: "Thank you. Your expression of interest is with the Secretariat.", body: "The Secretariat reviews it against the selection criteria and may contact your referees. Submitting does not confer an appointment." }}
              fields={[
                { name: "applicantType", label: "Applying as", type: "choice", options: ["An institution", "An individual practitioner"], required: true },
                { name: "name", label: "Full name", required: true },
                { name: "email", label: "Email", type: "email", required: true },
                { name: "country", label: "Country you would cover", type: "country", required: true },
                { name: "city", label: "City", required: true },
                { name: "organisation", label: "Organisation", required: true },
                { name: "years", label: "Years in ecosystem-building practice", type: "select", options: ["Under 5", "5 to 9", "10 to 14", "15 or more"], required: true },
                { name: "website", label: "LinkedIn or website", type: "url" },
                { name: "referees", label: "Two referees (name, organisation, email)", type: "textarea", required: true },
                { name: "motivation", label: "Why you, and why now (up to 300 words)", type: "textarea", required: true },
                { name: "plan", label: "Your first-year plan for the country (up to 300 words)", type: "textarea", required: true },
                { name: "conflicts", label: "Any conflicts of interest to declare", type: "textarea" },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
