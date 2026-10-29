import type { ReactNode } from "react";

// Numbered hairline rows: the site's standard list pattern. Numerals, no icons.
export function Rows({ items, start = 1 }: { items: { title: ReactNode; body: ReactNode; meta?: ReactNode }[]; start?: number }) {
  return (
    <ol className="border-t border-ink">
      {items.map((t, i) => (
        <li key={i} className="reveal grid gap-3 border-b border-hairline py-8 lg:grid-cols-12 lg:gap-10">
          <span className="numeral text-sm text-umber lg:col-span-1">{String(i + start).padStart(2, "0")}</span>
          <h3 className="font-display text-[1.5rem] leading-tight lg:col-span-4 lg:text-[1.75rem]">{t.title}</h3>
          <div className="text-[1rem] leading-relaxed text-stone lg:col-span-7">
            {t.body}
            {t.meta && <div className="mt-3 text-[0.8125rem] text-stone">{t.meta}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}

// Key-value grid: short label and line, two or three columns on desktop.
export function KeyGrid({ items, cols = 3 }: { items: { k: ReactNode; v: ReactNode }[]; cols?: 2 | 3 }) {
  return (
    <dl className={`grid border-t border-ink sm:grid-cols-2 ${cols === 3 ? "lg:grid-cols-3" : ""}`}>
      {items.map((x, i) => (
        <div key={i} className="border-b border-hairline py-7 sm:pr-8">
          <dt className="font-display text-[1.375rem] leading-tight">{x.k}</dt>
          <dd className="mt-3 text-[0.9375rem] leading-relaxed text-stone">{x.v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Source({ children }: { children: ReactNode }) {
  return <p className="mt-6 text-[0.8125rem] leading-relaxed text-stone">{children}</p>;
}

export function Ext({ href, children }: { href: string; children: ReactNode }) {
  return <a className="underline underline-offset-4 hover:text-ember" href={href} target="_blank" rel="noreferrer">{children}</a>;
}
