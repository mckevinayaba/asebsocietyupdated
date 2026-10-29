import { createFileRoute } from "@tanstack/react-router";
import People from "@/pages/institution/People";

export const Route = createFileRoute("/_site/people")({
  head: () => ({
    meta: [
      { title: "People and leadership | ASEB Society" },
      { name: "description", content: "The founder, executive team and board of ASEB Society." },
      { property: "og:title", content: "People and leadership | ASEB Society" },
      { property: "og:description", content: "The founder, executive team and board of ASEB Society." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: People,
});
