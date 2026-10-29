import { createFileRoute } from "@tanstack/react-router";
import { RolePage } from "@/pages/Field";

export const Route = createFileRoute("/_site/field/role/$slug")({
  head: () => ({
    meta: [
      { title: 'Role | ASEB Society' },
      { name: "description", content: 'A role in the ecosystem-building field.' },
      { property: "og:title", content: 'Role | ASEB Society' },
      { property: "og:description", content: 'A role in the ecosystem-building field.' },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RolePage,
});
