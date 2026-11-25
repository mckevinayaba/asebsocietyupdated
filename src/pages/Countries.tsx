import { useMemo, useState } from "react";
import { Link, useParams } from "@/lib/router";
import { Btn, TLink } from "@/components/Arrow";
import { PageHero } from "@/components/PageHero";
import { auRegions, countryProfiles, networkSummary, profileBySlug, territories, type AuRegion } from "@/content/continent";
import { registry } from "@/content/registry";
import { nextSummit } from "@/content/case";

export function CountriesIndex() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<AuRegion | "all">("all");
  const shown = useMemo(() => countryProfiles.filter((c) => (region === "all" || c.region === region) && c.name.toLowerCase().includes(query.trim().toLowerCase())), [query, region]);
  return (
    <>
      <PageHero eyebrow="Explore · Countries" title="A mandate across Africa's 54 nations." lede="The Society is building locally rooted representation country by country. Each profile shows what is confirmed today: appointed representatives, Field Registry records and recognition history. Where nothing is confirmed yet, the profile says so." />
      <section className="section-tight">
        <div className="wrap">
          <dl className="grid grid-cols-3 border-y border-hairline">
            {[[String(networkSummary.sovereignStates), "Sovereign states in the mandate"], [String(networkSummary.withArchiveRecords), "With Field Registry records"], [String(networkSummary.withCountryPartner), "With a confirmed Country Partner"]].map(([v, k], i) => (
              <div key={k} className={`flex flex-col py-5 ${i ? "border-l border-hairline pl-4 sm:pl-8" : ""}`}><dt className="order-2 mt-2 text-[0.8125rem] leading-snug text-stone">{k}</dt><dd className="numeral text-[2rem] leading-none sm:text-[2.5rem]">{v}</dd></div>
            ))}
          </dl>
          <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <label className="block w-full max-w-md"><span className="field-label">Find a country</span><input type="search" className="field-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Country name" /></label>
            <div className="no-scrollbar flex gap-2 overflow-x-auto" role="group" aria-label="Filter by African Union region">
              {(["all", ...auRegions] as const).map((r) => <button key={r} type="button" aria-pressed={region === r} onClick={() => setRegion(r)} className={`min-h-[44px] shrink-0 border px-4 text-[0.875rem] font-semibold ${region === r ? "border-ink bg-ink text-ivory" : "border-hairline text-stone hover:border-ink hover:text-ink"}`}>{r === "all" ? "All regions" : r}</button>)}
            </div>
          </div>
          <ul className="mt-8 border-t border-ink" aria-live="polite">
            {shown.map((c) => (
              <li key={c.slug}>
                <Link to={`/countries/${c.slug}`} className="group grid grid-cols-[1fr_auto] items-center gap-4 border-b border-hairline py-4 sm:grid-cols-[minmax(0,2fr)_1fr_1.4fr_auto]">
                  <span className="font-display text-[1.375rem] leading-tight group-hover:text-ember">{c.name}</span>
                  <span className="hidden text-[0.875rem] text-stone sm:block">{c.region} Africa</span>
                  <span className="hidden text-[0.875rem] sm:block">{c.representation.length ? c.representation.map((r) => r.kind).join(", ") : <span className="text-stone">Representation open</span>}</span>
                  <span className="flex items-center gap-3 text-[0.8125rem] text-stone">{c.registryRecords ? `${c.registryRecords} record${c.registryRecords === 1 ? "" : "s"}` : ""}<span aria-hidden="true" className="text-ember">→</span></span>
                </Link>
              </li>
            ))}
            {!shown.length && <li className="py-8 text-stone">No country matches that search.</li>}
          </ul>
          <div className="mt-12 grid gap-6 border border-hairline bg-paper p-6 lg:grid-cols-2 lg:p-10">
            <div><p className="eyebrow">Territorial engagement</p><p className="mt-4 text-[1rem] leading-relaxed text-stone">Territories are classified separately from the 54 sovereign states.</p></div>
            <ul>{territories.map((t) => <li key={t.slug}><Link to={`/countries/${t.slug}`} className="group block"><span className="font-display text-[1.5rem] group-hover:text-ember">{t.name} →</span><span className="mt-1 block text-[0.9375rem] text-stone">{t.note}</span></Link></li>)}</ul>
          </div>
        </div>
      </section>
    </>
  );
}

