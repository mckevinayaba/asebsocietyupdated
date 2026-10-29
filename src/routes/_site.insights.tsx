import { createFileRoute } from "@tanstack/react-router";
import Insights from "@/pages/institution/Insights";

export const Route = createFileRoute("/_site/insights")({
  head: () => ({
    meta: [
      { title: "Insights | ASEB Society" },
      { name: "description", content: "Research, case studies, tools and stories from African ecosystem building." },
      { property: "og:title", content: "Insights | ASEB Society" },
      { property: "og:description", content: "Research, case studies, tools and stories from African ecosystem building." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Insights,
});
