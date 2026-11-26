import { useEffect } from "react";
import { useLocation } from "@/lib/router";
import { pillars } from "@/content/pillars";
import { standing, summitSocietyRelationship } from "@/content/proposition";
import { AnnualCycle } from "@/components/proposition/AnnualCycle";
import { PageHero, SectionHead } from "@/components/PageHero";
import { Btn } from "@/components/Arrow";
import { Photo } from "@/components/Photo";
import { programmeReadiness } from "@/content/platform";
import { TLink } from "@/components/Arrow";
import { pillarPhoto as registryPillarPhoto } from "@/content/photography";

const pillarPhoto: Record<string, { src: string; alt: string; caption: string } | undefined> = Object.fromEntries(
  (["summit", "circles", "academy", "field-lab"] as const).map((key) => [key, { src: registryPillarPhoto(key).src, alt: registryPillarPhoto(key).alt, caption: registryPillarPhoto(key).subject }]),
);

const chapters = [
  { k: "See the Field", v: "The Field Registry, the evidence and Insights." },
  { k: "Build the Field", v: "The Academy and the Field Lab." },
  { k: "Carry the Field Forward", v: "Circles, the commitments made and the next Summit." },
];

export default function WhatWeBuild() {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash]);

  return (
    <>
      <PageHero
        eyebrow="What we build"
        title="Four pillars. One year-round practice."
        lede="The Summit brings the field together. The Society sustains the work throughout the year, through Circles, the Academy and the Field Lab, with five knowledge products carrying it between gatherings. Explore each pillar and choose a pathway into the work."
      />

      <section className="section border-b border-hairline bg-paper" aria-labelledby="cycle-title">
        <div className="wrap">
          <SectionHead eyebrow="Beyond the annual gathering" title={<span id="cycle-title">One institutional cycle, all year.</span>} lede={summitSocietyRelationship} />
          <div className="mt-14"><AnnualCycle /></div>
        </div>
      </section>

      {pillars.map((p, idx) => {
        const ph = pillarPhoto[p.slug];
        const readiness = programmeReadiness[p.slug as keyof typeof programmeReadiness];
        return (
          <section key={p.slug} id={p.slug} className={`section scroll-mt-28 ${idx % 2 === 1 ? "bg-linen/50" : ""}`}>
            <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-5">
                <div className="flex items-baseline gap-4">
                  <span aria-hidden="true" className="block h-[3px] w-12 bg-signal" />
                  <span className="text-eyebrow font-semibold uppercase text-umber">{p.role}</span>
                </div>
                {readiness && <p className="mt-5 text-sm font-semibold text-teal">{readiness.mandate}</p>}
                <h2 className="mt-6 text-display-md">{p.name}</h2>
                <p className="mt-5 font-display text-[1.375rem] leading-snug">{p.line}</p>
                <p className="mt-6 text-[1.0625rem] leading-relaxed text-stone">{p.body}</p>
                {readiness && <><p className="mt-5 border-l-2 border-teal pl-4 text-base text-teal">{readiness.now}</p><div className="mt-6"><TLink to={readiness.to}>{readiness.action}</TLink></div></>}
                {ph && <Photo className="mt-10" src={ph.src} alt={ph.alt} caption={ph.caption} ratio="aspect-[3/2]" />}
              </div>
              <div className="lg:col-span-6 lg:col-start-7">
                <p className="text-eyebrow font-semibold uppercase text-stone">Programme directions</p>
                <p className="mt-2 text-[0.875rem] text-stone">Directions the pillar is developing. Only what its status describes is operating today.</p>
                <ul className="mt-5 border-t border-ink">
                  {p.programmes.map((g) => (
                    <li key={g.name} className="flex flex-wrap items-start justify-between gap-4 border-b border-hairline py-6">
                      <div className="min-w-0 flex-1 basis-[220px]">
                        <p className="font-display text-[1.375rem] leading-tight">{g.name}</p>
                        <p className="mt-2 text-[0.9375rem] leading-relaxed text-stone">{g.detail}</p>
                      </div>
                      
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        );
      })}

      <section id="pathway" className="on-dark section scroll-mt-28 bg-ink text-ivory" aria-labelledby="standing-title">
        <div className="wrap">
          <SectionHead
            eyebrow="Professional standing"
            title={<span id="standing-title">Different forms of standing, kept distinct.</span>}
            lede="Registering, applying, contributing and being recognised are different things. None confers another, and nothing on this platform is accreditation, certification or a professional designation."
          />
          <ul className="mt-14 border-t border-hairline-dark">
            {standing.map((l) => (
              <li key={l.name} className="grid gap-2 border-b border-hairline-dark py-6 lg:grid-cols-12 lg:items-baseline lg:gap-10">
                <span className="font-display text-[1.5rem] leading-tight lg:col-span-4">{l.name}</span>
                <p className="text-[1rem] leading-relaxed text-stone-light lg:col-span-6">{l.line}</p>
                <span className="text-[0.8125rem] font-semibold text-sand lg:col-span-2 lg:text-right">{l.status}</span>
              </li>
            ))}
          </ul>
          <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap"><Btn to="/join" variant="signal">Apply for membership</Btn><Btn to="/progress" variant="line">See what is operational</Btn></div>
        </div>
      </section>
    </>
  );
}
