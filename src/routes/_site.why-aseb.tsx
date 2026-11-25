import { createFileRoute } from "@tanstack/react-router";
import WhyAseb from "@/pages/WhyAseb";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_site/why-aseb")({
  head: () => seo({ title: "Why We Exist", description: "Why Africa needs stronger entrepreneurship support systems, and why ASEB Society strengthens the people who build them.", path: "/why-aseb" }),
  component: WhyAseb,
});
