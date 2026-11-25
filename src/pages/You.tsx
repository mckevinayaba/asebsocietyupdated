import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";
import { Link, useSearchParams } from "@/lib/router";
import { Btn } from "@/components/Arrow";
import { useMember } from "@/hooks/use-member";
import { useSaved } from "@/hooks/use-saved";
import { useEngagement } from "@/hooks/use-community";
import { supabase } from "@/integrations/supabase/client";
import { deleteDraft, getMyBookmarks, getMyWork, withdrawContribution } from "@/lib/community.functions";
import { kindLabel, permalink, statusLabel, excerpt } from "@/lib/community";
import { OnboardingPage } from "@/pages/village/People";
import { NotYetLive, timeAgo } from "@/components/village/Primitives";
import { villageLine } from "@/content/products";

const states = [
  { k: "Visitor", v: "Explore everything public without an account." },
  { k: "Registered account", v: "Saves your profile and contributions. It is not membership." },
  { k: "Applicant", v: "Your membership application is with the Secretariat for review." },
  { k: "Approved member", v: "Granted only by Secretariat decision under the Society's approval process." },
];
const tabs = ["profile", "contributions", "published", "saved", "following", "membership", "settings"] as const;
type Tab = (typeof tabs)[number] | "overview";

function Contributions({ publishedOnly = false }: { publishedOnly?: boolean }) {
  const fetchWork = useServerFn(getMyWork);
  const withdraw = useServerFn(withdrawContribution);
  const remove = useServerFn(deleteDraft);
  const queryClient = useQueryClient();
  const work = useQuery({ queryKey: ["village", "my-work"], queryFn: () => fetchWork() });
  if (work.isLoading) return <p className="py-8 text-stone">Loading…</p>;
  if (!work.data?.available) return <NotYetLive what="My contributions" />;
  const items = work.data.items.filter((i) => i.kind !== "answer" || !publishedOnly).filter((i) => !publishedOnly || i.status === "published");
  const latestMessage = (id: string) => work.data?.available ? work.data.messages.find((m) => m.content_id === id) : undefined;
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["village"] });
  if (!items.length) return <div className="border border-dashed border-hairline p-8 text-center"><p className="font-display text-[1.375rem]">{publishedOnly ? "Nothing published yet." : "You have not contributed yet."}</p><div className="mt-5"><Btn to="/contribute">Contribute</Btn></div></div>;
  return (
    <ul className="border-t border-ink">
      {items.map((item) => {
        const message = latestMessage(item.id);
        const editable = ["draft", "submitted", "revision_requested"].includes(item.status);
        return (
          <li key={item.id} className="border-b border-hairline py-5">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-teal">{kindLabel[item.kind]}</p>
              <p className="flex items-center gap-2 text-[0.8125rem]"><span className={`status-dot ${item.status === "published" ? "bg-teal" : item.status === "revision_requested" ? "bg-signal" : item.status === "declined" || item.status === "archived" ? "border border-stone/50" : "bg-umber"}`} aria-hidden="true" />{statusLabel[item.status]} · {timeAgo(item.updated_at)}</p>
            </div>
            <p className="mt-2 font-semibold">{item.status === "published" ? <Link to={permalink(item.kind, item.slug)} className="hover:text-ember">{item.title || excerpt(item.body, 90)}</Link> : item.title || excerpt(item.body, 90)}</p>
            {message?.message_to_author && <p className="mt-2 border-l-2 border-signal pl-3 text-[0.9375rem]"><span className="font-semibold">Editors: </span>{message.message_to_author}</p>}
            <div className="mt-3 flex flex-wrap gap-4 text-[0.875rem]">
              {editable && <Link to={`/contribute?edit=${item.id}`} className="font-semibold underline underline-offset-4">Continue editing</Link>}
              {item.status === "draft" && <button type="button" className="text-ember underline underline-offset-4" onClick={async () => { if (window.confirm("Delete this draft? This cannot be undone.")) { await remove({ data: { id: item.id } }); await refresh(); } }}>Delete draft</button>}
              {item.status !== "draft" && item.status !== "archived" && <button type="button" className="text-stone underline underline-offset-4" onClick={async () => { if (window.confirm("Withdraw this contribution? It will be taken down from the platform.")) { await withdraw({ data: { id: item.id } }); await refresh(); } }}>Withdraw</button>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function Saved() {
  const fetchMarks = useServerFn(getMyBookmarks);
  const marks = useQuery({ queryKey: ["village", "bookmarks"], queryFn: () => fetchMarks() });
  const device = useSaved();
  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-display text-[1.5rem]">Saved to your account</h2>
        {marks.isLoading ? <p className="mt-3 text-stone">Loading…</p> : !marks.data?.available ? <p className="mt-3 text-stone">Saving to your account opens with The Field.</p>
          : marks.data.items.length ? <ul className="mt-4 border-t border-ink">{marks.data.items.map((i) => <li key={i.id} className="border-b border-hairline py-4"><p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-teal">{kindLabel[i.kind]}</p><Link to={permalink(i.kind, i.slug)} className="mt-1 block font-semibold hover:text-ember">{i.title || excerpt(i.body, 90)}</Link></li>)}</ul>
          : <p className="mt-3 text-stone">Nothing saved yet. Use Save on any contribution.</p>}
      </section>
      <section>
        <h2 className="font-display text-[1.5rem]">Saved on this device</h2>
        {device.items.length ? <ul className="mt-4 border-t border-ink">{device.items.map((i) => <li key={i.key} className="flex items-center justify-between gap-4 border-b border-hairline py-4"><Link to={i.to} className="font-semibold hover:text-ember">{i.title}</Link><button type="button" onClick={() => device.toggle(i)} className="text-[0.875rem] text-stone underline">Remove</button></li>)}</ul> : <p className="mt-3 text-stone">Nothing saved on this device.</p>}
      </section>
    </div>
  );
}

function Following() {
  const engagement = useEngagement([]);
  const follows = engagement.follows;
  if (!follows.length) return <p className="text-stone">You are not following anyone or anything yet. Follow practitioners, questions and Playbook chapters from their pages.</p>;
  const label = (t: string) => ({ profile: "Person", country: "Country", topic: "Topic", question: "Question", chapter: "Playbook chapter" }[t] ?? t);
  const href = (t: string, k: string) => t === "profile" ? `/members/${k}` : t === "question" ? `/ask/${k}` : t === "chapter" ? `/playbook/${k}` : t === "country" ? `/countries` : "/the-field";
  return <ul className="border-t border-ink">{follows.map((f) => <li key={`${f.target_type}-${f.target_key}`} className="flex items-center justify-between gap-4 border-b border-hairline py-4"><span><span className="block text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-teal">{label(f.target_type)}</span><Link to={href(f.target_type, f.target_key)} className="font-semibold hover:text-ember">{f.target_type === "profile" ? "View profile" : f.target_key.replace(/-/g, " ")}</Link></span><button type="button" className="text-[0.875rem] text-stone underline" onClick={() => void engagement.toggleFollow(f.target_type as "profile", f.target_key, false)}>Unfollow</button></li>)}</ul>;
}

export default function You() {
  const { user, ready } = useMember();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const requested = params.get("tab");
  const tab: Tab = (tabs as readonly string[]).includes(requested ?? "") ? (requested as Tab) : "overview";
  const device = useSaved();
  const name = user && typeof user.user_metadata["name"] === "string" ? String(user.user_metadata["name"]) : "";

  if (ready && !user) {
    return (
      <>
        <header className="border-b border-hairline"><div className="wrap pb-10 pt-10 lg:pb-14 lg:pt-16"><p className="eyebrow">You</p><h1 className="mt-5 text-display-lg">Your place in the village.</h1><p className="lede mt-5 max-w-prose">Sign in to contribute, follow people and save your work. Exploring needs no account.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"><Btn to="/auth">Sign in</Btn><Btn to="/auth?mode=signup" variant="line">Create an account</Btn><Btn to="/join" variant="line">Apply for membership</Btn></div></div></header>
        <section className="section-tight"><div className="wrap grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7"><h2 className="font-display text-[1.75rem]">Saved on this device</h2>{device.items.length ? <ul className="mt-6 border-t border-ink">{device.items.map((i) => <li key={i.key} className="flex items-center justify-between gap-4 border-b border-hairline py-4"><Link to={i.to} className="font-semibold hover:text-ember">{i.title}</Link><button type="button" onClick={() => device.toggle(i)} className="text-[0.875rem] text-stone underline">Remove</button></li>)}</ul> : <p className="mt-3 text-stone">Nothing saved yet.</p>}</div>
          <aside className="lg:col-span-4 lg:col-start-9"><h2 className="font-display text-[1.5rem]">How membership works</h2><ol className="mt-5 border-t border-ink">{states.map((s) => <li key={s.k} className="border-b border-hairline py-4"><p className="font-semibold">{s.k}</p><p className="mt-1 text-[0.9375rem] text-stone">{s.v}</p></li>)}</ol></aside>
        </div></section>
      </>
    );
  }
  if (!ready) return null;

  return (
    <div className="wrap max-w-[60rem] pb-20 pt-8 lg:pt-12">
      {tab === "overview" && (
        <>
          <p className="eyebrow">You</p>
          <h1 className="mt-5 text-display-md">Welcome back{name ? `, ${name.split(" ")[0]}` : ""}.</h1>
          <p className="mt-3 italic text-stone">{villageLine}</p>
          <div className="mt-10 grid gap-px border border-hairline bg-hairline sm:grid-cols-2">
            {[["Profile", "How you appear in the village", "/you?tab=profile"], ["My contributions", "Drafts, submissions and published work", "/you?tab=contributions"], ["Saved", "Everything you saved", "/you?tab=saved"], ["Following", "People, questions and chapters", "/you?tab=following"], ["Membership", "Your application and Circles", "/you?tab=membership"], ["The Field", "What is happening in your ecosystem?", "/the-field"]].map(([k, v, to]) => <Link key={k} to={to ?? "/"} className="group bg-ivory p-6 hover:bg-paper"><span className="block font-display text-[1.5rem] group-hover:text-ember">{k}</span><span className="mt-1 block text-[0.9375rem] text-stone">{v}</span></Link>)}
          </div>
        </>
      )}
      {tab === "profile" && <><h1 className="text-display-sm">Profile</h1><p className="mt-2 text-stone">Your profile shows participation in the village. It is not membership, verification or accreditation.</p><div className="mt-8"><OnboardingPage embedded /></div></>}
      {tab === "contributions" && <><h1 className="text-display-sm">My contributions</h1><p className="mt-2 text-stone">Drafts are visible only to you. You can withdraw anything you have contributed.</p><div className="mt-8"><Contributions /></div></>}
      {tab === "published" && <><h1 className="text-display-sm">Published work</h1><div className="mt-8"><Contributions publishedOnly /></div></>}
      {tab === "saved" && <><h1 className="text-display-sm">Saved</h1><div className="mt-8"><Saved /></div></>}
      {tab === "following" && <><h1 className="text-display-sm">Following</h1><div className="mt-8"><Following /></div></>}
      {tab === "membership" && (
        <>
          <h1 className="text-display-sm">Membership</h1>
          <ol className="mt-8 border-t border-ink">{states.map((s) => <li key={s.k} className="border-b border-hairline py-4"><p className="font-semibold">{s.k}</p><p className="mt-1 text-[0.9375rem] text-stone">{s.v}</p></li>)}</ol>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Btn to="/app">Application status and Circles</Btn><Btn to="/join" variant="line">Apply for membership</Btn></div>
        </>
      )}
      {tab === "settings" && (
        <>
          <h1 className="text-display-sm">Settings</h1>
          <ul className="mt-8 border-t border-ink">
            <li className="border-b border-hairline py-5"><p className="font-semibold">Profile visibility and home page</p><p className="mt-1 text-[0.9375rem] text-stone">Set who can see your profile and where you start when you sign in.</p><Link to="/you?tab=profile" className="tlink mt-3 text-[0.875rem]">Edit profile <span className="arr" aria-hidden="true">→</span></Link></li>
            <li className="border-b border-hairline py-5"><p className="font-semibold">Community guidelines</p><Link to="/community-guidelines" className="tlink mt-3 text-[0.875rem]">Read the guidelines <span className="arr" aria-hidden="true">→</span></Link></li>
            <li className="border-b border-hairline py-5"><p className="font-semibold">Withdrawing your work</p><p className="mt-1 text-[0.9375rem] text-stone">You keep ownership of what you contribute and can withdraw it from My contributions at any time.</p></li>
            <li className="py-5"><button type="button" className="btn btn-line" onClick={async () => { await queryClient.cancelQueries(); queryClient.clear(); await supabase.auth.signOut(); await navigate({ to: "/auth", replace: true }); }}>Sign out</button></li>
          </ul>
        </>
      )}
    </div>
  );
}
