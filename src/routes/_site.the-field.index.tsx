import { createFileRoute } from "@tanstack/react-router";
import { FieldPage } from "@/pages/village/Field";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_site/the-field/")({
  validateSearch: (search: Record<string, unknown>) => ({ tab: typeof search["tab"] === "string" ? search["tab"] : undefined }),
  head: () => seo({ title: "The Field", description: "Africa's ecosystem building community. What is happening in your ecosystem?", path: "/the-field", image: "/og/field.png" }),
  component: FieldPage,
});
