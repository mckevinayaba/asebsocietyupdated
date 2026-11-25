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
