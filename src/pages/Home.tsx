import { Link } from "@/lib/router";
import { registry, countries, regions } from "@/content/registry";
import { challenges, programmeReadiness } from "@/content/platform";
import { pillars } from "@/content/pillars";
import { FindYourPlace } from "@/components/FindYourPlace";
import { ProgrammeStatus } from "@/components/ProgrammeStatus";
import { Photo } from "@/components/Photo";
import { Btn, TLink, Arr } from "@/components/Arrow";
import { asset } from "@/lib/asset";
import panelPhoto from "@/assets/aseb-2026-panel-from-movement-to-institution.jpg.asset.json";

function Heading({ label, title, children }: { label: string; title: string; children?: React.ReactNode }) {
  return <div className="max-w-3xl"><p className="eyebrow">{label}</p><h2 className="society-section-title mt-5">{title}</h2>{children && <p className="lede mt-6">{children}</p>}</div>;
}

export default function Home() {
  return <>
    <section className="society-hero on-dark relative isolate flex items-center overflow-hidden bg-teal text-ivory">
      <img src={asset("images/events/aseb-2026-summit-delegates.jpg")} alt="ASEB ecosystem builders gathered together at the 2026 Summit in Johannesburg" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" fetchPriority="high" />
      <div className="society-hero-scrim absolute inset-0 -z-10" />
      <div className="wrap py-12 lg:py-14">
        <p className="text-sm font-semibold text-ivory">Africa Startup Ecosystem Builders Society</p>
        <h1 className="society-headline mt-5 max-w-[15ch]">You help entrepreneurs grow.<br /><span className="text-sand">Who helps you grow?</span></h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory lg:text-lg">Across Africa, you mentor founders, run innovation hubs, teach entrepreneurship, connect startups to funding and help businesses reach markets. But who supports the people doing this work?</p>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-ivory/90">ASEB Society is building a professional home where you can connect, learn, grow and work together.</p>
        <div className="mt-7 flex flex-wrap gap-3"><Btn to="/#find-your-place" variant="signal">Find Your Place</Btn><Btn to="/what-we-build" variant="line">Explore What We Build</Btn></div>
        <p className="mt-7 text-xs text-ivory/80">ASEB Summit delegates, Johannesburg, October 2026 · Photo: ASEB Society</p>
      </div>
    </section>
    <div className="border-b border-hairline bg-teal-soft"><div className="wrap flex flex-col gap-3 py-5 text-sm sm:flex-row sm:items-center sm:justify-between"><p className="max-w-2xl text-teal"><strong>A Society for the whole year.</strong> The Summit convenes and recognises the field. The Society is building its continuing professional home.</p><TLink to="/progress" className="shrink-0">See our progress</TLink></div></div>

    <section className="section"><div className="wrap grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-5"><Heading label="The work behind the work" title="Does this sound familiar?">The people supporting entrepreneurs need support of their own.</Heading><Photo className="mt-8" src="images/events/aseb-networking.jpg" alt="ASEB practitioners sharing a conversation between sessions" caption="Practitioners connecting at an ASEB gathering" ratio="aspect-[3/2]" /></div>
      <div className="border-t border-ink lg:col-span-6 lg:col-start-7">{challenges.map((item) => <details key={item.who} className="group border-b border-hairline py-6"><summary className="flex cursor-pointer list-none items-start justify-between gap-5 [&::-webkit-details-marker]:hidden"><span><span className="text-xs font-semibold text-teal">{item.who}</span><span className="mt-2 block font-display text-2xl leading-snug">{item.question}</span></span><span aria-hidden="true" className="mt-6 text-xl text-ember group-open:hidden">+</span><span aria-hidden="true" className="mt-6 hidden text-xl text-ember group-open:block">−</span></summary><p className="mt-5 text-base text-stone">{item.answer}</p><div className="mt-4"><TLink to={item.to}>{item.action}</TLink></div></details>)}</div>
    </div></section>

    <section className="section border-t border-hairline bg-paper"><div className="wrap grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-5"><Heading label="You may already be doing it" title="What is ecosystem building?">It is the work that helps entrepreneurs find the people, knowledge, finance, markets and conditions they need to start and grow.</Heading><p className="mt-5 text-stone">You do not need “ecosystem builder” in your job title. If you strengthen the support around entrepreneurs, your work belongs in this field.</p><div className="mt-7"><TLink to="/framework">Read the framework</TLink></div><Photo className="mt-8" src={panelPhoto.url} alt="Three practitioners in conversation on stage at ASEB 2026" caption="The field in conversation, ASEB 2026, Johannesburg" ratio="aspect-[4/3]" position="50% 60%" /></div>
      <div className="lg:col-span-6 lg:col-start-7">{[
        ["A mentor opens a door.", "You help a founder navigate a difficult decision and connect them with someone who can help."],
        ["A hub builds lasting support.", "Your team brings workspace, skills, networks and investment readiness together for growing businesses."],
        ["An educator connects learning to enterprise.", "You help students turn ideas into ventures and build relationships beyond the classroom."],
        ["A climate practitioner connects the system.", "You link green ventures to relevant skills, finance, policy and markets so innovation can become a viable business."],
        ["A policymaker removes a barrier.", "You make it easier for entrepreneurs to start, operate and access the support they need."],
      ].map(([title, text]) => <div key={title} className="border-t border-hairline py-6"><h3 className="text-2xl leading-tight">{title}</h3><p className="mt-3 text-base text-stone">{text}</p></div>)}</div>
    </div></section>

    <section id="find-your-place" className="section scroll-mt-44"><div className="wrap"><Heading label="Your work belongs here" title="Find your place.">What best describes your work? Find the relevant pathway without needing to know our institutional terminology.</Heading><FindYourPlace /></div></section>

    <section className="section border-y border-hairline bg-teal-soft"><div className="wrap"><Heading label="A year-round ambition" title="Four ways we support the people who support entrepreneurs." />
      <div className="mt-12 grid gap-x-10 md:grid-cols-2">{pillars.map((pillar) => { const info = programmeReadiness[pillar.slug as keyof typeof programmeReadiness]; if (!info) return null; return <div key={pillar.slug} className="border-t border-teal/25 py-8"><ProgrammeStatus status={info.status} /><h3 className="mt-5 text-3xl">{pillar.name}</h3><p className="mt-2 font-display text-2xl text-teal">{info.benefit}</p><p className="mt-4 max-w-lg text-base text-stone">{info.now}</p><div className="mt-5"><TLink to={info.to}>{info.action}</TLink></div></div>; })}</div>
      <Photo className="mt-8" src="images/events/aseb-awards-stage-2.jpg" alt="Two ecosystem builders embracing on the ASEB Awards stage" caption="Recognition of the people behind entrepreneurship, ASEB Awards" ratio="aspect-[2/1]" position="50% 40%" />
    </div></section>

    <section className="section"><div className="wrap"><Heading label="Continental purpose, practical delivery" title="One professional home across Africa.">A continental mission does not require an office in every country. Shared resources can serve the field while local partnerships and focused programmes develop where there is capacity.</Heading>
      <div className="mt-12 grid gap-8 lg:grid-cols-3">{[
        ["Continental infrastructure", "A shared professional home", "Profiles, a searchable archive, public knowledge and a common framework connect the field across borders.", "A mentor can use the Evidence Library without a local ASEB office."],
        ["Countries and communities", "Relevant to where you work", "Circles and local partnerships are being developed around geography, language, roles and shared challenges.", "A proposed country partnership needs confirmed people and responsibilities—not just a name on a map."],
        ["Programmes and collaboration", "Focused work, clear outcomes", "Projects bring specific partners together around a defined entrepreneurship challenge, beneficiaries and delivery plan.", "A university and hub could propose a joint practitioner-development programme."],
      ].map(([label, title, text, example]) => <div key={label} className="border-t-2 border-teal pt-6"><p className="text-xs font-semibold text-teal">{label}</p><h3 className="mt-3 text-2xl">{title}</h3><p className="mt-4 text-base text-stone">{text}</p><p className="mt-5 border-l border-hairline pl-4 text-sm text-stone">{example}</p></div>)}</div>
    </div></section>

    <section className="section border-y border-hairline bg-paper"><div className="wrap grid gap-10 lg:grid-cols-12"><div className="lg:col-span-5"><Heading label="The Field Registry" title="Discover people and organisations.">Find practitioners and institutions by country, region or role. Start with the people recognised in the ASEB Awards archive.</Heading><div className="mt-7"><Btn to="/registry">Explore the Registry</Btn></div><p className="mt-6 text-sm text-stone">{registry.length} archive records · {countries.length} countries represented. These are archive figures, not Society membership totals.</p><div className="mt-5 flex flex-wrap gap-4">{regions.map((region) => <TLink key={region} to={`/registry?region=${encodeURIComponent(region)}`}>{region} Africa</TLink>)}</div></div><div className="lg:col-span-6 lg:col-start-7"><Photo src="images/events/aseb-2026-recognised-builders.jpg" alt="Recognised practitioners and institutions holding awards at ASEB 2026" caption="Recognised ecosystem builders, ASEB 2026, Johannesburg" ratio="aspect-[4/3]" />
      <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">{[["Awards archive", "A record of historical recognition, not active membership."], ["Claimed profile", "A claim requires review; submitting a request is not confirmation."], ["Verified practice", "Evidence-based verification is separate from an award."], ["Active membership", "An account or archive listing does not establish approved Society membership."]].map(([term, meaning]) => <div key={term} className="border-t border-hairline pt-3"><dt className="font-semibold text-teal">{term}</dt><dd className="mt-1 text-stone">{meaning}</dd></div>)}</dl>
    </div></div></section>

    <section className="section"><div className="wrap"><Heading label="Available now" title="What can you do today?" />
      <div className="mt-10 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">{[
        ["Apply to join", "Tell us who you are, what you do and where you operate. Applications are reviewed.", "/join"],
        ["Create your account", "Save your professional profile and Circle preferences. An account does not replace membership review.", "/auth"],
        ["Explore the field", "Find public archive records by country, role and organisation type.", "/registry"],
        ["Request a profile claim", "Use the application pathway to request review of an existing archive record.", "/join"],
        ["Read and contribute", "Use open evidence and submit an editorial pitch from your practice.", "/insights"],
        ["Propose a partnership", "Discuss your priorities for practitioner development or a focused collaboration.", "/collaborate"],
      ].map(([title, text, to]) => <Link key={title} to={to ?? "/join"} className="group border-t border-hairline py-7"><h3 className="flex items-baseline justify-between gap-3 text-2xl group-hover:text-ember">{title}<Arr /></h3><p className="mt-3 text-base text-stone">{text}</p></Link>)}</div>
    </div></section>

    <section className="section border-y border-hairline bg-teal-soft"><div className="wrap"><Heading label="Honest about readiness" title="What we are building.">The professional home is taking shape. Here is what you can use now and what still needs people, partners and delivery capacity.</Heading><div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{[
      ["Available", "Public resources and applications", "The Registry, framework, Evidence Library, accounts and enquiry forms are available."],
      ["Launching", "Community foundations", "Members can save Circle preferences while facilitated communities are developed."],
      ["Planned", "Structured professional learning", "Academy courses, assessments and professional credentials are not yet open."],
      ["Open for Partnership", "Focused collaborative work", "Field Lab proposals can be discussed; delivery depends on agreed scope and capacity."],
    ].map(([status, title, text]) => <div key={status} className="border-t border-teal/25 pt-6"><ProgrammeStatus status={status as "Available" | "Launching" | "Planned" | "Open for Partnership"} /><h3 className="mt-5 text-2xl">{title}</h3><p className="mt-3 text-base text-stone">{text}</p></div>)}</div><div className="mt-9"><TLink to="/progress">Read our full progress update</TLink></div></div></section>

    <section className="section"><div className="wrap grid gap-10 lg:grid-cols-12"><Photo className="lg:col-span-6" src="images/events/aseb-summit-panel.jpg" alt="Practitioners exchanging ideas during an ASEB Summit panel" caption="Shared practice at the ASEB Summit" ratio="aspect-[4/3]" /><div className="lg:col-span-5 lg:col-start-8"><Heading label="From recognition to continuity" title="Why this matters." /><p className="mt-6 text-stone">Since 2022, five Summit and Awards editions have brought attention to the people who support entrepreneurship. ASEB Society was publicly launched on 21 October 2026 to build a continuing professional home beyond the annual event.</p><p className="mt-5 text-stone">Event reach is a starting point—not proof of year-round professional outcomes. The next task is to turn relationships and shared knowledge into sustained support for the field.</p><div className="mt-7 flex flex-wrap gap-5"><TLink to="/about/story">Read our story</TLink><TLink to="/summit">Explore past editions</TLink></div></div></div></section>

    <section className="on-dark section bg-teal text-ivory"><div className="wrap"><p className="eyebrow">Your next chapter</p><h2 className="society-section-title mt-5 max-w-3xl">You build opportunities for others.<br />Make room for your own growth.</h2><p className="mt-6 max-w-2xl text-lg text-ivory/90">Whether you work independently, lead an institution or support the field through funding, research or policy, there is a place to begin.</p><div className="mt-8 flex flex-wrap gap-3"><Btn to="/join" variant="signal">Apply to Join the Society</Btn><Btn to="/get-involved" variant="line">Find a Way to Contribute</Btn></div></div></section>
  </>;
}
