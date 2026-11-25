import { createFileRoute } from "@tanstack/react-router";
import { ResearchItemPage } from "@/pages/village/StateOfField";
import { getPublicMeta } from "@/lib/community.public";
import { itemSeo } from "@/lib/seo";

export const Route = createFileRoute("/_site/state-of-the-field/$slug")({
  loader: ({ params }) => getPublicMeta({ data: { slug: params.slug } }).catch(() => null),
  head: ({ params, loaderData }) => itemSeo(loaderData ?? null, { product: "State of the Field", path: `/state-of-the-field/${params.slug}`, image: "/og/state.png", article: true }),
  component: ResearchItemPage,
});
