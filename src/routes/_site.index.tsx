import { createFileRoute } from "@tanstack/react-router";
import Home from "@/pages/Home";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_site/")({
  head: () => seo({ title: "ASEB Society | Stronger ecosystems. Stronger African economies.", description: "ASEB Society strengthens the people, institutions and systems that make entrepreneurship possible across Africa.", path: "/" }),
  component: Home,
});
