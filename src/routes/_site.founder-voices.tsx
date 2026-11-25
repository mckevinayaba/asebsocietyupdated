import { createFileRoute, redirect } from "@tanstack/react-router";

// Founder Voices is a category of ASEB Voices, not a separate product. Old links keep working.
export const Route = createFileRoute("/_site/founder-voices")({
  beforeLoad: () => { throw redirect({ href: "/voices?category=founders", statusCode: 301 }); },
});
