import { Link } from "@/lib/router";
import { statements, whyNow } from "@/content/site";
import { PageHero, SectionHead } from "@/components/PageHero";
import { Btn, TLink } from "@/components/Arrow";
import { Photo } from "@/components/Photo";
import { Source, Ext } from "@/components/Rows";
import { TheoryOfChange } from "@/components/TheoryOfChange";
import { investPath } from "@/content/navigation";
import { mandates, positioning, problemThemes, publishedEvidence, supportSystem } from "@/content/case";
import { photo, assignments } from "@/content/photography";

// Why We Exist: the institutional case in full. Structural challenges are described as the
// Society's intervention focus, never as claims about every African country.
export default function WhyAseb() {
  return (
    <>
      <PageHero eyebrow="Why We Exist" title="Entrepreneurship needs infrastructure. So do the people who build it." lede={`${positioning.statement} ASEB Society exists because the people who design and run entrepreneurship support have had no permanent professional home of their own.`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap"><Btn to={investPath} variant="accent">Invest in Our Mission</Btn><Btn to="/about/story" variant="line">Read Our Story</Btn></div>
      </PageHero>

      <section className="section" aria-labelledby="realities-title">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="eyebrow">African economic realities</p>
            <h2 id="realities-title" className="mt-5 text-display-sm">Enterprise will decide much of Africa's economic future.</h2>
            <p className="mt-6 text-[1.0625rem] leading-relaxed text-stone">Employment, productivity and economic transformation depend heavily on whether enterprises can start, survive and grow. Entrepreneurship is part of the response. It is not a substitute for public investment, and the Society does not claim it can solve unemployment on its own.</p>
          </div>
          <ul className="border-t border-ink lg:col-span-6 lg:col-start-7">
            {publishedEvidence.map((e) => (
              <li key={e.figure} className="grid gap-2 border-b border-hairline py-6 sm:grid-cols-[10rem_1fr] sm:gap-6">
                <p className="numeral text-[2.25rem] leading-none text-ember">{e.figure}</p>
                <div><p className="text-[1rem] leading-relaxed">{e.claim}</p><Source><Ext href={e.href}>{e.source}</Ext></Source></div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section border-y border-hairline bg-paper" aria-labelledby="systems-title">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="eyebrow">The role of support systems</p>
            <h2 id="systems-title" className="mt-5 text-display-sm">Founders rarely succeed alone.</h2>
            <p className="mt-6 text-[1.0625rem] leading-relaxed text-stone">Entrepreneurs depend on a web of people and institutions. How effective that web is depends on the capability, knowledge, relationships and sustainability of the practitioners who run it.</p>
          </div>
          <ul className="flex flex-wrap content-start gap-2 lg:col-span-6 lg:col-start-7">{supportSystem.map((s) => <li key={s} className="tag bg-ivory text-[0.875rem]">{s}</li>)}</ul>
        </div>
      </section>

      <section className="section" aria-labelledby="challenges-title">
        <div className="wrap">
          <SectionHead eyebrow="Structural challenges" title="What ecosystem builders work against." lede="These are the problem areas the Society is set up to address. Their shape differs from country to country, which is why the Field Lab's research agenda exists." />
          <div className="mt-14 grid gap-px border border-hairline bg-hairline md:grid-cols-2">
            {problemThemes.map((t) => (
              <div key={t.name} className="reveal bg-ivory p-7 lg:p-10">
                <h3 className="font-display text-[1.75rem]">{t.name}</h3>
                <p className="mt-2 text-[1rem] text-ember">{t.line}</p>
                <ul className="mt-5 space-y-2.5">{t.issues.map((i) => <li key={i} className="flex gap-3 text-[0.9875rem] text-stone"><span className="mt-[0.65em] h-px w-4 shrink-0 bg-ink/40" aria-hidden="true" />{i}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-hairline bg-paper">
        <div className="wrap grid lg:grid-cols-2">
          {[{ k: "Mission", v: statements.mission }, { k: "Vision", v: statements.vision }].map((x, i) => (
            <div key={x.k} className={`py-14 lg:py-20 ${i === 1 ? "border-t border-hairline lg:border-l lg:border-t-0 lg:pl-12" : "lg:pr-12"}`}>
              <p className="eyebrow">{x.k}</p>
              <p className="mt-6 font-display text-[1.625rem] leading-snug lg:text-[2rem]">{x.v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="mandate-title">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5"><p className="eyebrow">ASEB Society's mandate</p><h2 id="mandate-title" className="mt-5 text-display-sm">Four connected mandates.</h2><p className="mt-6 text-stone">{statements.whatWeDo}</p></div>
          <ul className="border-t border-ink lg:col-span-6 lg:col-start-7">{mandates.map((m) => <li key={m.key}><Link to={m.pathway.to} className="group grid gap-1 border-b border-hairline py-5"><span className="flex items-baseline justify-between font-display text-[1.5rem] group-hover:text-ember">{m.name}<span aria-hidden="true" className="text-[1rem]">→</span></span><span className="text-[0.9375rem] text-stone">{m.purpose}</span></Link></li>)}</ul>
        </div>
      </section>

      <section className="on-dark section bg-night text-ivory" aria-labelledby="toc-title">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5"><p className="eyebrow text-sand">Theory of change</p><h2 id="toc-title" className="mt-5 text-display-sm">From investment to economic contribution.</h2><p className="mt-6 text-ivory/75">Intended outcomes, not measured impact. The Society will report results as evidence is gathered, through its Progress page and future impact reports.</p></div>
          <div className="lg:col-span-6 lg:col-start-7"><TheoryOfChange /></div>
        </div>
      </section>

      <section id="informal" className="section scroll-mt-24" aria-labelledby="informal-title">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5"><Photo src={photo(assignments.whyAseb.informal).src} alt={photo(assignments.whyAseb.informal).alt} caption="Delegates at ASEB 2025, Addis Ababa" ratio="aspect-[4/3]" /></div>
          <div className="space-y-6 text-[1.0625rem] leading-relaxed lg:col-span-6 lg:col-start-7">
            <p className="eyebrow">The whole economy</p>
            <h2 id="informal-title" className="text-display-sm">An ecosystem is not only its startups.</h2>
            <p>A field that serves only venture-backed founders serves a small share of Africa's enterprise. The Society treats the builders of township, rural, informal and green economies as practitioners of the same profession.</p>
            <p className="text-stone">South Africa's township economy alone is estimated at more than R900 billion, and 80% of the township businesses surveyed by Standard Bank are unregistered. That is why the ASEB 2026 Ecosystem Tour went to Soweto.</p>
            <Source><Ext href="https://www.standardbank.co.za/static_file/South%20Africa/PDF/Township%20Informal%20Economy%20Insights%20Report%202025/Standard%20Bank%20Township%20Informal%20Economy%20Report%20October%202025%20Final.pdf">Standard Bank, Township Informal Economy Report, 2025</Ext></Source>
          </div>
        </div>
      </section>

      <section className="section border-t border-hairline bg-paper" aria-labelledby="sustain-title">
        <div className="wrap">
          <SectionHead eyebrow="Why sustained investment matters" title="Short programmes cannot build a permanent field." lede="As official development assistance retreats, more of the burden falls on Africa's own institutions. They need to be stronger, better connected and able to last beyond any single funding cycle." />
          <div className="mt-12 grid gap-px border border-hairline bg-hairline lg:grid-cols-3">
            {whyNow.map((w) => <div key={w.figure} className="bg-ivory p-7"><p className="numeral text-[2rem] leading-none text-ember">{w.figure}</p><p className="mt-4 text-[0.9375rem] leading-relaxed">{w.label}</p><a href={w.href} target="_blank" rel="noreferrer" className="mt-3 inline-block text-[0.8125rem] text-stone underline-offset-4 hover:underline">{w.source} ↗</a></div>)}
          </div>
          <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap"><Btn to={investPath}>Invest in Our Mission</Btn><Btn to="/progress" variant="line">See our progress</Btn></div>
          <div className="mt-6"><TLink to="/framework">Explore the seven conditions</TLink></div>
        </div>
      </section>
    </>
  );
}
