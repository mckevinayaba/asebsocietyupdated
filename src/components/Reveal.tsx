import { useEffect } from "react";
import { useLocation } from "@/lib/router";

// Adds a quiet fade-up to elements with the "reveal" class as they enter the viewport.
export function useReveal() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const vh = window.innerHeight;
    // Only elements below the fold are armed, so nothing visible on load ever flashes.
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal:not(.in)")).filter((el) => el.getBoundingClientRect().top > vh * 0.9);
    els.forEach((el) => el.classList.add("armed"));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
}

export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
