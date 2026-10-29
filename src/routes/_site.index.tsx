import { createFileRoute } from "@tanstack/react-router";
import Home from "@/pages/Home";

export const Route = createFileRoute("/_site/")({
  head: () => ({
    meta: [
      { title: 'ASEB Society | The professional home for ecosystem building in Africa' },
      { name: "description", content: 'ASEB Society advances startup ecosystem building in Africa as a defined practice and a recognised profession.' },
      { property: "og:title", content: 'ASEB Society | The professional home for ecosystem building in Africa' },
      { property: "og:description", content: 'ASEB Society advances startup ecosystem building in Africa as a defined practice and a recognised profession.' },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});
