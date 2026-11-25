import { createFileRoute } from "@tanstack/react-router";
import Secretariat from "@/pages/Secretariat";
import { seo } from "@/lib/seo";

// Authentication is enforced by the _authenticated layout, the role check in the server
// functions and, decisively, by row level security in the database.
export const Route = createFileRoute("/_authenticated/secretariat")({
  head: () => seo({ title: "Secretariat", description: "ASEB Society Secretariat workspace.", path: "/secretariat", noindex: true }),
  component: Secretariat,
});
