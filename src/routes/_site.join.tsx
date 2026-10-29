import { createFileRoute } from "@tanstack/react-router";
import Join from "@/pages/Join";

export const Route = createFileRoute("/_site/join")({
  head: () => ({
    meta: [
      { title: 'Join the Society | ASEB Society' },
      { name: "description", content: 'Apply to join ASEB Society and take your place in the field.' },
      { property: "og:title", content: 'Join the Society | ASEB Society' },
      { property: "og:description", content: 'Apply to join ASEB Society and take your place in the field.' },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Join,
});
