import { useEffect } from "react";
import { useLocation } from "@/lib/router";
import { pillars } from "@/content/pillars";
import { ladder } from "@/content/framework";
import { PageHero, SectionHead } from "@/components/PageHero";
import { Btn } from "@/components/Arrow";
import { Photo } from "@/components/Photo";
import { programmeReadiness } from "@/content/platform";
import { ProgrammeStatus } from "@/components/ProgrammeStatus";
import { TLink } from "@/components/Arrow";

const pillarPhoto: Record<string, { src: string; alt: string; caption: string } | undefined> = {
  summit: { src: "images/events/aseb-2026-recognised-builders.jpg", alt: "Recognised practitioners at ASEB 2026", caption: "ASEB 2026, Johannesburg" },
  circles: { src: "images/events/aseb-networking.jpg", alt: "Practitioners connecting between sessions at an ASEB gathering", caption: "Finding your people at an ASEB gathering" },
};

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
        lede="The Summit brings the field together. The Society is building year-round support through Circles, learning and collaborative projects. See what is available today and what is still in development."
      />

      <section className="border-b border-hairline bg-paper">
        <div className="wrap grid lg:grid-cols-3">
          {chapters.map((c, i) => (
            <div key={c.k} className={`py-10 ${i > 0 ? "border-t border-hairline lg:border-l lg:border-t-0 lg:pl-10" : "lg:pr-10"}`}>
              <span aria-hidden="true" className="block h-[2px] w-8 bg-signal" />
              <p className="mt-5 font-display text-[1.625rem] leading-tight">{c.k}</p>
              <p className="mt-2 text-[0.9375rem] text-stone">{c.v}</p>
            </div>
          ))}
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
                {readiness && <div className="mt-5"><ProgrammeStatus status={readiness.status} /></div>}
                <h2 className="mt-6 text-display-md">{p.name}</h2>
                <p className="mt-5 font-display text-[1.375rem] leading-snug">{p.line}</p>
                <p className="mt-6 text-[1.0625rem] leading-relaxed text-stone">{p.body}</p>
                {readiness && <><p className="mt-5 border-l-2 border-teal pl-4 text-base text-teal">{readiness.now}</p><div className="mt-6"><TLink to={readiness.to}>{readiness.action}</TLink></div></>}
                {ph && <Photo className="mt-10" src={ph.src} alt={ph.alt} caption={ph.caption} ratio="aspect-[3/2]" />}
              </div>
              <div className="lg:col-span-6 lg:col-start-7">
                <p className="text-eyebrow font-semibold uppercase text-stone">Programmes</p>
                <ul className="mt-5 border-t border-ink">
                  {p.programmes.map((g) => (
                    <li key={g.name} className="flex flex-wrap items-start justify-between gap-4 border-b border-hairline py-6">
                      <div className="min-w-0 flex-1 basis-[220px]">
                        <p className="font-display text-[1.375rem] leading-tight">{g.name}</p>
                        <p className="mt-2 text-[0.9375rem] leading-relaxed text-stone">{g.detail}</p>
                      </div>
                      <ProgrammeStatus status={g.status === "Live" ? "Available" : g.status} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        );
      })}

      <section id="pathway" className="on-dark section scroll-mt-28 bg-ink text-ivory">
        <div className="wrap">
          <SectionHead
            eyebrow="The recognition pathway"
            title="A proposed pathway for professional growth."
            lede="These designations describe the intended direction of professional development, not credentials available today. Assessment, standards and governance must be operational before any professional certification is issued."
          />
          <ol className="mt-16 border-t border-hairline-dark">
            {ladder.map((l, i) => (
              <li key={l.step} className="grid gap-3 border-b border-hairline-dark py-8 lg:grid-cols-12 lg:items-baseline lg:gap-10">
                <span aria-hidden="true" className="hidden lg:col-span-1 lg:block"><span className="block h-[2px] w-6 bg-sand" /></span>
                <span className="font-display text-[1.75rem] leading-tight lg:col-span-4">{l.name}</span>
                <p className="text-[1rem] leading-relaxed text-stone-light lg:col-span-6">{l.how}</p>
                <span className="hidden h-[3px] bg-signal lg:col-span-1 lg:block" style={{ opacity: 0.3 + i * 0.175 }} aria-hidden="true" />
              </li>
            ))}
          </ol>
          <div className="mt-12"><Btn to="/join" variant="signal">Begin as a Member</Btn></div>
        </div>
      </section>
    </>
  );
}
