import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "@/lib/router";
import { Logo } from "./Logo";
import { nav } from "@/content/site";
import { useMember } from "@/hooks/use-member";

export function Header() {
  const { user } = useMember();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);
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
            <Link to={user ? "/app" : "/auth"} className="transition-colors hover:text-ivory">{user ? "My member app" : "Member sign in"}</Link>
          </div>
        </div>
      </div>

      <header className={`sticky top-0 z-40 border-b bg-ivory/95 backdrop-blur-sm transition-colors ${scrolled ? "border-hairline" : "border-transparent"}`}>
        <div className="wrap flex h-[72px] items-center justify-between gap-6">
          <Logo />
          <nav aria-label="Main" className="hidden items-center gap-7 xl:flex">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `relative py-2 text-[0.9375rem] font-medium transition-colors hover:text-ink ${isActive ? "text-ink after:absolute after:-bottom-[1px] after:left-0 after:h-[2px] after:w-full after:bg-signal" : "text-ink/70"}`
                }
              >
                {n.label}
              </NavLink>
            ))}
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
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} className="flex items-baseline gap-5 border-b border-hairline py-5">
                                <span className="font-display text-[1.875rem] leading-none">{n.label}</span>
              </NavLink>
            ))}
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
