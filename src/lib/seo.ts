// Route metadata: title, description, canonical URL and Open Graph tags in one place.
export const siteOrigin = "https://www.asebsociety.org";

export function seo({ title, description, path, noindex = false, image = "/images/events/aseb-community-gathering.jpg" }: { title: string; description: string; path: string; noindex?: boolean; image?: string }) {
  const fullTitle = title.includes("ASEB Society") ? title : `${title} | ASEB Society`;
  const url = `${siteOrigin}${path}`;
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: `${siteOrigin}${image}` },
      { name: "twitter:card", content: "summary_large_image" },
      ...(noindex ? [{ name: "robots", content: "noindex, nofollow" }] : []),
    ],
    links: noindex ? [] : [{ rel: "canonical", href: url }],
  };
}

// Metadata for a single community item. Unpublished or private items get a generic, noindex
// preview, so nothing unpublished can appear in a link preview or a search engine.
export function itemSeo(meta: { title: string; description: string; author: string; publishedAt: string | null } | null, options: { product: string; path: string; image: string; article?: boolean }) {
  if (!meta) return seo({ title: options.product, description: `${options.product} on ASEB Society.`, path: options.path, image: options.image, noindex: true });
  const base = seo({ title: `${meta.title} | ${options.product}`, description: meta.description, path: options.path, image: options.image });
  return {
    ...base,
    meta: [
      ...base.meta.map((m) => ("property" in m && m.property === "og:type" && options.article ? { property: "og:type", content: "article" } : m)),
      ...(meta.author ? [{ name: "author", content: meta.author }] : []),
      ...(meta.publishedAt && options.article ? [{ property: "article:published_time", content: meta.publishedAt }] : []),
    ],
  };
}
