import { createFileRoute } from "@tanstack/react-router";
import Collaborate from "@/pages/institution/Collaborate";

export const Route = createFileRoute("/_site/collaborate")({
  head: () => ({
    meta: [
      { title: "Programme collaborations | ASEB Society" },
      { name: "description", content: "Align your accelerator, fellowship, research or policy programme with the field." },
      { property: "og:title", content: "Programme collaborations | ASEB Society" },
      { property: "og:description", content: "Align your accelerator, fellowship, research or policy programme with the field." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Collaborate,
});
