import { createFileRoute } from "@tanstack/react-router";
import { VoiceStoryPage } from "@/pages/village/Voices";
import { getPublicMeta } from "@/lib/community.public";
import { itemSeo } from "@/lib/seo";

export const Route = createFileRoute("/_site/voices/$slug")({
  loader: ({ params }) => getPublicMeta({ data: { slug: params.slug } }).catch(() => null),
  head: ({ params, loaderData }) => itemSeo(loaderData ?? null, { product: "ASEB Voices", path: `/voices/${params.slug}`, image: "/og/voices.png", article: true }),
  component: VoiceStoryPage,
});
