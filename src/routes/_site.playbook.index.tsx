import { createFileRoute } from "@tanstack/react-router";
import { PlaybookPage } from "@/pages/village/Playbook";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_site/playbook/")({
  head: () => seo({ title: "The African Ecosystem Building Playbook", description: "It Takes a Village. A book Africa writes together.", path: "/playbook", image: "/og/playbook.png" }),
  component: PlaybookPage,
});
