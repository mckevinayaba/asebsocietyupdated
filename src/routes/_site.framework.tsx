import { createFileRoute } from "@tanstack/react-router";
import Framework from "@/pages/Framework";

export const Route = createFileRoute("/_site/framework")({
  head: () => ({
    meta: [
      { title: 'The Framework | ASEB Society' },
      { name: "description", content: 'The ASEB Society Framework for the practice of ecosystem building.' },
      { property: "og:title", content: 'The Framework | ASEB Society' },
      { property: "og:description", content: 'The ASEB Society Framework for the practice of ecosystem building.' },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Framework,
});
