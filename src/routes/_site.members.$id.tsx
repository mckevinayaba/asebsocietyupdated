import { createFileRoute } from "@tanstack/react-router";
import { MemberProfilePage } from "@/pages/village/People";
import { seo } from "@/lib/seo";

// Profile pages are not indexed: people control visibility, and that choice can change.
export const Route = createFileRoute("/_site/members/$id")({
  head: ({ params }) => seo({ title: "Profile", description: "A professional profile in The Field.", path: `/members/${params.id}`, noindex: true }),
  component: MemberProfilePage,
});
