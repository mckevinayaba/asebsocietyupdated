// Institutional statements and site-wide copy.
// Voice rules: name the practice, speak for the field, address people by role,
// precision over praise, every number carries a source and a year. British spelling.

export const statements = {
  hero: "Building the practice. Advancing the profession.",
  heroLede:
    "ASEB Society advances startup ecosystem building across Africa as a defined practice and a recognised profession. We equip, connect and recognise the people and institutions who build the conditions for founders to start, grow and scale.",
  short: "The professional home for the practice of ecosystem building in Africa.",
  mission:
    "To advance startup ecosystem building across Africa as a defined practice, with shared methods, standards and evidence, and as a recognised profession, with pathways, credentials and a professional home for those who do the work.",
  vision:
    "Every African founder, in every one of the 54 countries, starts inside an ecosystem that works, built and sustained by practitioners who are equipped, connected and valued.",
  definition:
    "Ecosystem building is the deliberate, long-term work of strengthening the conditions under which entrepreneurs start, grow and scale. It is done by individuals and institutions across every sector, often without a title, a budget or a peer group.",
  whoBuilds:
    "Ecosystem builders are the mentors, coaches and angel investors; the hubs, incubators, accelerators and coworking spaces; the funders, corporates and investment networks; the policymakers, researchers, universities and infrastructure builders whose work makes founders possible. Some hold the title. Most do not. ASEB Society exists for all of them.",
  whatWeDo:
    "We work at the level of the field. We connect practitioners across borders, set and certify standards of practice, solve shared structural problems through collaborative projects, and recognise excellence in front of the continent.",
  indexLine: "The index measures the conditions. ASEB Society equips the people who change them.",
  recognitionLine: "Recognition is not a trophy. It is infrastructure.",
};

export type NavGroup = { label: string; to: string; items: { label: string; to: string; note: string }[] };

// Intent-led navigation preserves all existing public destinations.
export const nav: NavGroup[] = [
  { label: "Start Here", to: "/", items: [
    { label: "Find Your Place", to: "/#find-your-place", note: "A pathway for the work you do" },
    { label: "Why ASEB Society", to: "/why-aseb", note: "A professional home, beyond the annual Summit" },
    { label: "Join the Society", to: "/join", note: "Apply as a practitioner or organisation" },
    { label: "Get Involved", to: "/get-involved", note: "Find a practical way to contribute" },
  ] },
  { label: "Find People and Organisations", to: "/registry", items: [
    { label: "Field Registry", to: "/registry", note: "Search public Awards archive records" },
    { label: "Discover Your Role", to: "/field", note: "See how your work strengthens entrepreneurship" },
    { label: "Propose a Record", to: "/registry/submit", note: "Submit work and evidence for review" },
  ] },
  { label: "Communities", to: "/communities", items: [
    { label: "ASEB Circles", to: "/communities", note: "Peer communities and their current readiness" },
    { label: "Country Partners", to: "/country-partners", note: "Express interest in local partnership" },
    { label: "Ambassadors", to: "/ambassadors", note: "Explore representing the field where you work" },
  ] },
  { label: "Learn and Grow", to: "/learning", items: [
    { label: "Learning and Academy", to: "/learning", note: "Resources today; programmes in development" },
    { label: "The Framework", to: "/framework", note: "Understand the conditions entrepreneurs need" },
    { label: "What We Build", to: "/what-we-build", note: "Four ways to support ecosystem builders" },
  ] },
  { label: "Work Together", to: "/collaborate", items: [
    { label: "ASEB Field Lab", to: "/field-lab", note: "Shared challenges, proposed collaborations" },
    { label: "Programme Collaborations", to: "/collaborate", note: "Propose work with agreed outcomes" },
    { label: "Work With Us", to: "/work-with-us", note: "Discuss commissioning and delivery capacity" },
    { label: "Partners", to: "/partners", note: "Institutional partnership pathways" },
    { label: "Funders and DFIs", to: "/funders", note: "Support practitioner and ecosystem development" },
  ] },
  { label: "Knowledge and Evidence", to: "/evidence", items: [
    { label: "Evidence Library", to: "/evidence", note: "Research to strengthen your practice" },
    { label: "Insights", to: "/insights", note: "Field perspectives and editorial contributions" },
    { label: "Green and Climate Economy", to: "/climate", note: "Build the ecosystems climate ventures need" },
    { label: "The 17 SDGs", to: "/sdgs", note: "Entrepreneurship ecosystem building and public benefit" },
  ] },
  { label: "Summit and Awards", to: "/summit", items: [] },
  { label: "About and Accountability", to: "/about/story", items: [
    { label: "Our Story", to: "/about/story", note: "From annual recognition to a continuing institution" },
    { label: "Our Progress", to: "/progress", note: "What is available, launching and planned" },
    { label: "People", to: "/people", note: "Founder, executive team and board" },
    { label: "Governance and Goals", to: "/governance", note: "Responsibility, standards and public benefit" },
  ] },
];

