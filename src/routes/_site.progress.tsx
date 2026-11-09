import { createFileRoute } from "@tanstack/react-router";
import Progress from "@/pages/Progress";
export const Route = createFileRoute("/_site/progress")({
  head: () => ({ meta: [{ title: "Our Progress and Institutional Journey | ASEB Society" }, { name: "description", content: "Follow ASEB Society’s institutional foundations, programme mandates and practical ways to contribute." }, { property: "og:title", content: "Our Progress and Institutional Journey | ASEB Society" }, { property: "og:description", content: "From continental recognition to a year-round professional home for ecosystem builders." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Progress,
});