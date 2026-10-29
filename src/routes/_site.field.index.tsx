import { createFileRoute } from "@tanstack/react-router";
import { FieldIndex } from "@/pages/Field";

export const Route = createFileRoute("/_site/field/")({
  head: () => ({
    meta: [
      { title: 'The Field | ASEB Society' },
      { name: "description", content: 'The constituencies and roles that make up ecosystem building in Africa.' },
      { property: "og:title", content: 'The Field | ASEB Society' },
      { property: "og:description", content: 'The constituencies and roles that make up ecosystem building in Africa.' },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FieldIndex,
});
