import { createFileRoute } from "@tanstack/react-router";
import { RecordPage } from "@/pages/Registry";

export const Route = createFileRoute("/_site/registry/$slug")({
  head: () => ({
    meta: [
      { title: 'Registry record | ASEB Society' },
      { name: "description", content: 'A recognised record in the ASEB Field Registry.' },
      { property: "og:title", content: 'Registry record | ASEB Society' },
      { property: "og:description", content: 'A recognised record in the ASEB Field Registry.' },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RecordPage,
});
