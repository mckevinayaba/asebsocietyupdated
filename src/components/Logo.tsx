import { Link } from "@/lib/router";
import { asset } from "@/lib/asset";

// The ASEB Society mark, set beside a typeset name. Use the on-dark artwork on ink backgrounds.
export function Logo({ tone = "light", compact = false }: { tone?: "light" | "dark"; compact?: boolean }) {
  const src = tone === "dark" ? "images/brand/aseb-society-mark-on-dark.png" : "images/brand/aseb-society-mark-on-light.png";
  return (
    <Link to="/" className="group inline-flex items-center gap-3" aria-label="ASEB Society, home">
      <img src={asset(src)} alt="" width={44} height={40} className="h-10 w-auto" />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className={`font-display text-[1.3rem] tracking-[-0.01em] ${tone === "dark" ? "text-ivory" : "text-ink"}`}>ASEB Society</span>
          <span className={`mt-1 hidden text-[0.625rem] font-semibold uppercase tracking-[0.16em] sm:block ${tone === "dark" ? "text-stone-light" : "text-stone"}`}>
            Africa Startup Ecosystem Builders
          </span>
        </span>
      )}
    </Link>
  );
}
