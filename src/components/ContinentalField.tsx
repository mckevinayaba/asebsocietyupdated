import { useState } from "react";
import { Link } from "@/lib/router";
import { auRegions, countryProfiles, territories, networkSummary, type AuRegion } from "@/content/continent";

// An honest continental view: one mark per sovereign state, grouped by African Union region.
// A filled mark means the Field Registry holds archive records there. A ring means a confirmed
// Country Partner. Nothing else is implied. It is a country index, not a decorative map.
export function ContinentalField() {
  const [region, setRegion] = useState<AuRegion | "all">("all");
  const shown = region === "all" ? countryProfiles : countryProfiles.filter((c) => c.region === region);
  return (
    <div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter by region">
        {(["all", ...auRegions] as const).map((r) => (
          <button key={r} type="button" aria-pressed={region === r} onClick={() => setRegion(r)}
            className={`min-h-[40px] shrink-0 border px-3.5 text-[0.8125rem] font-semibold transition-colors ${region === r ? "border-ink bg-ink text-ivory" : "border-hairline text-stone hover:border-ink hover:text-ink"}`}>
            {r === "all" ? "All 54" : `${r}`}
          </button>
        ))}
      </div>
      <ul className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(7.25rem,1fr))] border-l border-t border-hairline" aria-label="African states">
        {shown.map((c) => {
          const partner = c.representation.some((r) => r.kind === "Country Partner");
          return (
            <li key={c.slug} className="border-b border-r border-hairline bg-ivory">
              <Link to={`/countries/${c.slug}`} className="group flex min-h-[52px] items-center gap-2.5 px-3 py-2 text-[0.8125rem] leading-tight transition-colors hover:bg-paper">
                <span aria-hidden="true" className={`status-dot ${partner ? "ring-2 ring-signal ring-offset-2 ring-offset-ivory" : ""} ${c.registryRecords > 0 ? "bg-teal" : "border border-stone/50 bg-transparent"}`} />
                <span className="min-w-0 truncate group-hover:text-ember">{c.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[0.8125rem] text-stone">
        <div className="flex items-center gap-2"><span className="status-dot bg-teal" aria-hidden="true" /><dt className="sr-only">Filled</dt><dd>Field Registry records ({networkSummary.withArchiveRecords} states)</dd></div>
        <div className="flex items-center gap-2"><span className="status-dot ring-2 ring-signal ring-offset-2 ring-offset-ivory" aria-hidden="true" /><dt className="sr-only">Ringed</dt><dd>Confirmed Country Partner ({networkSummary.withCountryPartner})</dd></div>
        {territories.map((t) => <div key={t.slug}><dt className="sr-only">Territory</dt><dd><Link className="underline underline-offset-4 hover:text-ink" to={`/countries/${t.slug}`}>{t.name}</Link>, territorial engagement</dd></div>)}
      </dl>
    </div>
  );
}
