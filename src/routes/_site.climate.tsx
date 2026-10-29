import { createFileRoute } from "@tanstack/react-router";
import Climate from "@/pages/institution/Climate";

export const Route = createFileRoute("/_site/climate")({
  head: () => ({
    meta: [
      { title: "Green and climate economy | ASEB Society" },
      { name: "description", content: "Why climate is a condition of every African ecosystem, not a vertical." },
      { property: "og:title", content: "Green and climate economy | ASEB Society" },
      { property: "og:description", content: "Why climate is a condition of every African ecosystem, not a vertical." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Climate,
});
