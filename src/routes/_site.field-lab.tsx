import { createFileRoute } from "@tanstack/react-router";
import ProgrammePage from "@/pages/ProgrammePage";
export const Route = createFileRoute("/_site/field-lab")({
  head: () => ({ meta: [{ title: "ASEB Field Lab and Collaboration | ASEB Society" }, { name: "description", content: "Applied research, policy intelligence and collaborations strengthening African entrepreneurship ecosystems." }, { property: "og:title", content: "ASEB Field Lab and Collaboration | ASEB Society" }, { property: "og:description", content: "Connect practitioner priorities with research, policy and practical collaboration." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => <ProgrammePage programme="field-lab" />,
});