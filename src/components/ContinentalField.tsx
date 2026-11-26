import { useState } from "react";
import { Link } from "@/lib/router";
import { auRegions, countryProfiles, territories, networkSummary, type AuRegion } from "@/content/continent";
import { Button } from "@/components/ui/button";

// An honest continental view: one mark per sovereign state, grouped by African Union region.
// A filled mark means the Field Registry holds archive records there. A ring means a confirmed
// Country Partner. Nothing else is implied. It is a country index, not a decorative map.
export function ContinentalField() {
  const [region, setRegion] = useState<AuRegion | "all">("all");
  const [countrySlug, setCountrySlug] = useState("south-africa");
  const shown = region === "all" ? countryProfiles : countryProfiles.filter((c) => c.region === region);
  const selected = shown.find((c) => c.slug === countrySlug) ?? shown[0];
  const archiveTotal = shown.reduce((sum, c) => sum + c.registryRecords, 0);
  return (
    <div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter by region">
        {(["all", ...auRegions] as const).map((r) => (
          <Button variant="ghost" key={r} type="button" aria-pressed={region === r} onClick={() => setRegion(r)}
            className={`min-h-[44px] shrink-0 rounded-none border px-3.5 text-[0.8125rem] font-semibold transition-colors ${region === r ? "border-teal bg-teal text-ivory hover:bg-teal hover:text-ivory" : "border-hairline text-stone hover:border-ink hover:text-ink"}`}>
            {r === "all" ? "All 54" : `${r}`}
          </Button>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3 border-b border-hairline pb-3">
        <p className="font-display text-[1.25rem]">{region === "all" ? "The continental field" : `${region} Africa`}</p>
        <p className="text-[0.8125rem] text-stone">{archiveTotal} archive records</p>
      </div>
      <ul className="continental-grid mt-4 grid grid-cols-[repeat(auto-fill,minmax(7.25rem,1fr))] border-l border-t border-hairline" aria-label="African states">
        {shown.map((c) => {
          const partner = c.representation.some((r) => r.kind === "Country Partner");
          return (
            <li key={c.slug} className="border-b border-r border-hairline bg-ivory">
              <Button variant="ghost" onClick={() => setCountrySlug(c.slug)} aria-pressed={selected?.slug === c.slug} aria-controls="country-discovery" className={`group flex h-auto min-h-[52px] w-full justify-start gap-2.5 rounded-none px-3 py-2 text-left text-[0.8125rem] leading-tight ${selected?.slug === c.slug ? "bg-teal-soft text-teal hover:bg-teal-soft" : "hover:bg-paper"}`}>
                <span aria-hidden="true" className={`status-dot ${partner ? "ring-2 ring-signal ring-offset-2 ring-offset-ivory" : ""} ${c.registryRecords > 0 ? "bg-teal" : "border border-stone/50 bg-transparent"}`} />
                <span className="min-w-0 whitespace-normal group-hover:text-ember">{c.name}</span>
              </Button>
            </li>
          );
        })}
      </ul>
      {selected && <section id="country-discovery" aria-label="Selected country" className="country-discovery mt-5 border-l-2 border-teal bg-teal-soft p-5" aria-live="polite">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
          <div className="min-w-0"><p className="text-[0.75rem] font-semibold text-teal">{selected.region} Africa</p><h3 className="mt-1 text-[1.75rem] leading-tight">{selected.name}</h3></div>
          <span className="numeral text-[2rem] leading-none text-teal">{selected.registryRecords}</span>
        </div>
        <p className="mt-3 text-[0.875rem] text-stone">{selected.registryRecords > 0 ? "Public-source Field Registry records. Awards recognition is not Society membership." : "No Field Registry records in the current archive."}</p>
        <p className="mt-2 text-[0.875rem]">{selected.representation.some((r) => r.kind === "Country Partner") ? "Country Partner confirmed" : "Country Partner representation open"}{selected.regionalCoverage ? `. ${selected.regionalCoverage}.` : "."}</p>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
          <Link to={`/countries/${selected.slug}`} className="tlink">Country profile <span aria-hidden="true">→</span></Link>
          {selected.registryRecords > 0 && <Link to={`/registry?country=${encodeURIComponent(selected.name)}`} className="tlink">View archive records <span aria-hidden="true">→</span></Link>}
        </div>
      </section>}
      <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[0.8125rem] text-stone">
        <div className="flex items-center gap-2"><span className="status-dot bg-teal" aria-hidden="true" /><dt className="sr-only">Filled</dt><dd>Field Registry records ({networkSummary.withArchiveRecords} states)</dd></div>
        <div className="flex items-center gap-2"><span className="status-dot ring-2 ring-signal ring-offset-2 ring-offset-ivory" aria-hidden="true" /><dt className="sr-only">Ringed</dt><dd>Confirmed Country Partner ({networkSummary.withCountryPartner})</dd></div>
        {territories.map((t) => <div key={t.slug}><dt className="sr-only">Territory</dt><dd><Link className="underline underline-offset-4 hover:text-ink" to={`/countries/${t.slug}`}>{t.name}</Link>, territorial engagement</dd></div>)}
      </dl>
    </div>
  );
}
