import { createFileRoute } from "@tanstack/react-router";
import Discover from "@/pages/Discover";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_site/discover")({
  validateSearch: (search: Record<string, unknown>) => ({
    type: typeof search["type"] === "string" ? search["type"] : undefined,
    condition: typeof search["condition"] === "string" ? search["condition"] : undefined,
  }),
  head: () => seo({ title: "Discover", description: "Knowledge, learning, opportunities and events for Africa's ecosystem builders.", path: "/discover" }),
  component: Discover,
});
