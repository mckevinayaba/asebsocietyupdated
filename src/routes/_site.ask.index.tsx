import { createFileRoute } from "@tanstack/react-router";
import { AskPage } from "@/pages/village/Ask";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_site/ask/")({
  validateSearch: (search: Record<string, unknown>) => ({ view: search["view"] === "unanswered" ? "unanswered" : undefined }),
  head: () => seo({ title: "Ask the Village", description: "No one has all the answers. Practical questions from ecosystem builders, answered from experience.", path: "/ask", image: "/og/ask.png" }),
  component: AskPage,
});
