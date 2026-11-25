import { useMemo, useState } from "react";
import { Link } from "@/lib/router";
import { searchSite } from "@/lib/site-search";
import { Sheet } from "./Sheet";
import { SearchIcon } from "./Icons";

const suggestions = ["Kenya", "Country Partner", "Academy", "investment readiness", "Field Lab", "Mayotte"];

export function SearchSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchSite(query), [query]);
  return (
    <Sheet open={open} onOpenChange={onOpenChange} title="Search" description="Pages, practitioners, institutions, countries and evidence.">
      <label className="sticky top-0 z-10 flex items-center gap-3 border-b border-ink bg-ivory pb-3 pt-1">
        <SearchIcon className="shrink-0 text-stone" />
        <span className="sr-only">Search ASEB Society</span>
        <input autoFocus type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the Society" className="min-h-[44px] w-full bg-transparent text-[1.125rem] outline-none placeholder:text-stone/70" />
      </label>
      {!query.trim() ? (
        <div className="py-6">
          <p className="text-label font-semibold uppercase tracking-[0.12em] text-stone">Try</p>
          <div className="mt-3 flex flex-wrap gap-2">{suggestions.map((s) => <button key={s} type="button" onClick={() => setQuery(s)} className="tag min-h-[36px] hover:border-ink hover:text-ink">{s}</button>)}</div>
        </div>
      ) : results.length === 0 ? (
        <p className="py-8 text-stone" role="status">Nothing matches “{query}”. Try a country, a role or a mandate.</p>
      ) : (
        <ul className="py-2" aria-live="polite">
          {results.map((result) => (
            <li key={`${result.kind}-${result.to}-${result.title}`}>
              <Link to={result.to} onClick={() => onOpenChange(false)} className="grid grid-cols-[88px_1fr] gap-3 border-b border-hairline py-3.5 transition-colors hover:bg-paper">
                <span className="pt-0.5 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-umber">{result.kind}</span>
                <span className="min-w-0"><span className="block font-semibold leading-snug">{result.title}</span><span className="mt-0.5 block truncate text-[0.8125rem] text-stone">{result.detail}</span></span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Sheet>
  );
}
