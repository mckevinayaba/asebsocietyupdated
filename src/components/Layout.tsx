import { Outlet, useLocation } from "@/lib/router";
import { AppBar } from "./shell/AppBar";
import { BottomNav } from "./shell/BottomNav";
import { ContextTabs } from "./shell/ContextTabs";
import { Footer } from "./Footer";
import { ScrollToTop, useReveal } from "./Reveal";
import { useMobileChrome } from "@/hooks/use-mobile-chrome";

// The public application frame: application bar, contextual tabs, content, footer and the
// persistent mobile bottom navigation. The home opening is immersive and runs under the bar.
export function Layout({ children }: { children?: import("react").ReactNode }) {
  useReveal();
  const { pathname } = useLocation();
  const chromeHidden = useMobileChrome(pathname);
  const immersive = pathname === "/";
  return (
    <div className="app-main flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-ink focus:px-4 focus:py-2 focus:text-ivory">Skip to content</a>
      <ScrollToTop />
      <AppBar immersive={immersive} tucked={chromeHidden} />
      {!immersive && <div aria-hidden="true" className="h-[calc(var(--app-bar-h)+var(--safe-top))] shrink-0" />}
      <ContextTabs tucked={chromeHidden} />
      <main id="main" className="flex-1">
        {children ?? <Outlet />}
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
