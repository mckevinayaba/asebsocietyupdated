import { Link } from "@/lib/router";
import { Btn } from "@/components/Arrow";
import { useMember } from "@/hooks/use-member";
import { useSaved } from "@/hooks/use-saved";

const states = [
  { k: "Visitor", v: "Explore everything public without an account." },
  { k: "Registered account", v: "Saves your profile and Circle preferences. It is not membership." },
  { k: "Applicant", v: "Your membership application is with the Secretariat for review." },
  { k: "Approved member", v: "Granted only by Secretariat decision under the Society's approval process." },
];

export default function You() {
  const { user, ready } = useMember();
  const { items, toggle, available } = useSaved();
  const name = user && typeof user.user_metadata["name"] === "string" ? String(user.user_metadata["name"]) : "";
  return (
    <>
      <header className="border-b border-hairline">
        <div className="wrap pb-10 pt-10 lg:pb-14 lg:pt-16">
          <p className="eyebrow">You</p>
          <h1 className="mt-5 text-display-lg">{user ? `Welcome back${name ? `, ${name.split(" ")[0]}` : ""}.` : "Your place in the field."}</h1>
          <p className="lede mt-5 max-w-prose">{user ? "Your account, profile, Circle selections and application status live in the member app." : "Sign in to keep a professional profile and Circle preferences, or apply for membership. Exploring needs no account."}</p>
          {ready && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {user ? (
                <><Btn to="/app">Open the member app</Btn><Btn to="/app?tab=circles" variant="line">My Circles</Btn></>
              ) : (
                <><Btn to="/auth">Sign in</Btn><Btn to="/auth?mode=signup" variant="line">Create an account</Btn><Btn to="/join" variant="line">Apply for membership</Btn></>
              )}
            </div>
          )}
        </div>
      </header>

      <section className="section-tight" aria-labelledby="saved-title">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 id="saved-title" className="font-display text-[1.75rem]">Saved</h2>
            <p className="mt-2 text-[0.875rem] text-stone">Saved on this device only. Saved items will sync to member accounts once that feature is connected.</p>
            {!available && <p className="mt-4 text-[0.9375rem] text-ember" role="status">This browser is blocking saved items, for example in a private window.</p>}
            {items.length ? (
              <ul className="mt-6 border-t border-ink">
                {items.map((item) => (
                  <li key={item.key} className="flex items-center justify-between gap-4 border-b border-hairline py-4">
                    <Link to={item.to} className="group min-w-0"><span className="block text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-teal">{item.kind}</span><span className="mt-1 block truncate font-semibold group-hover:text-ember">{item.title}</span></Link>
                    <button type="button" onClick={() => toggle(item)} className="shrink-0 text-[0.875rem] text-stone underline-offset-4 hover:text-ink hover:underline">Remove</button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-6 border border-dashed border-hairline p-8 text-center">
                <p className="font-display text-[1.375rem]">Nothing saved yet.</p>
                <p className="mt-2 text-[0.9375rem] text-stone">Save research, opportunities and stories as you explore.</p>
                <div className="mt-5"><Btn to="/discover" variant="line">Go to Discover</Btn></div>
              </div>
            )}
          </div>
          <aside className="lg:col-span-4 lg:col-start-9" aria-labelledby="journey-title">
            <h2 id="journey-title" className="font-display text-[1.5rem]">How membership works</h2>
            <ol className="mt-5 border-t border-ink">{states.map((s) => <li key={s.k} className="border-b border-hairline py-4"><p className="font-semibold">{s.k}</p><p className="mt-1 text-[0.9375rem] text-stone">{s.v}</p></li>)}</ol>
          </aside>
        </div>
      </section>
    </>
  );
}
