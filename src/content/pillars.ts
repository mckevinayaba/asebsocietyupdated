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
      "A year-round professional space where ecosystem builders exchange practice and reduce isolation. Circles are organised by region, language, country and condition, with closed Practice Circles for practitioners who want a facilitated peer group over twelve months.",
    programmes: [
      { name: "Open Circles", detail: "Regional, language and condition Circles open to every Member.", status: "Launching" },
      { name: "Practice Circles", detail: "8 to 12 Verified practitioners, closed cohort, 12 months, facilitated.", status: "Planned" },
      { name: "Country Circles", detail: "Hosted by Country Stewards and linked to each country page.", status: "Planned" },
      { name: "ASEB Voices", detail: "Monthly practitioner-led conversations, published with audio and a written summary.", status: "Launching" },
      { name: "Builder Wellbeing Circles", detail: "Confidential and facilitated. Nothing indexed, nothing shared.", status: "Planned" },
    ],
  },
  {
    slug: "academy",
    n: "02",
    name: "ASEB Academy",
    role: "Professionalisation",
    line: "Standards, learning and certification, designed by practitioners for practitioners.",
    body:
      "The Academy turns experience into a recognised standard. Its curriculum follows eight competency domains and leads from a free foundation course to the Professional Ecosystem Builder designation and the ASEB Fellowship.",
    programmes: [
      { name: "ASEB Foundations", detail: "Free. Six modules, audio and text, in four languages. Leads to Associate Ecosystem Builder.", status: "Launching" },
      { name: "Practitioner Programme", detail: "Twelve-week cohort with a capstone reviewed by faculty. Leads to Professional Ecosystem Builder.", status: "Planned" },
      { name: "ASEB Fellowship", detail: "Twelve months, 12 to 20 Fellows a year, each leading a Field Lab project.", status: "Planned" },
      { name: "Mentor Corps", detail: "Matched mentoring. Hours count towards continuing practice.", status: "Planned" },
      { name: "Builder Apprenticeship", detail: "Six-month paid placements with host institutions.", status: "Planned" },
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
      { name: "Ecosystem Stage Diagnostic", detail: "A score on each of the seven conditions for a city or country, led by its Steward.", status: "Planned" },
      { name: "ASEB Hub Standard", detail: "Self-assessment and peer review for hubs and support organisations.", status: "Planned" },
      { name: "Policy Bridge", detail: "Practitioner input into startup acts and policy reform, with a brief per cohort.", status: "Planned" },
      { name: "Fair Work Benchmark", detail: "An annual, anonymous survey of pay and conditions across the field.", status: "Planned" },
      { name: "State of African Ecosystem Building", detail: "An annual report produced with the Society's Knowledge Partners.", status: "Planned" },
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
      { name: "Regional rounds", detail: "North, West, Central, East and Southern rounds feeding the continental finals.", status: "Planned" },
      { name: "Builders' Assembly", detail: "Members vote on the ASEB Agenda and on standards, in person or remotely.", status: "Planned" },
    ],
  },
];
