import { circleGroups } from "@/lib/programme-intake";
import { useState, type ReactNode } from "react";
import { Link, useSearchParams } from "@/lib/router";
import { BottomNav } from "@/components/shell/BottomNav";
import { useQuery } from "@tanstack/react-query";
import { getMyAccess } from "@/lib/secretariat.functions";
import { useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMemberData, updateCircleMembership } from "@/lib/member.functions";
import { useMember } from "@/hooks/use-member";
import { MemberProfile } from "@/components/MemberProfile";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { asset } from "@/lib/asset";
import { constituencies, rolesFor, roleBySlug } from "@/content/field";
import { conditions, domains, ladder } from "@/content/framework";
import { pillars } from "@/content/pillars";
import { summit2026, speakers } from "@/content/summit";
import { registry, regions } from "@/content/registry";

// Member app. Mobile first: the global bottom navigation stays in place after sign in, and the
// member sections become contextual tabs at the top. On desktop the same sections form a left rail.
// All content here is structural preview content. No members, posts or quotes are invented.

type Tab = "home" | "circles" | "academy" | "fieldlab" | "summit";
const tabs: { id: Tab; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "circles", label: "Circles" },
  { id: "academy", label: "Academy" },
  { id: "fieldlab", label: "Field Lab" },
  { id: "summit", label: "Summit" },
];

const storyPhotos = [
  "images/events/aseb-awards-stage-1.jpg",
  "images/events/aseb-awards-stage-3.jpg",
  "images/events/aseb-awards-stage-2.jpg",
  "images/events/aseb-summit-panel.jpg",
];

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`border border-hairline bg-paper p-5 ${className}`}>{children}</div>;
}

function Label({ children }: { children: ReactNode }) {
  return <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-stone">{children}</p>;
}

