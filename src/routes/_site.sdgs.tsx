import { createFileRoute } from "@tanstack/react-router";
import Sdgs from "@/pages/institution/Sdgs";

export const Route = createFileRoute("/_site/sdgs")({
  head: () => ({
    meta: [
      { title: "The 17 SDGs | ASEB Society" },
      { name: "description", content: "How startup ecosystem building serves each of the Sustainable Development Goals." },
      { property: "og:title", content: "The 17 SDGs | ASEB Society" },
      { property: "og:description", content: "How startup ecosystem building serves each of the Sustainable Development Goals." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Sdgs,
});
