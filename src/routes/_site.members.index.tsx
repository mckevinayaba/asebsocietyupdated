import { createFileRoute } from "@tanstack/react-router";
import { MembersDirectoryPage } from "@/pages/village/People";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_site/members/")({
  head: () => seo({ title: "Professional profiles", description: "Practitioners and institutions in ASEB Society's community who chose to make their profile public.", path: "/members" }),
  component: MembersDirectoryPage,
});
