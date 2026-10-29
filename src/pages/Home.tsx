import { Link } from "@/lib/router";
import { statements, whyNow } from "@/content/site";
import { LadderAssessment } from "@/components/LadderAssessment";
import { conditions, ladder } from "@/content/framework";
import { constituencies, rolesFor } from "@/content/field";
import { pillars } from "@/content/pillars";
import { registry, regions } from "@/content/registry";
import { Photo } from "@/components/Photo";
import { Btn, TLink, Arr } from "@/components/Arrow";
import { SectionHead } from "@/components/PageHero";
import { asset } from "@/lib/asset";
import panelPhoto from "@/assets/aseb-2026-panel-from-movement-to-institution.jpg.asset.json";

// The full stop in the hero carries the logo orange. A small, deliberate brand detail.
const Dot = () => <span className="text-signal">.</span>;

export default function Home() {
  const byRegion = regions.map((r) => ({ r, n: registry.filter((x) => x.region === r).length }));
  const maxRegion = Math.max(...byRegion.map((x) => x.n));
  const countryCount = new Set(registry.map((r) => r.country).filter(Boolean)).size;

  return (
    <>
      {/* 1. Hero */}
      <section className="border-b border-hairline">
        <div className="wrap pt-12 lg:pt-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-8">
              <p className="eyebrow">The professional home for ecosystem building in Africa</p>
              <h1 className="mt-7 text-display-lg">
                Building the practice<Dot />
                <br />
                Advancing the profession<Dot />
              </h1>
            </div>
            <div className="flex flex-col justify-end lg:col-span-4 lg:pb-3">
              <p className="text-[1.0625rem] leading-relaxed text-stone">{statements.heroLede}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Btn to="/join">Join the Society</Btn>
                <Btn to="/field" variant="line">Explore the field</Btn>
              </div>
            </div>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 md:gap-4 lg:mt-16 lg:gap-5">
            <Photo
              src="images/events/aseb-2026-recognised-builders.jpg"
              alt="Recognised practitioners and institutions holding their awards at ASEB 2026 in Johannesburg"
              caption="Recognised practitioners and institutions, ASEB Summit and Awards 2026, Johannesburg"
              ratio="aspect-[4/3]"
              position="50% 45%"
              eager
            />
            <Photo
              src="images/events/aseb-2026-summit-delegates.jpg"
              alt="Summit delegates gathered together in the atrium at ASEB 2026 in Johannesburg"
              caption="Builders, funders and partners gathered for the 5th anniversary summit"
              ratio="aspect-[4/3]"
              position="50% 55%"
              eager
            />
          </div>
        </div>
        {/* The field, in figures */}
        <div className="wrap">
          <dl className="mt-12 grid grid-cols-2 gap-px border-t border-hairline bg-hairline lg:grid-cols-4">
            {[
              { value: String(registry.length), label: "Practitioners and institutions on record", to: "/registry" },
              { value: String(countryCount), label: "Countries in the Field Registry", to: "/registry" },
              { value: "28", label: "Recognised roles in the field", to: "/field" },
              { value: "7", label: "Conditions the practice strengthens", to: "/framework" },
            ].map((p, i) => (
              <div key={p.label} className={`bg-ivory py-8 lg:py-10 ${i % 2 === 1 ? "pl-5" : "pr-4"} ${i > 0 ? "lg:pl-8" : ""}`}>
                <dt className="sr-only">{p.label}</dt>
                <dd className="numeral text-[2.75rem] leading-none lg:text-[3.5rem]">{p.value}</dd>
                <dd className="mt-3 text-[0.9375rem] font-medium">
                  <Link to={p.to} className="hover:text-ember">{p.label} <Arr /></Link>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 2. Definition */}
      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="eyebrow">The practice</p>
            <h2 className="mt-5 text-display-md">What is ecosystem building?</h2>
            <p className="mt-7 text-xl leading-relaxed text-ink lg:text-[1.375rem]">{statements.definition}</p>
            <div className="mt-8"><TLink to="/framework">Read the framework</TLink></div>
            <Photo
              src={panelPhoto.url}
              alt="A panel of ecosystem builders in conversation on stage at the ASEB 2026 Summit in Johannesburg"
              caption="The field in conversation, ASEB Summit and Awards 2026, Johannesburg"
              ratio="aspect-[4/3]"
              position="50% 60%"
              className="mt-10"
            />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="text-eyebrow font-semibold uppercase text-stone">The seven conditions it strengthens</p>
            <ol className="mt-5 border-t border-ink">
              {conditions.map((c) => (
                <li key={c.n} className="reveal group grid grid-cols-[3rem_1fr] items-baseline gap-2 border-b border-hairline py-5">
                  <span aria-hidden="true" className="mt-[0.7em] block h-px w-4 bg-signal" />
                  <div>
                    <p className="font-display text-[1.375rem] leading-tight">{c.name}</p>
                    <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-stone">{c.summary}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 3. The field */}
      <section className="section border-t border-hairline bg-paper">
        <div className="wrap">
          <SectionHead
            eyebrow="The profession"
            title={<>One field. Twenty&#8209;eight roles.</>}
            lede="Ecosystem building is done by people and institutions across every sector. The Society recognises four parts of the field, drawn from the categories of the ASEB Awards."
          />
          <div className="mt-14 border-t border-ink">
            {constituencies.map((c) => {
              const rs = rolesFor(c.slug);
              return (
                <Link key={c.slug} to={`/field/${c.slug}`} className="reveal group grid gap-4 border-b border-hairline py-8 transition-colors hover:bg-ivory lg:grid-cols-12 lg:items-baseline lg:gap-10 lg:py-10">
                  <span aria-hidden="true" className="hidden lg:col-span-1 lg:block"><span className="block h-[2px] w-8 bg-signal transition-all duration-500 group-hover:w-14" /></span>
                  <div className="lg:col-span-4">
                    <h3 className="text-[2rem] leading-none lg:text-[2.5rem]">{c.name}</h3>
                    <p className="mt-3 text-sm font-medium text-umber">{rs.length} roles</p>
                  </div>
                  <p className="text-[0.9375rem] leading-relaxed text-stone lg:col-span-6">
                    {rs.map((r) => r.role).join(" · ")}
                  </p>
                  <span className="hidden text-right text-2xl text-ink/40 transition-all group-hover:translate-x-1 group-hover:text-ember lg:col-span-1 lg:block" aria-hidden="true">→</span>
                </Link>
              );
            })}
          </div>
          <p className="mt-10 max-w-2xl font-display text-[1.5rem] leading-snug lg:text-[1.75rem]">
            If your work makes founders possible, you are part of this field.
          </p>
        </div>
      </section>

      {/* 4. The challenge */}
      <section className="on-dark section bg-ink text-ivory">
        <div className="wrap">
          <SectionHead
            eyebrow="Why now"
            title="A field carrying a continent, without a profession behind it."
            lede="When external support contracts, the practitioners and institutions that hold ecosystems together carry more of the load. A field without a professional home cannot absorb that pressure."
          />
          <div className="mt-16 grid gap-px bg-hairline-dark lg:grid-cols-3">
            {whyNow.map((w) => (
              <div key={w.figure} className="reveal bg-ink py-8 lg:px-8 lg:py-10 lg:first:pl-0">
                <p className="numeral text-[2.5rem] leading-none text-signal lg:text-[3rem]">{w.figure}</p>
                <p className="mt-5 max-w-xs text-[0.9375rem] leading-relaxed text-ivory/90">{w.label}</p>
                <a href={w.href} target="_blank" rel="noreferrer" className="mt-4 inline-block text-[0.8125rem] text-stone-light underline-offset-4 hover:text-ivory hover:underline">
                  {w.source}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4b. Evidence */}
      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <p className="eyebrow">The evidence</p>
            <h2 className="mt-5 text-display-md">From ecosystem language to ecosystem evidence.</h2>
          </div>
          <div className="lg:col-span-5 lg:col-start-8 lg:pt-10">
            <p className="text-[1.0625rem] leading-relaxed text-stone">
              Africa's ecosystems can now be measured. The Africa Entrepreneurial Ecosystem Index, developed by Utrecht University, the Allan Gray Centre for Africa Entrepreneurship at Stellenbosch University and i4Policy, assesses seven conditions for productive entrepreneurship across the continent. ASEB Society works alongside it to identify the practitioners and institutions who change those conditions, and equips them to do it well.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Btn to="/evidence" variant="line">Explore the evidence</Btn>
            </div>
          </div>
          <blockquote className="reveal border-t border-ink pt-8 lg:col-span-12">
            <p className="max-w-4xl font-display text-[1.75rem] leading-snug lg:text-[2.5rem]">{statements.indexLine}</p>
          </blockquote>
        </div>
      </section>

      {/* 5 and 6. Our role and the four pillars */}
      <section className="section border-t border-hairline bg-linen/60">
        <div className="wrap">
          <SectionHead
            eyebrow="What we build"
            title="We work at the level of the field."
            lede="No single hub, funder or government can fix the system alone. ASEB Society coordinates the work of many: connecting practitioners, setting standards, solving shared problems and making the field visible."
          />
          <div className="mt-16 grid gap-10 lg:grid-cols-12">
            <Link to="/summit" className="reveal group lg:col-span-7">
              <div className="photo aspect-[4/3]">
                <img src={asset("images/events/aseb-awards-stage-2.jpg")} alt="Two builders embrace on stage at the ASEB Awards" loading="lazy" className="transition-transform duration-700 ease-quiet group-hover:scale-[1.02]" />
              </div>
              <div className="mt-6">
                <span className="text-eyebrow font-semibold uppercase text-umber">{pillars[3]!.role}</span>
                <div className="mt-3">
                  <h3 className="text-[2rem] leading-tight">{pillars[3]!.name}</h3>
                  <p className="mt-2 max-w-md text-[0.9375rem] text-stone">{pillars[3]!.line}</p>
                </div>
              </div>
            </Link>
            <div className="flex flex-col lg:col-span-5">
              {pillars.slice(0, 3).map((p) => (
                <Link key={p.slug} to={`/what-we-build#${p.slug}`} className="reveal group border-t border-ink/80 py-8 first:pt-8 lg:first:border-t-0 lg:first:pt-0">
                  <span className="text-eyebrow font-semibold uppercase text-umber">{p.role}</span>
                  <h3 className="mt-4 text-[2rem] leading-tight transition-colors group-hover:text-ember">{p.name}</h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-stone">{p.line}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Pathway */}
      <section className="section">
        <div className="wrap">
          <SectionHead
            eyebrow="The pathway"
            title="A recognised path of practice."
            lede="Recognition is earned through evidence of practice, not attendance."
            aside={<TLink to="/what-we-build#pathway">How recognition works</TLink>}
          />
          <ol className="mt-16 grid gap-0 lg:grid-cols-5">
            {ladder.map((l, i) => (
              <li key={l.step} className="reveal relative border-t border-hairline py-7 lg:border-t-0 lg:pr-6 lg:pt-10">
                <span className="absolute left-0 top-0 hidden h-[3px] bg-signal lg:block" style={{ width: `${(i + 1) * 20}%`, opacity: 0.35 + i * 0.16 }} aria-hidden="true" />
                <span className="absolute left-0 right-0 top-0 hidden h-px bg-hairline lg:block" aria-hidden="true" />
                <p className="font-display text-[1.5rem] leading-tight">{l.name}</p>
                <p className="mt-3 text-[0.875rem] leading-relaxed text-stone">{l.how}</p>
              </li>
            ))}
          </ol>
          <div id="find-your-place" className="mt-16 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h3 className="font-display text-[2rem] leading-tight">Where are you on the path?</h3>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-stone">Four questions about your practice. See which designation you can work towards next.</p>
            </div>
            <div className="lg:col-span-7 lg:col-start-6"><LadderAssessment /></div>
          </div>
        </div>
      </section>

      {/* 9. Field Registry */}
      <section className="section border-t border-hairline bg-paper">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="eyebrow">The Field Registry</p>
            <h2 className="mt-5 text-display-md">Mapping who builds Africa's ecosystems.</h2>
            <p className="lede mt-7">
              A public record of practitioners and institutions, beginning with every finalist and Champion of the ASEB Awards. Find others in your role. Claim your profile.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Btn to="/registry">Search the Registry</Btn>
              <Btn to="/join" variant="line">Claim your profile</Btn>
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="grid grid-cols-2 border-t border-ink">
              <div className="border-b border-r border-hairline py-6 pr-4">
                <p className="numeral text-[3rem] leading-none">{registry.length}</p>
                <p className="mt-2 text-sm text-stone">Verified records</p>
              </div>
              <div className="border-b border-hairline py-6 pl-6">
                <p className="numeral text-[3rem] leading-none">{countryCount}</p>
                <p className="mt-2 text-sm text-stone">Countries</p>
              </div>
            </div>
            <p className="mt-8 text-eyebrow font-semibold uppercase text-stone">Records by region</p>
            <ul className="mt-4 space-y-3">
              {byRegion.map(({ r, n }) => (
                <li key={r} className="grid grid-cols-[5.5rem_1fr_2.5rem] items-center gap-4 text-[0.9375rem]">
                  <span>{r}</span>
                  <span className="relative h-[6px] bg-linen">
                    <span className="absolute inset-y-0 left-0 bg-umber" style={{ width: `${(n / maxRegion) * 100}%` }} />
                  </span>
                  <span className="numeral text-right text-stone">{n}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[0.8125rem] text-stone">Source: ASEB Awards archive, 2023 to 2026. Records verified against asebs.com.</p>
          </div>
        </div>
      </section>

      {/* Summit band */}
      <section className="on-dark bg-ink text-ivory">
        <div className="grid lg:grid-cols-12">
          <div className="photo aspect-[4/3] lg:col-span-7 lg:aspect-auto lg:min-h-[560px]">
            <img src={asset("images/events/aseb-summit-panel.jpg")} alt="Practitioners in conversation on a panel at the ASEB Summit" loading="lazy" />
          </div>
          <div className="flex flex-col justify-center px-5 py-16 sm:px-8 lg:col-span-5 lg:px-14 lg:py-20">
            <p className="eyebrow">Summit and Awards</p>
            <h2 className="mt-5 text-display-sm">The continent's recognition of ecosystem building.</h2>
            <p className="mt-6 text-[1.0625rem] leading-relaxed text-stone-light">
              Five editions since 2022. The fifth, in Johannesburg in October 2026, asked one question of the whole field: who built the builder?
            </p>
            <p className="mt-8 border-l-2 border-signal pl-5 font-display text-[1.375rem] leading-snug">{statements.recognitionLine}</p>
            <div className="mt-10"><Btn to="/summit" variant="signal">The Summit and Awards</Btn></div>
          </div>
        </div>
      </section>

      {/* 12. Close */}
      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Get involved" title="Take your place in the field." />
          <div className="mt-14 grid border-t border-ink sm:grid-cols-2 lg:grid-cols-4">
            {[
              { k: "I am a practitioner", d: "Mentors, coaches, angels, builders, storytellers and care-givers.", to: "/join" },
              { k: "I lead an institution", d: "Hubs, incubators, accelerators, ESOs, coworking and education.", to: "/get-involved#institutions" },
              { k: "I fund or invest", d: "Funders, development partners, corporates and investor networks.", to: "/partners" },
              { k: "I work in government, research or a university", d: "Policy, measurement, infrastructure and higher education.", to: "/field/systems-builders" },
            ].map((e, i) => (
              <Link key={e.k} to={e.to} className={`reveal group flex min-h-[220px] flex-col justify-between border-b border-hairline py-8 sm:px-6 lg:py-10 ${i % 2 === 0 ? "sm:pl-0" : "sm:border-l"} ${i > 0 ? "lg:border-l lg:pl-6" : ""}`}>
                <div>
                  <h3 className="font-display text-[1.625rem] leading-tight transition-colors group-hover:text-ember">{e.k}</h3>
                  <p className="mt-3 text-[0.9375rem] text-stone">{e.d}</p>
                </div>
                <span className="mt-6 text-sm font-semibold">Begin <Arr /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
