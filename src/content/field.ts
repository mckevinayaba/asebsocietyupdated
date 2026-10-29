// The field: four constituencies and 28 roles, drawn from the ASEB Awards categories.
// The award category name stays on the Awards pages; the platform uses the shorter role name.

export type ConstituencySlug = "practitioners" | "support-institutions" | "capital-market-builders" | "systems-builders";

export type Constituency = {
  slug: ConstituencySlug;
  n: string;
  name: string;
  headline: string;
  intro: string;
};

export type Role = {
  slug: string;
  role: string;
  award: string;
  constituency: ConstituencySlug;
  contribution: string;
  offer: string;
};

export const constituencies: Constituency[] = [
  {
    slug: "practitioners",
    n: "01",
    name: "Practitioners",
    headline: "The practitioners who build the field.",
    intro:
      "Ecosystems are built by people before they are built by programmes. Mentors, coaches, investors, connectors, storytellers and care-givers do work that rarely appears in a funding report. The Society gives that work a standard, a peer group and a record.",
  },
  {
    slug: "support-institutions",
    n: "02",
    name: "Support Institutions",
    headline: "The institutions where founders find their footing.",
    intro:
      "Hubs, incubators, accelerators, coworking spaces, support organisations and education programmes are the physical and programmatic infrastructure of African entrepreneurship. Many operate on thin margins and short grant cycles. The Society helps them benchmark, collaborate and endure.",
  },
  {
    slug: "capital-market-builders",
    n: "03",
    name: "Capital and Market Builders",
    headline: "The builders who move capital, markets and partnerships.",
    intro:
      "Founders need more than support. They need money, customers, partners and routes across borders. The funders, corporates, networks and organisers in this group decide where opportunity flows. The Society gives them a clearer view of the field and partners they can trust.",
  },
  {
    slug: "systems-builders",
    n: "04",
    name: "Systems Builders",
    headline: "The builders who shape the system itself.",
    intro:
      "Some ecosystem builders never meet a founder in a pitch session. They write the policy, produce the evidence, build the shared infrastructure, open the university and address the structural exclusions. Their work determines whether everything else can scale. The Society connects them to the practitioners on the ground.",
  },
];

