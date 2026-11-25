import { createFileRoute } from "@tanstack/react-router";
import { OnboardingPage } from "@/pages/village/People";
import { SignInPrompt } from "@/components/village/Primitives";
import { useMember } from "@/hooks/use-member";
import { seo } from "@/lib/seo";

function Page() {
  const { user, ready } = useMember();
  return <div className="wrap max-w-[52rem] pb-20 pt-10 lg:pt-14">{!ready ? null : user ? <OnboardingPage /> : <div className="py-10"><h1 className="text-display-md">Find your place in the village.</h1><div className="mt-6"><SignInPrompt action="set up your profile" /></div></div>}</div>;
}

export const Route = createFileRoute("/_site/onboarding")({
  head: () => seo({ title: "Find your place in the village", description: "Tell us why you are joining.", path: "/onboarding", noindex: true }),
  component: Page,
});
