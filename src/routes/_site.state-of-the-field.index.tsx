import { createFileRoute } from "@tanstack/react-router";
import { StateOfFieldPage } from "@/pages/village/StateOfField";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_site/state-of-the-field/")({
  head: () => seo({ title: "State of the Field", description: "Understanding the ecosystems we are building. Evidence and ecosystem intelligence.", path: "/state-of-the-field", image: "/og/state.png" }),
  component: StateOfFieldPage,
});
