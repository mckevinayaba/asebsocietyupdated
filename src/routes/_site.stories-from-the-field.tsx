import { createFileRoute, redirect } from "@tanstack/react-router";

// Stories from the Field is consolidated into ASEB Voices. Old links keep working.
export const Route = createFileRoute("/_site/stories-from-the-field")({
  beforeLoad: () => { throw redirect({ href: "/voices", statusCode: 301 }); },
});
