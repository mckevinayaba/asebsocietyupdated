import { createFileRoute } from "@tanstack/react-router";
import Home from "@/pages/Home";

export const Route = createFileRoute("/_site/")({
  head: () => ({
    meta: [
      { title: 'ASEB Society | The professional home for ecosystem building in Africa' },
      { name: "description", content: 'You help entrepreneurs grow. ASEB Society is building a professional home to connect, learn and collaborate across Africa.' },
      { property: "og:title", content: 'ASEB Society | The professional home for ecosystem building in Africa' },
      { property: "og:description", content: 'You help entrepreneurs grow. ASEB Society is building a professional home to connect, learn and collaborate across Africa.' },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});
