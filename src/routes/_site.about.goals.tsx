import { createFileRoute, redirect } from "@tanstack/react-router";

// The previous ASEB Society website published "Stewardship Goals" at /about/goals. Visitors and search
// results using that address are sent permanently to its home on this platform.
export const Route = createFileRoute("/_site/about/goals")({
  beforeLoad: () => { throw redirect({ href: "/governance", statusCode: 301 }); },
});
