import { Link } from "@/lib/router";
import { asset } from "@/lib/asset";

// The ASEB Society mark, set beside a typeset name. Use the on-dark artwork on ink backgrounds.
export function Logo({ tone = "light", compact = false }: { tone?: "light" | "dark"; compact?: boolean }) {
  const src = tone === "dark" ? "images/brand/aseb-society-mark-on-dark.png" : "images/brand/aseb-society-mark-on-light.png";
  return (
    <Link to="/" className="group inline-flex items-center gap-3" aria-label="ASEB Society, home">
      <img src={asset(src)} alt="" width={44} height={40} className="h-10 w-auto" />
      {!compact && (
        <span className={`hidden flex-col font-display text-[1.05rem] leading-[1.15] tracking-[-0.01em] sm:flex ${tone === "dark" ? "text-ivory" : "text-ink"}`}>
          <span>Africa Startup Ecosystem</span>
          <span>Builders Society</span>
        </span>
      )}
    </Link>
  );
}
