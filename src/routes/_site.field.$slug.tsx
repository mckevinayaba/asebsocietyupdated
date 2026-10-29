import { createFileRoute } from "@tanstack/react-router";
import { ConstituencyPage } from "@/pages/Field";

export const Route = createFileRoute("/_site/field/$slug")({
  head: () => ({
    meta: [
      { title: 'Constituency | ASEB Society' },
      { name: "description", content: 'A constituency of the ecosystem-building field.' },
      { property: "og:title", content: 'Constituency | ASEB Society' },
      { property: "og:description", content: 'A constituency of the ecosystem-building field.' },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConstituencyPage,
});
