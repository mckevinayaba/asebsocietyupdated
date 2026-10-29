import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "@/lib/router";
import { Logo } from "./Logo";
import { nav } from "@/content/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const inGroup = (g: (typeof nav)[number]) => pathname === g.to || g.items.some((i) => pathname === i.to || pathname.startsWith(i.to + "/"));
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => { setOpen(false); setMenu(null); }, [pathname]);
  useEffect(() => {
    const close = (e: MouseEvent) => { if (navRef.current && !navRef.current.contains(e.target as Node)) setMenu(null); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setMenu(null); };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", esc); };
  }, []);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      {/* Utility bar: the Society and its Summit are one institution with two front doors */}
      <div className="on-dark bg-ink text-[0.8125rem] text-stone-light">
        <div className="wrap flex h-9 items-center justify-between">
          <div className="flex items-center gap-5">
            <span className="font-semibold text-ivory">ASEB Society</span>
            <span className="h-3 w-px bg-hairline-dark" aria-hidden="true" />
            <Link to="/summit" className="transition-colors hover:text-ivory">Summit and Awards</Link>
          </div>
          <div className="hidden items-center gap-5 sm:flex">
            <Link to="/registry" className="transition-colors hover:text-ivory">Field Registry</Link>
            <Link to="/app" className="transition-colors hover:text-ivory">Member sign in</Link>
          </div>
        </div>
      </div>

      <header className={`sticky top-0 z-40 border-b bg-ivory/95 backdrop-blur-sm transition-colors ${scrolled ? "border-hairline" : "border-transparent"}`}>
        <div className="wrap flex h-[72px] items-center justify-between gap-6">
          <Logo />
          <nav ref={navRef} aria-label="Main" className="hidden items-center gap-7 xl:flex">
            {nav.map((g) => {
              const active = inGroup(g);
              const cls = `relative flex min-h-[44px] items-center gap-1.5 text-[0.9375rem] font-medium transition-colors hover:text-ink ${active ? "text-ink after:absolute after:bottom-[6px] after:left-0 after:h-[2px] after:w-full after:bg-signal" : "text-ink/70"}`;
              if (!g.items.length) return <Link key={g.label} to={g.to} className={cls}>{g.label}</Link>;
              const isOpen = menu === g.label;
              return (
                <div key={g.label} className="relative" onMouseEnter={() => setMenu(g.label)} onMouseLeave={() => setMenu(null)}>
                  <button type="button" className={cls} aria-expanded={isOpen} aria-haspopup="true" onClick={() => setMenu(isOpen ? null : g.label)}>
                    {g.label}<span aria-hidden="true" className={`text-[0.75rem] text-stone transition-transform ${isOpen ? "rotate-180" : ""}`}>⌄</span>
                  </button>
                  {isOpen && (
                    <div className="absolute left-[-1.5rem] top-full z-50 w-[340px] pt-2">
                      <ul className="border border-hairline bg-paper py-2 shadow-[0_18px_40px_-24px_rgba(20,17,15,0.35)]">
                        {g.items.map((i) => (
                          <li key={i.to}>
                            <Link to={i.to} className={`group block px-6 py-3 transition-colors hover:bg-linen ${pathname === i.to ? "bg-linen/60" : ""}`}>
                              <span className="block text-[0.9375rem] font-semibold text-ink">{i.label} <span className="arr inline-block transition-transform group-hover:translate-x-1" aria-hidden="true">→</span></span>
                              <span className="mt-0.5 block text-[0.8125rem] leading-snug text-stone">{i.note}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/join" className="btn btn-primary hidden min-h-[44px] px-5 sm:inline-flex">
              Join the Society
            </Link>
            <button
              type="button"
              className="min-h-[44px] px-1 text-[0.9375rem] font-semibold tracking-wide xl:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-[108px] z-30 overflow-y-auto bg-ivory xl:hidden">
          <nav aria-label="Mobile" className="wrap flex flex-col pb-16 pt-6">
            {nav.map((g, i) => {
              const num = <span className="numeral w-6 text-sm text-stone">{String(i + 1).padStart(2, "0")}</span>;
              if (!g.items.length)
                return (
                  <Link key={g.label} to={g.to} className="flex items-baseline gap-5 border-b border-hairline py-5">
                    {num}<span className="font-display text-[1.875rem] leading-none">{g.label}</span>
                  </Link>
                );
              const ex = mobileGroup === g.label;
              return (
                <div key={g.label} className="border-b border-hairline">
                  <button type="button" aria-expanded={ex} onClick={() => setMobileGroup(ex ? null : g.label)} className="flex w-full items-baseline gap-5 py-5 text-left">
                    {num}<span className="flex-1 font-display text-[1.875rem] leading-none">{g.label}</span>
                    <span aria-hidden="true" className="text-[1.25rem] text-stone">{ex ? "−" : "+"}</span>
                  </button>
                  {ex && (
                    <ul className="pb-4 pl-11">
                      {g.items.map((it) => (
                        <li key={it.to}>
                          <Link to={it.to} className="block py-2.5">
                            <span className="block text-[1.0625rem] font-semibold">{it.label}</span>
                            <span className="block text-[0.8125rem] text-stone">{it.note}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
            <div className="mt-10 flex flex-col gap-3">
              <Link to="/join" className="btn btn-primary w-full">Join the Society</Link>
              <Link to="/app" className="btn btn-line w-full">Open the member app preview</Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
