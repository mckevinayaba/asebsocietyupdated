// The four pillars of ASEB Society. Status labels are honest: Live, Launching, Planned.

export type Pillar = {
  slug: string;
  n: string;
  name: string;
  role: string;
  line: string;
  body: string;
  programmes: { name: string; detail: string; status: "Live" | "Launching" | "Planned" }[];
};

export const pillars: Pillar[] = [
  {
    slug: "circles",
    n: "01",
    name: "ASEB Circles",
    role: "Continuity",
    line: "Peer practice across borders, through the whole year.",
    body:
      "Peer connection is professional infrastructure. The Circles agenda brings shared challenges, exchanged methods and cross-border relationships into a continuing community for the people behind entrepreneurship.",
    programmes: [
      { name: "Open Circles", detail: "A community direction connecting practitioners by region, language and ecosystem condition.", status: "Launching" },
      { name: "Practice Circles", detail: "Facilitated peer exchange designed around shared professional challenges.", status: "Planned" },
      { name: "Country Circles", detail: "A local community direction shaped with country partners and practitioner priorities.", status: "Planned" },
      { name: "ASEB Voices", detail: "A practitioner-led conversation format for exchanging experience and field perspectives.", status: "Launching" },
      { name: "Builder Wellbeing Circles", detail: "A community direction focused on the wellbeing of people supporting entrepreneurs.", status: "Planned" },
    ],
  },
  {
    slug: "academy",
    n: "02",
    name: "ASEB Academy",
    role: "Professionalisation",
    line: "Learning and professional development, designed around practitioner needs.",
    body:
      "Professional learning connects experience with stronger methods. The Academy agenda centres on practitioner development, shared frameworks and standards grounded in the realities of African entrepreneurship ecosystems.",
    programmes: [
      { name: "ASEB Foundations", detail: "Foundation learning direction: understanding ecosystem conditions and connecting them to everyday practice.", status: "Planned" },
      { name: "Practitioner Programme", detail: "Applied practitioner development centred on programme design, methods and reflective practice.", status: "Planned" },
      { name: "ASEB Fellowship", detail: "An advanced development direction for experienced practitioners contributing to the field.", status: "Planned" },
      { name: "Mentor Corps", detail: "A mentoring direction connecting experienced practitioners with emerging ecosystem builders.", status: "Planned" },
      { name: "Builder Apprenticeship", detail: "A practice-based learning direction developed around host institutions and real ecosystem work.", status: "Planned" },
    ],
  },
  {
    slug: "field-lab",
    n: "03",
    name: "ASEB Field Lab",
    role: "Systems work",
    line: "Collaborative projects on the structural problems no single institution can solve.",
    body:
      "Field Lab is where the field works on itself. Projects are documented from the first day, tagged to a condition and closed with an output that stays in the public record: a diagnostic, a standard, a brief or a playbook.",
    programmes: [
      { name: "Ecosystem Stage Diagnostic", detail: "A research direction examining the seven ecosystem conditions in a city or country.", status: "Planned" },
      { name: "ASEB Hub Standard", detail: "A standards-development direction for self-assessment and peer learning in support institutions.", status: "Planned" },
      { name: "Policy Bridge", detail: "A policy collaboration direction bringing practitioner experience into startup legislation and reform.", status: "Planned" },
      { name: "Fair Work Benchmark", detail: "A research direction on working conditions and sustainable livelihoods across the field.", status: "Planned" },
      { name: "State of African Ecosystem Building", detail: "A research agenda documenting African ecosystem-building practice and conditions.", status: "Planned" },
    ],
  },
  {
    slug: "summit",
    n: "04",
    name: "ASEB Summit and Awards",
    role: "Signal and recognition",
    line: "The continent's annual recognition of ecosystem building.",
    body:
      "Since 2022 the Summit and Awards have documented the field across five editions and more than 50 countries. Every finalist enters the Field Registry, and every Champion is invited into the Society's recognition pathway.",
    programmes: [
      { name: "The Awards", detail: "28 roles across four parts of the field, peer-reviewed against eight domains.", status: "Live" },
      { name: "The Summit", detail: "Three days of evidence, practice and field visits. Fifth edition held in Johannesburg, October 2026.", status: "Live" },
      { name: "Honour Roll", detail: "Every recognised practitioner and institution, from 2023 onward, in the Field Registry.", status: "Live" },
      { name: "Regional rounds", detail: "A regional engagement direction connecting local practice with continental recognition.", status: "Planned" },
      { name: "Builders' Assembly", detail: "A member-engagement direction for shaping shared priorities and practice standards.", status: "Planned" },
    ],
  },
];
