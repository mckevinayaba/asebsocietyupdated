import { Link } from "@/lib/router";
import { summit2026, speakers, editions, gallery, supporters } from "@/content/summit";
import { constituencies, rolesFor } from "@/content/field";
import { statements, proof } from "@/content/site";
import { SectionHead } from "@/components/PageHero";
import { Btn, TLink } from "@/components/Arrow";
import { asset } from "@/lib/asset";
import { nextSummit } from "@/content/case";

export default function Summit() {
  return (
    <>
      {/* Opening */}
      <header className="on-dark bg-ink text-ivory">
        <div className="wrap pb-12 pt-14 lg:pb-16 lg:pt-20">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <img src={asset("images/brand/aseb-logo.png")} alt="ASEB Africa Startup Ecosystem Builders Summit and Awards" className="h-16 w-auto lg:h-20" />
              <h1 className="mt-10 text-display-lg">The continent's recognition of ecosystem building.</h1>
            </div>
            <div className="flex flex-col justify-end lg:col-span-4">
              <p className="text-[1.0625rem] leading-relaxed text-stone-light">
                The ASEB Awards recognise excellence in 28 roles across four parts of the field. Recognition is evidence-based, peer-reviewed and continental. Every finalist becomes part of the Field Registry.
              </p>
            </div>
          </div>
        </div>
        <div className="wrap">
          <figure>
            <div className="photo aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]">
              <img src={asset("images/events/aseb-2026-recognised-builders.jpg")} alt="Recognised practitioners and institutions at ASEB 2026" style={{ objectPosition: "50% 40%" }} />
            </div>
            <figcaption className="caption">ASEB Summit and Awards 2026, Johannesburg · Photo: ASEB Society</figcaption>
          </figure>
          <dl className="mt-10 grid grid-cols-2 gap-px bg-hairline-dark lg:grid-cols-4">
            {proof.map((p) => (
              <div key={p.label} className="bg-ink py-8 pr-4">
                <dd className="numeral text-[2.75rem] leading-none text-ivory">{p.value}</dd>
                <dt className="mt-3 text-[0.9375rem]">{p.label}</dt>
                <dd className="mt-1 text-[0.8125rem] text-stone-light">{p.note}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="wrap pb-20 pt-12 lg:pb-28">
          <p className="max-w-3xl border-l-2 border-signal pl-6 font-display text-[1.75rem] leading-snug lg:text-[2.25rem]">{statements.recognitionLine}</p>
          <p className="mt-4 pl-6 text-[0.9375rem] text-stone-light">Visible practitioners attract partners, capital and talent. Invisible ones carry the load alone.</p>
        </div>
      </header>

      {/* The Summit within the Society's permanent mandate, and the next edition */}
      <section className="border-b border-hairline bg-paper" aria-labelledby="summit-mandate-title">
        <div className="wrap grid gap-10 py-12 lg:grid-cols-12 lg:gap-10 lg:py-16">
          <div className="lg:col-span-7">
            <p className="eyebrow">One of four mandates</p>
            <h2 id="summit-mandate-title" className="mt-4 text-display-sm">The continental convening of a permanent institution.</h2>
            <p className="mt-5 max-w-prose text-[1.0625rem] leading-relaxed text-stone">The Summit convenes the field once a year, recognises its practitioners and mobilises new ones. Between editions, ASEB Circles, the Academy and the Field Lab carry that work forward. The full Summit and Awards programme lives at asebs.com.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap"><Btn to="https://www.asebs.com" variant="line">Visit asebs.com</Btn><TLink to="/what-we-build">How the four mandates connect</TLink></div>
          </div>
          <div className="on-dark self-start bg-night p-7 text-ivory lg:col-span-4 lg:col-start-9">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-sand">Next edition · Announced</p>
            <p className="mt-3 font-display text-[2.25rem] leading-none">{nextSummit.place} {nextSummit.year}</p>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-ivory/80">{nextSummit.line}</p>
          </div>
        </div>
      </section>

      {/* 2026 programme */}
      <section className="section">
        <div className="wrap">
          <SectionHead
            eyebrow={`${summit2026.edition} · ${summit2026.dates}`}
            title={<>ASEB 2026: Who Built the Builder?</>}
            lede={`${summit2026.city}. Three chapters across three days, moving the field from what it sees, to what it builds, to what it carries forward.`}
            aside={<TLink to="https://www.asebs.com/programme">The full 2026 programme</TLink>}
          />
          <ol className="mt-16 grid border-t border-ink lg:grid-cols-3">
            {summit2026.days.map((d, i) => (
              <li key={d.label} className={`py-10 ${i > 0 ? "border-t border-hairline lg:border-l lg:border-t-0 lg:pl-10" : ""} lg:pr-10`}>
                <p className="text-eyebrow font-semibold uppercase text-umber">{d.chapter}</p>
                <p className="mt-4 text-[0.875rem] text-stone">{d.label} · {d.date}</p>
                <h3 className="mt-2 font-display text-[1.75rem] leading-tight">{d.title}</h3>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-stone">{d.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Speakers */}
      <section className="section border-t border-hairline bg-paper">
        <div className="wrap">
          <SectionHead eyebrow="Voices of ASEB 2026" title="The practitioners and researchers who carried the programme." />
          <ul className="mt-14 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
            {speakers.map((s) => (
              <li key={s.slug} className="reveal">
                <div className="photo aspect-[4/5]">
                  <img src={asset(`images/people/${s.slug}.jpg`)} alt={s.name} loading="lazy" className="grayscale-[15%]" />
                </div>
                <p className="mt-4 font-display text-[1.1875rem] leading-tight">{s.name}</p>
                <p className="mt-1 text-[0.8125rem] leading-snug text-stone">{s.role}</p>
                <p className="mt-3 border-t border-hairline pt-3 text-[0.8125rem] leading-snug">{s.session}</p>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-[0.8125rem] text-stone">
            Source: <a className="underline underline-offset-4 hover:text-ember" href="https://www.asebs.com/speakers" target="_blank" rel="noreferrer">ASEB 2026 speakers, asebs.com</a>
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="From the Summit floor" title="The record, in pictures." lede="Photography from the ASEB Summit and Awards. Photos: ASEB Society." />
          <div className="mt-14 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {gallery.map((g) => (
              <figure key={g.src} className={g.span === "wide" ? "col-span-2" : "col-span-1"}>
                <div className={`photo ${g.span === "wide" ? "aspect-[16/10]" : "aspect-[4/5] lg:aspect-[8/10]"}`}>
                  <img src={asset(g.src)} alt={g.alt} loading="lazy" />
                </div>
              </figure>
            ))}
            <div className="on-dark col-span-1 flex flex-col justify-between bg-ink p-5 text-ivory lg:p-7">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-sand">ASEB 2026</p>
              <div>
                <p className="font-display text-[1.375rem] leading-snug lg:text-[1.625rem]">The full gallery follows.</p>
                <p className="mt-3 text-[0.8125rem] leading-relaxed text-stone-light">More photographs from the Summit floor to follow.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section border-t border-hairline bg-linen/50">
        <div className="wrap">
          <SectionHead
            eyebrow="The categories"
            title={<>Twenty&#8209;eight roles. Four parts of the field.</>}
            lede="Each category opens with the role it recognises, and links to that role's page in the Field. The Awards are the entry point of a year-round pathway."
          />
          <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-x-16">
            {constituencies.map((c) => (
              <div key={c.slug}>
                <div className="flex items-baseline justify-between border-b border-ink pb-3">
                  <h3 className="font-display text-[1.625rem]">{c.name}</h3>
                  <span className="numeral text-sm text-stone">{rolesFor(c.slug).length}</span>
                </div>
                <ul>
                  {rolesFor(c.slug).map((r) => (
                    <li key={r.slug}>
                      <Link to={`/field/role/${r.slug}`} className="group flex items-baseline justify-between gap-4 border-b border-hairline py-3 text-[0.9375rem]">
                        <span className="group-hover:text-ember">{r.award}</span>
                        <span className="text-ink/30 group-hover:text-ember" aria-hidden="true">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-14 flex flex-col gap-6 border-t border-ink pt-10 lg:flex-row lg:items-center lg:justify-between">
            <p className="max-w-xl text-[1.0625rem] leading-relaxed">
              Nominations for 2026 closed on 12 July 2026. Register to be notified when nominations for ASEB 2027 open.
            </p>
            <Btn to="/join?intent=nominate">Register interest for 2027</Btn>
          </div>
        </div>
      </section>

      {/* Editions */}
      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <p className="eyebrow">Five editions</p>
            <h2 className="mt-5 text-display-sm">Documented practice since 2022.</h2>
          </div>
          <ol className="border-t border-ink lg:col-span-7 lg:col-start-6">
            {editions.map((e) => (
              <li key={e.year} className="grid grid-cols-[5rem_1fr] gap-4 border-b border-hairline py-5 sm:grid-cols-[6rem_10rem_1fr]">
                <span className="numeral text-[1.5rem] leading-none">{e.year}</span>
                <span className="font-display text-[1.25rem]">{e.city}</span>
                <span className="col-span-2 text-[0.9375rem] text-stone sm:col-span-1">{e.note}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Supporters */}
      <section className="section-tight border-t border-hairline bg-paper">
        <div className="wrap">
          <p className="eyebrow">They showed up for the ecosystem</p>
          <ul className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
            {supporters.map((s) => (
              <li key={s} className="font-display text-[1.375rem] text-ink/80">{s}</li>
            ))}
          </ul>
          <p className="mt-8 text-[0.8125rem] text-stone">
            As listed on <a className="underline underline-offset-4 hover:text-ember" href="https://www.asebs.com" target="_blank" rel="noreferrer">asebs.com</a>. Logos appear once each institution has approved its use.
          </p>
        </div>
      </section>
    </>
  );
}
