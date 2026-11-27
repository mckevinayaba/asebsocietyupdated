import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Link, useSearchParams } from "@/lib/router";
import { getMyWork } from "@/lib/community.functions";
import { useMember } from "@/hooks/use-member";
import { communityKinds, contentKinds, kindLabel, type ContentKind } from "@/lib/community";
import { products } from "@/content/products";
import { ContributionEditor } from "@/components/village/ContributionEditor";

const choices: { kind: ContentKind; label: string; line: string }[] = [
  { kind: "post", label: "Professional update", line: "What is happening in your ecosystem?" },
  { kind: "article", label: "Article", line: "A longer, considered piece for The Field." },
  { kind: "voice", label: "ASEB Voices story", line: "Every ecosystem has a story. We want yours." },
  { kind: "playbook_contribution", label: "Playbook contribution", line: "Help write the African Ecosystem Building Playbook." },
  { kind: "question", label: "Ask the Village", line: "No one has all the answers." },
  { kind: "research", label: "Evidence for State of the Field", line: "Research, surveys, observations and cases." },
  { kind: "opportunity", label: "Opportunity", line: "Funding, roles, calls and programmes, with their official source." },
];

// The full-screen contribution workspace: a distraction-free writing environment on desktop and
// a full-height editor on mobile.
export default function Contribute() {
  const [params] = useSearchParams();
  const requested = params.get("kind");
  const kind = (contentKinds as readonly string[]).includes(requested ?? "") && requested !== "answer" ? (requested as ContentKind) : null;
  const chapter = params.get("chapter") ?? undefined;
  const category = params.get("category") ?? undefined;
  const editId = params.get("edit");
  const { user } = useMember();
  const fetchWork = useServerFn(getMyWork);
  const work = useQuery({ queryKey: ["village", "my-work"], queryFn: () => fetchWork(), enabled: !!user && !!editId });
  const editing = work.data?.available ? work.data.items.find((i) => i.id === editId && (["draft", "submitted", "revision_requested", "checking", "restricted"].includes(i.status) || (i.status === "published" && communityKinds.includes(i.kind)))) : undefined;
  if (editId && editing) {
    return (
      <div className="wrap max-w-[52rem] pb-20 pt-8 lg:pt-12">
        <Link to="/you?tab=contributions" className="text-[0.875rem] text-stone hover:text-ink">← My contributions</Link>
        <h1 className="mt-6 text-display-sm">{editing.status === "published" ? "Edit your contribution" : "Continue editing"}</h1>
        {editing.status === "published" && <p className="mt-3 max-w-prose text-[0.9375rem] text-stone">Your changes are checked again before they appear. Until then, the contribution is not visible to others.</p>}
        {work.data?.available && work.data.messages.filter((m) => m.content_id === editing.id && m.message_to_author).slice(0, 1).map((m) => <p key={m.created_at} className="mt-4 border-l-2 border-signal pl-4 text-[0.9375rem]"><span className="font-semibold">Message from the editors: </span>{m.message_to_author}</p>)}
        <div className="mt-8"><ContributionEditor kind={editing.kind} initial={editing} {...(editing.parent_id ? { parentId: editing.parent_id } : {})} /></div>
      </div>
    );
  }
  return (
    <div className="wrap max-w-[52rem] pb-20 pt-8 lg:pt-12">
      {!kind ? (
        <>
          <p className="eyebrow">Contribute</p>
          <h1 className="mt-5 text-display-md">What would you like to share with the village?</h1>
          <ul className="mt-10 border-t border-ink">
            {choices.map((c) => <li key={c.kind}><Link to={`/contribute?kind=${c.kind}`} className="group flex items-baseline justify-between gap-6 border-b border-hairline py-5"><span><span className="block font-display text-[1.5rem] group-hover:text-ember">{c.label}</span><span className="mt-1 block text-[0.9375rem] text-stone">{c.line}</span></span><span aria-hidden="true" className="text-ember">→</span></Link></li>)}
          </ul>
        </>
      ) : (
        <>
          <Link to="/contribute" className="text-[0.875rem] text-stone hover:text-ink">← All ways to contribute</Link>
          <p className="eyebrow mt-8">{kind === "voice" ? products.voices.name : kind === "playbook_contribution" ? "The Playbook" : kind === "question" ? products.ask.name : kind === "research" ? products.state.name : products.field.name}</p>
          <h1 className="mt-4 text-display-sm">{choices.find((c) => c.kind === kind)?.label ?? kindLabel[kind]}</h1>
          <p className="mt-2 text-stone">{choices.find((c) => c.kind === kind)?.line}</p>
          <div className="mt-8"><ContributionEditor kind={kind} {...(chapter ? { chapterSlug: chapter } : {})} {...(category ? { category } : {})} /></div>
        </>
      )}
    </div>
  );
}
