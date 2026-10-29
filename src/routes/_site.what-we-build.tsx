import { createFileRoute } from "@tanstack/react-router";
import WhatWeBuild from "@/pages/WhatWeBuild";

export const Route = createFileRoute("/_site/what-we-build")({
  head: () => ({
    meta: [
      { title: 'What we build | ASEB Society' },
      { name: "description", content: 'ASEB Circles, Academy, Field Lab, and the Summit and Awards.' },
      { property: "og:title", content: 'What we build | ASEB Society' },
      { property: "og:description", content: 'ASEB Circles, Academy, Field Lab, and the Summit and Awards.' },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WhatWeBuild,
});
