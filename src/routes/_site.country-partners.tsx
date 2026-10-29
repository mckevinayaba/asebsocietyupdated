import { createFileRoute } from "@tanstack/react-router";
import CountryPartners from "@/pages/institution/CountryPartners";

export const Route = createFileRoute("/_site/country-partners")({
  head: () => ({
    meta: [
      { title: "Country Partners | ASEB Society" },
      { name: "description", content: "Institutions that carry the field of ecosystem building in their country." },
      { property: "og:title", content: "Country Partners | ASEB Society" },
      { property: "og:description", content: "Institutions that carry the field of ecosystem building in their country." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CountryPartners,
});
