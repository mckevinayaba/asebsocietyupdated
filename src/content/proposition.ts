// The founding proposition of ASEB Society, from the Founding Organisational Profile 2026/2027.
// Public copy only. The profile's confidential landscape analysis never enters the platform:
// the public narrative stands on the Society's own founding purpose and never names, compares
// with or cites the closure of another organisation. See docs/INSTITUTIONAL_BLUEPRINT.md.

export const fieldProposition = "Building the field behind the ecosystem.";

// The three complementary levels of intervention. The Society's distinctive focus is the third.
export const levels = [
  {
    key: "entrepreneurship",
    name: "Entrepreneurship development",
    builds: "Building entrepreneurs.",
    line: "Strengthening the capabilities, opportunities and sustainability of individual enterprises.",
    who: "Founders, and the programmes that work with them directly.",
  },
  {
    key: "ecosystem",
    name: "Ecosystem development",
    builds: "Building entrepreneurial ecosystems.",
    line: "Strengthening the relationships, institutions, resources and conditions that enable entrepreneurs to succeed.",
    who: "Hubs, funders, agencies, universities, policymakers and the institutions around founders.",
  },
  {
    key: "field",
    name: "Professional field development",
    builds: "Building the field of ecosystem building.",
    line: "Strengthening the professional knowledge, competencies, identity, continuity, ethical principles and collective infrastructure of the people responsible for ecosystem development.",
    who: "Ecosystem builders themselves, across every role, country and employer. This is where ASEB Society works.",
  },
] as const;

// The human experience behind ecosystem building. An illustrative professional situation, never a
// documented case, never attributed to anyone in a photograph.
export const continuity = {
  title: "The field should not have to start from zero every time.",
  opening:
    "Across Africa, ecosystem builders spend years developing relationships, strengthening institutions, opening doors for entrepreneurs and discovering what works in their communities. Their contribution is usually visible through the success of others, while the work that made those achievements possible stays largely unseen.",
  situation:
    "Consider a practitioner who has spent years earning the trust of entrepreneurs, building partnerships and learning how to navigate the realities of a local ecosystem.",
  breaks: ["A grant ends.", "A programme concludes.", "An institution changes leadership.", "Experienced practitioners move on."],
  question: "What remains of the knowledge, the relationships and the professional experience that work produced?",
  consequence: "The next practitioner may inherit the same challenges without inheriting the knowledge of those who came before.",
  response:
    "ASEB Society exists to help change that, by building the professional infrastructure through which ecosystem builders can preserve knowledge, strengthen their capabilities, sustain meaningful relationships and advance the quality of their work.",
  label: "An illustrative professional situation, not a documented case.",
};

// Not every activity builds an ecosystem. The activity is not the outcome. Each example links to a
// functioning destination where the practice can be taken further.
export const activities = [
  { key: "conference", name: "Organising a conference", activity: "Convening.", contribution: "Useful relationships, referrals, collaboration and commitments that continue after the room empties.", next: { label: "Ask how others follow through", to: "/ask" } },
  { key: "hub", name: "Establishing an innovation hub", activity: "Creating a facility or support institution.", contribution: "Better access to relevant knowledge, resources, relationships and opportunities for the entrepreneurs it serves.", next: { label: "Read the ASEB Society Framework", to: "/framework" } },
  { key: "accelerator", name: "Delivering an accelerator programme", activity: "Providing structured enterprise support.", contribution: "Stronger support capabilities, and relationships that stay valuable after the cohort graduates.", next: { label: "Shape the ASEB Academy", to: "/learning" } },
  { key: "research", name: "Publishing research", activity: "Producing knowledge.", contribution: "Better professional practice, institutional decisions and policy, built on credible evidence.", next: { label: "Propose a Field Lab collaboration", to: "/field-lab" } },
  { key: "partnership", name: "Signing a partnership agreement", activity: "Establishing an agreement.", contribution: "Complementary capabilities combined to deliver meaningful and accountable outcomes.", next: { label: "Contribute to the Playbook", to: "/playbook" } },
] as const;

// Why a permanent professional institution. The structural risks the field carries.
export const continuityRisks = [
  "Knowledge fragmentation",
  "Institutional discontinuity",
  "Unclear professional pathways",
  "Inconsistent approaches to practice",
  "Fragmented professional relationships",
  "Limited institutional memory",
  "Dependence on individual goodwill",
  "Practitioner burnout",
  "Inadequate recognition",
  "Uneven access to professional learning",
];

