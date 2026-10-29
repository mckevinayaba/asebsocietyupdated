import { createFileRoute } from "@tanstack/react-router";
import WorkWithUs from "@/pages/institution/WorkWithUs";

export const Route = createFileRoute("/_site/work-with-us")({
  head: () => ({
    meta: [
      { title: "Work with us | ASEB Society" },
      { name: "description", content: "Commission ecosystem diagnostics, capacity building, evaluation and convening." },
      { property: "og:title", content: "Work with us | ASEB Society" },
      { property: "og:description", content: "Commission ecosystem diagnostics, capacity building, evaluation and convening." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorkWithUs,
});
