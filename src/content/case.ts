import { pillarPhoto } from "./photography";
// The institutional case: problem, intervention logic, mandates, network and investment.
// Shared by the home page, Why We Exist and Invest so the argument never contradicts itself.
// Rule: every figure carries a source, and a figure is only published when `verified` is true.

export const positioning = {
  headline: "Stronger ecosystems. Stronger economies.",
  statement: "We advance ecosystem building as a professional practice and a recognised profession, strengthening the people, institutions and systems that make entrepreneurship possible across Africa.",
  philosophy: "It Takes a Village.",
  promise: "Strengthening those who strengthen entrepreneurship.",
  question: "Africa invests in entrepreneurs. Who invests in the people who make entrepreneurship possible?",
};

export type Evidence = { figure: string; claim: string; source: string; href: string; year: string; verified: boolean; note?: string };

export const economicEvidence: Evidence[] = [
  {
    figure: "85.8%",
    claim: "of employment in Africa is informal, so most livelihoods depend on enterprises that formal support rarely reaches.",
    source: "International Labour Organization, Report on Employment in Africa",
    href: "https://www.ilo.org/media/396341/download",
    year: "ILO",
    verified: true,
  },
  {
    figure: "Under 1%",
    claim: "of global venture funding reaches African startups, so capital alone cannot carry enterprise development.",
    source: "BusinessDay, 2026",
    href: "https://businessday.ng/technology/article/africas-startups-raise-2-2bn-in-2025-as-growth-outruns-europe-china-and-india/",
    year: "2026",
    verified: true,
  },
  {
    figure: "$213bn to $140bn",
    claim: "projected fall in official development assistance, which places more of the burden on Africa's own institutions.",
    source: "UNDP, 2026",
    href: "https://www.undp.org/sites/g/files/zskgke326/files/2026-04/how_a_1bn_undp_initiative_can_offset_a_60bn_aid_decline.pdf",
    year: "2026",
    verified: true,
  },
  {
    // Leadership supplied this figure. The source page could not be reached from the build
    // environment to confirm its wording and context, so it stays unpublished until verified.
    figure: "10 to 12 million",
    claim: "young Africans enter the labour market each year, against roughly three million formal jobs created.",
    source: "African Development Bank",
    href: "https://www.afdb.org/en/topics-and-sectors/topics/youth",
    year: "AfDB",
    verified: false,
    note: "Awaiting verification of the original wording and context before publication.",
  },
];

export const publishedEvidence = economicEvidence.filter((item) => item.verified);

export const supportSystem = ["Innovation hubs", "Incubators", "Accelerators", "Universities", "Investors", "Mentors", "Government agencies", "Support organisations", "Policymakers", "Research institutions", "Enterprise development practitioners"];

export type ProblemTheme = { name: string; line: string; issues: string[] };

// The intervention focus. Presented as problem areas, never as claims about every country.
export const problemThemes: ProblemTheme[] = [
  { name: "Fragmentation", line: "Support exists, but it rarely works as a system.", issues: ["Fragmented entrepreneurship support systems", "Weak coordination between ecosystem stakeholders", "Limited collaboration across national ecosystems"] },
  { name: "Capability", line: "The people running support institutions learn mostly alone.", issues: ["Limited professional development for ecosystem practitioners", "Weak translation of research into professional practice", "Uneven access to ecosystem knowledge"] },
  { name: "Fragility", line: "Programmes end when funding cycles end.", issues: ["Institutional fragility and unsustainable support programmes", "Geographic inequality in entrepreneurship support"] },
  { name: "Memory and voice", line: "Hard-won lessons disappear, and the field has no collective voice.", issues: ["Limited institutional memory", "Inadequate professional recognition", "Insufficient collective representation"] },
];

export type ChangeStep = { label: string; title: string; body: string };

// The intervention logic. These are intended outcomes. Measured impact is reported separately
// on the Progress page only when evidence exists.
export const theoryOfChange: ChangeStep[] = [
  { label: "Investment", title: "Institutional investment", body: "Funding and partnership strengthen the Society's Secretariat, programmes and digital infrastructure." },
  { label: "Builders", title: "Stronger ecosystem builders", body: "Practitioners gain professional development, shared knowledge, coordination, recognition and peers across borders." },
  { label: "Institutions", title: "Stronger support institutions", body: "Hubs, incubators, accelerators, agencies and universities become more capable, connected and sustainable." },
  { label: "Entrepreneurs", title: "Better conditions for entrepreneurs", body: "Founders meet support that is coordinated, informed by evidence and present beyond capital cities." },
  { label: "Economies", title: "Enterprise and economic transformation", body: "Improved conditions can contribute to enterprise growth, productivity, employment and wider transformation." },
];

export type MandateKey = "summit" | "circles" | "academy" | "field-lab";
export type Mandate = { key: MandateKey; name: string; role: string; challenge: string; purpose: string; contribution: string; status: { tone: "operational" | "developing"; text: string }; pathway: { label: string; to: string }; photo: string; alt: string };

