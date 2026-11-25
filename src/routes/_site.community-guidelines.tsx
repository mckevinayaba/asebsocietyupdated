import { createFileRoute } from "@tanstack/react-router";
import { GuidelinesPage } from "@/pages/village/People";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_site/community-guidelines")({
  head: () => seo({ title: "Community guidelines", description: "How the ASEB community works together.", path: "/community-guidelines" }),
  component: GuidelinesPage,
});
