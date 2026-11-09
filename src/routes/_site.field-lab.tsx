import { createFileRoute } from "@tanstack/react-router";
import ProgrammePage from "@/pages/ProgrammePage";
export const Route = createFileRoute("/_site/field-lab")({
  head: () => ({ meta: [{ title: "ASEB Field Lab and Collaboration | ASEB Society" }, { name: "description", content: "Explore proposed collaborative work on entrepreneurship ecosystem challenges and express partnership interest." }, { property: "og:title", content: "ASEB Field Lab and Collaboration | ASEB Society" }, { property: "og:description", content: "Solve shared ecosystem challenges through carefully scoped partnership proposals." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => <ProgrammePage programme="field-lab" />,
});