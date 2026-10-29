import { PageHero } from "@/components/PageHero";
import { Btn } from "@/components/Arrow";

export default function NotFound() {
  return (
    <PageHero eyebrow="Page not found" title="This page is not part of the record." lede="The address may have changed. Start again from the home page or search the Field Registry.">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Btn to="/">Home</Btn>
        <Btn to="/registry" variant="line">The Field Registry</Btn>
      </div>
    </PageHero>
  );
}