export function CountryProfilePage() {
  const { slug = "" } = useParams();
  const profile = profileBySlug(slug);
  if (!profile) return <section className="section"><div className="wrap"><h1 className="text-display-md">Country not found.</h1><div className="mt-6"><TLink to="/countries">All countries</TLink></div></div></section>;
  const records = registry.filter((r) => r.country === profile.name);
  const isMayotte = profile.slug === "mayotte";
  return (
    <>
      <header className="border-b border-hairline">
        <div className="wrap pb-12 pt-10 lg:pb-16 lg:pt-16">
          <Link to="/countries" className="text-[0.875rem] text-stone hover:text-ink">← All countries</Link>
          <p className="eyebrow mt-8">{profile.kind} · {profile.region === "Indian Ocean territory" ? profile.region : `${profile.region} Africa`}</p>
          <h1 className="mt-5 text-display-lg">{profile.name}</h1>
          {profile.note && <p className="lede mt-6 max-w-prose">{profile.note}</p>}
        </div>
      </header>
      <section className="section-tight">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <h2 className="font-display text-[1.75rem]">Representation</h2>
            {profile.representation.length ? (
              <ul className="mt-5 border-t border-ink">{profile.representation.map((r) => <li key={r.name} className="border-b border-hairline py-5"><p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-teal">{r.kind}</p><Link to={r.profile} className="mt-1 block font-display text-[1.5rem] hover:text-ember">{r.name}</Link><p className="mt-1 text-[0.8125rem] text-stone">Source: {r.source}</p></li>)}</ul>
            ) : (
              <p className="mt-4 border-l-2 border-signal pl-5 text-[1rem] leading-relaxed text-stone">No Country Partner or Ambassador has been appointed for {profile.name} yet. {isMayotte ? "Engagement here centres on the 2027 Summit." : "Credible organisations and practitioners can apply."}</p>
            )}
            {profile.regionalCoverage && <p className="mt-4 text-[0.9375rem]">{profile.regionalCoverage}.</p>}
            {!isMayotte && <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Btn to="/country-partners">Apply as Country Partner</Btn><Btn to="/ambassadors" variant="line">Apply as Ambassador</Btn></div>}
            {isMayotte && <div className="mt-8"><Btn to={nextSummit.href} variant="line">ASEB Summit and Awards on asebs.com</Btn></div>}

            <h2 className="mt-16 font-display text-[1.75rem]">Field Registry</h2>
            {records.length ? (
              <>
                <ul className="mt-5 border-t border-ink">{records.slice(0, 8).map((r) => <li key={r.slug}><Link to={`/registry/${r.slug}`} className="group flex items-baseline justify-between gap-4 border-b border-hairline py-4"><span><span className="block font-semibold group-hover:text-ember">{r.name}</span><span className="block text-[0.875rem] text-stone">{[r.role, r.organisation].filter(Boolean).join(" · ")}</span></span><span aria-hidden="true" className="text-ember">→</span></Link></li>)}</ul>
                {records.length > 8 && <div className="mt-5"><TLink to={`/registry?country=${encodeURIComponent(profile.name)}`}>All {records.length} records for {profile.name}</TLink></div>}
              </>
            ) : <p className="mt-4 text-stone">The Field Registry holds no archive records for {profile.name} yet.</p>}
            <p className="mt-4 text-[0.8125rem] text-stone">Registry records document Awards recognition. They are not Society membership.</p>
          </div>
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="border border-hairline bg-paper p-6">
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-stone">What this profile will hold</p>
              <ul className="mt-4 space-y-3 text-[0.9375rem]">
                {[["National ecosystem overview", false], ["Country Partner and Ambassadors", profile.representation.length > 0], ["Recognised practitioners and institutions", records.length > 0], ["Local activities and opportunities", false], ["Relevant knowledge", false]].map(([label, done]) => (
                  <li key={String(label)} className="flex items-start gap-3"><span aria-hidden="true" className={`status-dot mt-[0.5em] ${done ? "bg-teal" : "border border-stone/50"}`} /><span className={done ? "" : "text-stone"}>{label}<span className="sr-only">{done ? ", available" : ", not yet available"}</span></span></li>
                ))}
              </ul>
              <p className="mt-5 text-[0.8125rem] leading-relaxed text-stone">Information appears only once it is verified. No national statistics are estimated.</p>
            </div>
            {profile.recognitionYears.length > 0 && <p className="mt-6 text-[0.875rem] text-stone">Recognised in ASEB Awards: {profile.recognitionYears.join(", ")}.</p>}
          </aside>
        </div>
      </section>
    </>
  );
}
