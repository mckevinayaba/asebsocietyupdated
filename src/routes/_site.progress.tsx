import { createFileRoute } from "@tanstack/react-router";
import Progress from "@/pages/Progress";
export const Route = createFileRoute("/_site/progress")({
  head: () => ({ meta: [{ title: "Our Progress and Programme Readiness | ASEB Society" }, { name: "description", content: "What ASEB Society has established, what is available today and what needs partners and delivery capacity." }, { property: "og:title", content: "Our Progress and Programme Readiness | ASEB Society" }, { property: "og:description", content: "An honest account of available services, launching communities and planned programmes." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Progress,
});