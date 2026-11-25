import { useEffect, useRef } from "react";
import { Link, useLocation } from "@/lib/router";
import { contextTabsFor, isTabCurrent } from "@/content/navigation";

// Horizontal contextual tabs under the application bar. They scroll sideways when they exceed
// the width, and the current tab is brought into view on arrival.
export function ContextTabs() {
  const { pathname, search } = useLocation();
  const set = contextTabsFor(pathname);
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Centre the current tab inside the strip without moving the page itself.
    const strip = scroller.current;
    const current = strip?.querySelector<HTMLElement>('[aria-current="page"]');
    if (strip && current) strip.scrollLeft = Math.max(0, current.offsetLeft - strip.clientWidth / 2 + current.clientWidth / 2);
  }, [pathname, search]);
  if (!set) return null;
  return (
    <nav aria-label={`${set.label} sections`} className="context-tabs sticky top-[calc(var(--app-bar-h)+var(--safe-top))] z-30 border-b border-hairline bg-ivory/95 backdrop-blur-sm">
      <div ref={scroller} className="no-scrollbar wrap flex h-[var(--context-tabs-h)] snap-x scroll-px-5 sm:scroll-px-8 items-stretch gap-6 overflow-x-auto">
        <span className="hidden shrink-0 items-center text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-umber sm:flex">{set.label}</span>
        {set.tabs.map((tab) => {
          const current = isTabCurrent(tab, pathname, search, set.tabs);
          return (
            <Link key={tab.to} to={tab.to} aria-current={current ? "page" : undefined}
              className={`relative flex shrink-0 items-center whitespace-nowrap text-[0.875rem] font-medium transition-colors ${current ? "" : "text-ink/60 hover:text-ink"}`}>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
