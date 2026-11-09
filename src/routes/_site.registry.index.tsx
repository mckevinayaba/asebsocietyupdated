import { createFileRoute } from "@tanstack/react-router";
import { RegistryIndex } from "@/pages/Registry";

export const Route = createFileRoute("/_site/registry/")({
  validateSearch: (search: Record<string, unknown>): { region?: string } =>
    typeof search.region === "string" ? { region: search.region } : {},
  head: () => ({
    meta: [
      { title: 'The Field Registry | ASEB Society' },
      { name: "description", content: 'A public record of recognised ecosystem builders and institutions in Africa.' },
      { property: "og:title", content: 'The Field Registry | ASEB Society' },
      { property: "og:description", content: 'A public record of recognised ecosystem builders and institutions in Africa.' },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RegistryIndex,
});