export const roles: Role[] = [
  // Practitioners
  { slug: "ecosystem-builder", role: "Ecosystem Builder", award: "Ecosystem Builder Champion of the Year", constituency: "practitioners",
    contribution: "You remove barriers, broker trust and strengthen the system beyond any single startup or programme.",
    offer: "A verified record of practice, a peer Circle in your region, and a path to Professional Ecosystem Builder." },
  { slug: "youth-ecosystem-builder", role: "Youth Ecosystem Builder", award: "Youth Ecosystem Builder Champion of the Year", constituency: "practitioners",
    contribution: "You are shaping the ecosystem your generation of founders will inherit.",
    offer: "An early-career track in the Academy, mentoring from senior practitioners, and visibility on a continental stage." },
  { slug: "immigrant-ecosystem-builder", role: "Immigrant Ecosystem Builder", award: "Immigrant Ecosystem Builder Champion of the Year", constituency: "practitioners",
    contribution: "You build in a host country, often without the networks or status locals take for granted.",
    offer: "Recognition of cross-context practice, a Circle of peers building away from home, and advocacy on the barriers you face." },
  { slug: "diaspora-bridge-builder", role: "Diaspora Bridge Builder", award: "Diaspora Ecosystem Bridge Builder Champion of the Year", constituency: "practitioners",
    contribution: "You turn networks, capital and knowledge abroad into results at home.",
    offer: "Structured routes into African ecosystems: verified partners, Field Lab projects and Country Circles." },
  { slug: "mentor", role: "Mentor", award: "Startup Mentor Champion of the Year", constituency: "practitioners",
    contribution: "Your long-term engagement changes founders' trajectories.",
    offer: "A mentoring standard, a record of the founders you have supported, and peer learning with mentors across the continent." },
  { slug: "coach", role: "Coach", award: "Startup Coach Champion of the Year", constituency: "practitioners",
    contribution: "You bring structure, accountability and performance support to founders.",
    offer: "Certification against a shared coaching standard and a directory where institutions can find you." },
  { slug: "angel-investor", role: "Angel Investor", award: "Angel Investor Champion of the Year", constituency: "practitioners",
    contribution: "Your early capital and belief carry startups through their most fragile stage.",
    offer: "Connection to angel networks across borders, investment readiness pipelines, and a peer Circle for early-stage investors." },
  { slug: "founder-wellbeing", role: "Founder Wellbeing Practitioner", award: "Founder Wellbeing Champion of the Year", constituency: "practitioners",
    contribution: "You protect the people behind the companies.",
    offer: "Recognition of wellbeing as ecosystem infrastructure, and a Field Lab track on founder and builder care." },
  { slug: "media-creator", role: "Ecosystem Media and Content Creator", award: "Ecosystem Media and Content Creator Champion of the Year", constituency: "practitioners",
    contribution: "Your African-authored stories shape how the continent sees its own builders.",
    offer: "Access to field data and practitioners for your reporting, and a contributor channel in Insights." },
  // Support institutions
  { slug: "eso", role: "Entrepreneur Support Organisation", award: "Entrepreneur Support Organisation (ESO) Champion of the Year", constituency: "support-institutions",
    contribution: "You route founders to the right support at the right time.",
    offer: "Shared referral standards, an institutional profile in the Registry, and a peer network of ESO leaders." },
  { slug: "service-provider", role: "Startup Service Provider", award: "Startup Service Provider Champion of the Year", constituency: "support-institutions",
    contribution: "You make legal, financial and professional services reachable for founders.",
    offer: "Visibility to institutions seeking trusted providers, and a verified listing." },
  { slug: "innovation-hub", role: "Innovation Hub", award: "Innovation Hub Champion of the Year", constituency: "support-institutions",
    contribution: "You provide the physical and social home where ideas, founders and communities meet.",
    offer: "The Hub Standard: benchmarking, peer review and a sustainability track for hub leaders." },
  { slug: "incubator-accelerator", role: "Incubator and Accelerator", award: "Incubator and Accelerator Champion of the Year", constituency: "support-institutions",
    contribution: "You run structured journeys from idea to launch and from launch to growth.",
    offer: "Programme design standards, outcome measurement tools, and cohort-level data sharing." },
  { slug: "coworking-space", role: "Coworking Space", award: "Coworking Space Champion of the Year", constituency: "support-institutions",
    contribution: "You turn shared space into shared community.",
    offer: "Community-building practice in the Academy, and listing as a node in the Field Registry." },
  { slug: "entrepreneurship-education", role: "Entrepreneurship Education", award: "Entrepreneurship Education Champion of the Year", constituency: "support-institutions",
    contribution: "You turn learning into entrepreneurial action in schools and institutions.",
    offer: "Curriculum exchange, educator Circles, and links to university and hub partners." },
  // Capital and market builders
  { slug: "financing-angel-network", role: "Startup Financing and Angel Network", award: "Startup Financing and Angel Network Champion of the Year", constituency: "capital-market-builders",
    contribution: "You make startup capital more accessible and more collaborative.",
    offer: "Cross-border co-investment introductions and a verified pipeline from member institutions." },
  { slug: "funder-development-partner", role: "Ecosystem Funder and Development Partner", award: "Ecosystem Funder and Development Partner Champion of the Year", constituency: "capital-market-builders",
    contribution: "You invest in the long-term infrastructure of African ecosystems.",
    offer: "Field-level data, vetted Field Lab projects to co-fund, and evidence of outcomes." },
  { slug: "corporate-cvc", role: "Corporate and CVC", award: "Corporate–Startup and CVC Collaboration Champion of the Year", constituency: "capital-market-builders",
    contribution: "You back startups through procurement, investment and partnership.",
    offer: "Fair-engagement guidelines, verified startup and hub partners, and a corporate peer Circle." },
  { slug: "ecosystem-collaboration", role: "Ecosystem Collaboration", award: "Ecosystem Collaboration Champion of the Year", constituency: "capital-market-builders",
    contribution: "Your alliance delivers impact greater than any partner could alone.",
    offer: "A Field Lab home for joint work, and documentation of the collaboration model for others to adopt." },
  { slug: "tech-transfer", role: "Technology Transfer and Commercialisation", award: "Technology Transfer and Commercialisation Champion of the Year", constituency: "capital-market-builders",
    contribution: "You turn research and intellectual property into ventures.",
    offer: "Links between universities, investors and industry, and a commercialisation practice track." },
  { slug: "cross-border", role: "Internationalisation and Cross-Border", award: "Ecosystem Internationalisation and Cross-Border Champion of the Year", constituency: "capital-market-builders",
    contribution: "You help startups enter new markets and connect ecosystems across borders.",
    offer: "Country Circles, cross-border partner directories, and AfCFTA-oriented Field Lab projects." },
  { slug: "ecosystem-event", role: "Ecosystem Event Organiser", award: "Startup Ecosystem Event Champion of the Year", constituency: "capital-market-builders",
    contribution: "Your events create founder visibility, investor access and real deals.",
    offer: "Event quality guidelines, a shared calendar on the platform, and co-convening with the Society." },
  { slug: "investment-readiness", role: "Investment Readiness", award: "Startup Investment Readiness Champion of the Year", constituency: "capital-market-builders",
    contribution: "You make startups investable through governance, financial readiness and diligence support.",
    offer: "A shared readiness framework and direct links to the investor members of the Society." },
  // Systems builders
  { slug: "policy-government", role: "Policy and Government", award: "Policy and Government Startup Initiative Champion of the Year", constituency: "systems-builders",
    contribution: "You make it easier to start, grow and scale a company.",
    offer: "Practitioner input on policy design, peer exchange between governments, and implementation evidence." },
  { slug: "research-measurement", role: "Measurement, Research and Impact", award: "Ecosystem Measurement, Research and Impact Champion of the Year", constituency: "systems-builders",
    contribution: "You make the ecosystem visible, accountable and evidence-based.",
    offer: "Access to Registry data under a data-sharing agreement, co-authorship of the State of the Field, and a research Circle." },
  { slug: "dei", role: "Diversity, Equity and Inclusion", award: "Ecosystem Diversity, Equity and Inclusion Champion of the Year", constituency: "systems-builders",
    contribution: "You address the structural inequalities that hold the whole field back.",
    offer: "Inclusion as a standard across Academy certification and Field Lab projects, and a platform for evidence of what works." },
  { slug: "infrastructure-shared-systems", role: "Infrastructure and Shared Systems", award: "Startup Ecosystem Infrastructure and Shared Systems Champion of the Year", constituency: "systems-builders",
    contribution: "You build the digital, data, financial and institutional rails many actors run on.",
    offer: "Adoption by member institutions, interoperability work in the Field Lab, and recognition as field infrastructure." },
  { slug: "university", role: "University Innovation and Entrepreneurship", award: "University Innovation and Entrepreneurship Champion of the Year", constituency: "systems-builders",
    contribution: "You turn knowledge, research and talent into entrepreneurial action.",
    offer: "Academic partnership on the Academy, student builder pathways, and links to hubs and investors." },
];

export const rolesFor = (c: ConstituencySlug) => roles.filter((r) => r.constituency === c);
export const constituencyBySlug = (s: string) => constituencies.find((c) => c.slug === s);
export const roleBySlug = (s: string) => roles.find((r) => r.slug === s);
