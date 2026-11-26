import { Link } from "@/lib/router";
import { asset } from "@/lib/asset";
import { Btn, TLink } from "@/components/Arrow";
import { ThreeLevels } from "@/components/proposition/ThreeLevels";
import { ContinuityStory } from "@/components/proposition/ContinuityStory";
import { fieldProposition } from "@/content/proposition";
import { MandatePanels } from "@/components/MandatePanels";
import { ContinentalField } from "@/components/ContinentalField";
import { investPath } from "@/content/navigation";
import { accountability, investmentAreas, membershipValue, positioning, publishedEvidence, supportSystem } from "@/content/case";
import { people } from "@/content/institution";
import { interdependence } from "@/content/products";
import { VillageHighlights } from "@/components/village/VillageHighlights";
import { photo, assignments } from "@/content/photography";

const heroTabs = [
  { label: "Our Purpose", href: "#purpose" },
  { label: "The Field", href: "/the-field" },
  { label: "Following", href: "/the-field?tab=following" },
];

function SectionLabel({ children, dark = false }: { children: string; dark?: boolean }) {
  return <p className={`eyebrow ${dark ? "text-sand" : ""}`}>{children}</p>;
}

export default function Home() {
  const chair = people.find((person) => person.slug === "ian-lorenzen");
  return (
    <>
      {/* 1. Immersive institutional introduction */}
      <section className="cinema cinema-mobile on-dark flex flex-col" aria-labelledby="home-title">
        <div className="cinema-media">
          <img src={asset(photo(assignments.home.hero).src)} alt="" className="object-[68%_center] lg:object-[60%_center]" fetchPriority="high" decoding="async" />
        </div>
        <div className="cinema-grade" />
        <nav aria-label="On this page" className="relative z-10 mt-[calc(var(--app-bar-h)+var(--safe-top))] flex justify-center gap-6 pt-2 text-[0.875rem] font-semibold text-ivory/75 lg:hidden">
          {heroTabs.map((tab, i) => tab.href.startsWith("#") ? <a key={tab.href} href={tab.href} className={`py-2 transition-colors hover:text-ivory ${i === 0 ? "text-ivory underline decoration-signal decoration-2 underline-offset-[10px]" : ""}`}>{tab.label}</a> : <Link key={tab.href} to={tab.href} className="py-2 transition-colors hover:text-ivory">{tab.label}</Link>)}
        </nav>
        <div className="wrap relative mt-auto pb-6 pt-12 lg:my-auto lg:pb-20 lg:pt-[calc(var(--app-bar-h)+56px)]">
          <div className="max-w-[44rem]">
            <h1 id="home-title" className="home-headline font-display text-ivory">Stronger ecosystems.<br /><em className="font-normal text-ivory/90">Stronger economies.</em></h1>
            <p className="mt-4 max-w-[34rem] text-[1rem] leading-relaxed text-ivory/90 sm:mt-5 sm:text-[1.0625rem] lg:text-[1.1875rem]">{positioning.statement}</p>
            <div className="mt-6 flex flex-col gap-2.5 sm:mt-7 sm:flex-row sm:gap-3">
              <Btn to={investPath} variant="signal">Invest in Our Mission</Btn>
              <Btn to="/what-we-build" variant="line">Explore Our Work</Btn>
            </div>
            <p className="mt-5 text-[0.9375rem] text-ivory/85 sm:mt-6">Ecosystem builder? <Link to="/join" className="font-semibold text-ivory underline decoration-signal underline-offset-4 hover:text-signal">Belong to the field you are building</Link></p>
          </div>
          <div className="mt-7 flex items-end justify-between gap-6 border-t border-ivory/15 pt-3 text-[0.75rem] text-ivory/70 sm:mt-10 sm:pt-4">
            <p className="font-display text-[1.0625rem] italic text-ivory/90">{positioning.philosophy}</p>
            <p className="text-right"><span className="hidden sm:inline">Practitioners at an ASEB Summit &amp; Awards gathering · </span>Photo: ASEB Society</p>
          </div>
        </div>
      </section>

      {/* 2. The economics of interdependence */}
      <section className="on-dark relative overflow-hidden bg-night text-ivory" aria-labelledby="village-title">
        <div className="wrap section grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <p className="eyebrow text-sand">The economics of interdependence</p>
            <h2 id="village-title" className="mt-5 font-display text-title italic">It Takes a Village.</h2>
            <p className="mt-6 text-[0.9375rem] leading-relaxed text-ivory/70">One way to see why ecosystem builders matter. Economic development has many drivers, and enterprise is one of them.</p>
          </div>
          <ol className="lg:col-span-7 lg:col-start-6">
            {interdependence.map((line, i) => (
              <li key={line} className="reveal flex items-baseline gap-5 border-t border-night-line py-5 first:border-t-0 first:pt-0">
                <span aria-hidden="true" className="mt-[0.7em] flex w-20 shrink-0"><span className="h-[2px] bg-signal" style={{ width: `${20 + i * 20}%` }} /></span>
                <span className="font-display text-[1.5rem] leading-snug lg:text-[2rem]">{line}</span>
              </li>
            ))}
            <li className="reveal border-t border-signal pt-6"><p className="text-[1.125rem] font-semibold text-sand">This is why ASEB Society exists.</p></li>
          </ol>
        </div>
      </section>

      {/* 3. African economic realities */}
      <section id="purpose" className="section scroll-mt-20" aria-labelledby="imperative-title">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <SectionLabel>African economic realities</SectionLabel>
            <h2 id="imperative-title" className="mt-5 text-title">Africa's economic future will be built by its enterprises.</h2>
            <p className="lede mt-6">Enterprise across Africa is formal and informal, rural and urban, in agriculture, manufacturing, trade, services and technology, in capital cities and far beyond them. Millions of young people enter labour markets every year, and many women and young founders start businesses with limited access to appropriate finance, uneven infrastructure, fragmented markets and support institutions of very different capacity.</p>
            <p className="mt-5 text-[1rem] leading-relaxed text-stone">Entrepreneurship is one part of the response, alongside industrial development, public investment, education and labour market reform. It only works where entrepreneurs can reach functioning support: the people, institutions and systems that help a business start, survive and grow.</p>
            <ul className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-[0.875rem] text-stone" aria-label="The support system entrepreneurs depend on">
              {supportSystem.map((item) => <li key={item} className="flex items-center gap-2"><span className="status-dot bg-teal/50" aria-hidden="true" />{item}</li>)}
            </ul>
          </div>
          <ol className="border-t border-ink lg:col-span-6 lg:col-start-7">
            {publishedEvidence.map((item) => (
              <li key={item.figure} className="reveal grid gap-3 border-b border-hairline py-7 sm:grid-cols-[minmax(0,11rem)_1fr] sm:gap-8">
                <p className="numeral text-[2.5rem] leading-none text-ember lg:text-[3rem]">{item.figure}</p>
                <div>
                  <p className="text-[1.0625rem] leading-relaxed">{item.claim}</p>
                  <a href={item.href} target="_blank" rel="noreferrer" className="mt-2 inline-block text-[0.8125rem] text-stone underline-offset-4 hover:text-ember hover:underline">{item.source} ↗</a>
                </div>
              </li>
            ))}
            <li className="py-6 text-[0.9375rem] leading-relaxed text-stone">Capital, policy and talent all matter. Each depends on the people and institutions who connect them. That layer is the least funded and the least visible.</li>
          </ol>
        </div>
      </section>

      <ContinuityStory />

      {/* 5 and 6. Building the field behind the ecosystem, and building a practice */}
      <section className="on-dark section bg-night text-ivory" aria-labelledby="field-title">
        <div className="wrap">
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-6">
              <SectionLabel dark>What makes ASEB Society distinct</SectionLabel>
              <h2 id="field-title" className="mt-5 text-title">{fieldProposition}</h2>
            </div>
            <p className="text-[1.0625rem] leading-relaxed text-ivory/80 lg:col-span-5 lg:col-start-8 lg:pt-12">Many institutions build entrepreneurs, and many build ecosystems. ASEB Society works on the professional field responsible for building them: its knowledge, competencies, identity, ethics, memory and continuity. It is not an accelerator, an investment marketplace or an umbrella with authority over African ecosystems, and it earns its place through useful work, evidence and voluntary participation.</p>
          </div>
          <div className="mt-14"><ThreeLevels dark /></div>
          <div className="mt-16 grid gap-px border border-night-line bg-night-line md:grid-cols-2">
            <div className="bg-night p-7 lg:p-9">
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-sand">Building a practice</p>
              <p className="mt-3 text-[1.0625rem] leading-relaxed text-ivory/85">The practice is the work itself: the methods, knowledge, competencies, judgement, evidence and tools used to improve ecosystem conditions, tested with practitioners and respectful of African contexts.</p>
            </div>
            <div className="bg-night p-7 lg:p-9">
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-sand">Advancing a profession</p>
              <p className="mt-3 text-[1.0625rem] leading-relaxed text-ivory/85">The profession is the people doing it: their identity, development, ethics, recognition and continuity, so no ecosystem builder has to start from zero when a programme ends or an employer changes.</p>
            </div>
          </div>
          <div className="mt-8"><Link to="/framework" className="tlink text-ivory">The ASEB Society Framework <span className="arr" aria-hidden="true">→</span></Link></div>
        </div>
      </section>

      {/* 7. Four institutional pillars */}
      <section id="work" className="section scroll-mt-20" aria-labelledby="mandates-title">
        <div className="wrap">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-6"><SectionLabel>Four institutional pillars</SectionLabel><h2 id="mandates-title" className="mt-5 text-title">One institution. Four ways it strengthens the field.</h2></div>
            <p className="lede lg:col-span-5 lg:col-start-8 lg:pt-12">Each pillar answers a different structural problem. The Summit brings the field together. The Society sustains the work throughout the year.</p>
          </div>
          <MandatePanels />
        </div>
      </section>

      {/* 8. Participation through the five knowledge products */}
      <VillageHighlights />

      {/* 9. Continental network */}
      <section id="network" className="section scroll-mt-20 border-t border-hairline bg-paper" aria-labelledby="network-title">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 lg:col-span-5">
            <SectionLabel>Continental network</SectionLabel>
            <h2 id="network-title" className="mt-5 text-title">Local knowledge. Continental collaboration.</h2>
            <p className="lede mt-6">The Society is building its presence country by country, through Country Partners, credible organisations with formal local responsibilities, and Ambassadors, individual practitioners with defined advocacy mandates.</p>
            <p className="mt-5 text-[0.9375rem] text-stone">Representation is appointed carefully and published only once confirmed. Most countries are still open.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Btn to="/countries">Explore the countries</Btn>
              <Btn to="/country-partners" variant="line">Become a Country Partner</Btn>
            </div>
            <div className="mt-5"><TLink to="/ambassadors">Apply as an Ambassador</TLink></div>
          </div>
          <div className="min-w-0 lg:col-span-6 lg:col-start-7"><ContinentalField /></div>
        </div>
      </section>

      {/* Institutional credibility */}
      <section className="section" aria-labelledby="credibility-title">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <SectionLabel>Grounded in practice</SectionLabel>
            <h2 id="credibility-title" className="mt-5 text-title">Credible because it is accountable.</h2>
            <p className="lede mt-6">ASEB Society grew out of five editions of the ASEB Summit &amp; Awards in four host countries. It is governed by a Board with fiduciary oversight, separates convening from authority, and publishes what is operational and what is not.</p>
            {chair && (
              <figure className="mt-10 grid grid-cols-[88px_1fr] items-center gap-5 border-t border-hairline pt-8">
                <div className="photo aspect-square"><img src={asset(chair.photo)} alt={`${chair.name}, ${chair.role}`} loading="lazy" /></div>
                <figcaption><p className="font-display text-[1.25rem] leading-tight">{chair.name}</p><p className="mt-1 text-[0.875rem] text-stone">{chair.role}. {chair.base}.</p></figcaption>
              </figure>
            )}
          </div>
          <nav aria-label="Accountability" className="border-t border-ink lg:col-span-5 lg:col-start-8">
            {[
              ["Our Story", "/about/story", "Five Summit editions and the move to a permanent institution"],
              ["Leadership", "/people", "Founder, executive team and Board"],
              ["Governance", "/governance", "Oversight, integrity and stewardship goals"],
              ["Institutional Progress", "/progress", "What is operational, in development or planned"],
              ["Evidence Library", "/evidence", "The research the Society's practice draws on"],
            ].map(([label, to, note]) => (
              <Link key={to} to={to ?? "/"} className="group flex items-baseline justify-between gap-6 border-b border-hairline py-5">
                <span><span className="block font-display text-[1.375rem] leading-tight group-hover:text-ember">{label}</span><span className="mt-1 block text-[0.875rem] text-stone">{note}</span></span>
                <span aria-hidden="true" className="text-ember transition-transform group-hover:translate-x-1">→</span>
              </Link>
            ))}
          </nav>
        </div>
      </section>

      {/* 10. Institutional funding and strategic collaboration */}
      <section id="invest" className="on-dark relative isolate overflow-hidden bg-night text-ivory" aria-labelledby="invest-title">
        <div className="wrap section grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <SectionLabel dark>Invest in Our Mission</SectionLabel>
            <h2 id="invest-title" className="mt-5 text-title">Fund the infrastructure, not merely the activity.</h2>
            <p className="mt-6 text-[1.0625rem] leading-relaxed text-ivory/80">Investment in entrepreneurship depends on the capabilities, coordination and sustainability of the people and institutions who deliver support. ASEB Society strengthens that professional infrastructure, so that a stronger hub can serve successive cohorts of founders, not one venture.</p>
            <dl className="mt-8 space-y-4 border-t border-night-line pt-6">
              {accountability.slice(0, 2).map((item) => <div key={item.k}><dt className="text-[0.8125rem] font-semibold text-sand">{item.k}</dt><dd className="mt-1 text-[0.9375rem] text-ivory/75">{item.v}</dd></div>)}
            </dl>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Btn to={investPath} variant="signal">Invest in Our Mission</Btn>
              <Btn to={`${investPath}#enquire`} variant="line">Start a conversation</Btn>
            </div>
          </div>
          <ul className="grid self-start sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
            {investmentAreas.map((area) => (
              <li key={area.slug} className="border-t border-night-line">
                <Link to={`${investPath}#${area.slug}`} className="group block py-5 pr-4">
                  <span className="flex items-baseline justify-between gap-3 font-semibold text-ivory group-hover:text-signal">{area.name}<span aria-hidden="true">→</span></span>
                  <span className="mt-1.5 block text-[0.875rem] leading-snug text-ivory/65">{area.outcome}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 9. Professional participation */}
      <section className="section" aria-labelledby="belong-title">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <SectionLabel>For ecosystem builders</SectionLabel>
            <h2 id="belong-title" className="mt-5 text-title">Belong to the field you are building.</h2>
            <p className="lede mt-6">If you mentor founders, run a hub, fund programmes, shape policy or research entrepreneurship, your work is part of one profession. Membership connects you to it.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Btn to="/join">Apply for membership</Btn>
              <Btn to="/auth?mode=signup" variant="line">Create an account</Btn>
            </div>
            <p className="mt-5 text-[0.875rem] text-stone">Applications are reviewed by the Secretariat. Creating an account does not by itself grant membership.</p>
          </div>
          <dl className="grid gap-px self-start border border-hairline bg-hairline sm:grid-cols-2 lg:col-span-5 lg:col-start-8">
            {membershipValue.map((item) => <div key={item.k} className="bg-ivory p-6"><dt className="font-display text-[1.375rem]">{item.k}</dt><dd className="mt-2 text-[0.9375rem] leading-relaxed text-stone">{item.v}</dd></div>)}
          </dl>
        </div>
      </section>
    </>
  );
}
