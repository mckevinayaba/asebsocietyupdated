// The seven conditions of the ASEB Framework, aligned with the dimensions of the
// Africa Entrepreneurial Ecosystem Index (AEEI). Measure with the AEEI names,
// practise with ASEB's conditions.

export type Condition = {
  n: string;
  name: string;
  aeei: string;
  fit: "Direct" | "Partial";
  summary: string;
  practice: string;
};

export const conditions: Condition[] = [
  {
    n: "01",
    name: "Capital Formation and Access",
    aeei: "Finance",
    fit: "Direct",
    summary: "Whether founders can reach the right capital, at the right stage, on terms they can survive.",
    practice: "Angel networks, investment readiness, blended and local capital, funder coordination.",
  },
  {
    n: "02",
    name: "Policy and Regulatory Environments",
    aeei: "Governance",
    fit: "Direct",
    summary: "Whether the rules make it easier, or harder, to start, grow and scale a company.",
    practice: "Startup acts, regulatory sandboxes, public procurement reform, practitioner input into policy.",
  },
  {
    n: "03",
    name: "Talent and Capability Development",
    aeei: "Human Capital",
    fit: "Direct",
    summary: "Whether founders, operators and builders can acquire the skills the next stage demands.",
    practice: "Entrepreneurship education, mentoring and coaching standards, builder apprenticeships.",
  },
  {
    n: "04",
    name: "Market Access and Procurement Pathways",
    aeei: "Market Access",
    fit: "Direct",
    summary: "Whether founders can find customers, enter supply chains and cross borders.",
    practice: "Corporate collaboration, cross-border programmes, AfCFTA-oriented market entry.",
  },
  {
    n: "05",
    name: "Trust, Coordination and Data",
    aeei: "Support",
    fit: "Partial",
    summary: "Whether the actors in an ecosystem know each other, refer to each other and share what they learn.",
    practice: "Hub and ESO networks, referral standards, shared outcome data, convenings.",
  },
  {
    n: "06",
    name: "Narrative, Distribution and Visibility",
    aeei: "Culture",
    fit: "Partial",
    summary: "Whether the work of founders and builders is seen, documented and told by Africans.",
    practice: "Ecosystem media, documentation, recognition, the public record of the field.",
  },
  {
    n: "07",
    name: "Environmental and Contextual Constraints",
    aeei: "Infrastructure",
    fit: "Partial",
    summary: "Whether energy, connectivity, logistics and shocks leave room for a company to operate.",
    practice: "Shared digital and physical infrastructure, resilience planning, founder wellbeing.",
  },
];

export const practiceProfession = [
  {
    term: "Practice",
    means: "The work of ecosystem building: its methods, standards, evidence and the seven conditions it strengthens.",
    builds: "The ASEB Framework, practice standards, Field Lab projects, the State of the Field.",
    shows: "Academy, Field Lab, Evidence Library",
  },
  {
    term: "Profession",
    means: "The people and institutions who do that work, and the recognition, pathway and home they hold.",
    builds: "The designations from Member to ASEB Fellow, certification, ASEB Circles, the Field Registry, the Awards.",
    shows: "Join, profiles, Circles, Summit and Awards",
  },
];

export const ladder = [
  { step: "01", name: "Member", how: "Join the Society, choose your role in the field and sign the Code of Practice." },
  { step: "02", name: "Verified", how: "Your record of practice is checked against public evidence or a peer reference." },
  { step: "03", name: "Associate Ecosystem Builder", how: "Complete ASEB Foundations and begin a logged record of continuing practice." },
  { step: "04", name: "Professional Ecosystem Builder", how: "Complete the Practitioner Programme and a capstone reviewed by faculty." },
  { step: "05", name: "ASEB Fellow", how: "Nominated, reviewed by the Leadership Council, and leading work in the Field Lab." },
];

export const domains = [
  "Ecosystem diagnosis and mapping",
  "Convening and trust-building",
  "Programme design for founders and informal enterprises",
  "Capital mobilisation",
  "Policy engagement and public-private partnership",
  "Measurement and evidence",
  "Inclusion",
  "Ethics, stewardship and self-sustainability",
];
