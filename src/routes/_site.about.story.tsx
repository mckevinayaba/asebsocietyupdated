import { createFileRoute } from "@tanstack/react-router";
import Story from "@/pages/institution/Story";

export const Route = createFileRoute("/_site/about/story")({
  head: () => ({
    meta: [
      { title: "Our story | ASEB Society" },
      { name: "description", content: "From a summit to an institution: how ASEB Society grew from 2022 to 2026." },
      { property: "og:title", content: "Our story | ASEB Society" },
      { property: "og:description", content: "From a summit to an institution: how ASEB Society grew from 2022 to 2026." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Story,
});
