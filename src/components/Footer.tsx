import { Link } from "@/lib/router";
import { Logo } from "./Logo";
import { footerNav, statements } from "@/content/site";

export function Footer() {
  return (
    <footer className="on-dark bg-ink text-ivory">
      <div className="wrap pb-10 pt-20 lg:pt-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo tone="dark" />
            <p className="mt-8 max-w-sm font-display text-[1.625rem] leading-snug text-ivory">{statements.short}</p>
            <Link to="/join" className="btn btn-signal mt-8">Join the Society <span className="arr" aria-hidden="true">→</span></Link>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 lg:col-span-8">
            {footerNav.map((col) => (
              <div key={col.heading}>
                <p className="text-eyebrow font-semibold uppercase text-sand">{col.heading}</p>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className="text-[0.9375rem] text-stone-light transition-colors hover:text-ivory">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="rule mt-20 flex flex-col gap-4 pt-8 text-[0.8125rem] text-stone-light md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} ASEB Society. Johannesburg, South Africa. Serving all 54 countries.</p>
          <p>Photography from the ASEB Summit and Awards. Photos: ASEB Society.</p>
        </div>
      </div>
    </footer>
  );
}
