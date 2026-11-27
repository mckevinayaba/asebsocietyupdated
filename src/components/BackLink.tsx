import { useCanGoBack, useRouter } from "@tanstack/react-router";
import { Link } from "@/lib/router";

// Returns visitors to exactly where they were inside the site (scroll position restored by the
// router). When the page was opened directly, it falls back to the parent section instead.
export function BackLink({ fallback, label, className = "" }: { fallback: string; label: string; className?: string }) {
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const cls = `inline-flex min-h-[44px] items-center gap-1.5 text-[0.875rem] font-medium text-stone hover:text-ink ${className}`;
  if (canGoBack) {
    return <button type="button" onClick={() => router.history.back()} className={cls}><span aria-hidden="true">←</span> {label}</button>;
  }
  return <Link to={fallback} className={cls}><span aria-hidden="true">←</span> {label}</Link>;
}
