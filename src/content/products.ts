// The five digital knowledge products. They are not institutional pillars. They support the four
// mandates (Summit & Awards, Circles, Academy, Field Lab) with shared content, identity and review.

export type ProductKey = "field" | "playbook" | "voices" | "ask" | "state";

export const products: Record<ProductKey, { name: string; line: string; description: string; path: string }> = {
  field: { name: "The Field", line: "Africa's ecosystem building community.", description: "The everyday professional home for people building entrepreneurship support across Africa.", path: "/the-field" },
  playbook: { name: "The African Ecosystem Building Playbook", line: "A book Africa writes together.", description: "A living, collaborative professional publication on how African ecosystems are built.", path: "/playbook" },
  voices: { name: "ASEB Voices", line: "Every ecosystem has a story. Every voice matters.", description: "The editorial home for the people, institutions, failures and lessons behind African entrepreneurship.", path: "/voices" },
  ask: { name: "Ask the Village", line: "No one has all the answers.", description: "Practical questions from ecosystem builders, answered from experience.", path: "/ask" },
  state: { name: "State of the Field", line: "Understanding the ecosystems we are building.", description: "Evidence and ecosystem intelligence, with sources, methods and coverage stated.", path: "/state-of-the-field" },
};

export const tagline = "It Takes a Village.";
export const villageLine = "One village. Many voices. Shared responsibility.";

// ASEB Voices categories. The database is the source of truth once migration 0007 is applied.
// This list mirrors the migration seed and is shown before then.
export const voicesCategories = [
  { key: "builders", name: "Builders' Voices", description: "The people who design and run entrepreneurship support, in their own words." },
  { key: "founders", name: "Founders' Voices", description: "Founders on the support systems that shaped their journeys: what worked, what did not, and who made a difference." },
  { key: "institutional", name: "Institutional Voices", description: "Hubs, agencies and support organisations reflecting on their practice." },
  { key: "research", name: "Research Voices", description: "Researchers translating evidence for practitioners." },
  { key: "policy", name: "Policy Voices", description: "Policymakers and advocates on the rules that shape enterprise." },
  { key: "community", name: "Community Voices", description: "Township, rural, informal and community economies." },
  { key: "capital", name: "Capital Voices", description: "Investors and financiers on building capital that fits African enterprise." },
  { key: "diaspora", name: "Diaspora Voices", description: "Africans abroad and international supporters building bridges." },
  { key: "uncomfortable-truth", name: "The Uncomfortable Truth", description: "Failures, mistakes and lessons the field cannot afford to lose." },
] as const;

export const founderTopics = [
  "How ecosystem builders contributed to your journey",
  "Innovation hubs and accelerators",
  "Access to relevant finance",
  "Access to customers and markets",
  "Mentorship",
  "Policy and regulation",
  "Support you needed but could not find",
  "What worked, what did not, and what could improve",
  "Recognising the practitioners and institutions who helped",
];

// Playbook chapters, mirroring the migration seed. Proposed editorial topics, not standards.
export const playbookChapters = [
  { slug: "why-entrepreneurship-matters", title: "Why entrepreneurship matters to Africa", call: "How has enterprise changed the economy, community or household you know best?" },
  { slug: "understanding-ecosystems", title: "Understanding African entrepreneurial ecosystems", call: "Describe the ecosystem you work in: who is in it, who is missing, and how they connect." },
  { slug: "it-takes-a-village", title: "It Takes a Village: interdependence", call: "Share a moment when collaboration between institutions made something possible that none could do alone." },
  { slug: "who-are-ecosystem-builders", title: "Who are ecosystem builders?", call: "What does your work as an ecosystem builder actually involve, day to day?" },
  { slug: "practice-and-profession", title: "Building a practice and advancing a profession", call: "What would make ecosystem building a recognised profession in your country?" },
  { slug: "local-conditions", title: "Understanding local ecosystem conditions", call: "How do you diagnose the conditions entrepreneurs face where you work?" },
  { slug: "trust-and-coordination", title: "Trust and institutional coordination", call: "Where has trust between institutions been built, or broken, and why?" },
  { slug: "informal-rural-emerging", title: "Informal, rural and emerging enterprise", call: "What support works for informal, rural and township enterprises?" },
  { slug: "capital-markets-infrastructure-policy", title: "Capital, markets, infrastructure and policy", call: "Which barrier in capital, markets, infrastructure or policy matters most where you work?" },
  { slug: "inclusion-and-geography", title: "Inclusion and geographic realities", call: "Who is left out of entrepreneurship support in your context, and what has helped include them?" },
  { slug: "sustainability-and-wellbeing", title: "Institutional sustainability and practitioner wellbeing", call: "How do support institutions and the people in them last beyond one funding cycle?" },
  { slug: "measuring-development", title: "Measuring ecosystem development", call: "How do you know your ecosystem is getting stronger? What do you measure?" },
  { slug: "stories-and-cases", title: "African ecosystem building stories and cases", call: "Share a documented case, including what did not work." },
  { slug: "tools-and-methods", title: "Professional tools and methods", call: "Which tool, method or template do you rely on, and how do you use it?" },
];

export const participationPaths = [
  { key: "builder", label: "I build entrepreneurial ecosystems" },
  { key: "founder", label: "I am a founder or entrepreneur" },
  { key: "institution", label: "I represent an institution" },
  { key: "research", label: "I conduct research or teach" },
  { key: "finance", label: "I provide finance or institutional support" },
  { key: "policy", label: "I influence policy" },
  { key: "expertise", label: "I want to contribute expertise to Africa" },
  { key: "aspiring", label: "I want to learn how to become an ecosystem builder" },
  { key: "connect", label: "I want to connect with African entrepreneurial ecosystems" },
] as const;

export const waysToContribute = ["Funding", "Research", "Technical expertise", "Professional knowledge", "Mentorship", "Technology", "Translation", "Institutional resources", "Introductions", "Media support", "Partnerships", "Country representation"];

// The economics of interdependence. One argument among others, never the only explanation.
export const interdependence = [
  "Our communities need thriving economies.",
  "Our economies need productive enterprises.",
  "Our enterprises need enabling ecosystems.",
  "Our ecosystems need capable builders.",
  "Our builders need a recognised and supported profession.",
];

export const communityGuidelinesSummary = [
  "Write from your own experience, and say when something is your view rather than evidence.",
  "Respect people's privacy. Do not name private individuals or share confidential information without permission.",
  "Disagree with ideas, not people. Harassment and personal attacks are removed.",
  "Serious allegations about people or institutions go to the editors for review, not into a public post.",
  "No advertising or fundraising appeals outside the Opportunities format.",
  "Report anything that breaks these guidelines. Moderators review every report.",
];
