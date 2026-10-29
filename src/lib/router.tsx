// Small compatibility layer so the ported pages keep their simple Link/NavLink API
// while running on TanStack Router.
import {
  Link as TLink,
  Outlet,
  useParams as useTParams,
  useRouterState,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

export { Outlet };

function split(to: string) {
  const [beforeHash, hash] = to.split("#");
  const [path, query] = beforeHash.split("?");
  const search = query ? Object.fromEntries(new URLSearchParams(query)) : undefined;
  return { path: path || "/", search, hash };
}

type LinkProps = { to: string; className?: string; children?: ReactNode; "aria-label"?: string; onClick?: () => void };

export function Link({ to, className, children, ...rest }: LinkProps) {
  const { path, search, hash } = split(to);
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <TLink to={path as any} search={search as any} hash={hash} className={className} {...rest}>
      {children}
    </TLink>
  );
}

export function NavLink({
  to,
  className,
  children,
  ...rest
}: Omit<LinkProps, "className"> & { className?: string | ((s: { isActive: boolean }) => string) }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const path = split(to).path;
  const isActive = path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(path + "/");
  const cls = typeof className === "function" ? className({ isActive }) : className;
  return (
    <Link to={to} className={cls} {...rest}>
      {children}
    </Link>
  );
}

export function useLocation() {
  const loc = useRouterState({ select: (s) => s.location });
  return { pathname: loc.pathname, hash: loc.hash ? `#${loc.hash}` : "", search: loc.searchStr };
}

export function useParams(): Record<string, string | undefined> {
  return useTParams({ strict: false }) as Record<string, string | undefined>;
}

export function useSearchParams(): [URLSearchParams] {
  const searchStr = useRouterState({ select: (s) => s.location.searchStr });
  return [new URLSearchParams(searchStr)];
}
