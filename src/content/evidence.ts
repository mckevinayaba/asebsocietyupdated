// The ASEB Evidence Library: open research on African ecosystems, summarised for practitioners.
// Free licensing covers the data and publications. It does not cover logos, partner claims
// or endorsement of ASEB's interpretations; those need written agreement.

export type EvidenceItem = {
  kind: "Dataset" | "Dashboard" | "Paper" | "Research programme" | "Resource" | "Summit session";
  title: string;
  authors: string;
  year: string;
  licence?: string;
  summary: string;
  forPractice: string;
  href: string;
  conditions: string[];
};

export const aeeiCredit =
  "Data: Africa Entrepreneurial Ecosystem Index, Stam, Nkontwana et al., Utrecht University, AGCAE Stellenbosch University and i4Policy, CC BY 4.0.";

export const evidence: EvidenceItem[] = [
  {
    kind: "Dataset",
    title: "Africa Entrepreneurial Ecosystem Index (AEEI) dataset",
    authors: "Stam, Nkontwana et al. Utrecht University, AGCAE Stellenbosch University, i4Policy",
    year: "2026",
    licence: "CC BY 4.0",
    summary:
      "Seven dimensions of ecosystem quality measured through 21 indicators across African countries: governance, culture, infrastructure, support, finance, human capital and market access.",
    forPractice:
      "Before designing a programme, read the condition profile of the country you work in. Build where the gap is, not where the funding is easiest.",
    href: "https://data.mendeley.com/datasets/bkgpx2765s/1",
    conditions: ["All seven"],
  },
  {
    kind: "Dashboard",
    title: "AEEI interactive dashboard",
    authors: "i4Policy",
    year: "2026",
    summary: "An open, interactive view of the index, country by country and dimension by dimension.",
    forPractice: "Use it in funder conversations to show which condition your work strengthens, and how that condition compares across the region.",
    href: "https://africa.ecosystem.build/",
    conditions: ["All seven"],
  },
  {
    kind: "Paper",
    title: "Measuring national entrepreneurial ecosystems in Africa",
    authors: "AGCAE, Utrecht University and partners. World Development",
    year: "2026",
    licence: "Open access",
    summary:
      "The peer-reviewed basis of the index. Its central finding is that ecosystem quality explains new firm creation and high-growth firms better than GDP per capita.",
    forPractice: "The quality of the system, not the size of the economy, decides how many productive firms emerge. That is the case for ecosystem building as a practice.",
    href: "https://agcae.africa/publication/measuring-national-entrepreneurial-ecosystems-in-africa/",
    conditions: ["All seven"],
  },
  {
    kind: "Research programme",
    title: "Entrepreneurship-led sustainable development in Africa",
    authors: "Centre for Global Challenges, Utrecht University",
    year: "Ongoing",
    summary: "The research programme behind the AEEI partnership between Utrecht University, AGCAE and i4Policy.",
    forPractice: "A reference point for researchers and Systems Builders who want to align local measurement with a continental method.",
    href: "https://www.uu.nl/en/organisation/centre-for-global-challenges/research/entrepreneurship-led-sustainable-development-in-africa",
    conditions: ["Trust, Coordination and Data"],
  },
  {
    kind: "Resource",
    title: "ecosystem.build: policy and diagnostic resources",
    authors: "i4Policy",
    year: "Ongoing",
    summary: "Materials on startup acts, participatory policy-making and ecosystem diagnostics.",
    forPractice: "For Policy and Government builders: start from what other countries have legislated, and the process they used to get there.",
    href: "https://www.ecosystem.build/blog/",
    conditions: ["Policy and Regulatory Environments"],
  },
  {
    kind: "Summit session",
    title: "From Ecosystem Language to Ecosystem Evidence",
    authors: "Professor Erik Stam, Utrecht University. ASEB Summit 2026, Day Two",
    year: "2026",
    summary: "What it really takes to build an entrepreneurial ecosystem, and how to tell the difference between activity and progress.",
    forPractice: "Every claim about an ecosystem should be backed by evidence. Recording and slides to be added to the library.",
    href: "https://www.asebs.com/speakers",
    conditions: ["All seven"],
  },
  {
    kind: "Summit session",
    title: "Africa Entrepreneurial Ecosystem Index: From Evidence to Institutional Action",
    authors: "Prof Erik Stam, Dr Phumlani Nkontwana and i4Policy. ASEB Summit 2026, Day Two",
    year: "2026",
    summary: "How the index can move from a research output into the decisions of governments, funders and support institutions.",
    forPractice: "Read alongside the dashboard demonstration by Lincoln Njogu of i4Policy. Recording to be added.",
    href: "https://www.asebs.com/speakers",
    conditions: ["Policy and Regulatory Environments", "Trust, Coordination and Data"],
  },
];
