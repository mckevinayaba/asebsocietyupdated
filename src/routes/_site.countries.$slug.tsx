import { createFileRoute } from "@tanstack/react-router";
import { CountryProfilePage } from "@/pages/Countries";
import { profileBySlug } from "@/content/continent";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_site/countries/$slug")({
  head: ({ params }) => {
    const profile = profileBySlug(params.slug);
    return seo(profile
      ? { title: `${profile.name}`, description: `ASEB Society in ${profile.name}: representation, Field Registry records and ways to take part.`, path: `/countries/${profile.slug}` }
      : { title: "Country not found", description: "This country profile could not be found.", path: "/countries", noindex: true });
  },
  component: CountryProfilePage,
});
