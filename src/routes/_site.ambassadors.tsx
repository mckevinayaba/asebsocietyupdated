import { createFileRoute } from "@tanstack/react-router";
import Ambassadors from "@/pages/institution/Ambassadors";

export const Route = createFileRoute("/_site/ambassadors")({
  head: () => ({
    meta: [
      { title: "Ambassadors | ASEB Society" },
      { name: "description", content: "Practitioners who represent ASEB Society where they work." },
      { property: "og:title", content: "Ambassadors | ASEB Society" },
      { property: "og:description", content: "Practitioners who represent ASEB Society where they work." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Ambassadors,
});
