import { createFileRoute } from "@tanstack/react-router";
import ProgrammePage from "@/pages/ProgrammePage";
export const Route = createFileRoute("/_site/learning")({
  head: () => ({ meta: [{ title: "Learning and ASEB Academy | ASEB Society" }, { name: "description", content: "Professional learning, shared frameworks and practice standards for Africa’s entrepreneurship ecosystem builders." }, { property: "og:title", content: "Learning and ASEB Academy | ASEB Society" }, { property: "og:description", content: "Explore evidence and practitioner development through ASEB Academy." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => <ProgrammePage programme="academy" />,
});