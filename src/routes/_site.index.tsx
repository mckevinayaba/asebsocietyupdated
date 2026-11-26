import { createFileRoute } from "@tanstack/react-router";
import Home from "@/pages/Home";
import { seo } from "@/lib/seo";
import { positioning } from "@/content/case";

export const Route = createFileRoute("/_site/")({
  head: () => {
    const title = `ASEB Society | ${positioning.headline}`;
    const description = "ASEB Society strengthens the people, institutions and systems that make entrepreneurship possible across Africa.";
    const metadata = seo({ title, description, path: "/" });
    const image = metadata.meta.find((entry) => "property" in entry && entry.property === "og:image");
    return {
      ...metadata,
      meta: [
        ...metadata.meta,
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        ...(image && "content" in image ? [{ name: "twitter:image", content: image.content }] : []),
      ],
    };
  },
  component: Home,
});
