import { useState, type ReactNode } from "react";
import { Link } from "@/lib/router";
import { asset } from "@/lib/asset";
import { constituencies, rolesFor } from "@/content/field";
import { conditions, domains, ladder } from "@/content/framework";
import { pillars } from "@/content/pillars";
import { summit2026, speakers } from "@/content/summit";
import { registry, regions } from "@/content/registry";

// Member app preview. Mobile first: a bottom tab bar with text labels and a logo-orange
// indicator, no icon set. On desktop the same tabs become a left rail.
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

function Status({ s }: { s: string }) {
  return <span className={`text-[0.6875rem] font-semibold uppercase tracking-[0.12em] ${s === "Live" ? "text-ember" : s === "Launching" ? "text-ink" : "text-stone"}`}>{s}</span>;
}

function HomeTab() {
  const countryCount = new Set(registry.map((r) => r.country).filter(Boolean)).size;
  return (
    <div className="space-y-8">
      <div>
        <Label>Good day</Label>
        <h1 className="mt-2 font-display text-[2rem] leading-tight">Your practice, through the year.</h1>
      </div>
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
          <span className="text-[0.75rem] font-semibold text-ember">Member</span>
        </div>
        <div className="mt-4 grid grid-cols-5 gap-1" aria-label="Recognition pathway progress">
          {ladder.map((l, i) => <span key={l.step} className={`h-[3px] ${i === 0 ? "bg-signal" : "bg-linen"}`} />)}
        </div>
        <p className="mt-4 text-[0.9375rem] leading-relaxed">Next step: <span className="font-semibold">Verified</span>. Add one public source or a peer reference to your record.</p>
        <button className="btn btn-primary mt-5 min-h-[44px] w-full sm:w-auto">Add evidence of practice <span className="arr" aria-hidden="true">→</span></button>
      </Card>
      <div>
        <Label>From the Society</Label>
        <ul className="mt-3 border-t border-ink">
          {[
            { k: "Evidence Library", t: "ASEB 2026 research sessions are being added", d: "Prof Erik Stam, Dr Phumlani Nkontwana and i4Policy on the Africa Entrepreneurial Ecosystem Index.", to: "/evidence" },
            { k: "Field Registry", t: `${registry.length} verified records across ${countryCount} countries`, d: "Every finalist and Champion of the ASEB Awards, 2023 to 2026. Claim yours.", to: "/registry" },
            { k: "Academy", t: "ASEB Foundations is launching", d: "Free. Six modules. Leads to Associate Ecosystem Builder.", to: "/what-we-build#academy" },
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

function CirclesTab() {
  const groups = [
    { k: "Regional Circles", items: regions.map((r) => `${r} Africa`) },
    { k: "Language Circles", items: ["Cercle francophone", "Círculo lusófono", "Arabic-language Circle"] },
    { k: "Condition Circles", items: conditions.map((c) => c.name) },
  ];
  return (
    <div className="space-y-8">
      <div>
        <Label>ASEB Circles · Launching</Label>
        <h1 className="mt-2 font-display text-[2rem] leading-tight">Peer practice across borders.</h1>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-stone">Open Circles are available to every Member. Practice Circles and Country Circles follow.</p>
      </div>
      {groups.map((g) => (
        <div key={g.k}>
          <Label>{g.k}</Label>
          <ul className="mt-3 border-t border-ink">
            {g.items.map((it) => (
              <li key={it} className="flex min-h-[56px] items-center justify-between gap-4 border-b border-hairline py-3">
                <span className="text-[1rem]">{it}</span>
                <button className="min-h-[36px] border border-ink px-3 text-[0.8125rem] font-semibold hover:bg-ink hover:text-ivory">Join</button>
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
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-stone">Free. Six modules, audio and text. Completing it, signing the Code and starting a record of continuing practice earns Associate Ecosystem Builder.</p>
      </div>
      <Card>
        <div className="flex items-baseline justify-between"><Label>Course outline</Label><span className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-stone">Draft</span></div>
        <ol className="mt-3">
          {modules.map((m, i) => (
            <li key={m} className="grid grid-cols-[2rem_1fr_auto] items-baseline gap-2 border-b border-hairline py-4 last:border-b-0">
              <span className="numeral text-sm text-umber">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[1rem]">{m}</span>
              <span className="text-[0.75rem] text-stone">Opens soon</span>
            </li>
          ))}
        </ol>
      </Card>
      <div>
        <Label>Your eight domains</Label>
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
  const lab = pillars.find((p) => p.slug === "field-lab")!;
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
              <Status s={p.status} />
            </div>
            <p className="mt-1.5 text-[0.875rem] leading-relaxed text-stone">{p.detail}</p>
          </li>
        ))}
      </ul>
      <Card>
        <Label>Open calls</Label>
        <p className="mt-3 text-[0.9375rem] leading-relaxed">No open calls yet. The first Field Lab projects are being scoped with Knowledge Partners for 2027.</p>
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
  const [tab, setTab] = useState<Tab>("home");
  const body = { home: <HomeTab />, circles: <CirclesTab />, academy: <AcademyTab />, fieldlab: <FieldLabTab />, summit: <SummitTab /> }[tab];

  return (
    <div className="min-h-screen bg-ivory">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-hairline bg-ivory/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-[1240px] items-center justify-between px-5 lg:h-16 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5" aria-label="ASEB Society website">
            <img src={asset("images/brand/aseb-society-mark-on-light.png")} alt="" className="h-8 w-auto" />
            <span className="font-display text-[1.125rem]">ASEB Society</span>
          </Link>
          <div className="flex items-center gap-5 text-[0.875rem] font-semibold">
            <button className="min-h-[44px]">Search</button>
            <span className="inline-flex h-9 w-9 items-center justify-center bg-ink font-display text-[0.9375rem] text-ivory" aria-label="Your profile">M</span>
          </div>
        </div>
        <div className="border-t border-hairline bg-sand/40 px-5 py-2 text-center text-[0.75rem] text-ink/80">
          Member app preview. Content is illustrative of structure only.
        </div>
      </header>

      <div className="mx-auto grid max-w-[1240px] lg:grid-cols-[220px_1fr_300px] lg:gap-10 lg:px-8">
        {/* Desktop rail */}
        <nav aria-label="App" className="sticky top-[100px] hidden h-fit pt-10 lg:block">
          <ul className="border-t border-ink">
            {tabs.map((t) => (
              <li key={t.id}>
                <button onClick={() => setTab(t.id)} className={`relative flex w-full items-center border-b border-hairline py-4 pl-4 text-left text-[1rem] ${tab === t.id ? "font-semibold" : "text-ink/70 hover:text-ink"}`}>
                  {tab === t.id && <span className="absolute left-0 top-3 bottom-3 w-[3px] bg-signal" aria-hidden="true" />}
                  {t.label}
                </button>
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
                {ladder.map((l, i) => (
                  <li key={l.step} className={`flex items-center gap-3 py-2 text-[0.875rem] ${i === 0 ? "font-semibold" : "text-stone"}`}>
                    <span className={`inline-block h-2 w-2 ${i === 0 ? "bg-signal" : "border border-stone/50"}`} aria-hidden="true" />
                    {l.name}
                  </li>
                ))}
              </ol>
            </Card>
            <Card>
              <Label>Find others in your role</Label>
              <p className="mt-3 text-[0.875rem] leading-relaxed text-stone">Search {registry.length} verified practitioners and institutions.</p>
              <Link to="/registry" className="tlink mt-4">Open the Registry <span className="arr" aria-hidden="true">→</span></Link>
            </Card>
          </div>
        </aside>
      </div>

      {/* Mobile tab bar: text labels, logo-orange indicator */}
      <nav aria-label="App tabs" className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-ivory/95 backdrop-blur-sm lg:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <ul className="grid grid-cols-5">
          {tabs.map((t) => (
            <li key={t.id}>
              <button onClick={() => { setTab(t.id); window.scrollTo({ top: 0 }); }} aria-current={tab === t.id ? "page" : undefined}
                className={`relative flex h-[60px] w-full items-center justify-center text-[0.8125rem] ${tab === t.id ? "font-semibold text-ink" : "text-stone"}`}>
                {tab === t.id && <span className="absolute left-1/2 top-0 h-[3px] w-8 -translate-x-1/2 bg-signal" aria-hidden="true" />}
                {t.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
