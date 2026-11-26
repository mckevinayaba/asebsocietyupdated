import { createFileRoute } from "@tanstack/react-router";
import Governance from "@/pages/institution/Governance";

export const Route = createFileRoute("/_site/governance")({
  head: () => ({
    meta: [
      { title: "Governance and goals | ASEB Society" },
      { name: "description", content: "One institution, one governing Board, four pillars and an Independent Awards Jury: how ASEB Society is governed, and the Stewardship Goals it serves." },
      { property: "og:title", content: "Governance and goals | ASEB Society" },
      { property: "og:description", content: "One institution, one governing Board, four pillars and an Independent Awards Jury: how ASEB Society is governed, and the Stewardship Goals it serves." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Governance,
});
