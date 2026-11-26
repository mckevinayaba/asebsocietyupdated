import { useState } from "react";
import { PageHero, SectionHead } from "@/components/PageHero";
import { Btn } from "@/components/Arrow";
import { Source, Ext } from "@/components/Rows";
import { people, type Person } from "@/content/institution";
import { asset } from "@/lib/asset";
import { Button } from "@/components/ui/button";

function Profile({ p, large = false }: { p: Person; large?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <article id={p.slug} className={`reveal scroll-mt-32 grid gap-6 border-b border-hairline py-10 ${large ? "lg:grid-cols-12 lg:gap-10" : "sm:grid-cols-[160px_1fr] sm:gap-8"}`}>
      <div className={large ? "lg:col-span-4" : ""}>
        <div className={`photo portrait-frame aspect-square ${large ? "max-w-[360px]" : "max-w-[160px]"}`}>
          <img src={asset(p.photo)} alt={`${p.name}, ${p.role.split(" · ")[0]}`} loading="lazy" />
        </div>
      </div>
      <div className={large ? "lg:col-span-7 lg:col-start-6" : ""}>
        <h3 className={`font-display leading-tight ${large ? "text-display-sm" : "text-[1.75rem]"}`}>{p.name}</h3>
        <p className="mt-2 text-[0.9375rem] font-semibold text-ember">{p.role}</p>
        <p className="mt-1 text-[0.875rem] text-stone">{p.base}</p>
        <p className="mt-5 max-w-prose text-[1rem] leading-relaxed">{p.summary}</p>
        {open && <div className="mt-4 max-w-prose space-y-4 text-[1rem] leading-relaxed text-stone">{p.bio.map((b, i) => <p key={i}>{b}</p>)}</div>}
        <div className="mt-5 flex flex-wrap items-center gap-5">
          <Button variant="ghost" type="button" className="tlink h-auto justify-start rounded-none px-0 hover:bg-transparent" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {open ? "Show less" : "Read full profile"} <span className="arr" aria-hidden="true">{open ? "↑" : "↓"}</span>
          </Button>
          {p.linkedin && (
            <a href={p.linkedin} target="_blank" rel="noreferrer" className="tlink">
              LinkedIn <span className="arr" aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function People() {
  const founder = people.filter((p) => p.group === "founder");
  const exec = people.filter((p) => p.group === "executive");
  const board = people.filter((p) => p.group === "board");
  return (
    <>
      <PageHero eyebrow="Our people" title="Leadership grounded in practice." lede="The people who steward ASEB Society have built hubs, programmes, funds and institutions themselves. They are accountable to the field, not to a single funder or personality." />

      <section className="section-tight">
        <div className="wrap">
          <p className="eyebrow">Founder</p>
          <div className="mt-6 border-t border-ink">{founder.map((p) => <Profile key={p.slug} p={p} large />)}</div>
        </div>
      </section>

      <section className="section-tight border-t border-hairline bg-paper">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">Executive Team</p>
            <h2 className="mt-5 text-display-sm">Operations, narrative and community.</h2>
          </div>
          <div className="border-t border-ink lg:col-span-8">{exec.map((p) => <Profile key={p.slug} p={p} />)}</div>
        </div>
      </section>

      <section className="section-tight border-t border-hairline">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">Board and Advisory Board</p>
            <h2 className="mt-5 text-display-sm">Strategic oversight and regional reach.</h2>
            <p className="mt-5 text-[1rem] leading-relaxed text-stone">The Board provides strategic oversight, ensures fiduciary responsibility and safeguards the mission. Regional roles carry the Society's work into Lusophone and East Africa.</p>
          </div>
          <div className="border-t border-ink lg:col-span-8">{board.map((p) => <Profile key={p.slug} p={p} />)}</div>
        </div>
      </section>

      <section className="section-tight border-t border-hairline bg-paper">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">Advisory Council</p>
            <h2 className="mt-5 text-display-sm">Being assembled.</h2>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <p className="text-[1.0625rem] leading-relaxed">Senior ecosystem builders, investors and policymakers from across the continent who advise on strategy, partnerships and programme development. Members will be announced once appointed.</p>
            <Source>Source: <Ext href="https://www.asebsociety.org/about/team">ASEB Society, Our People</Ext>.</Source>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Serve the field" title="Carry the work in your country." lede="Country Partners and Ambassadors extend the Society across all 54 countries. Both are obligations, not titles." />
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Btn to="/country-partners">Become a Country Partner</Btn>
            <Btn to="/ambassadors" variant="line">Become an Ambassador</Btn>
          </div>
        </div>
      </section>
    </>
  );
}
