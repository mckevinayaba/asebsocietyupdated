import { createFileRoute } from "@tanstack/react-router";
import { FieldItemPage } from "@/pages/village/Field";
import { getPublicMeta } from "@/lib/community.public";
import { itemSeo } from "@/lib/seo";

export const Route = createFileRoute("/_site/the-field/$slug")({
  loader: ({ params }) => getPublicMeta({ data: { slug: params.slug } }).catch(() => null),
  head: ({ params, loaderData }) => itemSeo(loaderData ?? null, { product: "The Field", path: `/the-field/${params.slug}`, image: "/og/field.png" }),
  component: FieldItemPage,
});
