import { Link } from "@/lib/router";
import { registry, countries, regions } from "@/content/registry";
import { challenges } from "@/content/platform";
import { FindYourPlace } from "@/components/FindYourPlace";
import { MandateExplorer } from "@/components/MandateExplorer";
import { Photo } from "@/components/Photo";
import { Btn, TLink, Arr } from "@/components/Arrow";
import { asset } from "@/lib/asset";
import panelPhoto from "@/assets/aseb-2026-panel-from-movement-to-institution.jpg.asset.json";

function Heading({ label, title, children }: { label: string; title: string; children?: React.ReactNode }) {
  return <div className="reveal max-w-3xl"><p className="eyebrow">{label}</p><h2 className="society-section-title mt-5">{title}</h2>{children && <p className="lede mt-6">{children}</p>}</div>;
}

export default function Home() {
  return <>
    <section className="society-hero on-dark relative isolate flex items-center overflow-hidden bg-teal text-ivory">
      <img src={asset("images/events/aseb-2026-summit-delegates.jpg")} alt="ASEB ecosystem builders gathered together at the 2026 Summit in Johannesburg" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" fetchPriority="high" />
      <div className="society-hero-scrim absolute inset-0 -z-10" />
      <div className="wrap relative py-10 lg:py-14">
        <p className="eyebrow">A professional home for Africa’s ecosystem builders</p>
        <h1 className="society-headline mt-6 max-w-[18ch]">Africa Startup Ecosystem<br /><em className="text-ivory">Builders Society.</em></h1><p className="hero-question mt-6 max-w-xl font-display text-2xl leading-snug lg:text-3xl">You help entrepreneurs grow.<br /><span className="text-sand">Who helps you grow?</span></p>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-ivory/90">For the people and institutions behind Africa’s entrepreneurs. A shared home for professional practice, knowledge, connection and collective action.</p>
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

    <section className="section mandate-band border-y border-hairline"><div className="wrap"><Heading label="Our institutional mandate" title="Connection. Practice. Collaboration. Recognition.">Four connected pillars strengthen the people and institutions who make entrepreneurship possible.</Heading><MandateExplorer /></div></section>

    <section className="section"><div className="wrap"><Heading label="Continental purpose, practical delivery" title="One professional home across Africa.">Our work connects a continental framework with local knowledge and focused collaboration. The goal is stronger support for entrepreneurs, wherever that work happens.</Heading>
      <div className="mt-12 grid gap-8 lg:grid-cols-3">{[
        ["Continental infrastructure", "A shared professional home", "Profiles, a searchable archive, public knowledge and a common framework connect the field across borders.", "A mentor can use the Evidence Library without a local ASEB office."],
        ["Countries and communities", "Relevant to where you work", "Circles and local partnerships are being developed around geography, language, roles and shared challenges.", "Local knowledge shapes the priorities; shared practice connects them across borders."],
        ["Programmes and collaboration", "Focused work, clear outcomes", "Projects bring specific partners together around a defined entrepreneurship challenge, beneficiaries and delivery plan.", "A university and hub could propose a joint practitioner-development programme."],
      ].map(([label, title, text, example]) => <div key={label} className="border-t-2 border-teal pt-6"><p className="text-xs font-semibold text-teal">{label}</p><h3 className="mt-3 text-2xl">{title}</h3><p className="mt-4 text-base text-stone">{text}</p><p className="mt-5 border-l border-hairline pl-4 text-sm text-stone">{example}</p></div>)}</div>
    </div></section>

    <section className="section border-y border-hairline bg-paper"><div className="wrap grid gap-10 lg:grid-cols-12"><div className="lg:col-span-5"><Heading label="The Field Registry" title="Discover people and organisations.">Find practitioners and institutions by country, region or role. Start with the people recognised in the ASEB Awards archive.</Heading><div className="mt-7"><Btn to="/registry">Explore the Registry</Btn></div><p className="mt-6 text-sm text-stone">{registry.length} archive records · {countries.length} countries represented. in the Awards archive.</p><div className="mt-5 flex flex-wrap gap-4">{regions.map((region) => <TLink key={region} to={`/registry?region=${encodeURIComponent(region)}`}>{region} Africa</TLink>)}</div></div><div className="lg:col-span-6 lg:col-start-7"><Photo src="images/events/aseb-2026-recognised-builders.jpg" alt="Recognised practitioners and institutions holding awards at ASEB 2026" caption="Recognised ecosystem builders, ASEB 2026, Johannesburg" ratio="aspect-[4/3]" />
      <p className="mt-6 text-sm text-stone">Recognition is one part of a professional journey. The Registry documents the Awards archive; membership and profile verification have their own review pathways.</p>
    </div></div></section>

    <section className="section"><div className="wrap"><Heading label="Available now" title="What can you do today?" />
      <div className="mt-10 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">{[
        ["Apply to join", "Tell us who you are, what you do and where you operate. Applications are reviewed.", "/join"],
        ["Create your account", "Save your professional profile and Circle preferences. Membership applications follow a separate review.", "/auth"],
        ["Explore the field", "Find public archive records by country, role and organisation type.", "/registry"],
        ["Make your work visible", "Describe your practice and request review of a profile in the Awards archive.", "/join"],
        ["Read and contribute", "Use open evidence and submit an editorial pitch from your practice.", "/insights"],
        ["Propose a partnership", "Discuss your priorities for practitioner development or a focused collaboration.", "/collaborate"],
      ].map(([title, text, to]) => <Link key={title} to={to ?? "/join"} className="group border-t border-hairline py-7"><h3 className="flex items-baseline justify-between gap-3 text-2xl group-hover:text-ember">{title}<Arr /></h3><p className="mt-3 text-base text-stone">{text}</p></Link>)}</div>
    </div></section>

    <section className="section institution-statement on-dark bg-teal text-ivory"><div className="wrap grid gap-10 lg:grid-cols-12"><div className="lg:col-span-8"><p className="eyebrow">A field with a name. A community with a purpose.</p><h2 className="society-section-title mt-6">Entrepreneurship grows stronger when its builders grow together.</h2></div><div className="flex flex-col justify-end lg:col-span-3 lg:col-start-10"><p className="text-base text-ivory/85">From mentoring and hub leadership to research, investment and climate innovation, your work is part of the same connected field.</p><div className="mt-7"><TLink to="/progress">Our institutional journey</TLink></div></div></div></section>

    <section className="section"><div className="wrap grid gap-10 lg:grid-cols-12"><Photo className="lg:col-span-6" src="images/events/aseb-summit-panel.jpg" alt="Practitioners exchanging ideas during an ASEB Summit panel" caption="Shared practice at the ASEB Summit" ratio="aspect-[4/3]" /><div className="lg:col-span-5 lg:col-start-8"><Heading label="From recognition to continuity" title="Why this matters." /><p className="mt-6 text-stone">Since 2022, five Summit and Awards editions have brought attention to the people who support entrepreneurship. ASEB Society was publicly launched on 21 October 2026 to build a continuing professional home beyond the annual event.</p><p className="mt-5 text-stone">The next chapter connects that recognition to continuity: shared methods, meaningful relationships and sustained support for the people and institutions building the field.</p><div className="mt-7 flex flex-wrap gap-5"><TLink to="/about/story">Read our story</TLink><TLink to="/summit">Explore past editions</TLink></div></div></div></section>

    <section className="on-dark section bg-teal text-ivory"><div className="wrap"><p className="eyebrow">Your next chapter</p><h2 className="society-section-title mt-5 max-w-3xl">You build opportunities for others.<br />Make room for your own growth.</h2><p className="mt-6 max-w-2xl text-lg text-ivory/90">Whether you work independently, lead an institution or support the field through funding, research or policy, there is a place to begin.</p><div className="mt-8 flex flex-wrap gap-3"><Btn to="/join" variant="signal">Apply to Join the Society</Btn><Btn to="/get-involved" variant="line">Find a Way to Contribute</Btn></div></div></section>
  </>;
}
