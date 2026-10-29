import { PageHero, SectionHead } from "@/components/PageHero";
import { KeyGrid } from "@/components/Rows";
import { EoiForm } from "@/components/EoiForm";
import { Arr } from "@/components/Arrow";
import { programmeStandard, collaborationModels } from "@/content/institution";

export default function Collaborate() {
  return (
    <>
      <PageHero
        eyebrow="Programme Collaborations"
        title="If your programme advances ecosystem building, align it with the field."
        lede="ASEB Society is open to collaboration with every programme, network, fellowship, academy, index and accelerator that strengthens African ecosystem building. We do not compete with your programme. We connect it to the field, its evidence and its people."
      >
        <a href="#apply" className="btn btn-primary">Propose a collaboration <Arr dir="down" /></a>
      </PageHero>

      <section className="section">
        <div className="wrap">
          <SectionHead
            eyebrow="ASEB-aligned Programme"
            title="Five tests of the Programme Standard."
            lede="Programmes that meet the Standard can carry the ASEB-aligned Programme designation, appear on the Programme Register and count towards their alumni's professional designations."
          />
          <ol className="mt-12 grid border-t border-ink sm:grid-cols-2 lg:grid-cols-5">
            {programmeStandard.map((s, i) => (
              <li key={s.k} className="border-b border-hairline py-7 sm:pr-6">
                <span className="numeral text-[2rem] leading-none text-ember">{i + 1}</span>
                <h3 className="mt-4 font-display text-[1.375rem]">{s.k}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-stone">{s.v}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section border-t border-hairline bg-paper">
        <div className="wrap">
          <SectionHead eyebrow="Collaboration models" title="Five ways to work together." />
          <div className="mt-12"><KeyGrid items={collaborationModels.map((m) => ({ k: m.name, v: m.line }))} /></div>
          <div className="mt-12 grid gap-6 border-t border-hairline pt-8 text-[0.9375rem] leading-relaxed text-stone lg:grid-cols-3">
            <p><span className="font-semibold text-ink">Co-badging.</span> The ASEB mark appears only on agreed outputs and always alongside yours.</p>
            <p><span className="font-semibold text-ink">No implied endorsement.</span> Alignment recognises practice. It does not endorse founder outcomes.</p>
            <p><span className="font-semibold text-ink">Accountability.</span> The designation is reviewed each year and withdrawn if the Standard is breached.</p>
          </div>
        </div>
      </section>

      <section id="apply" className="section scroll-mt-24">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <p className="eyebrow">Expression of interest</p>
            <h2 className="mt-5 text-display-sm">Tell us about your programme.</h2>
            <p className="mt-5 text-[1rem] leading-relaxed text-stone">The Secretariat will propose a collaboration model within three weeks.</p>
          </div>
          <div className="min-w-0 lg:col-span-7 lg:col-start-6">
            <EoiForm
              table="collaboration_eoi"
              submitLabel="Propose a collaboration"
              consent="Our programme is willing to work to the ASEB Programme Standard and the Code of Practice."
              done={{ title: "Thank you. Your proposal is with the Secretariat.", body: "We will review it and propose a collaboration model within three weeks." }}
              fields={[
                { name: "programme", label: "Programme name", required: true },
                { name: "leadOrg", label: "Lead organisation", required: true },
                { name: "contact", label: "Contact name", required: true },
                { name: "email", label: "Email", type: "email", required: true },
                { name: "type", label: "Programme type", type: "select", options: ["Accelerator or incubator", "Hub or network", "Fellowship or academy", "Research or index", "Funding programme", "Policy programme", "Corporate programme", "Other"], required: true },
                { name: "countries", label: "Countries covered", required: true },
                { name: "model", label: "Preferred collaboration model", type: "select", options: collaborationModels.map((m) => m.name), required: true },
                { name: "website", label: "Website", type: "url" },
                { name: "sdgs", label: "SDGs addressed (numbers)", hint: "For example: 5, 8, 9, 13" },
                { name: "conditions", label: "Conditions addressed", hint: "From the seven conditions of the Framework" },
                { name: "summary", label: "Summary of the programme and the proposed collaboration (up to 300 words)", type: "textarea", required: true },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
