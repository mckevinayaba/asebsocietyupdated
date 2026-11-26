import { Link } from "@/lib/router";
import { PageHero, SectionHead } from "@/components/PageHero";
import { Btn } from "@/components/Arrow";
import { Photo } from "@/components/Photo";
import { Source, Ext } from "@/components/Rows";
import { climateRoles } from "@/content/institution";

const figures = [
  { v: "USD 43.7bn", l: "Climate finance flowing to Africa each year, 2021/22.", s: "Climate Policy Initiative, 2024", h: "https://www.climatepolicyinitiative.org/publication/landscape-of-climate-finance-in-africa-2024/" },
  { v: "23%", l: "Share of Africa's estimated annual climate finance needs that this covers.", s: "Climate Policy Initiative, 2024", h: "https://www.climatepolicyinitiative.org/publication/landscape-of-climate-finance-in-africa-2024/" },
  { v: "10%", l: "Share of climate finance reaching the 30 African countries that receive the least.", s: "Climate Policy Initiative, 2024", h: "https://www.climatepolicyinitiative.org/press-release/climate-finance-in-africa-2024-press-release/" },
];

export default function Climate() {
  return (
    <>
      <PageHero
        eyebrow="Green and climate economy"
        title="Climate is a condition, not a vertical."
        lede="Climate-tech startups and green enterprises need more than an idea and investment. They need incubators, technical expertise, routes to market and policy that enables them to grow. The practitioners building those conditions for clean-energy, agri-climate and circular-economy ventures are startup and entrepreneurship ecosystem builders. They belong at the centre of this field."
      />

      <section className="on-dark section bg-ink text-ivory">
        <div className="wrap">
          <SectionHead eyebrow="Why it is an ecosystem question" title="The gap is not only capital. It is the system that makes capital deployable." lede="Pipelines, intermediaries, technical assistance and local support organisations decide whether climate finance reaches African founders. That is ecosystem building." />
          <div className="mt-14 grid gap-px bg-hairline-dark lg:grid-cols-3">
            {figures.map((f) => (
              <div key={f.v} className="bg-ink py-8 lg:px-8 lg:py-10 lg:first:pl-0">
                <p className="numeral text-[2.5rem] leading-none text-signal">{f.v}</p>
                <p className="mt-5 max-w-xs text-[0.9375rem] leading-relaxed text-ivory/90">{f.l}</p>
                <a href={f.h} target="_blank" rel="noreferrer" className="mt-4 inline-block text-[0.8125rem] text-stone-light hover:text-ivory">{f.s}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="eyebrow">You belong here if you are</p>
            <h2 className="mt-5 text-display-sm">The builders of Africa's green economy.</h2>
            <p className="mt-5 text-[1rem] leading-relaxed text-stone">On the Framework, climate sits within the seventh condition, Environmental and Contextual Constraints. Across the field, it touches every other condition.</p>
          </div>
          <ul className="border-t border-ink lg:col-span-7 lg:col-start-6">
            {climateRoles.map((r, i) => (
              <li key={r} className="grid grid-cols-[2.5rem_1fr] border-b border-hairline py-4 text-[1.0625rem]">
                <span aria-hidden="true" className="mt-3 block h-[2px] w-6 bg-signal" />{r}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section border-t border-hairline bg-paper">
        <div className="wrap">
          <SectionHead eyebrow="What the Society offers" title="A place in every pillar." />
          <div className="mt-12 grid border-t border-ink sm:grid-cols-2 lg:grid-cols-4">
            {[
              { k: "Circles", v: "A Climate and Green Economy Circle for peer exchange across countries." },
              { k: "Academy", v: "A proposed module: ecosystem building for the green economy." },
              { k: "Field Lab", v: "A working group on climate-ready ecosystems and green pipelines." },
              { k: "Summit and Awards", v: "A climate lens across categories, rather than a single green award." },
            ].map((x) => (
              <div key={x.k} className="border-b border-hairline py-7 sm:pr-6">
                <h3 className="font-display text-[1.375rem]">{x.k}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-stone">{x.v}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-[0.9375rem] text-stone">Programmes and insights carry SDG tags, including 7, 12, 13, 14 and 15. <Link to="/sdgs" className="font-semibold text-ink underline underline-offset-4 hover:text-ember">See all 17 SDGs</Link>.</p>
        </div>
      </section>

      <section id="informal" className="section scroll-mt-24">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <p className="eyebrow">The informal and township economy</p>
            <h2 className="mt-5 text-display-md">More than eight in ten African workers.</h2>
            <p className="numeral mt-8 text-[4.5rem] leading-none text-ember lg:text-[6rem]">85.8%</p>
            <p className="mt-3 max-w-sm text-[1rem] leading-relaxed text-stone">of employment in Africa is informal, the highest share of any region.</p>
            <Source>
              <Ext href="https://www.ilo.org/media/396341/download">ILO, Report on Employment in Africa</Ext>. The ILO's later regional profile gives 83.1%, with 94.8% for young workers: <Ext href="https://www.ilo.org/sites/default/files/2025-02/Africa_Informality%20Regional%20statistical%20profile.pdf">ILO, Overview of the informal economy in Africa</Ext>.
            </Source>
          </div>
          <div className="space-y-6 text-[1.0625rem] leading-relaxed lg:col-span-5 lg:col-start-8 lg:pt-12">
            <p>A field built only around venture-backed startups describes fewer than two in ten African workers. Township, rural and informal-economy builders are part of the practice: enterprise development agencies, township hubs, cooperatives, savings-group organisers and local economic development officers.</p>
            <p className="text-stone">This is why the ASEB 2026 Ecosystem Tour went to Soweto. Soweto is home to about a quarter of Johannesburg's residents but produces about 5% of the city's economy, and it is where support organisations most often deliver services in South African townships.</p>
            <Source>
              <Ext href="https://www.pic.gov.za/assets/TownshipandRuralEconomy.pdf">Public Investment Corporation, Township and Rural Economy</Ext>; <Ext href="https://andeglobal.org/wp-content/uploads/2025/06/2021-Township-Ecosystem-Snapshot.pdf">ANDE, Township Economies in South Africa</Ext>.
            </Source>
          </div>
        </div>
      </section>

      <section className="pb-[72px] lg:pb-32">
        <div className="wrap">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Btn to="/join">Join the Society</Btn>
            <Btn to="/ambassadors" variant="line">Become a Climate Ambassador</Btn>
          </div>
        </div>
      </section>
    </>
  );
}
