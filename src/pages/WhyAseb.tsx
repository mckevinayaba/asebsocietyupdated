import { statements, timeline, whyNow } from "@/content/site";
import { PageHero, SectionHead } from "@/components/PageHero";
import { Photo } from "@/components/Photo";
import { Btn } from "@/components/Arrow";
import { asset } from "@/lib/asset";

export default function WhyAseb() {
  return (
    <>
      <PageHero
        eyebrow="Why ASEB"
        title="From movement to institution."
        lede="Five editions of the ASEB Summit and Awards proved that ecosystem building in Africa is a real field, with its own knowledge, its own standards and its own leaders. What it did not have was a professional home. ASEB Society is that home."
      />

      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="eyebrow">Who we are</p>
            <h2 className="mt-5 text-display-sm">A professional body for the people who build the conditions for founders.</h2>
          </div>
          <div className="space-y-6 text-[1.0625rem] leading-relaxed text-stone lg:col-span-6 lg:col-start-7">
            <p className="text-xl leading-relaxed text-ink">
              ASEB Society advances startup ecosystem building across Africa as a defined practice and a recognised profession. We equip, connect and recognise the people and institutions who build the conditions for founders to start, grow and scale.
            </p>
            <p>{statements.whoBuilds}</p>
            <p>{statements.whatWeDo}</p>
          </div>
        </div>
      </section>

      <section className="border-y border-hairline bg-paper">
        <div className="wrap grid lg:grid-cols-2">
          {[
            { k: "Mission", v: statements.mission },
            { k: "Vision", v: statements.vision },
          ].map((x, i) => (
            <div key={x.k} className={`py-14 lg:py-20 ${i === 1 ? "border-t border-hairline lg:border-l lg:border-t-0 lg:pl-12" : "lg:pr-12"}`}>
              <p className="eyebrow">{x.k}</p>
              <p className="mt-6 font-display text-[1.625rem] leading-snug lg:text-[2rem]">{x.v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead
            eyebrow="Our story"
            title="We did not start with a theory. We started with a room."
            lede="In 2022 we opened a room for the people who build the rooms founders walk into. Five years and four host countries later, the field asked one question: what happens between summits?"
          />
          <ol className="mt-16 border-t border-ink">
            {timeline.map((t) => (
              <li key={t.year} className="reveal grid gap-3 border-b border-hairline py-8 lg:grid-cols-12 lg:items-baseline lg:gap-10">
                <span className="numeral text-[2.5rem] leading-none lg:col-span-2 lg:text-[3rem]">{t.year}</span>
                <span className="font-display text-[1.5rem] lg:col-span-3">{t.city}</span>
                <p className="text-[1.0625rem] leading-relaxed text-stone lg:col-span-7">{t.line}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-[0.8125rem] text-stone">
            Source: <a className="underline underline-offset-4 hover:text-ember" href="https://www.asebs.com/story" target="_blank" rel="noreferrer">The ASEB Story, asebs.com</a>. First-edition details to be confirmed.
          </p>
        </div>
      </section>

      <section className="pb-[72px] lg:pb-32">
        <div className="wrap grid gap-6 sm:grid-cols-2">
          <Photo src="images/events/aseb-awards-stage-1.jpg" alt="A recognised builder addresses the room at the ASEB Awards" caption="The ASEB Awards" ratio="aspect-[4/5]" />
          <Photo src="images/events/aseb-awards-stage-3.jpg" alt="A recognition plaque presented at the ASEB Awards" caption="Recognition presented at the ASEB Awards" ratio="aspect-[4/5]" className="sm:mt-24" />
        </div>
      </section>

      <section className="on-dark section bg-ink text-ivory">
        <div className="wrap">
          <SectionHead
            eyebrow="Why now"
            title="The field has never been more needed, or more fragile."
            lede="African ecosystems are entering a period of structural transition. When outside money retreats, Africa's own builders are what remains. They need to be stronger, better connected and recognised."
          />
          <div className="mt-16 grid gap-px bg-hairline-dark lg:grid-cols-3">
            {whyNow.map((w) => (
              <div key={w.figure} className="bg-ink py-8 lg:px-8 lg:py-10 lg:first:pl-0">
                <p className="numeral text-[2.5rem] leading-none text-signal">{w.figure}</p>
                <p className="mt-5 max-w-xs text-[0.9375rem] leading-relaxed text-ivory/90">{w.label}</p>
                <a href={w.href} target="_blank" rel="noreferrer" className="mt-4 inline-block text-[0.8125rem] text-stone-light hover:text-ivory">{w.source}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="lg:col-span-4">
            <div className="photo aspect-square max-w-[320px]">
              <img src={asset("images/people/mckevin-ayaba.jpg")} alt="McKevin Ayaba, Founder and Chief Ecosystem Officer, ASEB Society" loading="lazy" />
            </div>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <p className="eyebrow">Convener's address, ASEB 2026</p>
            <p className="mt-6 font-display text-[1.75rem] leading-snug lg:text-[2.25rem]">
              Understanding startup ecosystem building: from movement to institution.
            </p>
            <p className="mt-6 text-[0.9375rem] text-stone">McKevin Ayaba, Founder and Chief Ecosystem Officer, ASEB Society. Day Two, ASEB Summit 2026, Johannesburg.</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Btn to="/what-we-build">What we build</Btn>
              <Btn to="/framework" variant="line">The framework</Btn>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
