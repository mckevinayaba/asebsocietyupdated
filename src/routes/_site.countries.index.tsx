import { createFileRoute } from "@tanstack/react-router";
import { CountriesIndex } from "@/pages/Countries";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_site/countries/")({
  head: () => seo({ title: "Countries", description: "ASEB Society's mandate across Africa's 54 nations: confirmed representation, Field Registry records and how to represent the Society.", path: "/countries" }),
  component: CountriesIndex,
});
