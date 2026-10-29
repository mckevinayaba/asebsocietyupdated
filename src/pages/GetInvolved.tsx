import { PageHero } from "@/components/PageHero";
import { Btn } from "@/components/Arrow";
import { Photo } from "@/components/Photo";

const paths = [
  { id: "practitioners", k: "Practitioners", h: "Join the Society and build your record of practice.", d: "Mentors, coaches, angel investors, ecosystem builders, media and wellbeing practitioners. Membership is the first step on the recognition pathway.", cta: "Join as a practitioner", to: "/join" },
  { id: "institutions", k: "Support institutions", h: "Register your institution in the Field Registry.", d: "Hubs, incubators, accelerators, ESOs, coworking spaces and education programmes. Benchmark against the Hub Standard and join a peer network of institution leaders.", cta: "Register an institution", to: "/join?type=organisation" },
  { id: "partner", k: "Funders and partners", h: "Fund the field, not a single programme.", d: "Development partners, foundations and corporates can co-fund Field Lab projects, sponsor an Academy cohort or an Awards category, and draw on field-level evidence of outcomes.", cta: "Start a partner conversation", to: "/join?intent=partner" },
  { id: "systems", k: "Government, research and universities", h: "Bring evidence and policy to the practitioners on the ground.", d: "Policy Bridge, the Research Council and the State of the Field connect systems builders with the people who implement change.", cta: "Work with the Society", to: "/join?intent=systems" },
  { id: "nominate", k: "Nominate", h: "Make a practitioner's work visible.", d: "Every nominee receives a record in the Field Registry. Nominations for ASEB 2027 open in 2027.", cta: "Register interest", to: "/join?intent=nominate" },
  { id: "steward", k: "Country Stewards", h: "Hold the field together in your country.", d: "Stewards verify records, host Country Circles and convene local Field Dialogues. Recruitment begins in the twenty most active countries.", cta: "Express interest", to: "/join?intent=steward" },
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
                  <span className="numeral text-sm text-umber">{String(i + 1).padStart(2, "0")}</span>
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
      <section className="pb-[72px] lg:pb-32">
        <div className="wrap">
          <Photo src="images/events/aseb-summit-panel.jpg" alt="Practitioners in conversation at the ASEB Summit" caption="Practitioners in conversation at the ASEB Summit" ratio="aspect-[16/9] lg:aspect-[21/9]" />
        </div>
      </section>
    </>
  );
}
