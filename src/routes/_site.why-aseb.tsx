import { createFileRoute } from "@tanstack/react-router";
import WhyAseb from "@/pages/WhyAseb";

export const Route = createFileRoute("/_site/why-aseb")({
  head: () => ({
    meta: [
      { title: 'Why ASEB | ASEB Society' },
      { name: "description", content: "Why Africa's ecosystem builders need a professional home." },
      { property: "og:title", content: 'Why ASEB | ASEB Society' },
      { property: "og:description", content: "Why Africa's ecosystem builders need a professional home." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WhyAseb,
});
