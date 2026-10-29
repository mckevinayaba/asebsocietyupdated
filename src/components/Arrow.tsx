import { Link } from "@/lib/router";
import type { ReactNode } from "react";

// Text arrows only. No icon library is used anywhere on the site.
export const Arr = ({ dir = "right" }: { dir?: "right" | "out" | "down" | "left" }) => (
  <span className="arr" aria-hidden="true">{dir === "out" ? "↗" : dir === "down" ? "↓" : dir === "left" ? "←" : "→"}</span>
);

export function TLink({ to, children, className = "" }: { to: string; children: ReactNode; className?: string }) {
  const external = /^https?:/.test(to);
  if (external)
    return (
      <a href={to} target="_blank" rel="noreferrer" className={`tlink ${className}`}>
        {children} <Arr dir="out" />
      </a>
    );
  return (
    <Link to={to} className={`tlink ${className}`}>
      {children} <Arr />
    </Link>
  );
}

export function Btn({ to, children, variant = "primary", className = "" }: { to: string; children: ReactNode; variant?: "primary" | "accent" | "signal" | "line"; className?: string }) {
  const cls = `btn btn-${variant} ${className}`;
  if (/^https?:/.test(to))
    return (
      <a href={to} target="_blank" rel="noreferrer" className={cls}>
        {children} <Arr dir="out" />
      </a>
    );
  return (
    <Link to={to} className={cls}>
      {children} <Arr />
    </Link>
  );
}
