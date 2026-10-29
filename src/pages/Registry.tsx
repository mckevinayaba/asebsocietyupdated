import { useMemo, useState } from "react";
import { Link, useParams } from "@/lib/router";
import { registry, recordBySlug, countries, regions, registryConditions, type RegistryRecord } from "@/content/registry";
import { filterRegistry } from "@/lib/registry-search";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/PageHero";
import { Btn, TLink } from "@/components/Arrow";
import NotFound from "./NotFound";

const PAGE = 24;

const topRecognition = (r: RegistryRecord) => {
  const sorted = [...r.recognitions].sort((a, b) => b.year - a.year);
  return sorted[0];
};

export function RegistryIndex() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<"all" | "individual" | "organisation">("all");
  const [region, setRegion] = useState("all");
  const [condition, setCondition] = useState("all");
  const [country, setCountry] = useState("all");
  const [year, setYear] = useState("all");
  const [sort, setSort] = useState("name");
  const [shown, setShown] = useState(PAGE);
  const years = [...new Set(registry.flatMap((r) => r.recognitions.map((x) => x.year)))].sort((a, b) => b - a);
  const hasFilters = !!q || [type, region, condition, country, year].some((value) => value !== "all");

  const results = useMemo(() => {
    return filterRegistry(registry, { query: q, type, region, condition, country, year, sort });
  }, [q, type, region, condition, country, year, sort]);

  const reset = (fn: () => void) => { fn(); setShown(PAGE); };

  return (
    <>
      <PageHero
        eyebrow="The Field Registry"
        title="Mapping who builds Africa's ecosystems."
        lede="A public record of the practitioners and institutions who build the conditions for founders, drawn from the ASEB Awards archive and linked public sources."
      />
      <section className="section-tight">
        <div className="wrap">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-5 border-b border-hairline pb-6"><p className="text-sm text-stone">Awards recognition and Society membership are distinct.</p><TLink to="/registry/submit">Propose a registry record</TLink></div>
          <div className="grid gap-4 border-b border-ink pb-8 lg:grid-cols-12">
            <label className="lg:col-span-5">
              <span className="field-label">Search</span>
              <input className="field-input" type="search" placeholder="Name, country, role or award" value={q} onChange={(e) => reset(() => setQ(e.target.value))} />
            </label>
            <label className="lg:col-span-2">
              <span className="field-label">Type</span>
              <select className="field-input" value={type} onChange={(e) => reset(() => setType(e.target.value as typeof type))}>
                <option value="all">All</option>
                <option value="individual">Practitioners</option>
                <option value="organisation">Institutions</option>
              </select>
            </label>
            <label className="lg:col-span-2">
              <span className="field-label">Region</span>
              <select className="field-input" value={region} onChange={(e) => reset(() => setRegion(e.target.value))}>
                <option value="all">All regions</option>
                {regions.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </label>
            <label className="lg:col-span-3">
              <span className="field-label">Condition</span>
              <select className="field-input" value={condition} onChange={(e) => reset(() => setCondition(e.target.value))}>
                <option value="all">All conditions</option>
                {registryConditions.map((c) => <option key={c} value={c}>{c.replace(/&/g, "and")}</option>)}
              </select>
            </label>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <label><span className="field-label">Country</span><select className="field-input" value={country} onChange={(e) => reset(() => setCountry(e.target.value))}><option value="all">All countries</option>{countries.map((c) => <option key={c}>{c}</option>)}<option value="continental">Continental / not specified</option></select></label>
            <label><span className="field-label">Recognition year</span><select className="field-input" value={year} onChange={(e) => reset(() => setYear(e.target.value))}><option value="all">All years</option>{years.map((y) => <option key={y}>{y}</option>)}</select></label>
            <label><span className="field-label">Sort by</span><select className="field-input" value={sort} onChange={(e) => reset(() => setSort(e.target.value))}><option value="name">Name, A–Z</option><option value="recent">Latest recognition</option></select></label>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-[0.875rem] text-stone" aria-live="polite"><span className="numeral font-semibold text-ink">{results.length}</span> of {registry.length} archive records</p>
            {hasFilters && <Button variant="ghost" onClick={() => reset(() => { setQ(""); setType("all"); setRegion("all"); setCondition("all"); setCountry("all"); setYear("all"); })}>Clear filters <span aria-hidden="true">×</span></Button>}
          </div>

          <ul className="mt-6 grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-3">
            {results.slice(0, shown).map((r) => {
              const top = topRecognition(r);
              return (
                <li key={r.slug} className="bg-ivory">
                  <Link to={`/registry/${r.slug}`} className="group flex h-full flex-col justify-between gap-6 p-6 transition-colors hover:bg-paper">
                    <div>
                      <div className="flex items-center justify-between gap-4 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-stone">
                        <span>{r.type === "organisation" ? "Institution" : "Practitioner"}</span>
                        <span>{r.country || "Continental"}</span>
                      </div>
                      <h3 className="mt-4 font-display text-[1.5rem] leading-tight group-hover:text-ember">{r.name}</h3>
                      {top && <p className="mt-2 text-[0.875rem] text-stone">{top.award}</p>}
                    </div>
                    {top && (
                      <p className="flex items-center gap-2 text-[0.8125rem] font-medium">
                        <span className={`inline-block h-2 w-2 ${/Winner/.test(top.result) ? "bg-signal" : "bg-sand"}`} aria-hidden="true" />
                        {top.result}, {top.year}
                      </p>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
          {results.length === 0 && <p className="border-b border-hairline py-16 text-center text-stone">No records match. Try a broader search.</p>}
          {shown < results.length && (
            <div className="mt-10 text-center">
              <Button type="button" variant="outline" className="btn btn-line h-auto" onClick={() => setShown((s) => s + PAGE)}>
                Show more records
              </Button>
            </div>
          )}
          <p className="mt-12 max-w-3xl text-[0.8125rem] leading-relaxed text-stone">
            Every record links to its public source. Submit a proposed record or request to claim an existing profile for Secretariat review. Registry inclusion does not establish Society membership or professional accreditation.
          </p>
        </div>
      </section>
    </>
  );
}

export function RecordPage() {
  const { slug = "" } = useParams();
  const r = recordBySlug(slug);
  if (!r) return <NotFound />;
  const recs = [...r.recognitions].sort((a, b) => b.year - a.year);
  return (
    <>
      <header className="border-b border-hairline">
        <div className="wrap pb-14 pt-10 lg:pb-20 lg:pt-14">
          <Link to="/registry" className="text-[0.875rem] font-medium text-stone hover:text-ink">← The Field Registry</Link>
          <div className="mt-10 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="eyebrow">{r.type === "organisation" ? "Institution" : "Practitioner"} · {r.country || "Continental"}</p>
              <h1 className="mt-6 text-display-lg">{r.name}</h1>
              {r.role && <p className="mt-5 text-lg text-stone">{r.role}</p>}
            </div>
            <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end lg:justify-end">
              <span className="inline-flex items-center gap-2 text-[0.875rem] font-semibold">
                <span className="inline-block h-2 w-2 bg-signal" aria-hidden="true" /> Public-source record
              </span>
              <span className="text-[0.8125rem] text-stone">Society membership is not confirmed by this listing.</span>
            </div>
          </div>
        </div>
      </header>
      <section className="section">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <p className="text-xl leading-relaxed">{r.bio}</p>
            {r.organisation && <p className="mt-5 text-stone">Organisation: <span className="font-medium text-ink">{r.organisation}</span></p>}
            <dl className="mt-10 grid border-t border-hairline text-[0.9375rem] sm:grid-cols-2">
              <div className="border-b border-hairline py-5 sm:pr-6"><dt className="text-stone">Primary condition</dt><dd className="mt-1 font-medium">{r.condition.replace(/&/g, "and") || "Not yet tagged"}</dd></div>
              <div className="border-b border-hairline py-5 sm:border-l sm:pl-6"><dt className="text-stone">Region</dt><dd className="mt-1 font-medium">{r.region || "Continental"}</dd></div>
            </dl>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Btn to={`/join?intent=claim&record=${encodeURIComponent(r.slug)}`}>Request to claim this profile</Btn>
              {r.source_url && <Btn to={r.source_url} variant="line">View the public source</Btn>}
              {r.linkedin && <TLink to={r.linkedin}>LinkedIn</TLink>}
              {r.website && <TLink to={r.website}>Website</TLink>}
            </div>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="text-eyebrow font-semibold uppercase text-stone">Recognition</p>
            <ol className="mt-5 border-t border-ink">
              {recs.length === 0 && <li className="border-b border-hairline py-5 text-sm text-stone">No award recognition recorded in this collection.</li>}
              {recs.map((x, i) => (
                <li key={i} className="border-b border-hairline py-5">
                  <p className="numeral text-sm text-umber">{x.year}{x.edition ? ` · ${x.edition}` : ""}</p>
                  <p className="mt-1 font-display text-[1.25rem] leading-snug">{x.result}</p>
                  <p className="text-[0.875rem] text-stone">{x.award}</p>
                </li>
              ))}
            </ol>
            <div className="mt-6"><TLink to="/summit">About the ASEB Awards</TLink></div>
          </div>
        </div>
      </section>
    </>
  );
}
