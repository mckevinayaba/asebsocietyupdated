import { createFileRoute } from "@tanstack/react-router";
import Invest from "@/pages/Invest";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_site/invest")({
  head: () => seo({ title: "Invest in Our Mission", description: "Fund the foundations of African entrepreneurship: the people, institutions and systems that make entrepreneurship possible.", path: "/invest", image: "/images/events/aseb-2026-recognised-builders.jpg" }),
  component: Invest,
});