// Current status comes from src/content/platform.ts readiness, described in plain language.
export const mandates: Mandate[] = [
  { key: "summit", name: "ASEB Summit & Awards", role: "The continental convening", challenge: "The field has few places where its practitioners meet, compare practice and are recognised for long-term contribution.", purpose: "Convene the field each year, recognise excellence and mobilise ecosystem builders across Africa.", contribution: "A visible, peer-reviewed record of who builds Africa's ecosystems, and a yearly point of coordination.", status: { tone: "operational", text: "Operational. Five editions held since 2022. The 2027 edition is announced for Mayotte." }, pathway: { label: "Explore the Summit & Awards", to: "/summit" }, photo: pillarPhoto("summit").src, alt: pillarPhoto("summit").alt },
  { key: "circles", name: "ASEB Circles", role: "Communities of practice", challenge: "Practitioners solve the same problems in isolation, country by country.", purpose: "Peer learning, knowledge exchange and collective problem solving by region, language and shared challenge.", contribution: "Relationships and methods that travel across borders and outlast single programmes.", status: { tone: "developing", text: "Circle preferences are open and saved to member accounts. Facilitated groups are in development." }, pathway: { label: "Choose your Circles", to: "/communities" }, photo: pillarPhoto("circles").src, alt: pillarPhoto("circles").alt },
  { key: "academy", name: "ASEB Academy", role: "Professional development", challenge: "Ecosystem building is learned on the job, with few shared standards or learning pathways.", purpose: "Learning pathways, practitioner capabilities and practice standards, building towards future professional recognition.", contribution: "More capable practitioners, and a shared language for what good practice looks like.", status: { tone: "developing", text: "Learning priorities are being gathered. Courses and credentials are in development and are not yet offered." }, pathway: { label: "Shape the Academy", to: "/learning" }, photo: pillarPhoto("academy").src, alt: pillarPhoto("academy").alt },
  { key: "field-lab", name: "ASEB Field Lab", role: "Applied research and policy intelligence", challenge: "Structural barriers outlast any single institution, and research rarely reaches practice.", purpose: "Applied research, policy intelligence, systems experimentation and institutional development.", contribution: "Evidence and tools that support institutions and policymakers can use.", status: { tone: "developing", text: "Open for research and policy collaborations, each agreed with defined scope and partners." }, pathway: { label: "Propose a collaboration", to: "/field-lab" }, photo: pillarPhoto("field-lab").src, alt: pillarPhoto("field-lab").alt },
];

export type InvestmentArea = { slug: string; name: string; purpose: string; outcome: string };

// No amounts, targets or commitments are published until approved.
export const investmentAreas: InvestmentArea[] = [
  { slug: "founding-support", name: "Founding institutional support", purpose: "Core support for the Society's first years as a permanent institution.", outcome: "A stable foundation that lets every other mandate operate." },
  { slug: "secretariat", name: "Secretariat development", purpose: "The small team that runs membership, partnerships, governance and reporting.", outcome: "Reliable operations, faster responses and accountable records." },
  { slug: "practitioner-development", name: "Practitioner and capacity development", purpose: "Learning pathways, peer Circles and practice standards for ecosystem builders.", outcome: "More capable practitioners and support institutions." },
  { slug: "country-network", name: "Country network activation", purpose: "Recruiting, onboarding and supporting Country Partners and Ambassadors.", outcome: "Locally rooted representation, beginning where demand and capacity exist." },
  { slug: "ecosystem-intelligence", name: "Ecosystem intelligence and applied research", purpose: "Field Lab research, policy intelligence and the translation of evidence into practice.", outcome: "Decisions informed by evidence rather than assumption." },
  { slug: "inclusive-participation", name: "Inclusive participation", purpose: "Reaching township, rural, informal economy and Francophone, Lusophone and Arabic speaking practitioners.", outcome: "A field that reflects the whole continent, not only its capital cities." },
  { slug: "playbook", name: "The African Ecosystem Building Playbook", purpose: "Editing, research and publication of a living professional publication written with practitioners.", outcome: "Shared, African-authored knowledge on how ecosystems are built." },
  { slug: "voices-and-memory", name: "ASEB Voices and institutional memory", purpose: "Editorial capacity to document the people, institutions and lessons behind African ecosystems.", outcome: "A field that keeps its memory instead of starting from zero." },
  { slug: "knowledge-access", name: "Knowledge accessibility", purpose: "Translation, low-bandwidth access and multilingual participation.", outcome: "Knowledge that reaches practitioners in every language and connection." },
  { slug: "digital-infrastructure", name: "Digital institutional infrastructure", purpose: "This platform: registry, member services, knowledge and Secretariat tools.", outcome: "A shared professional home that a small team can run." },
  { slug: "strategic-collaboration", name: "Strategic collaboration", purpose: "Joint programmes with foundations, agencies, universities and networks.", outcome: "Shared outcomes, agreed in advance and reported openly." },
];

export const accountability = [
  { k: "Intended outcomes", v: "Every investment area states what it is meant to change. Measured impact is reported only when evidence exists." },
  { k: "Governance", v: "One governing Board with fiduciary oversight of every pillar, an Independent Awards Jury that assesses nominees under approved criteria, and a conflict of interest framework." },
  { k: "Transparent progress", v: "The Progress page separates what is operational from what is in development, planned or subject to funding." },
  { k: "Agreed reporting", v: "Programme partnerships agree scope, delivery partners and reporting before work begins." },
];

export const membershipValue = [
  { k: "Community", v: "Peers by region, language and shared challenge through ASEB Circles." },
  { k: "Knowledge", v: "Open evidence, field insights and the framework behind good practice." },
  { k: "Recognition", v: "A professional record in the field, and a voice in how the profession develops." },
  { k: "Collaboration", v: "Routes into Field Lab projects, programme collaborations and country work." },
];

// Leadership supplied cumulative figures. Kept for Our Story with a clear provenance label.
// They are not independently verified until reconciled against source records.
export const cumulativeFigures = {
  provenance: "Cumulative figures supplied by ASEB leadership. Reconciliation against source records is in progress.",
  items: [
    { value: "12,700+", label: "Nominations across five editions" },
    { value: "245+", label: "Ecosystem builders recognised" },
    { value: "5", label: "Completed continental editions" },
  ],
};

export const nextSummit = { year: "2027", place: "Mayotte", line: "Announced as the next host destination of the ASEB Summit and Awards. Dates and programme are published on asebs.com when confirmed.", href: "https://www.asebs.com" };
