import { useState } from "react";
import { Link } from "@/lib/router";
import { asset } from "@/lib/asset";
import { Btn, TLink } from "@/components/Arrow";
import { Photo } from "@/components/Photo";
import { TheoryOfChange } from "@/components/TheoryOfChange";
import { MandatePanels } from "@/components/MandatePanels";
import { ContinentalField } from "@/components/ContinentalField";
import { investPath } from "@/content/navigation";
import { accountability, investmentAreas, membershipValue, positioning, problemThemes, publishedEvidence, supportSystem } from "@/content/case";
import { people } from "@/content/institution";
import { interdependence } from "@/content/products";
import { VillageHighlights } from "@/components/village/VillageHighlights";
import { photo, pillarPhoto, assignments } from "@/content/photography";

const heroTabs = [
  { label: "Our Purpose", href: "#purpose" },
  { label: "The Field", href: "/the-field" },
  { label: "Following", href: "/the-field?tab=following" },
];

function SectionLabel({ children, dark = false }: { children: string; dark?: boolean }) {
  return <p className={`eyebrow ${dark ? "text-sand" : ""}`}>{children}</p>;
}

export default function Home() {
  const [problem, setProblem] = useState(0);
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
            <p className="text-right"><span className="hidden sm:inline">Practitioners at an ASEB gathering · </span>Photo: ASEB Society</p>
          </div>
        </div>
      </section>

      {/* 2. The economic imperative */}
      <section id="purpose" className="section scroll-mt-20" aria-labelledby="imperative-title">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <SectionLabel>The economic imperative</SectionLabel>
            <h2 id="imperative-title" className="mt-5 text-title">Africa's economic future will be built by its enterprises.</h2>
            <p className="lede mt-6">Entrepreneurship is part of the response to Africa's employment and productivity challenges. It only works where entrepreneurs can reach functioning support: people, institutions and systems that help a business start, survive and grow.</p>
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

      {/* The economics of interdependence */}
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

      {/* 3. The overlooked problem */}
      <section className="section border-t border-hairline bg-paper" aria-labelledby="question-title">
        <div className="wrap">
          <h2 id="question-title" className="max-w-[22ch] font-display text-title">Africa invests in entrepreneurs. <span className="text-ember">Who invests in the people who make entrepreneurship possible?</span></h2>
          <div className="mt-14 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Photo src={photo(assignments.home.question).src} alt={photo(assignments.home.question).alt} caption="Ecosystem builders at the ASEB Summit 2024, Accra" ratio="aspect-[4/5]" position="50% center" />
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <p className="text-[1.125rem] leading-relaxed">The effectiveness of every hub, accelerator and agency depends on the capabilities, knowledge, relationships and sustainability of the people who design and run them. Across the continent, those people work with structural barriers that no single institution can remove.</p>
              <div role="tablist" aria-label="Structural challenges" className="mt-10 grid grid-cols-2 border-t border-ink sm:grid-cols-4">
                {problemThemes.map((theme, i) => (
                  <button key={theme.name} role="tab" type="button" id={`problem-tab-${i}`} aria-selected={problem === i} aria-controls="problem-panel" onClick={() => setProblem(i)}
                    className={`relative min-h-[56px] border-b border-hairline px-1 py-3 text-left text-[0.9375rem] font-semibold transition-colors ${problem === i ? "text-ink" : "text-stone hover:text-ink"}`}>
                    {theme.name}
                    {problem === i && <span aria-hidden="true" className="absolute inset-x-0 -bottom-px h-[2px] bg-signal" />}
                  </button>
                ))}
              </div>
              <div id="problem-panel" role="tabpanel" aria-labelledby={`problem-tab-${problem}`} className="mandate-enter pt-7" key={problem}>
                <p className="font-display text-[1.625rem] leading-snug">{problemThemes[problem]?.line}</p>
                <ul className="mt-5 space-y-3">{problemThemes[problem]?.issues.map((issue) => <li key={issue} className="flex gap-3 text-[1rem] text-stone"><span className="mt-[0.6em] h-px w-4 shrink-0 bg-ember" aria-hidden="true" />{issue}</li>)}</ul>
              </div>
              <p className="mt-10 border-l-2 border-signal pl-5 text-[0.9375rem] leading-relaxed text-stone">These are the areas ASEB Society is set up to address. Conditions differ across countries, and the Society's research agenda exists to document where and how.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The institutional solution */}
      <section className="on-dark section bg-night text-ivory" aria-labelledby="solution-title">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <SectionLabel dark>The institutional solution</SectionLabel>
            <h2 id="solution-title" className="mt-5 text-title">Building the infrastructure behind Africa's entrepreneurial future.</h2>
            <p className="mt-6 text-[1.0625rem] leading-relaxed text-ivory/80">ASEB Society is permanent professional infrastructure for the people who build entrepreneurship support. Investment in the Society travels outward: to practitioners, through their institutions, to entrepreneurs and the economies they grow.</p>
            <p className="mt-6 text-[0.8125rem] leading-relaxed text-ivory/60">These are intended outcomes. The Society reports measured results separately, and only when there is evidence for them.</p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7"><TheoryOfChange /></div>
        </div>
      </section>

      {/* 5. Four connected mandates */}
      <section id="work" className="section scroll-mt-20" aria-labelledby="mandates-title">
        <div className="wrap">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-6"><SectionLabel>Four connected mandates</SectionLabel><h2 id="mandates-title" className="mt-5 text-title">One institution. Four ways it strengthens the field.</h2></div>
            <p className="lede lg:col-span-5 lg:col-start-8 lg:pt-12">Each mandate answers a different structural problem. Together they turn a yearly convening into continuing infrastructure.</p>
          </div>
          <MandatePanels />
        </div>
      </section>

      {/* 6. Continental network */}
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

      {/* 7. Institutional credibility */}
      <section className="section" aria-labelledby="credibility-title">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <SectionLabel>Grounded in practice</SectionLabel>
            <h2 id="credibility-title" className="mt-5 text-title">Credible because it is accountable.</h2>
            <p className="lede mt-6">The Society grew out of five years of convening practitioners in four host countries. It is governed by a Board with fiduciary oversight, separates convening from authority, and publishes what is operational and what is not.</p>
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

      {/* From the village: live editorial previews from the five knowledge products */}
      <VillageHighlights />

      {/* 8. Institutional investment */}
      <section id="invest" className="on-dark relative isolate overflow-hidden bg-night text-ivory" aria-labelledby="invest-title">
        <div className="wrap section grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <SectionLabel dark>Invest in Our Mission</SectionLabel>
            <h2 id="invest-title" className="mt-5 text-title">Fund the foundations of African entrepreneurship.</h2>
            <p className="mt-6 text-[1.0625rem] leading-relaxed text-ivory/80">A stronger hub supports successive cohorts of founders, not one venture. Investment in ecosystem builders and their institutions compounds across every programme they run.</p>
            <dl className="mt-8 space-y-4 border-t border-night-line pt-6">
              {accountability.slice(0, 2).map((item) => <div key={item.k}><dt className="text-[0.8125rem] font-semibold text-sand">{item.k}</dt><dd className="mt-1 text-[0.9375rem] text-ivory/75">{item.v}</dd></div>)}
            </dl>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Btn to={investPath} variant="signal">Invest in Our Mission</Btn>
              <Btn to={`${investPath}#enquire`} variant="line">Start a conversation</Btn>
            </div>
          </div>
          <ul className="grid self-start sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
            {investmentAreas.slice(0, 7).map((area) => (
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
