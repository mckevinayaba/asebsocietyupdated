import type { ComponentType, SVGProps } from "react";
import { Link, useLocation } from "@/lib/router";
import { activeTab, primaryTabs, type TabKey } from "@/content/navigation";
import { useMember } from "@/hooks/use-member";
import { CirclesIcon, DiscoverIcon, ExploreIcon, HomeIcon, YouIcon } from "./Icons";

const icons: Record<TabKey, ComponentType<SVGProps<SVGSVGElement> & { filled?: boolean }>> = {
  home: HomeIcon, explore: ExploreIcon, circles: CirclesIcon, discover: DiscoverIcon, you: YouIcon,
};

// Persistent mobile navigation: five destinations, the same before and after sign in.
export function BottomNav() {
  const { pathname } = useLocation();
  const { user } = useMember();
  const current = activeTab(pathname);
  return (
    <nav aria-label="Primary" className="bottom-nav fixed inset-x-0 bottom-0 z-40 bg-ivory/97 backdrop-blur-md lg:hidden">
      <ul className="mx-auto grid h-[var(--bottom-nav-h)] max-w-xl grid-cols-5">
        {primaryTabs.map((tab) => {
          const Icon = icons[tab.key];
          const selected = current === tab.key;
          const to = user && tab.memberTo ? tab.memberTo : tab.to;
          return (
            <li key={tab.key} className="min-w-0">
              <Link to={to} aria-current={selected ? "page" : undefined}
                className={`relative flex h-full flex-col items-center justify-center gap-1 text-[0.6875rem] font-semibold tracking-[0.01em] transition-colors ${selected ? "text-ink" : "text-stone hover:text-ink"}`}>
                <span className="nav-mark absolute inset-x-[30%] top-0 h-[2px] rounded-full bg-signal" aria-hidden="true" />
                <Icon filled={selected} className={selected ? "text-ember" : ""} />
                <span className="max-w-full truncate px-1">{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
