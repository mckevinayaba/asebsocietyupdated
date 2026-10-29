import { useState } from "react";
import { evidence, aeeiCredit } from "@/content/evidence";
import { conditions } from "@/content/framework";
import { PageHero } from "@/components/PageHero";
import { asset } from "@/lib/asset";

const kinds = ["All", "Dataset", "Dashboard", "Paper", "Research programme", "Resource", "Summit session"] as const;

// Illustrative only: the AEEI condition profile is shown as an empty frame until the open
// dataset is imported. No figures are invented.
function ProfileFrame() {
  return (
    <div className="border border-hairline bg-paper p-6 lg:p-8">
      <div className="flex items-baseline justify-between">
        <p className="text-eyebrow font-semibold uppercase text-stone">Country condition profile</p>
        <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-umber">Data import pending</p>
      </div>
      <ul className="mt-6 space-y-4">
        {conditions.map((c) => (
          <li key={c.n} className="grid grid-cols-[8.5rem_1fr] items-center gap-4 text-[0.875rem]">
            <span>{c.aeei}</span>
            <span className="relative h-[6px] bg-linen">
              <span className="absolute inset-y-0 left-0 w-0 bg-umber" />
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-[0.8125rem] leading-relaxed text-stone">
        Each country page will show its AEEI profile beside the ASEB practitioners and institutions active in each condition.
      </p>
    </div>
  );
}

export default function Evidence() {
  const [kind, setKind] = useState<(typeof kinds)[number]>("All");
  const list = kind === "All" ? evidence : evidence.filter((e) => e.kind === kind);
  return (
    <>
      <PageHero
        eyebrow="The Evidence Library"
        title="From ecosystem language to ecosystem evidence."
        lede="A free, curated library of the best open research on African ecosystems, organised by condition and written up for practitioners. Open to everyone, without signing in."
      />

      <section className="section-tight border-b border-hairline">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <p className="eyebrow">The research behind ASEB 2026</p>
            <h2 className="mt-5 text-display-sm">Africa's ecosystems can now be measured.</h2>
            <p className="mt-6 text-[1.0625rem] leading-relaxed text-stone">
              The Africa Entrepreneurial Ecosystem Index is a partnership between Utrecht University, the Allan Gray Centre for Africa Entrepreneurship at Stellenbosch University and i4Policy. It measures seven dimensions through 21 indicators. Its peer-reviewed finding is that ecosystem quality explains new firm creation and high-growth firms better than GDP per capita.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                { s: "erik-stam", n: "Prof Erik Stam", o: "Utrecht University" },
                { s: "phumlani-nkontwana", n: "Dr Phumlani Nkontwana", o: "AGCAE, Stellenbosch" },
                { s: "tim-gelissen", n: "Tim Gelissen", o: "i4Policy" },
              ].map((p) => (
                <figure key={p.s}>
                  <div className="photo aspect-[4/5]"><img src={asset(`images/people/${p.s}.jpg`)} alt={p.n} loading="lazy" /></div>
                  <figcaption className="mt-3 text-[0.8125rem] leading-snug"><span className="font-semibold">{p.n}</span><br /><span className="text-stone">{p.o}</span></figcaption>
                </figure>
              ))}
            </div>
            <p className="mt-4 text-[0.8125rem] text-stone">Speakers at the ASEB Summit 2026 research session, Day Two.</p>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <ProfileFrame />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="Filter by type">
            {kinds.map((k) => (
              <button
                key={k}
                role="tab"
                aria-selected={kind === k}
                onClick={() => setKind(k)}
                className={`min-h-[40px] shrink-0 border px-4 text-[0.875rem] font-medium transition-colors ${kind === k ? "border-ink bg-ink text-ivory" : "border-hairline text-ink hover:border-ink"}`}
              >
                {k}
              </button>
            ))}
          </div>
          <ul className="mt-10 border-t border-ink">
            {list.map((e) => (
              <li key={e.title} className="grid gap-5 border-b border-hairline py-10 lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-3">
                  <p className="text-eyebrow font-semibold uppercase text-umber">{e.kind}</p>
                  <p className="mt-2 text-[0.875rem] text-stone">{e.year}{e.licence ? ` · ${e.licence}` : ""}</p>
                </div>
                <div className="lg:col-span-6">
                  <h3 className="font-display text-[1.625rem] leading-tight">
                    <a href={e.href} target="_blank" rel="noreferrer" className="hover:text-ember">{e.title} <span className="text-[1rem] text-stone" aria-hidden="true">↗</span></a>
                  </h3>
                  <p className="mt-2 text-[0.875rem] text-stone">{e.authors}</p>
                  <p className="mt-4 text-[1rem] leading-relaxed">{e.summary}</p>
                </div>
                <div className="border-l-2 border-signal pl-5 lg:col-span-3">
                  <p className="text-eyebrow font-semibold uppercase text-stone">What this means for your practice</p>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed">{e.forPractice}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-12 max-w-3xl space-y-3 text-[0.8125rem] leading-relaxed text-stone">
            <p>{aeeiCredit} <a className="underline underline-offset-4 hover:text-ember" href="https://data.mendeley.com/datasets/bkgpx2765s/1" target="_blank" rel="noreferrer">DOI 10.17632/bkgpx2765s.1</a>.</p>
            <p>Open licensing covers the data and the publications. Their inclusion here does not imply that the authors or their institutions endorse ASEB Society's interpretations.</p>
          </div>
        </div>
      </section>
    </>
  );
}
