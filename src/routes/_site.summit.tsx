import { createFileRoute } from "@tanstack/react-router";
import Summit from "@/pages/Summit";

export const Route = createFileRoute("/_site/summit")({
  head: () => ({
    meta: [
      { title: 'Summit and Awards | ASEB Society' },
      { name: "description", content: 'The ASEB Africa Startup Ecosystem Builders Summit and Awards.' },
      { property: "og:title", content: 'Summit and Awards | ASEB Society' },
      { property: "og:description", content: 'The ASEB Africa Startup Ecosystem Builders Summit and Awards.' },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Summit,
});
