import { Outlet } from "@/lib/router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ScrollToTop, useReveal } from "./Reveal";

export function Layout() {
  useReveal();
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-ivory">Skip to content</a>
      <ScrollToTop />
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
