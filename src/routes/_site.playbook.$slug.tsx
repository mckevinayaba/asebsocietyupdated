import { createFileRoute } from "@tanstack/react-router";
import { PlaybookChapterPage } from "@/pages/village/Playbook";
import { playbookChapters } from "@/content/products";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_site/playbook/$slug")({
  head: ({ params }) => {
    const chapter = playbookChapters.find((c) => c.slug === params.slug);
    return seo(chapter
      ? { title: `${chapter.title} | The Playbook`, description: chapter.call, path: `/playbook/${chapter.slug}`, image: "/og/playbook.png" }
      : { title: "The Playbook", description: "The African Ecosystem Building Playbook.", path: "/playbook", image: "/og/playbook.png" });
  },
  component: PlaybookChapterPage,
});
