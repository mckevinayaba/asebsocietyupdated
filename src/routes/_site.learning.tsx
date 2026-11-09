import { createFileRoute } from "@tanstack/react-router";
import ProgrammePage from "@/pages/ProgrammePage";
export const Route = createFileRoute("/_site/learning")({
  head: () => ({ meta: [{ title: "Learning and ASEB Academy | ASEB Society" }, { name: "description", content: "Use public ecosystem-building resources and explore planned ASEB Academy learning." }, { property: "og:title", content: "Learning and ASEB Academy | ASEB Society" }, { property: "og:description", content: "Knowledge you can use today, with transparent information about future Academy programmes." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => <ProgrammePage programme="academy" />,
});