import { Link } from "@/lib/router";
import { PageHero, SectionHead } from "@/components/PageHero";
import { KeyGrid } from "@/components/Rows";
import { EoiForm } from "@/components/EoiForm";
import { Arr } from "@/components/Arrow";
import { ambassadorDuties, ambassadorTypes } from "@/content/institution";
import { africanCountries } from "@/content/countries";

export default function Ambassadors() {
  return (
    <>
      <PageHero
        eyebrow="ASEB Society Ambassadors"
        title="Not a title. An obligation."
        lede="Ambassadors champion ecosystem building as a profession and steward the Society's mission in their communities, networks and spheres of influence. They commit three to five hours a month of active contribution."
      >
        <a href="#apply" className="btn btn-primary">Express interest <Arr dir="down" /></a>
      </PageHero>

      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Responsibilities" title="Four kinds of stewardship." />
          <div className="mt-12"><KeyGrid cols={2} items={ambassadorDuties.map((d) => ({ k: d.k, v: d.v }))} /></div>
        </div>
      </section>

      <section className="section border-t border-hairline bg-paper">
        <div className="wrap">
          <SectionHead eyebrow="Who we are looking for" title="Seven kinds of Ambassador." lede="Each type carries the practice into a different part of the field." />
          <ol className="mt-12 grid border-t border-ink sm:grid-cols-2 lg:grid-cols-3">
            {ambassadorTypes.map((t, i) => (
              <li key={t.name} className="border-b border-hairline py-7 sm:pr-8">
                <span aria-hidden="true" className="mt-3 block h-[2px] w-6 bg-signal" />
                <h3 className="mt-3 font-display text-[1.375rem] leading-tight">{t.name}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-stone">{t.who}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="on-dark section bg-ink text-ivory">
        <div className="wrap grid gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Ambassadorship is not</p>
            <ul className="mt-6 border-t border-hairline-dark text-[1.0625rem]">
              {["A badge for a profile", "A title without obligations", "Access to perks or visibility", "A passive affiliation"].map((x) => <li key={x} className="border-b border-hairline-dark py-4 text-stone-light">{x}</li>)}
            </ul>
          </div>
          <div>
            <p className="eyebrow">Ambassadorship is</p>
            <ul className="mt-6 border-t border-hairline-dark text-[1.0625rem]">
              {["Active stewardship in your community", "Commitment to professional standards", "Contribution to collective learning", "Responsibility for field development"].map((x) => <li key={x} className="border-b border-hairline-dark py-4">{x}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section id="apply" className="section scroll-mt-24">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <p className="eyebrow">Expression of interest</p>
            <h2 className="mt-5 text-display-sm">Ready to steward?</h2>
            <p className="mt-5 text-[1rem] leading-relaxed text-stone">If you cannot commit the time, Ambassadorship is not for you. If you can, you will be part of an institution professionalising essential work.</p>
            <p className="mt-5 text-[0.9375rem] text-stone">Ambassadors can progress to <Link to="/country-partners" className="underline underline-offset-4 hover:text-ink">Country Partner</Link>.</p>
          </div>
          <div className="min-w-0 lg:col-span-7 lg:col-start-6">
            <EoiForm
              source="/ambassadors"
              submitLabel="Submit expression of interest"
              consent="I can commit three to five hours a month and I commit to the ASEB Society Code of Practice."
              done={{ title: "Thank you. Your expression of interest is with the Secretariat.", body: "Your application is pending review. The Ambassador team can contact you about your proposed contribution; submission does not confer an appointment." }}
              fields={[
                { name: "type", label: "Ambassador type", type: "select", options: ambassadorTypes.map((t) => t.name), required: true },
                { name: "name", label: "Full name", required: true },
                { name: "email", label: "Email", type: "email", required: true },
                { name: "country", label: "Country", type: "select", options: [...africanCountries, "Diaspora, outside Africa"], required: true },
                { name: "city", label: "City", required: true },
                { name: "organisation", label: "Organisation" },
                { name: "linkedin", label: "LinkedIn", type: "url", full: true },
                { name: "reach", label: "Which communities and networks can you reach?", type: "textarea", required: true },
                { name: "plan", label: "What would you do in your first 90 days?", type: "textarea", required: true },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
