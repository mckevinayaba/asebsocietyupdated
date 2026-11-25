import { createFileRoute } from "@tanstack/react-router";
import You from "@/pages/You";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_site/you")({
  validateSearch: (search: Record<string, unknown>) => ({ tab: typeof search["tab"] === "string" ? search["tab"] : undefined }),
  head: () => seo({ title: "You", description: "Your account, saved items and membership pathway.", path: "/you", noindex: true }),
  component: You,
});
