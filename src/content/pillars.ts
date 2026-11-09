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
      { name: "Country Circles", detail: "Hosted by Country Partners and linked to each country page.", status: "Planned" },
      { name: "ASEB Voices", detail: "Monthly practitioner-led conversations, published with audio and a written summary.", status: "Launching" },
      { name: "Builder Wellbeing Circles", detail: "Confidential and facilitated. Nothing indexed, nothing shared.", status: "Planned" },
    ],
  },
  {
    slug: "academy",
    n: "02",
    name: "ASEB Academy",
    role: "Professionalisation",
    line: "Learning and professional development, designed around practitioner needs.",
    body:
      "The planned Academy aims to help practitioners strengthen their methods and share experience. Courses, assessments and credentials will require confirmed curriculum, delivery capacity and governance before they become available.",
    programmes: [
      { name: "ASEB Foundations", detail: "Proposed foundation learning on entrepreneurship ecosystem practice. Curriculum and delivery languages are not yet confirmed.", status: "Planned" },
      { name: "Practitioner Programme", detail: "A proposed cohort-based learning programme with applied work. Duration, assessment and faculty remain to be confirmed.", status: "Planned" },
      { name: "ASEB Fellowship", detail: "A proposed advanced practitioner-development pathway. Cohort capacity, assessment and delivery are not yet confirmed.", status: "Planned" },
      { name: "Mentor Corps", detail: "A proposed mentoring pathway requiring confirmed mentors and delivery arrangements.", status: "Planned" },
      { name: "Builder Apprenticeship", detail: "A proposed placement pathway requiring confirmed host institutions and funding.", status: "Planned" },
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
      { name: "Ecosystem Stage Diagnostic", detail: "A score on each of the seven conditions for a city or country, led by its Country Partner.", status: "Planned" },
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
