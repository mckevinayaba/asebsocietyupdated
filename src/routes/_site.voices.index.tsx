import { createFileRoute } from "@tanstack/react-router";
import { VoicesPage } from "@/pages/village/Voices";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_site/voices/")({
  validateSearch: (search: Record<string, unknown>) => ({ category: typeof search["category"] === "string" ? search["category"] : undefined }),
  head: () => seo({ title: "ASEB Voices", description: "Every ecosystem has a story. Every voice matters. The editorial home of African ecosystem building.", path: "/voices", image: "/og/voices.png" }),
  component: VoicesPage,
});
