import { PageHero } from "@/components/PageHero";
import { Btn } from "@/components/Arrow";
import { Photo } from "@/components/Photo";
import { photo, assignments } from "@/content/photography";

const paths = [
  { id: "practitioners", k: "Practitioners", h: "Join the Society and build your record of practice.", d: "Mentors, coaches, angel investors, ecosystem builders, media and wellbeing practitioners. Membership is the first step on the recognition pathway.", cta: "Join as a practitioner", to: "/join" },
  { id: "institutions", k: "Support institutions", h: "Register your institution in the Field Registry.", d: "Hubs, incubators, accelerators, ESOs, coworking spaces and education programmes. Benchmark against the Hub Standard and join a peer network of institution leaders.", cta: "Register an institution", to: "/join?type=organisation" },
  { id: "partner", k: "Funders and partners", h: "Fund the builders, not a single programme.", d: "Development finance institutions, foundations, corporates and public agencies can fund field infrastructure, a pillar, a country or a cohort, and draw on field-level evidence of outcomes.", cta: "For funders and DFIs", to: "/funders" },
  { id: "systems", k: "Government, research and universities", h: "Bring evidence and policy to the practitioners on the ground.", d: "Policy Bridge, the Research Council and the State of the Field connect systems builders with the people who implement change.", cta: "Work with the Society", to: "/join?intent=systems" },
  { id: "nominate", k: "Nominate", h: "Make a practitioner's work visible.", d: "Every nominee receives a record in the Field Registry. Nominations for ASEB 2027 open in 2027.", cta: "Register interest", to: "/join?intent=nominate" },
  { id: "country", k: "Country Partners", h: "Carry the field in your country.", d: "Institutions that verify records, host Country Circles and convene local Field Dialogues. Expressions of interest are open.", cta: "Express interest", to: "/country-partners" },
  { id: "ambassador", k: "Ambassadors", h: "Represent the Society where you work.", d: "Practitioners who represent ASEB Society in a country, a region, a language or a community, including the green economy.", cta: "Become an Ambassador", to: "/ambassadors" },
  { id: "collaborate", k: "Programmes", h: "Align your programme with the field.", d: "Accelerators, fellowships, research and policy programmes that advance ecosystem building can collaborate with the Society.", cta: "Propose a collaboration", to: "/collaborate" },
  { id: "work", k: "Commission", h: "Commission the field, or bring us into a bid.", d: "Ecosystem diagnostics, capacity building, programme design, evaluation and convening, delivered with practitioners on the ground.", cta: "Work with us", to: "/work-with-us" },
];

export default function GetInvolved() {
  return (
    <>
      <PageHero eyebrow="Get involved" title="Take your place in the field." lede="Every route into the Society begins with your role in the field. Choose the one that describes your work." />
      <section className="section">
        <div className="wrap">
          <ul className="border-t border-ink">
            {paths.map((p, i) => (
              <li key={p.id} id={p.id} className="reveal grid scroll-mt-28 gap-5 border-b border-hairline py-10 lg:grid-cols-12 lg:gap-10 lg:py-12">
                <div className="lg:col-span-2">
                  <span aria-hidden="true" className="mt-3 block h-[2px] w-6 bg-signal" />
                  <p className="mt-2 text-eyebrow font-semibold uppercase text-stone">{p.k}</p>
                </div>
                <div className="lg:col-span-6">
                  <h2 className="font-display text-[1.75rem] leading-tight lg:text-[2rem]">{p.h}</h2>
                  <p className="mt-4 text-[1rem] leading-relaxed text-stone">{p.d}</p>
                </div>
                <div className="lg:col-span-4 lg:text-right">
                  <Btn to={p.to} variant={i === 0 ? "primary" : "line"}>{p.cta}</Btn>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section id="contact" className="section-tight scroll-mt-24 border-t border-hairline">
        <div className="wrap grid gap-6 lg:grid-cols-12 lg:gap-10">
          <p className="eyebrow lg:col-span-4">Contact the Secretariat</p>
          <div className="lg:col-span-8">
            <a href="mailto:aseb@asebsociety.org" className="font-display text-[1.75rem] hover:text-ember lg:text-[2.25rem]">aseb@asebsociety.org</a>
            <p className="mt-3 text-[0.9375rem] text-stone">Johannesburg, South Africa. We reply within five working days.</p>
          </div>
        </div>
      </section>
      <section className="pb-[72px] pt-[72px] lg:pb-32">
        <div className="wrap">
          <Photo src={photo(assignments.getInvolved.closing).src} alt={photo(assignments.getInvolved.closing).alt} caption="In discussion at the ASEB Summit 2024, Accra" ratio="aspect-[16/9] lg:aspect-[21/9]" />
        </div>
      </section>
    </>
  );
}