export const footerNav = [
  { heading: "The Society", links: [
    { label: "Our Story", to: "/about/story" },
    { label: "Why ASEB", to: "/why-aseb" },
    { label: "People", to: "/people" },
    { label: "Governance and Goals", to: "/governance" },
    { label: "What We Build", to: "/what-we-build" },
    { label: "Our Progress", to: "/progress" },
    { label: "The Framework", to: "/framework" },
  ] },
  { heading: "The Field", links: [
    { label: "Practitioners", to: "/field/practitioners" },
    { label: "Support Institutions", to: "/field/support-institutions" },
    { label: "Capital and Market Builders", to: "/field/capital-market-builders" },
    { label: "Systems Builders", to: "/field/systems-builders" },
    { label: "Green and Climate Economy", to: "/climate" },
    { label: "The 17 SDGs", to: "/sdgs" },
    { label: "Field Registry", to: "/registry" },
  ] },
  { heading: "Partner", links: [
    { label: "Partners", to: "/partners" },
    { label: "Country Partners", to: "/country-partners" },
    { label: "Ambassadors", to: "/ambassadors" },
    { label: "Programme Collaborations", to: "/collaborate" },
    { label: "Funders and DFIs", to: "/funders" },
    { label: "Work With Us", to: "/work-with-us" },
  ] },
  { heading: "Take part", links: [
    { label: "Join the Society", to: "/join" },
    { label: "Get Involved", to: "/get-involved" },
    { label: "Summit and Awards", to: "/summit" },
    { label: "Insights", to: "/insights" },
    { label: "Evidence Library", to: "/evidence" },
    { label: "Contact", to: "/get-involved#contact" },
    { label: "Member app preview", to: "/app" },
  ] },
];

// Proof figures. Each one carries its year and its source.
export const proof = [
  { value: "1,786", label: "Nominations received", note: "ASEB 2026", href: "https://www.asebs.com" },
  { value: "52", label: "Countries represented", note: "ASEB 2026", href: "https://www.asebs.com" },
  { value: "145", label: "Finalists", note: "ASEB 2026", href: "https://www.asebs.com" },
  { value: "5", label: "Editions since 2022", note: "2022 to 2026", href: "https://www.asebs.com/story" },
];

export const timeline = [
  { year: "2022", city: "Johannesburg", line: "Where it began. A room for the people who build the rooms founders walk into." },
  { year: "2023", city: "Nairobi", line: "Recognition created retention. Builders came back, and brought others." },
  { year: "2024", city: "Accra", line: "The field asked what happens between summits." },
  { year: "2025", city: "Addis Ababa", line: "Scale met substance. The field continued shaping its ambition for a year-round professional home." },
  { year: "2026", city: "Johannesburg", line: "The homecoming. Fifth edition, 20 to 22 October: Who Built the Builder? ASEB Society was publicly launched on 21 October 2026." },
];

export const whyNow = [
  {
    figure: "$213bn to $140bn",
    label: "Projected fall in official development assistance. USAID closed on 1 July 2025.",
    source: "UNDP, 2026",
    href: "https://www.undp.org/sites/g/files/zskgke326/files/2026-04/how_a_1bn_undp_initiative_can_offset_a_60bn_aid_decline.pdf",
  },
  {
    figure: "$100m+",
    label: "USAID innovation funding Kenyan startups alone lost access to.",
    source: "TechCabal, 2025",
    href: "https://techcabal.com/2025/02/12/usaid-shutdown-affects-kenya/",
  },
  {
    figure: "Under 1%",
    label: "Africa's share of global venture funding.",
    source: "BusinessDay, 2026",
    href: "https://businessday.ng/technology/article/africas-startups-raise-2-2bn-in-2025-as-growth-outruns-europe-china-and-india/",
  },
];
