import { PageHero, SectionHead } from "@/components/PageHero";
import { Photo } from "@/components/Photo";
import { Btn } from "@/components/Arrow";
import { Source, Ext } from "@/components/Rows";
import { story } from "@/content/institution";

export default function Story() {
  return (
    <>
      <PageHero
        eyebrow="Our story"
        title="We did not start with a theory. We started with a room."
        lede="In 2022 we opened a room for the people who build the rooms founders walk into. Four host countries and five editions later, that room has become an institution: the professional home for the practice of ecosystem building in Africa."
      />

      <section className="section">
        <div className="wrap">
          <ol className="border-t border-ink">
            {story.map((s) => (
              <li key={s.year} className="reveal grid gap-3 border-b border-hairline py-10 lg:grid-cols-12 lg:gap-10">
                <span className="numeral text-[2.75rem] leading-none lg:col-span-2 lg:text-[3.25rem]">{s.year}</span>
                <div className="lg:col-span-3">
                  <p className="eyebrow">{s.city}</p>
                  <h2 className="mt-3 font-display text-[1.625rem] leading-tight">{s.title}</h2>
                </div>
                <p className="text-[1.0625rem] leading-relaxed text-stone lg:col-span-7">{s.line}</p>
              </li>
            ))}
          </ol>
          <Source>Source: <Ext href="https://www.asebsociety.org/about/story">ASEB Society, Our Story</Ext>.</Source>
        </div>
      </section>

      <section className="pb-[72px] lg:pb-32">
        <div className="wrap grid gap-6 sm:grid-cols-3">
          <Photo src="images/events/aseb-2023-nairobi.jpg" alt="Builders celebrate together at ASEB 2023 in Nairobi" caption="Nairobi, 2023" ratio="aspect-[4/5]" position="40% center" />
          <Photo src="images/events/aseb-2024-accra-group.jpg" alt="Recognised builders at the ASEB Summit 2024 in Accra" caption="Accra, 2024" ratio="aspect-[4/5]" className="sm:mt-16" />
          <Photo src="images/events/aseb-2025-addis-panel.jpg" alt="A panel discussion at ASEB 2025 in Addis Ababa" caption="Addis Ababa, 2025" ratio="aspect-[4/5]" position="70% center" className="sm:mt-32" />
        </div>
      </section>

      <section className="on-dark section bg-ink text-ivory">
        <div className="wrap">
          <SectionHead
            eyebrow="What the story taught us"
            title="Visibility is not infrastructure."
            lede="A convening can recognise the field once a year. Only an institution can keep its memory, set its standards and protect its builders in the eleven months between. That is why the Summit became a Society."
          />
          <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Btn to="/people" variant="signal">Our people</Btn>
            <Btn to="/governance" variant="line">How we are governed</Btn>
          </div>
        </div>
      </section>
    </>
  );
}
