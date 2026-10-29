import { createFileRoute } from "@tanstack/react-router";
import Evidence from "@/pages/Evidence";

export const Route = createFileRoute("/_site/evidence")({
  head: () => ({
    meta: [
      { title: 'Evidence | ASEB Society' },
      { name: "description", content: 'Research and evidence on ecosystem building in Africa.' },
      { property: "og:title", content: 'Evidence | ASEB Society' },
      { property: "og:description", content: 'Research and evidence on ecosystem building in Africa.' },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Evidence,
});
