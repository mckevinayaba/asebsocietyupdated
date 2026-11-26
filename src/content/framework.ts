// The seven conditions of the ASEB Society Framework, aligned with the dimensions of the
// Africa Entrepreneurial Ecosystem Index (AEEI). Measure with the AEEI names,
// practise with the ASEB Society Framework's conditions.

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
    means: "The work itself: the methods, knowledge, competencies, judgement, evidence and tools used to improve entrepreneurial ecosystem conditions.",
    builds: "The ASEB Society Framework, shared methods developed and tested with practitioners, Field Lab investigations, the Playbook and State of the Field, each respecting African contextual differences.",
    shows: "Academy, Field Lab, the Playbook, Evidence Library",
  },
  {
    term: "Profession",
    means: "The people doing that work: their professional identity, recognition, development, ethical responsibilities, credibility, peer support and continuity. No ecosystem builder should have to start from zero every time a programme ends or an employer changes.",
    builds: "Professional profiles, peer communities in ASEB Circles, the Field Registry and recognition through the Summit & Awards. Formal professional pathways are a future proposal that would need consultation and institutional approval.",
    shows: "Join, profiles, Circles, Summit and Awards",
  },
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
