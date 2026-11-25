import { createFileRoute, notFound } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { seo } from "@/lib/seo";

// Development-only design preview of the Secretariat workspace with demonstration data.
// In production builds import.meta.env.DEV is false: the route answers "not found" and the
// demonstration module is removed by the bundler.
const Demo = import.meta.env.DEV ? lazy(() => import("@/dev/secretariat-demo")) : null;

export const Route = createFileRoute("/preview/secretariat")({
  ssr: false,
  beforeLoad: () => { if (!import.meta.env.DEV) throw notFound(); },
  head: () => seo({ title: "Secretariat preview", description: "Development preview.", path: "/preview/secretariat", noindex: true }),
  component: () => (Demo ? <Suspense fallback={null}><Demo /></Suspense> : null),
});
