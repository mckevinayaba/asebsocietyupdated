// ASEB Summit and Awards. Source for programme and speakers: https://www.asebs.com/programme
// and https://www.asebs.com/speakers. Photos credited to ASEB Society.

export const summit2026 = {
  edition: "Fifth edition",
  dates: "20 to 22 October 2026",
  city: "Johannesburg, South Africa",
  theme: "Who Built the Builder?",
  days: [
    {
      label: "Day One",
      date: "Tuesday 20 October",
      chapter: "See the Field",
      title: "Beneath the success stories",
      body: "National headlines rarely show what founders face in their own provinces and towns. Day One looked beneath those stories at the local realities that decide whether businesses start, survive and grow.",
    },
    {
      label: "Day Two",
      date: "Wednesday 21 October",
      chapter: "Build the Field",
      title: "From Movement to Institution",
      body: "Evidence, institutional action, AI and enterprise growth. The research session aligned the Africa Entrepreneurial Ecosystem Index with the practice of ecosystem building, followed by the Awards.",
    },
    {
      label: "Day Three",
      date: "Thursday 22 October",
      chapter: "Carry the Field Forward",
      title: "The Johannesburg Ecosystem Tour",
      body: "A learning journey through Johannesburg and Soweto, from Sandton to Vilakazi Street, visiting the institutions where the work is done.",
    },
  ],
};

export type Speaker = { slug: string; name: string; role: string; session: string };

export const speakers: Speaker[] = [
  { slug: "mckevin-ayaba", name: "McKevin Ayaba", role: "Founder and Chief Ecosystem Officer, ASEB Society", session: "Understanding Startup Ecosystem Building: From Movement to Institution" },
  { slug: "colin-leshou", name: "Colin Leshou", role: "Head of Ecosystem Enablement, Allan & Gill Gray Philanthropies", session: "From Programmes to Ecosystems: Building Institutions Entrepreneurs Can Depend On" },
  { slug: "erik-stam", name: "Professor Erik Stam", role: "Professor of Strategy, Organisation and Entrepreneurship, Utrecht University", session: "From Ecosystem Language to Ecosystem Evidence" },
  { slug: "phumlani-nkontwana", name: "Dr Phumlani Nkontwana", role: "Founding Academic Director, Allan Gray Centre for Africa Entrepreneurship, Stellenbosch University", session: "Provincial ecosystem research in South Africa" },
  { slug: "tim-gelissen", name: "Tim Gelissen", role: "Co Director, i4Policy", session: "Africa Entrepreneurial Ecosystem Index: From Evidence to Institutional Action" },
  { slug: "lincoln-njogu", name: "Lincoln Njogu", role: "Head of Technology, i4Policy", session: "The AEEI Data Dashboard" },
  { slug: "catherine-wijnberg", name: "Catherine Wijnberg", role: "Founder and CEO, Fetola", session: "20 Years of Building Businesses That Last" },
  { slug: "david-wilson", name: "David Wilson", role: "CEO and Co Founder, National Mentorship Movement", session: "Mentorship in Practice" },
  { slug: "thekla-mutero", name: "Thekla Mutero", role: "Founding President, Emerging Mining Association of Namibia", session: "When Recognition Becomes Responsibility" },
  { slug: "katrin-putz", name: "Katrin Pütz", role: "Founder and Managing Director, (B)energy", session: "Access to capital and markets" },
];

export const editions = [
  { year: "2026", city: "Johannesburg", note: "Fifth edition. The homecoming, and the institutional launch of ASEB Society." },
  { year: "2025", city: "Addis Ababa", note: "Scale met substance." },
  { year: "2024", city: "Accra", note: "The field asked what happens between summits." },
  { year: "2023", city: "Nairobi", note: "Recognition created retention." },
  { year: "2022", city: "Johannesburg", note: "Where it began." },
];

export const gallery = [
  { src: "images/events/aseb-2026-recognised-builders.jpg", alt: "Recognised practitioners and institutions at ASEB 2026 in Johannesburg", caption: "Recognised practitioners and institutions, ASEB 2026, Johannesburg", span: "wide" },
  { src: "images/events/aseb-awards-stage-1.jpg", alt: "A recognised builder on stage at the ASEB Awards", caption: "On stage at the ASEB Awards", span: "tall" },
  { src: "images/events/aseb-awards-stage-2.jpg", alt: "Two builders embrace on the ASEB Awards stage", caption: "The ASEB Awards", span: "tall" },
  { src: "images/events/aseb-summit-panel.jpg", alt: "A panel discussion at the ASEB Summit", caption: "A practitioner panel at the ASEB Summit", span: "wide" },
  { src: "images/events/aseb-awards-stage-3.jpg", alt: "A recognition plaque presented at the ASEB Awards", caption: "Recognition presented at the ASEB Awards", span: "tall" },
];

// Institutions listed on asebs.com under "They showed up for the ecosystem."
export const supporters = [
  "Brand South Africa",
  "GrowthWheel SA",
  "Fetola",
  "Indalo Inclusive",
  "CloudPlexo",
  "E4Impact",
  "Reach for Change",
  "EDI Ethiopia",
  "BIC Ethiopia",
  "GrowthAfrica",
];
