import { createFileRoute } from "@tanstack/react-router";
import Editorial from "@/pages/Editorial";
import { seo } from "@/lib/seo";

// Access is enforced by can_moderate() and can_edit_content() in the database, not by this route.
export const Route = createFileRoute("/_authenticated/editorial")({
  head: () => seo({ title: "Editorial", description: "ASEB Society editorial workspace.", path: "/editorial", noindex: true }),
  component: Editorial,
});
