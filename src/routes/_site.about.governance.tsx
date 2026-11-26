import { createFileRoute, redirect } from "@tanstack/react-router";

// The previous ASEB Society website published "Governance and Accountability" at /about/governance. Visitors and search
// results using that address are sent permanently to its home on this platform.
export const Route = createFileRoute("/_site/about/governance")({
  beforeLoad: () => { throw redirect({ href: "/governance", statusCode: 301 }); },
});
