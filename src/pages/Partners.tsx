import { Link } from "@/lib/router";
import { PageHero, SectionHead } from "@/components/PageHero";
import { Btn } from "@/components/Arrow";
import { supporters } from "@/content/summit";
import { partnerTypes, partnerCommitments } from "@/content/institution";

const tiers = [
  {
    name: "Continental Partners",
    who: "Hub networks, academies, development finance institutions and governments.",
    what: "A seat on the partner council, co-design of the ASEB Agenda, and shared data under the Common Reporting Framework.",
  },
  {
    name: "Knowledge Partners",
    who: "Research centres and policy institutions producing evidence on African ecosystems.",
    what: "Named co-authorship of the State of the Field, a seat on the ASEB Research Council, a Field Lab project and a research session at every Summit.",
  },
  {
    name: "Programme Partners",
    who: "Funders, foundations and corporates who back a specific pillar or programme.",
    what: "Sponsorship of an Academy cohort, a Field Lab project or an Awards category, with outcome reporting against the seven conditions.",
  },
  {
    name: "Summit and Awards Partners",
    who: "Institutions supporting the annual convening and recognition of the field.",
    what: "Category sponsorship, Summit sessions and visibility in front of practitioners from more than 50 countries.",
  },
];

function PLink({ to, k, v }: { to: string; k: string; v: string }) {
  return (
    <Link to={to} className="group grid gap-2 py-6 lg:grid-cols-12 lg:gap-10">
      <span className="font-display text-[1.5rem] group-hover:text-ember lg:col-span-4">{k} <span className="arr" aria-hidden="true">→</span></span>
      <span className="text-[1rem] leading-relaxed text-stone lg:col-span-8">{v}</span>
    </Link>
  );
}

export default function Partners() {
  return (
    <>
      <PageHero
        eyebrow="Partners"
        title="Institutions advancing the field with us."
        lede="No single funder can sustain a field. ASEB Society is built on a coalition: partners who each contribute what they are able, and who share in what the field produces."
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap"><Btn to="/funders#enquire">Partner with the Society</Btn><Btn to="/country-partners" variant="line">Become a Country Partner</Btn></div>
      </PageHero>

      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="How partnership works" title="Four ways to partner." />
          <ol className="mt-14 border-t border-ink">
            {tiers.map((t) => (
              <li key={t.name} className="reveal grid gap-4 border-b border-hairline py-10 lg:grid-cols-12 lg:gap-10">
                <span aria-hidden="true" className="mt-3 block h-[2px] w-6 bg-signal" />
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

      <section className="on-dark section bg-ink text-ivory">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="eyebrow">What partners commit to</p>
            <h2 className="mt-5 text-display-md">Partnership is not logo placement.</h2>
            <p className="mt-5 text-[1rem] leading-relaxed text-stone-light">It is a shared commitment to strengthening the systems African founders depend on.</p>
          </div>
          <ol className="border-t border-ivory/40 lg:col-span-6 lg:col-start-7">
            {partnerCommitments.map((c, i) => (
              <li key={c} className="grid grid-cols-[2.5rem_1fr] border-b border-hairline-dark py-5 font-display text-[1.5rem]"><span aria-hidden="true" className="mt-3 block h-[2px] w-6 bg-signal" />{c}</li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Who partners with us" title="Six kinds of institution." />
          <dl className="mt-12 grid border-t border-ink sm:grid-cols-2 lg:grid-cols-3">
            {partnerTypes.map((t) => (
              <div key={t.name} className="border-b border-hairline py-7 sm:pr-8">
                <dt className="font-display text-[1.375rem]">{t.name}</dt>
                <dd className="mt-2 text-[0.9375rem] leading-relaxed text-stone">{t.who}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section border-t border-hairline">
        <div className="wrap">
          <SectionHead eyebrow="Other ways to build with us" title="Partnership at every scale." />
          <ul className="mt-12 border-t border-ink">
            {[
              { to: "/country-partners", k: "Country Partners", v: "Institutions that carry the Society's work in one country." },
              { to: "/ambassadors", k: "Ambassadors", v: "Individual practitioners who represent the Society in a country, region, language or community." },
              { to: "/collaborate", k: "Programme Collaborations", v: "Programmes that advance ecosystem building and want to align with the field." },
              { to: "/funders", k: "Funders and DFIs", v: "Fund the builders and draw on field-level evidence." },
              { to: "/work-with-us", k: "Work With Us", v: "Commission the Society or bring it into a consortium." },
            ].map((x) => (
              <li key={x.to} className="border-b border-hairline">
                <PLink to={x.to} k={x.k} v={x.v} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
