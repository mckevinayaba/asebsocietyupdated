import { createFileRoute } from "@tanstack/react-router";
import Stories from "@/pages/Stories";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/stories")({
  validateSearch: (search: Record<string, unknown>) => ({ story: typeof search["story"] === "string" ? search["story"] : undefined }),
  head: () => seo({ title: "Field stories", description: "Five editions, four mandates and the next convening, in stories from the ASEB archive.", path: "/stories" }),
  component: Stories,
});
