import { createFileRoute } from "@tanstack/react-router";
import { QuestionPage } from "@/pages/village/Ask";
import { getPublicMeta } from "@/lib/community.public";
import { itemSeo } from "@/lib/seo";

export const Route = createFileRoute("/_site/ask/$slug")({
  loader: ({ params }) => getPublicMeta({ data: { slug: params.slug } }).catch(() => null),
  head: ({ params, loaderData }) => itemSeo(loaderData ?? null, { product: "Ask the Village", path: `/ask/${params.slug}`, image: "/og/ask.png" }),
  component: QuestionPage,
});
