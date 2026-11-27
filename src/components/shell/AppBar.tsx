import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "@/lib/router";
import { asset } from "@/lib/asset";
import { desktopNav, investPath } from "@/content/navigation";
import { useMember } from "@/hooks/use-member";
import { CreateIcon, MenuIcon, SearchIcon } from "./Icons";
import { NotificationsButton } from "./Notifications";
import { SearchSheet } from "./SearchSheet";
import { MenuSheet } from "./MenuSheet";

// The global application bar. Solid on reading and working screens; on the immersive home
// opening it starts clear over the photograph and turns solid as soon as the visitor scrolls.
export function AppBar({ immersive = false, tucked = false }: { immersive?: boolean; tucked?: boolean }) {
  const { user } = useMember();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => { setMenu(null); setMenuOpen(false); setSearchOpen(false); }, [pathname]);
  useEffect(() => {
    const close = (event: MouseEvent) => { if (navRef.current && !navRef.current.contains(event.target as Node)) setMenu(null); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setMenu(null); };
    const slash = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (event.key === "/" && !event.metaKey && !event.ctrlKey && target && !/INPUT|TEXTAREA|SELECT/.test(target.tagName) && !target.isContentEditable) { event.preventDefault(); setSearchOpen(true); }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", escape);
    document.addEventListener("keydown", slash);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", escape); document.removeEventListener("keydown", slash); };
  }, []);

  const clear = immersive && !scrolled && !menu;
  const surface = clear ? "clear" : "solid";
  const groupActive = (to: string, items: { to: string }[]) => [to, ...items.map((i) => i.to.split("?")[0] ?? i.to)].some((path) => path !== "/" && (pathname === path || pathname.startsWith(path + "/")));
  const firstName = user && typeof user.user_metadata["name"] === "string" ? String(user.user_metadata["name"]).split(" ")[0] : "";

  return (
    <>
      <header data-surface={surface} data-tucked={tucked && !menuOpen && !searchOpen} className={`app-bar fixed inset-x-0 top-0 z-40 ${clear ? "text-ivory" : "text-ink"}`}>
        <div className="wrap flex h-[var(--app-bar-h)] items-center gap-4 lg:gap-8">
          <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="ASEB Society, home">
            <img src={asset(clear ? "images/brand/aseb-society-mark-on-dark.png" : "images/brand/aseb-society-mark-on-light.png")} alt="" width={40} height={36} className="h-11 w-auto lg:h-12" />
            <span className="hidden flex-col font-display text-[1rem] leading-[1.15] tracking-[-0.01em] lg:flex xl:text-[1.05rem]"><span>Africa Startup Ecosystem</span><span>Builders Society</span></span>
          </Link>

          <nav ref={navRef} aria-label="Main" className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            <Link to="/" className={`relative flex h-11 items-center px-3 text-[0.875rem] font-medium transition-colors ${clear ? "text-ivory/90 hover:text-ivory" : pathname === "/" ? "text-ink" : "text-ink/70 hover:text-ink"}`}>Home</Link>
            {desktopNav.map((group) => {
              const open = menu === group.label;
              const active = groupActive(group.to, group.items);
              return (
                <div key={group.label} className="relative" onMouseEnter={() => setMenu(group.label)} onMouseLeave={() => setMenu(null)}>
                  <button type="button" aria-expanded={open} aria-haspopup="true" onClick={() => setMenu(open ? null : group.label)}
                    className={`relative flex h-11 items-center gap-1.5 px-3 text-[0.875rem] font-medium transition-colors ${clear ? "text-ivory/90 hover:text-ivory" : active ? "text-ink" : "text-ink/70 hover:text-ink"}`}>
                    {group.label}
                    <span aria-hidden="true" className={`text-[0.7rem] opacity-60 transition-transform ${open ? "rotate-180" : ""}`}>⌄</span>
                    {active && !clear && <span aria-hidden="true" className="absolute inset-x-3 bottom-1 h-[2px] bg-signal" />}
                  </button>
                  {open && (
                    <div className="absolute left-1/2 top-full z-50 w-[560px] -translate-x-1/2 pt-3">
                      <div className="intent-menu grid grid-cols-[1fr_180px] overflow-hidden border border-hairline bg-ivory text-ink">
                        <ul className="py-3">
                          {group.items.map((item) => (
                            <li key={item.to}>
                              <Link to={item.to} onClick={() => setMenu(null)} className="group block px-6 py-3 transition-colors hover:bg-paper">
                                <span className="flex items-baseline justify-between gap-3 text-[0.9375rem] font-semibold">{item.label}<span aria-hidden="true" className="text-ember transition-transform group-hover:translate-x-1">→</span></span>
                                <span className="mt-0.5 block text-[0.8125rem] leading-snug text-stone">{item.note}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <div className="flex flex-col justify-between border-l border-hairline bg-paper p-5">
                          <p className="font-display text-[1.25rem] leading-snug">{group.label}</p>
                          <p className="text-[0.8125rem] leading-snug text-stone">Strengthening those who strengthen entrepreneurship.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1 lg:ml-0 lg:gap-3">
            <button type="button" onClick={() => setSearchOpen(true)} className="grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-current/10" aria-label="Search ASEB Society" title="Search (press /)">
              <SearchIcon />
            </button>
            {user && (
              <Link to="/contribute" className={`hidden h-11 items-center gap-1.5 rounded-full px-3 text-[0.875rem] font-semibold transition-colors hover:bg-current/10 md:inline-flex`} aria-label="Create a contribution">
                <CreateIcon width={20} height={20} /><span className="hidden xl:inline">Create</span>
              </Link>
            )}
            {user && <Link to="/contribute" className="grid h-11 w-11 place-items-center rounded-full hover:bg-current/10 md:hidden" aria-label="Create a contribution"><CreateIcon /></Link>}
            {user && <NotificationsButton clear={clear} />}
            <Link to={user ? "/you" : "/auth"} className={`hidden h-11 items-center px-2 text-[0.875rem] font-medium lg:inline-flex ${clear ? "text-ivory/90 hover:text-ivory" : "text-ink/75 hover:text-ink"}`}>
              {user ? (firstName || "You") : "Sign in"}
            </Link>
            <Link to={investPath} className="btn btn-signal hidden min-h-[44px] px-4 text-[0.875rem] lg:inline-flex">Invest in Our Mission</Link>
            <button type="button" onClick={() => setMenuOpen(true)} className="grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-current/10 lg:hidden" aria-label="Open the institutional menu" aria-expanded={menuOpen}>
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>
      <SearchSheet open={searchOpen} onOpenChange={setSearchOpen} />
      <MenuSheet open={menuOpen} onOpenChange={setMenuOpen} />
    </>
  );
}
