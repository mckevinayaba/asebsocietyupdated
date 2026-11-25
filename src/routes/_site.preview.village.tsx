import { createFileRoute, notFound } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { seo } from "@/lib/seo";

// Development-only design preview of the community with demonstration content. In production
// builds the route answers "not found" and the demonstration module is removed by the bundler.
const Demo = import.meta.env.DEV ? lazy(() => import("@/dev/village-demo")) : null;

export const Route = createFileRoute("/_site/preview/village")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({ page: search["page"] === "voices" || search["page"] === "ask" ? search["page"] : "field" }),
  beforeLoad: () => { if (!import.meta.env.DEV) throw notFound(); },
  head: () => seo({ title: "Village preview", description: "Development preview.", path: "/preview/village", noindex: true }),
  component: Page,
});

function Page() {
  const { page } = Route.useSearch();
  return Demo ? <Suspense fallback={null}><Demo page={page as "field" | "voices" | "ask"} /></Suspense> : null;
}
