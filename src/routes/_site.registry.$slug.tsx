import { createFileRoute } from "@tanstack/react-router";
import { RecordPage } from "@/pages/Registry";
import { recordBySlug } from "@/content/registry";

export const Route = createFileRoute("/_site/registry/$slug")({
  head: ({ params }) => {
    const record = recordBySlug(params.slug);
    const title = record ? `${record.name} | ASEB Field Registry` : "Record unavailable | ASEB Society";
    const description = record?.bio || "This ASEB Field Registry record could not be found.";
    return ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    });
  },
  component: RecordPage,
});
