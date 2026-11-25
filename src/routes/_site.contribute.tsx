import { createFileRoute } from "@tanstack/react-router";
import Contribute from "@/pages/village/Contribute";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_site/contribute")({
  validateSearch: (search: Record<string, unknown>) => ({
    kind: typeof search["kind"] === "string" ? search["kind"] : undefined,
    chapter: typeof search["chapter"] === "string" ? search["chapter"] : undefined,
    category: typeof search["category"] === "string" ? search["category"] : undefined,
  }),
  head: () => seo({ title: "Contribute", description: "Share with the village.", path: "/contribute", noindex: true }),
  component: Contribute,
});
