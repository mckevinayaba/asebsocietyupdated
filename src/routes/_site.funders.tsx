import { createFileRoute } from "@tanstack/react-router";
import Funders from "@/pages/institution/Funders";

export const Route = createFileRoute("/_site/funders")({
  head: () => ({
    meta: [
      { title: "Funders and DFIs | ASEB Society" },
      { name: "description", content: "Fund the builders and multiply the founders: a case for funders and DFIs." },
      { property: "og:title", content: "Funders and DFIs | ASEB Society" },
      { property: "og:description", content: "Fund the builders and multiply the founders: a case for funders and DFIs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Funders,
});