// Additionality before expansion.
export const additionality = [
  "Who is already doing this work?",
  "What important need remains unmet?",
  "Can ASEB Society contribute meaningful additional value?",
  "Would collaboration, knowledge curation or referral serve the field better than a new service?",
];

// Beyond the annual gathering: the proposed institutional cycle.
export const annualCycle = [
  { key: "listen", name: "Listen", line: "Understand practitioner priorities, founder experiences and emerging ecosystem challenges.", through: "ASEB Circles, The Field, Ask the Village" },
  { key: "develop", name: "Develop", line: "Build collective knowledge, professional capabilities, evidence and practical approaches.", through: "ASEB Academy, ASEB Field Lab, the Playbook, State of the Field" },
  { key: "convene", name: "Convene", line: "Bring the field together through the Summit & Awards to share knowledge, examine challenges, recognise contributions and agree commitments.", through: "ASEB Summit & Awards" },
  { key: "follow", name: "Follow through", line: "Support continued relationships, collaborative action, accountability and collective learning.", through: "ASEB Voices, ASEB Circles, The Field" },
] as const;

export const cycleStatement = "The Summit brings the field together. The Society sustains the work throughout the year.";

export const summitSocietyRelationship =
  "ASEB Society provides the permanent institutional infrastructure through which the relationships, knowledge, recognition and collective ambitions generated by the Summit can continue to develop throughout the year.";

// Distinct forms of standing on the platform. None confers another, and none is accreditation.
export const standing = [
  { name: "Registered participant", line: "Holds an account. Can read, save, follow and contribute for review.", status: "Operational" },
  { name: "Membership applicant", line: "Has applied for membership. The application waits for Secretariat review.", status: "Operational" },
  { name: "Approved member", line: "Membership approved by the Society under an authorised process.", status: "Subject to institutional approval" },
  { name: "Contributor", line: "Has had a contribution reviewed and published with consent.", status: "Operational" },
  { name: "Recognised ecosystem builder", line: "Recognised through the ASEB Summit & Awards and listed in the Field Registry.", status: "Operational" },
  { name: "Verified practitioner", line: "A record of practice checked against evidence or peer reference.", status: "Planned" },
  { name: "Accredited professional", line: "A possible future pathway. It would require consultation, assessment standards and appropriate authorisation. No accreditation, certification or designation is offered today.", status: "Subject to institutional approval" },
] as const;

// What each knowledge product helps the field overcome.
export const productProblems = {
  field: "Practitioners mostly work in isolation, so useful updates, opportunities and relationships rarely travel beyond a single network.",
  playbook: "Hard-won knowledge stays in project reports and individual memories, so the field keeps relearning what it already knew.",
  voices: "The people and institutions behind African ecosystems are rarely documented in their own words, and failures are almost never recorded.",
  ask: "Practitioners face problems that someone elsewhere on the continent has already solved, with no easy way to find them.",
  state: "Claims about ecosystems often rest on activity counts rather than evidence, and the evidence that exists is scattered.",
} as const;

// Contribution campaigns. Prompts for practitioners, not quotations from anyone.
export const campaigns = [
  { prompt: "What do you know today that you wish someone had taught you when you started?", to: "/contribute?kind=playbook_contribution", label: "Contribute to the Playbook" },
  { prompt: "What happens to professional knowledge when a programme ends?", to: "/contribute?kind=voice", label: "Share it in ASEB Voices" },
  { prompt: "What has building your ecosystem taught you about institutional sustainability?", to: "/contribute?kind=voice", label: "Share it in ASEB Voices" },
  { prompt: "What distinguishes meaningful ecosystem development from isolated activity?", to: "/contribute?kind=playbook_contribution", label: "Contribute to the Playbook" },
  { prompt: "What challenge are you facing that someone elsewhere in Africa might already have solved?", to: "/contribute?kind=question", label: "Ask the Village" },
  { prompt: "What support actually made a difference to your entrepreneurial journey?", to: "/contribute?kind=voice", label: "Share it in Founders' Voices" },
] as const;

// How the Society's effectiveness should eventually be assessed. Intended measures, not results.
export const intendedMeasures = [
  "Improvements in professional capabilities",
  "Useful shared knowledge",
  "Reviewed practitioner contributions",
  "Sustained professional relationships",
  "Improved institutional coordination",
  "Practical application of professional methods",
  "Preservation of institutional memory",
  "Constructive founder feedback",
  "Meaningful country network participation",
  "Sustainable institutional operations",
];
