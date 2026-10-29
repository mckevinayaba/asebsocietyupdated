import { createFileRoute } from "@tanstack/react-router";
import Partners from "@/pages/Partners";

export const Route = createFileRoute("/_site/partners")({
  head: () => ({
    meta: [
      { title: 'Partners | ASEB Society' },
      { name: "description", content: 'Partner with ASEB Society.' },
      { property: "og:title", content: 'Partners | ASEB Society' },
      { property: "og:description", content: 'Partner with ASEB Society.' },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Partners,
});