function HomeTab({ name, role, country, edit, applications }: { name: string; role: string; country: string; edit: () => void; applications: { id: string; name: string; status: string; created_at: string }[] }) {
  const countryCount = new Set(registry.map((r) => r.country).filter(Boolean)).size;
  return (
    <div className="space-y-8">
      <div>
        <Label>Good day{name ? `, ${name.split(" ")[0]}` : ""}</Label>
        <h1 className="mt-2 font-display text-[2rem] leading-tight">Your practice, through the year.</h1>
      </div>
      <section className="border-y border-hairline py-5"><Label>Your membership application</Label>{applications.length ? <ul className="mt-3 space-y-4">{applications.map(application => <li key={application.id}><p className="font-semibold">{application.name} · {application.status === "pending" ? "Pending Secretariat review" : application.status}</p><p className="mt-1 text-sm text-stone">Submitted {new Date(application.created_at).toLocaleDateString("en-GB", { timeZone: "UTC" })}</p></li>)}</ul> : <p className="mt-3 text-sm text-stone">No application is linked to your verified email. <Link to="/join" className="underline">Apply to join</Link> using your account email.</p>}</section>
      {/* Story row: one vertical card per part of the field */}
      <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 lg:mx-0 lg:px-0">
        {constituencies.map((c, i) => (
          <Link key={c.slug} to={`/field/${c.slug}`} className="relative block aspect-[9/14] w-[38%] shrink-0 overflow-hidden bg-ink sm:w-[30%] lg:w-[23%]">
            <img src={asset(storyPhotos[i] ?? "")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" loading="lazy" />
            <span className="absolute left-0 top-0 h-[3px] w-full bg-signal/90" aria-hidden="true" />
            <span className="absolute inset-x-0 bottom-0 bg-ink/80 p-3 text-ivory">
              <span className="block text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-sand">{rolesFor(c.slug).length} roles</span>
              <span className="mt-1 block font-display text-[1.0625rem] leading-tight">{c.name}</span>
            </span>
          </Link>
        ))}
      </div>
      <Card>
        <div className="flex items-baseline justify-between">
          <Label>Your record</Label>
          <span className="text-[0.75rem] font-semibold text-ember">Account profile</span>
        </div>
        <p className="mt-4 text-[0.9375rem] leading-relaxed">{roleBySlug(role)?.role || "Primary role not selected"}{country ? ` · ${country}` : ""}</p>
        <Button onClick={edit} className="btn btn-primary h-auto mt-5 min-h-[44px] w-full sm:w-auto">Edit profile <span className="arr" aria-hidden="true">→</span></Button>
        <Link to="/registry/submit" className="tlink mt-5 block w-fit">Submit evidence of practice →</Link>
      </Card>
      <div>
        <Label>From the Society</Label>
        <ul className="mt-3 border-t border-ink">
          {[
            { k: "Evidence Library", t: "ASEB 2026 research sessions are being added", d: "Prof Erik Stam, Dr Phumlani Nkontwana and i4Policy on the Africa Entrepreneurial Ecosystem Index.", to: "/evidence" },
            { k: "Field Registry", t: `${registry.length} public-source records across ${countryCount} countries`, d: "Practitioners and institutions drawn from the ASEB archive. Find your record.", to: "/registry" },
            { k: "Academy", t: "Your professional learning priorities", d: "Explore the framework and register interest in practitioner development opportunities.", to: "/learning" },
          ].map((x) => (
            <li key={x.t}>
              <Link to={x.to} className="block border-b border-hairline py-5">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-umber">{x.k}</p>
                <p className="mt-1.5 font-display text-[1.25rem] leading-snug">{x.t}</p>
                <p className="mt-1.5 text-[0.875rem] leading-relaxed text-stone">{x.d}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function CirclesTab({ joined, toggle }: { joined: string[]; toggle: (key: string, join: boolean) => Promise<void> }) {
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const groups = circleGroups.map(group => ({ k: group.title, items: group.items }));
  return (
    <div className="space-y-8">
      <div>
        <Label>ASEB Circles · Peer communities</Label>
        <h1 className="mt-2 font-display text-[2rem] leading-tight">Peer practice across borders.</h1>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-stone">{joined.length} Circle selections saved. Invitations to facilitated sessions follow confirmed programme schedules.</p>
      </div>
      {error && <p role="alert" className="text-sm text-ember">{error}</p>}
      {groups.map((g) => (
        <div key={g.k}>
          <Label>{g.k}</Label>
          <ul className="mt-3 border-t border-ink">
            {g.items.map((it) => (
              <li key={it.key} className="flex min-h-[56px] items-center justify-between gap-4 border-b border-hairline py-3">
                <span className="text-[1rem]">{it.name}</span>
                <Button variant="outline" className="min-h-[36px] shrink-0 border border-ink px-3 text-[0.8125rem] font-semibold" disabled={!!busy} aria-label={`${joined.includes(it.key) ? "Remove preference for" : "Save preference for"} ${it.name}`} onClick={async () => { setBusy(it.key); setError(""); try { await toggle(it.key, !joined.includes(it.key)); } catch { setError("Your Circle selection could not be saved. Please try again."); } finally { setBusy(""); } }}>{busy === it.key ? "Saving…" : joined.includes(it.key) ? "Remove" : "Select"}</Button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function AcademyTab() {
  const modules = ["What ecosystem building is", "The seven conditions", "The roles of the field", "Evidence and measurement", "Ethics and the Code of Practice", "Your record of practice"];
  return (
    <div className="space-y-8">
      <div>
        <Label>ASEB Academy</Label>
        <h1 className="mt-2 font-display text-[2rem] leading-tight">ASEB Foundations</h1>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-stone">Explore the learning themes behind professional ecosystem-building practice. Register your priorities for upcoming opportunities; confirmed course and qualification details will be shared separately.</p>
      </div>
      <Card>
        <div className="flex items-baseline justify-between"><Label>Course outline</Label><span className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-stone">Draft</span></div>
        <ol className="mt-3">
          {modules.map((m) => (
            <li key={m} className="grid grid-cols-[2rem_1fr_auto] items-baseline gap-2 border-b border-hairline py-4 last:border-b-0">
              <span aria-hidden="true" className="block h-px w-4 -translate-y-[0.3em] bg-signal" />
              <span className="text-[1rem]">{m}</span>
              <span className="text-[0.75rem] text-stone">Learning theme</span>
            </li>
          ))}
        </ol>
      </Card>
      <Button asChild className="btn btn-primary h-auto"><Link to="/learning#participate">Register learning interest →</Link></Button>
      <div>
        <Label>Practice domains</Label>
        <ul className="mt-3 space-y-3">
          {domains.map((d) => (
            <li key={d} className="grid grid-cols-[1fr_4rem] items-center gap-4 text-[0.875rem]">
              <span>{d}</span>
              <span className="h-[4px] bg-linen" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function FieldLabTab() {
  const lab = pillars.find((p) => p.slug === "field-lab");
  if (!lab) return null;
  return (
    <div className="space-y-8">
      <div>
        <Label>ASEB Field Lab</Label>
        <h1 className="mt-2 font-display text-[2rem] leading-tight">Work on the problems no single institution can solve.</h1>
      </div>
      <ul className="border-t border-ink">
        {lab.programmes.map((p) => (
          <li key={p.name} className="border-b border-hairline py-5">
            <div className="flex items-baseline justify-between gap-4">
              <p className="font-display text-[1.25rem] leading-snug">{p.name}</p>

            </div>
            <p className="mt-1.5 text-[0.875rem] leading-relaxed text-stone">{p.detail}</p>
          </li>
        ))}
      </ul>
      <Card>
        <Label>Research collaboration</Label>
        <p className="mt-3 text-[0.9375rem] leading-relaxed">Bring an ecosystem bottleneck, policy question or applied research priority for Secretariat review.</p>
        <Button asChild className="btn btn-primary h-auto mt-5 whitespace-normal"><Link to="/field-lab#participate">Submit a research enquiry →</Link></Button>
      </Card>
    </div>
  );
}

function SummitTab() {
  return (
    <div className="space-y-8">
      <div className="on-dark -mx-5 bg-ink px-5 py-8 text-ivory lg:mx-0 lg:px-8">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-sand">{summit2026.edition} · {summit2026.dates}</p>
        <h1 className="mt-3 font-display text-[2rem] leading-tight">{summit2026.theme}</h1>
        <p className="mt-2 text-[0.9375rem] text-stone-light">{summit2026.city}</p>
      </div>
      <ul className="border-t border-ink">
        {summit2026.days.map((d) => (
          <li key={d.label} className="border-b border-hairline py-5">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-umber">{d.chapter} · {d.date}</p>
            <p className="mt-1.5 font-display text-[1.25rem]">{d.title}</p>
            <p className="mt-1 text-[0.8125rem] text-stone">Session recordings being added</p>
          </li>
        ))}
      </ul>
      <div>
        <Label>Voices of ASEB 2026</Label>
        <div className="no-scrollbar -mx-5 mt-3 flex gap-3 overflow-x-auto px-5 lg:mx-0 lg:px-0">
          {speakers.slice(0, 6).map((s) => (
            <div key={s.slug} className="w-[34%] shrink-0 sm:w-[24%] lg:w-[18%]">
              <div className="photo aspect-[4/5]"><img src={asset(`images/people/${s.slug}.jpg`)} alt={s.name} loading="lazy" /></div>
              <p className="mt-2 text-[0.8125rem] font-semibold leading-tight">{s.name}</p>
            </div>
          ))}
        </div>
      </div>
      <Link to="/registry" className="btn btn-line w-full">The Honour Roll in the Registry <span className="arr" aria-hidden="true">→</span></Link>
    </div>
  );
}

export default function AppShell() {
  const { user } = useMember();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const fetchMember = useServerFn(getMemberData);
  const changeCircle = useServerFn(updateCircleMembership);
  const { data } = useSuspenseQuery({ queryKey: ["member-data", user?.id], queryFn: () => fetchMember() });
  const [editing, setEditing] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [searchParams] = useSearchParams();
  const requested = searchParams.get("tab");
  const [tab, setTab] = useState<Tab>(tabs.some((t) => t.id === requested) ? (requested as Tab) : "home");
  const fetchAccess = useServerFn(getMyAccess);
  const access = useQuery({ queryKey: ["my-access", user?.id], queryFn: () => fetchAccess(), staleTime: 60_000 });
  const profile = data.profile;
  const body = editing ? <MemberProfile profile={profile} close={() => setEditing(false)} /> : { home: <HomeTab applications={data.applications} name={profile?.name || ""} role={profile?.primary_role || ""} country={profile?.country || ""} edit={() => setEditing(true)} />, circles: <CirclesTab joined={data.circles} toggle={async (key, join) => { await changeCircle({ data: { key, join } }); await queryClient.invalidateQueries({ queryKey: ["member-data"] }); }} />, academy: <AcademyTab />, fieldlab: <FieldLabTab />, summit: <SummitTab /> }[tab];

  return (
    <div className="min-h-screen bg-ivory">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-hairline bg-ivory/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-[1240px] items-center justify-between px-5 lg:h-16 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5" aria-label="ASEB Society website">
            <img src={asset("images/brand/aseb-society-mark-on-light.png")} alt="" className="h-8 w-auto" />
            <span className="font-display text-[1.125rem]">ASEB Society</span>
          </Link>
          <div className="flex items-center gap-3 text-[0.875rem] font-semibold sm:gap-5">
            {access.data?.secretariat && <Link to="/secretariat" className="hidden min-h-[44px] items-center text-ember hover:text-ink sm:inline-flex">Secretariat</Link>}
            <Button variant="ghost" className="min-h-[44px]" disabled={signingOut} onClick={async () => { setSigningOut(true); await queryClient.cancelQueries(); queryClient.clear(); await supabase.auth.signOut(); await navigate({ to: "/auth", replace: true }); }}>Sign out</Button>
            <Button onClick={() => setEditing(true)} className="h-9 w-9 bg-ink font-display text-[0.9375rem] text-ivory" aria-label="Your profile">{profile?.name?.slice(0, 1) || "M"}</Button>
          </div>
        </div>
        <div className="border-t border-hairline bg-sand/40 px-5 py-2 text-center text-[0.75rem] text-ink/80">
          {profile?.country && profile?.primary_role ? "Your ASEB account · Society membership is reviewed separately." : "Complete your profile to add your country and primary role."}
        </div>
        <nav aria-label="Member sections" className="no-scrollbar flex h-11 gap-6 overflow-x-auto border-t border-hairline px-5 lg:hidden">
          {tabs.map((t) => (
            <button key={t.id} type="button" onClick={() => { setEditing(false); setTab(t.id); window.scrollTo({ top: 0 }); }} aria-current={tab === t.id ? "page" : undefined}
              className={`relative shrink-0 whitespace-nowrap text-[0.875rem] ${tab === t.id ? "font-semibold text-ink after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-signal" : "text-ink/60"}`}>
              {t.label}
            </button>
          ))}
          {access.data?.secretariat && <Link to="/secretariat" className="flex shrink-0 items-center whitespace-nowrap text-[0.875rem] font-semibold text-ember">Secretariat</Link>}
        </nav>
      </header>

      <div className="mx-auto grid max-w-[1240px] lg:grid-cols-[220px_1fr_300px] lg:gap-10 lg:px-8">
        {/* Desktop rail */}
        <nav aria-label="App" className="sticky top-[100px] hidden h-fit pt-10 lg:block">
          <ul className="border-t border-ink">
            {tabs.map((t) => (
              <li key={t.id}>
                <Button variant="ghost" onClick={() => { setEditing(false); setTab(t.id); }} className={`relative flex h-auto justify-start w-full items-center border-b border-hairline py-4 pl-4 text-left text-[1rem] ${tab === t.id ? "font-semibold" : "text-ink/70 hover:text-ink"}`}>
                  {tab === t.id && <span className="absolute left-0 top-3 bottom-3 w-[3px] bg-signal" aria-hidden="true" />}
                  {t.label}
                </Button>
              </li>
            ))}
          </ul>
          <Link to="/" className="mt-8 block text-[0.875rem] text-stone hover:text-ink">← Back to the website</Link>
        </nav>

        <main className="px-5 pb-32 pt-8 lg:px-0 lg:pb-20 lg:pt-10">{body}</main>

        {/* Desktop right rail */}
        <aside className="hidden pt-10 lg:block">
          <div className="sticky top-[110px] space-y-6">
            <Card>
              <Label>Recognition pathway</Label>
              <ol className="mt-3">
                {ladder.map((l) => (
                  <li key={l.step} className="flex items-center gap-3 py-2 text-[0.875rem] text-stone">
                    <span className="inline-block h-2 w-2 border border-stone/50" aria-hidden="true" />
                    {l.name}
                  </li>
                ))}
              </ol>
            </Card>
            <Card>
              <Label>Find others in your role</Label>
              <p className="mt-3 text-[0.875rem] leading-relaxed text-stone">Search {registry.length} public-source practitioners and institutions.</p>
              <Link to="/registry" className="tlink mt-4">Open the Registry <span className="arr" aria-hidden="true">→</span></Link>
            </Card>
          </div>
        </aside>
      </div>

      <BottomNav />
    </div>
  );
}
