import { Link } from "@/lib/router";
import { asset } from "@/lib/asset";
import { Photo } from "@/components/Photo";
import { Btn, TLink } from "@/components/Arrow";
import { Source, Ext } from "@/components/Rows";
import { story } from "@/content/institution";
import { proof } from "@/content/site";
import { cumulativeFigures, nextSummit, positioning } from "@/content/case";
import { photo, pillarPhoto, assignments } from "@/content/photography";

const editionPhoto: Record<string, { src: string; alt: string; caption: string; position?: string }> = Object.fromEntries(
  Object.entries(assignments.story.editions).map(([year, key]) => [year, { src: photo(key).src, alt: photo(key).alt, caption: `${photo(key).city ?? ""}, ${year}` }]),
);

// Our Story: the historical archive. The movement-to-institution narrative, edition record and
// historical figures live here, not on the home page.
export default function Story() {
  return (
    <>
      <section className="cinema cinema-dense on-dark" aria-labelledby="story-title">
        <div className="cinema-media"><img src={asset(photo(assignments.story.hero).src)} alt="" className="object-[45%_center]" fetchPriority="high" /></div>
        <div className="cinema-grade" />
        <div className="wrap relative pb-14 pt-32 lg:pb-24 lg:pt-44">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-sand">Our Story · From movement to institution</p>
          <h1 id="story-title" className="mt-5 max-w-[18ch] font-display text-hero">We did not start with a theory. We started with a room.</h1>
          <p className="mt-6 max-w-[36rem] text-[1.0625rem] leading-relaxed text-ivory/85">In 2022 the Africa Startup Ecosystem Builders Summit &amp; Awards opened a room for the people who build the rooms founders walk into. Five editions in four host countries later, the conversations that began there have become a permanent institution. The Society is new. The work, relationships and experiences that gave birth to it are not.</p>
          <p className="mt-10 text-[0.75rem] text-ivory/60">ASEB Summit delegates, Johannesburg, October 2026 · Photo: ASEB Society</p>
        </div>
      </section>

      <section className="section" aria-labelledby="editions-title">
        <div className="wrap">
          <div className="grid gap-6 lg:grid-cols-12"><div className="lg:col-span-6"><p className="eyebrow">Five editions</p><h2 id="editions-title" className="mt-5 text-title">The record, edition by edition.</h2></div><p className="lede lg:col-span-5 lg:col-start-8 lg:pt-12">Each convening answered a question the last one raised. Together they made the case for an institution.</p></div>
          <ol className="mt-14 border-t border-ink">
            {story.map((s) => {
              const photo = editionPhoto[s.year];
              return (
                <li key={s.year} className="reveal grid gap-6 border-b border-hairline py-10 lg:grid-cols-12 lg:gap-10">
                  <div className="lg:col-span-2"><span className="numeral block text-[2.75rem] leading-none lg:text-[3.5rem]">{s.year}</span><span className="mt-2 block text-[0.875rem] font-semibold text-umber">{s.city}</span></div>
                  <div className="lg:col-span-5"><h3 className="font-display text-[1.75rem] leading-tight">{s.title}</h3><p className="mt-4 text-[1.0625rem] leading-relaxed text-stone">{s.line}</p></div>
                  <div className="lg:col-span-4 lg:col-start-9">{photo ? <Photo src={photo.src} alt={photo.alt} caption={photo.caption} ratio="aspect-[4/3]" {...(photo.position ? { position: photo.position } : {})} /> : <div className="grid aspect-[4/3] place-items-center border border-hairline bg-paper p-6 text-center text-[0.875rem] text-stone">No authorised photograph from the first edition is in the archive yet.</div>}</div>
                </li>
              );
            })}
            <li className="grid gap-6 py-10 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-2"><span className="numeral block text-[2.75rem] leading-none text-ember lg:text-[3.5rem]">{nextSummit.year}</span><span className="mt-2 block text-[0.875rem] font-semibold text-umber">{nextSummit.place}</span></div>
              <div className="lg:col-span-7"><h3 className="font-display text-[1.75rem] leading-tight">The next convening</h3><p className="mt-4 text-[1.0625rem] leading-relaxed text-stone">{nextSummit.line}</p><div className="mt-5"><TLink to={nextSummit.href}>ASEB Summit and Awards on asebs.com</TLink></div></div>
            </li>
          </ol>
          <Source>Source: <Ext href="https://www.asebs.com/story">The ASEB Story, asebs.com</Ext>.</Source>
        </div>
      </section>

      <section className="section border-y border-hairline bg-paper" aria-labelledby="figures-title">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4"><p className="eyebrow">The historical record</p><h2 id="figures-title" className="mt-5 text-display-sm">What five editions gathered.</h2><p className="mt-5 text-[0.9375rem] leading-relaxed text-stone">Nominations, recognitions, Field Registry records, registered accounts, approved members, Country Partners and Ambassadors are different things, and the Society counts each separately.</p></div>
          <div className="lg:col-span-7 lg:col-start-6">
            <h3 className="text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-stone">Across five editions</h3>
            <dl className="mt-4 grid grid-cols-3 border-y border-hairline">{cumulativeFigures.items.map((f, i) => <div key={f.label} className={`flex flex-col py-6 ${i ? "border-l border-hairline pl-4 sm:pl-6" : ""}`}><dt className="order-2 mt-2 text-[0.8125rem] leading-snug text-stone">{f.label}</dt><dd className="numeral text-[1.875rem] leading-none sm:text-[2.5rem]">{f.value}</dd></div>)}</dl>
            <p className="mt-3 text-[0.8125rem] text-stone">{cumulativeFigures.provenance}</p>
            <h3 className="mt-10 text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-stone">The 2026 edition</h3>
            <dl className="mt-4 grid grid-cols-2 border-y border-hairline sm:grid-cols-4">{proof.map((p, i) => <div key={p.label} className={`flex flex-col py-6 ${i % 2 ? "border-l border-hairline pl-4" : ""} ${i >= 2 ? "border-t border-hairline sm:border-t-0" : ""} ${i === 2 ? "sm:border-l sm:pl-4" : ""}`}><dt className="order-2 mt-2 text-[0.8125rem] leading-snug text-stone">{p.label}<span className="block text-[0.75rem]">{p.note}</span></dt><dd className="numeral text-[1.75rem] leading-none sm:text-[2rem]">{p.value}</dd></div>)}</dl>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="transition-title">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Photo src={photo(assignments.story.transition).src} alt={photo(assignments.story.transition).alt} caption="On stage at the ASEB Awards" ratio="aspect-[4/3]" />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="eyebrow">The institutional transition</p>
            <h2 id="transition-title" className="mt-5 text-display-sm">Visibility is not infrastructure.</h2>
            <p className="mt-6 text-[1.0625rem] leading-relaxed text-stone">A convening can recognise the field once a year. Only an institution can keep its memory, set its standards and support its builders in the eleven months between. ASEB Society was officially launched on 21 October 2026, on Day Two of the fifth edition in Johannesburg, to be that institution.</p>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-stone">The Africa Startup Ecosystem Builders Summit &amp; Awards remains the flagship continental convening and recognition programme of ASEB Society, with its own home at asebs.com. The Summit brings the field together. The Society sustains the work throughout the year.</p>
            <p className="mt-8 font-display text-[1.5rem] leading-snug">{positioning.promise}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"><Btn to="/why-aseb">Why We Exist</Btn><Btn to="/people" variant="line">Leadership</Btn><Btn to="https://www.asebs.com" variant="line">asebs.com</Btn></div>
            <p className="mt-6 text-[0.875rem] text-stone">Recognised practitioners appear in the <Link to="/registry" className="underline underline-offset-4">Field Registry</Link>. Recognition there does not make someone a Society member.</p>
          </div>
        </div>
      </section>
    </>
  );
}
