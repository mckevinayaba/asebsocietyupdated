import { createFileRoute } from "@tanstack/react-router";
import ProgrammePage from "@/pages/ProgrammePage";
export const Route = createFileRoute("/_site/communities")({
  head: () => ({ meta: [{ title: "Communities and ASEB Circles | ASEB Society" }, { name: "description", content: "Discover ASEB Circles, peer-community plans and what members can do today." }, { property: "og:title", content: "Communities and ASEB Circles | ASEB Society" }, { property: "og:description", content: "Find your people, explore community readiness and save Circle preferences." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => <ProgrammePage programme="circles" />,
});