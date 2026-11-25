import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";
import { Link, useParams } from "@/lib/router";
import { followerCount, profileContent, publicProfiles } from "@/lib/community-data";
import { getMyProfile, saveVillageProfile } from "@/lib/community.functions";
import { communityGuidelinesSummary, participationPaths, tagline, villageLine } from "@/content/products";
import { africanCountries } from "@/content/countries";
import { useCommunity, useEngagement, EngagementProvider } from "@/hooks/use-community";
import { ContentCard } from "@/components/village/ContentCard";
import { NotYetLive } from "@/components/village/Primitives";
import { Workspace } from "@/components/village/Workspace";

export function MemberProfilePage() {
  const { id = "" } = useParams();
  const community = useCommunity();
  const profile = useQuery({ queryKey: ["village", "profile", id], queryFn: async () => (await publicProfiles({ ids: [id], limit: 1 }))[0] ?? null, enabled: community.available && /^[0-9a-f-]{36}$/.test(id) });
  const followers = useQuery({ queryKey: ["village", "followers", id], queryFn: () => followerCount(id), enabled: !!profile.data });
  const work = useQuery({ queryKey: ["village", "author-work", id], queryFn: () => profileContent(id), enabled: !!profile.data });
  const engagement = useEngagement([]);
  if (!community.ready || profile.isLoading) return <Workspace label="People"><p className="py-16 text-stone">Loading…</p></Workspace>;
  if (!community.available) return <Workspace label="People"><NotYetLive what="Professional profiles" /></Workspace>;
  const p = profile.data;
  if (!p) return <Workspace label="People"><div className="py-16"><h1 className="text-display-sm">This profile is not public.</h1><p className="mt-3 text-stone">People choose whether their profile is visible.</p></div></Workspace>;
  const following = engagement.following("profile", p.id);
  return (
    <Workspace label="People">
      <header className="border-b border-hairline pb-8">
        <span aria-hidden="true" className="grid h-20 w-20 place-items-center rounded-full bg-night font-display text-[2rem] text-ivory">{p.name.slice(0, 1)}</span>
        <h1 className="mt-5 font-display text-[2.25rem] leading-tight">{p.name}</h1>
        {p.headline && <p className="mt-2 text-[1.125rem]">{p.headline}</p>}
        <p className="mt-2 text-[0.9375rem] text-stone">{[p.organisation, p.country].filter(Boolean).join(" · ")}</p>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          {engagement.signedIn && <button type="button" className={`btn ${following ? "btn-line" : "btn-primary"} min-h-[44px]`} aria-pressed={following} onClick={() => void engagement.toggleFollow("profile", p.id, !following)}>{following ? "Following" : "Follow"}</button>}
          {typeof followers.data === "number" && followers.data > 0 && <span className="text-[0.875rem] text-stone">{followers.data} follower{followers.data === 1 ? "" : "s"}</span>}
        </div>
        <p className="mt-4 text-[0.8125rem] text-stone">A community profile. It shows participation, not Society membership or professional accreditation.</p>
      </header>
      <div className="grid gap-10 py-8 lg:grid-cols-[1fr_16rem]">
        <div>
          {p.bio && <p className="whitespace-pre-line text-[1.0625rem] leading-relaxed">{p.bio}</p>}
          <h2 className="mt-10 font-display text-[1.5rem]">Published contributions</h2>
          {work.data?.length ? <EngagementProvider ids={work.data.map((w) => w.id)}>{work.data.map((w) => <ContentCard key={w.id} item={w} />)}</EngagementProvider> : <p className="mt-3 text-stone">No published contributions yet.</p>}
        </div>
        <aside className="space-y-6 text-[0.9375rem]">
          {p.expertise.length > 0 && <div><p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-stone">Expertise</p><p className="mt-2 flex flex-wrap gap-2">{p.expertise.map((e) => <span key={e} className="tag">{e}</span>)}</p></div>}
          {p.countries_of_operation.length > 0 && <div><p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-stone">Works in</p><p className="mt-2">{p.countries_of_operation.join(", ")}</p></div>}
          {p.links.length > 0 && <div><p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-stone">Links</p><ul className="mt-2 space-y-1">{p.links.map((l) => <li key={l}><a href={l} target="_blank" rel="noreferrer nofollow" className="break-all underline underline-offset-4">{l.replace(/^https:\/\//, "")}</a></li>)}</ul></div>}
        </aside>
      </div>
    </Workspace>
  );
}

// Find Your Place in the Village: onboarding and profile settings in one form. Preferences shape
// discovery only. They never grant membership, verification or authority.
export function OnboardingPage({ embedded = false }: { embedded?: boolean }) {
  const fetchProfile = useServerFn(getMyProfile);
  const save = useServerFn(saveVillageProfile);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const profile = useQuery({ queryKey: ["village", "my-profile"], queryFn: () => fetchProfile() });
  const [form, setForm] = useState({ name: "", headline: "", country: "", organisation: "", bio: "", countriesOfOperation: "", expertise: "", participationPaths: [] as string[], links: "", visibility: "private" as "public" | "community" | "private", homePreference: "field" as "field" | "institution", acceptGuidelines: false });
  const [state, setState] = useState<"idle" | "busy" | "saved">("idle");
  const [error, setError] = useState("");
  useEffect(() => {
    const p = profile.data?.profile;
    if (!p) return;
    setForm((f) => ({ ...f, name: p.name ?? "", headline: p.headline ?? "", country: p.country ?? "", organisation: p.organisation ?? "", bio: p.bio ?? "", countriesOfOperation: (p.countries_of_operation ?? []).join(", "), expertise: (p.expertise ?? []).join(", "), participationPaths: p.participation_paths ?? [], links: (p.links ?? []).join("\n"), visibility: (p.visibility as "public" | "community" | "private") ?? "private", homePreference: (p.home_preference as "field" | "institution") ?? "field", acceptGuidelines: !!p.guidelines_accepted_at }));
  }, [profile.data]);
  if (profile.isLoading) return <p className="py-10 text-stone">Loading…</p>;
  if (!profile.data?.available) return <NotYetLive what="Village profiles" />;
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));
  const list = (s: string, sep = ",") => s.split(sep).map((x) => x.trim()).filter(Boolean);
  return (
    <form className="space-y-8" onSubmit={async (e) => {
      e.preventDefault(); setError(""); setState("busy");
      try {
        await save({ data: { ...form, countriesOfOperation: list(form.countriesOfOperation), expertise: list(form.expertise), participationPaths: form.participationPaths as never, links: list(form.links, "\n") } });
        await queryClient.invalidateQueries({ queryKey: ["village"] });
        setState("saved");
        if (!embedded) await navigate({ href: form.homePreference === "field" ? "/the-field" : "/" });
      } catch (err) { setError(err instanceof Error ? err.message : "Your profile could not be saved."); setState("idle"); }
    }}>
      {!embedded && <header><p className="eyebrow">{tagline}</p><h1 className="mt-5 text-display-md">Find your place in the village.</h1><p className="lede mt-4 max-w-prose">Tell us why you are here. Your choices shape what you discover. They do not grant membership or any formal status.</p></header>}
      <fieldset>
        <legend className="field-label">Why are you joining? Choose all that apply.</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {participationPaths.map((p) => {
            const on = form.participationPaths.includes(p.key);
            return <label key={p.key} className={`flex min-h-[56px] cursor-pointer items-center gap-3 border px-4 text-[0.9375rem] transition-colors ${on ? "border-ink bg-paper font-semibold" : "border-hairline hover:border-ink"}`}><input type="checkbox" className="sr-only" checked={on} onChange={() => set("participationPaths", on ? form.participationPaths.filter((x) => x !== p.key) : [...form.participationPaths, p.key])} /><span aria-hidden="true" className={`grid h-5 w-5 shrink-0 place-items-center border ${on ? "border-ink bg-ink text-ivory" : "border-stone"}`}>{on ? "✓" : ""}</span>{p.label}</label>;
          })}
        </div>
      </fieldset>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block"><span className="field-label">Name</span><input required className="field-input" maxLength={200} value={form.name} onChange={(e) => set("name", e.target.value)} /></label>
        <label className="block"><span className="field-label">Professional headline</span><input className="field-input" maxLength={160} value={form.headline} onChange={(e) => set("headline", e.target.value)} placeholder="Programme lead, rural enterprise hub" /></label>
        <label className="block"><span className="field-label">Organisation</span><input className="field-input" maxLength={200} value={form.organisation} onChange={(e) => set("organisation", e.target.value)} /></label>
        <label className="block"><span className="field-label">Country</span><select className="field-input" value={form.country} onChange={(e) => set("country", e.target.value)}><option value="">Choose</option>{africanCountries.map((c) => <option key={c}>{c}</option>)}<option>Diaspora, outside Africa</option></select></label>
        <label className="block"><span className="field-label">Countries you work in (comma separated)</span><input className="field-input" value={form.countriesOfOperation} onChange={(e) => set("countriesOfOperation", e.target.value)} /></label>
        <label className="block"><span className="field-label">Areas of expertise (comma separated)</span><input className="field-input" value={form.expertise} onChange={(e) => set("expertise", e.target.value)} /></label>
      </div>
      <label className="block"><span className="field-label">About you</span><textarea className="field-input min-h-[120px] py-3" maxLength={3000} value={form.bio} onChange={(e) => set("bio", e.target.value)} /></label>
      <label className="block"><span className="field-label">Professional links, one per line (https only)</span><textarea className="field-input min-h-[80px] py-3" value={form.links} onChange={(e) => set("links", e.target.value)} /></label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block"><span className="field-label">Who can see your profile</span><select className="field-input" value={form.visibility} onChange={(e) => set("visibility", e.target.value as typeof form.visibility)}><option value="private">Only me</option><option value="community">Signed-in community members</option><option value="public">Everyone</option></select><span className="mt-1.5 block text-[0.8125rem] text-stone">Your email and phone number are never shown.</span></label>
        <label className="block"><span className="field-label">When you sign in, start at</span><select className="field-input" value={form.homePreference} onChange={(e) => set("homePreference", e.target.value as typeof form.homePreference)}><option value="field">The Field</option><option value="institution">The ASEB Society home page</option></select></label>
      </div>
      <fieldset className="border border-hairline bg-paper p-5">
        <legend className="px-1 font-semibold">Community guidelines</legend>
        <ul className="mt-2 space-y-2 text-[0.9375rem] text-stone">{communityGuidelinesSummary.map((g) => <li key={g} className="flex gap-3"><span className="mt-[0.65em] h-px w-4 shrink-0 bg-ember" aria-hidden="true" />{g}</li>)}</ul>
        <label className="mt-4 flex gap-3 text-[0.9375rem]"><input type="checkbox" className="mt-1" checked={form.acceptGuidelines} onChange={(e) => set("acceptGuidelines", e.target.checked)} />I will follow the community guidelines.</label>
        <p className="mt-2 text-[0.8125rem] text-stone">These guidelines are a working summary pending formal approval by the Society. <Link to="/community-guidelines" className="underline underline-offset-4">Read more</Link></p>
      </fieldset>
      {error && <p className="text-ember" role="alert">{error}</p>}
      {state === "saved" && <p className="text-teal" role="status">Saved.</p>}
      <button type="submit" disabled={state === "busy"} className="btn btn-primary">{state === "busy" ? "Saving…" : embedded ? "Save profile" : "Enter the village"}</button>
      {!embedded && <p className="text-[0.875rem] italic text-stone">{villageLine}</p>}
    </form>
  );
}

export function GuidelinesPage() {
  return (
    <div className="wrap max-w-[48rem] pb-20 pt-12 lg:pt-16">
      <p className="eyebrow">The Field</p>
      <h1 className="mt-5 text-display-md">Community guidelines</h1>
      <p className="lede mt-5">A working summary while the Society finalises its formal community policy, contributor terms and privacy notice. Until then, every contribution is reviewed before it appears.</p>
      <ul className="mt-10 border-t border-ink">{communityGuidelinesSummary.map((g) => <li key={g} className="border-b border-hairline py-5 text-[1.0625rem]">{g}</li>)}</ul>
      <section className="mt-12 space-y-4 text-[1rem] leading-relaxed text-stone">
        <h2 className="font-display text-[1.5rem] text-ink">Your work stays yours</h2>
        <p>Contributors keep ownership of their original work. By submitting, you give ASEB Society permission to publish it as you chose, credited as you chose. You can withdraw your contribution at any time from My contributions, and it will be taken down from the platform.</p>
        <h2 className="pt-4 font-display text-[1.5rem] text-ink">Moderation</h2>
        <p>Moderators can hide content that breaks these guidelines and record why. Reports are confidential. Serious allegations about people or institutions are reviewed by an editor and are not published without care for fairness, privacy and evidence.</p>
      </section>
    </div>
  );
}
