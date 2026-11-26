import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

// The track remains a semantic list/grid. Buttons are an alternative to touch scrolling.
export function ScrollRail({ label, children }: { label: string; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ start: true, end: false, overflow: false });
  useEffect(() => {
    const track = root.current?.querySelector<HTMLElement>("[data-rail-track]");
    if (!track) return;
    const update = () => setPosition({ start: track.scrollLeft < 4, end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 4, overflow: track.scrollWidth > track.clientWidth + 4 });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(track);
    track.addEventListener("scroll", update, { passive: true });
    return () => { observer.disconnect(); track.removeEventListener("scroll", update); };
  }, []);
  const move = (direction: number) => {
    const track = root.current?.querySelector<HTMLElement>("[data-rail-track]");
    track?.scrollBy({ left: direction * track.clientWidth * .85, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  return <div ref={root} className="min-w-0">
    <div className={`rail-controls mt-7 flex justify-end gap-2 lg:hidden ${position.overflow ? "" : "invisible"}`}>
      <Button variant="outline" className="h-11 w-11 p-0" aria-label={`Previous ${label}`} title={`Previous ${label}`} disabled={position.start} onClick={() => move(-1)}><span aria-hidden="true">←</span></Button>
      <Button variant="outline" className="h-11 w-11 p-0" aria-label={`Next ${label}`} title={`Next ${label}`} disabled={position.end} onClick={() => move(1)}><span aria-hidden="true">→</span></Button>
    </div>
    {children}
  </div>;
}