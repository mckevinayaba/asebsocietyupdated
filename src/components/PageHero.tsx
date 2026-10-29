import type { ReactNode } from "react";

// Interior page opening: eyebrow, serif headline, lede. Left aligned, generous space.
export function PageHero({ eyebrow, title, lede, children, dark = false }: { eyebrow: string; title: ReactNode; lede?: ReactNode; children?: ReactNode; dark?: boolean }) {
  return (
    <header className={dark ? "on-dark bg-ink text-ivory" : "border-b border-hairline"}>
      <div className="wrap pb-14 pt-14 lg:pb-24 lg:pt-24">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-6 max-w-[18ch] text-display-lg">{title}</h1>
        {lede && <div className="lede mt-7 max-w-prose">{lede}</div>}
        {children && <div className="mt-10">{children}</div>}
      </div>
    </header>
  );
}

export function SectionHead({ eyebrow, title, lede, aside }: { eyebrow: string; title: ReactNode; lede?: ReactNode; aside?: ReactNode }) {
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-7">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-5 text-display-md">{title}</h2>
      </div>
      {(lede || aside) && (
        <div className="lg:col-span-5 lg:pt-10">
          {lede && <p className="lede">{lede}</p>}
          {aside && <div className="mt-6">{aside}</div>}
        </div>
      )}
    </div>
  );
}
