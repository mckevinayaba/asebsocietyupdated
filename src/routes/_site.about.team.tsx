import { createFileRoute, redirect } from "@tanstack/react-router";

// The previous ASEB Society website published "Our People" at /about/team. Visitors and search
// results using that address are sent permanently to its home on this platform.
export const Route = createFileRoute("/_site/about/team")({
  beforeLoad: () => { throw redirect({ href: "/people", statusCode: 301 }); },
});
