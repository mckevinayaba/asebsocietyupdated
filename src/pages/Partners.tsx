import { PageHero, SectionHead } from "@/components/PageHero";
import { Btn } from "@/components/Arrow";
import { supporters } from "@/content/summit";

const tiers = [
  {
    n: "01",
    name: "Continental Partners",
    who: "Hub networks, academies, development finance institutions and governments.",
    what: "A seat on the partner council, co-design of the ASEB Agenda, and shared data under the Common Reporting Framework.",
  },
  {
    n: "02",
    name: "Knowledge Partners",
    who: "Research centres and policy institutions producing evidence on African ecosystems.",
    what: "Named co-authorship of the State of the Field, a seat on the ASEB Research Council, a Field Lab project and a research session at every Summit.",
  },
  {
    n: "03",
    name: "Programme Partners",
    who: "Funders, foundations and corporates who back a specific pillar or programme.",
    what: "Sponsorship of an Academy cohort, a Field Lab project or an Awards category, with outcome reporting against the seven conditions.",
  },
  {
    n: "04",
    name: "Summit and Awards Partners",
    who: "Institutions supporting the annual convening and recognition of the field.",
    what: "Category sponsorship, Summit sessions and visibility in front of practitioners from more than 50 countries.",
  },
];

export default function Partners() {
  return (
    <>
      <PageHero
        eyebrow="Partners"
        title="Institutions advancing the field with us."
        lede="No single funder can sustain a field. ASEB Society is built on a coalition: partners who each contribute what they are able, and who share in what the field produces."
      >
        <Btn to="/get-involved#partner">Partner with the Society</Btn>
      </PageHero>

      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="How partnership works" title="Four ways to partner." />
          <ol className="mt-14 border-t border-ink">
            {tiers.map((t) => (
              <li key={t.n} className="reveal grid gap-4 border-b border-hairline py-10 lg:grid-cols-12 lg:gap-10">
                <span className="numeral text-sm text-umber lg:col-span-1">{t.n}</span>
                <h3 className="font-display text-[1.875rem] leading-tight lg:col-span-4">{t.name}</h3>
                <div className="space-y-3 text-[1rem] leading-relaxed lg:col-span-7">
                  <p>{t.who}</p>
                  <p className="text-stone">{t.what}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section border-t border-hairline bg-paper">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="eyebrow">Knowledge Partner</p>
            <h2 className="mt-5 text-display-sm">i4Policy</h2>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-stone">
              The Innovation for Policy Foundation is a partner in the Africa Entrepreneurial Ecosystem Index and an ASEB Society Knowledge Partner. At ASEB 2026, i4Policy presented the index and demonstrated its open dashboard.
            </p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="eyebrow">Summit and Awards supporters</p>
            <ul className="mt-6 grid grid-cols-1 border-t border-ink sm:grid-cols-2">
              {supporters.map((s, i) => (
                <li key={s} className={`border-b border-hairline py-4 font-display text-[1.25rem] ${i % 2 === 1 ? "sm:border-l sm:pl-6" : ""}`}>{s}</li>
              ))}
            </ul>
            <p className="mt-6 text-[0.8125rem] text-stone">Partner logos are shown once each institution has approved their use.</p>
          </div>
        </div>
      </section>
    </>
  );
}
