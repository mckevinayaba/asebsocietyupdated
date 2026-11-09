import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "@/lib/router";
import { Logo } from "./Logo";
import { useMember } from "@/hooks/use-member";
import { nav } from "@/content/site";
import { Button } from "@/components/ui/button";
import { Btn } from "./Arrow";

export function Header() {
  const { user } = useMember();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const inGroup = (g: (typeof nav)[number]) => pathname === g.to || g.items.some((i) => pathname === i.to || pathname.startsWith(i.to + "/"));
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => { setOpen(false); setMenu(null); setMobileGroup(null); }, [pathname]);
  useEffect(() => {
    const close = (e: MouseEvent) => { if (navRef.current && !navRef.current.contains(e.target as Node)) setMenu(null); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") { setMenu(null); setOpen(false); } };
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
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Utility bar: the Society and its Summit are one institution with two front doors */}
      <div className="on-dark bg-ink text-[0.8125rem] text-stone-light">
        <div className="wrap flex min-h-9 flex-wrap items-center justify-between gap-2 py-1">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <a href="mailto:aseb@asebsociety.org" className="font-semibold text-ivory transition-colors hover:text-ivory/80">aseb@asebsociety.org</a>
            <span className="h-3 w-px bg-hairline-dark" aria-hidden="true" />
            <a href="https://wa.me/27731366639" target="_blank" rel="noreferrer" className="transition-colors hover:text-ivory">WhatsApp +27 73 136 6639</a>
          </div>
          <div className="hidden items-center gap-5 sm:flex">
            <Link to="/registry" className="transition-colors hover:text-ivory">Field Registry</Link>
            <Link to={user ? "/app" : "/auth"} className="transition-colors hover:text-ivory">{user ? "My member app" : "Member sign in"}</Link>
          </div>
        </div>
      </div>

      <header className={`sticky top-0 z-40 border-b bg-ivory/95 backdrop-blur-sm transition-colors ${scrolled ? "border-hairline" : "border-transparent"}`}>
        <div className="wrap flex min-h-[72px] flex-wrap items-center justify-between gap-x-6">
          <Logo />
          <nav ref={navRef} aria-label="Main" className="order-3 hidden w-full items-center justify-between gap-3 border-t border-hairline lg:flex">
            {nav.map((g) => {
              const active = inGroup(g);
              const cls = `relative flex min-h-[44px] items-center gap-1.5 text-[0.8125rem] font-medium transition-colors hover:text-ink ${active ? "text-ink after:absolute after:bottom-[6px] after:left-0 after:h-[2px] after:w-full after:bg-signal" : "text-ink/70"}`;
              if (!g.items.length) return <Link key={g.label} to={g.to} className={cls}>{g.label}</Link>;
              const isOpen = menu === g.label;
              return (
                <div key={g.label} className="relative" onMouseEnter={() => setMenu(g.label)} onMouseLeave={() => setMenu(null)}>
                  <Button variant="ghost" type="button" className={`${cls} h-auto whitespace-normal rounded-none px-0 py-3 text-left leading-tight`} aria-expanded={isOpen} aria-haspopup="true" onClick={() => setMenu(isOpen ? null : g.label)}>
                    {g.label}<span aria-hidden="true" className={`text-[0.75rem] text-stone transition-transform ${isOpen ? "rotate-180" : ""}`}>⌄</span>
                  </Button>
                  {isOpen && (
                    <div className={`absolute top-full z-50 w-[320px] pt-2 ${nav.indexOf(g) >= 5 ? "right-0" : "left-0"}`}>
                      <ul className="intent-menu border border-hairline bg-paper py-2">
                        {g.items.map((i) => (
                          <li key={i.to}>
                            <Link to={i.to} onClick={() => { setMenu(null); setOpen(false); }} className={`group block px-6 py-3 transition-colors hover:bg-linen ${pathname === i.to ? "bg-linen/60" : ""}`}>
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
            <div className="hidden sm:block"><Btn to="/join">Join the Society</Btn></div>
            <Button
              variant="ghost"
              type="button"
              className="min-h-[44px] px-1 text-[0.9375rem] font-semibold lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? "Close" : "Menu"}
            </Button>
          </div>
        </div>
      </header>

      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-[108px] z-30 overflow-y-auto bg-ivory lg:hidden">
          <nav aria-label="Mobile" className="wrap flex flex-col pb-16 pt-6">
            {nav.map((g) => {
              
              if (!g.items.length)
                return (
                  <Link key={g.label} to={g.to} className="flex items-baseline gap-5 border-b border-hairline py-5">
                    <span className="font-display text-[1.625rem] leading-tight">{g.label}</span>
                  </Link>
                );
              const ex = mobileGroup === g.label;
              return (
                <div key={g.label} className="border-b border-hairline">
                  <Button variant="ghost" type="button" aria-expanded={ex} onClick={() => setMobileGroup(ex ? null : g.label)} className="flex h-auto w-full items-baseline gap-5 whitespace-normal rounded-none px-0 py-5 text-left">
                    <span className="flex-1 font-display text-[1.625rem] leading-tight">{g.label}</span>
                    <span aria-hidden="true" className="text-[1.25rem] text-stone">{ex ? "−" : "+"}</span>
                  </Button>
                  {ex && (
                    <ul className="pb-4 pl-4">
                      {g.items.map((it) => (
                        <li key={it.to}>
                          <Link to={it.to} onClick={() => setOpen(false)} className="block py-2.5">
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
              <Link to={user ? "/app" : "/auth"} className="btn btn-line w-full">{user ? "Open my member app" : "Member sign in"}</Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
