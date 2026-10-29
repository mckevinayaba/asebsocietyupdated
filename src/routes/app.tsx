import { createFileRoute } from "@tanstack/react-router";
import AppShell from "@/pages/AppShell";
import { ScrollToTop } from "@/components/Reveal";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: 'Member app | ASEB Society' },
      { name: "description", content: 'Your ASEB account, personal profile, Circle selections and resources.' },
      { property: "og:title", content: 'Member app | ASEB Society' },
      { property: "og:description", content: 'Your ASEB account, personal profile, Circle selections and resources.' },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return (<><ScrollToTop /><AppShell /></>);
}
