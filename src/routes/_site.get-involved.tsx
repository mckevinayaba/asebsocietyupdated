import { createFileRoute } from "@tanstack/react-router";
import GetInvolved from "@/pages/GetInvolved";

export const Route = createFileRoute("/_site/get-involved")({
  head: () => ({
    meta: [
      { title: 'Get involved | ASEB Society' },
      { name: "description", content: 'Ways to take part in ASEB Society.' },
      { property: "og:title", content: 'Get involved | ASEB Society' },
      { property: "og:description", content: 'Ways to take part in ASEB Society.' },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GetInvolved,
});
