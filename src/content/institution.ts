// The institution: story, people, governance, partnership routes, climate, SDGs, funders and tenders.
// Source for story, people, governance, goals, partners and ambassadors: www.asebsociety.org (October 2026).
// Do not add a person, partner or past contract here until it is confirmed.

export const story = [
  { year: "2022", city: "Johannesburg, South Africa", title: "A room for the builders", line: "The Africa Startup Ecosystem Builders Summit & Awards (ASEB) was established to recognise and connect the people and institutions building the conditions for African entrepreneurship, and to bring visibility and meaning to the practice of ecosystem building. Part of its founding concern was the growing use of the term without clear professional meaning." },
  { year: "2023", city: "Nairobi, Kenya", title: "The first conversations", line: "During the second edition, conversations began about a permanent organisation beyond the annual gathering. Practitioners saw the value of sustained professional engagement, relationships and collective learning throughout the year." },
  { year: "2024", city: "Accra, Ghana", title: "The case deepens", line: "During the third edition, the discussion of a permanent institution deepened. The need for professional belonging, institutional continuity and engagement between summits became increasingly apparent." },
  { year: "2025", city: "Addis Ababa, Ethiopia", title: "The intention announced", line: "During the fourth edition, the intention to establish the Africa Startup Ecosystem Builders Society was announced. Stakeholders in Ethiopia began assembling a team towards local representation, an early mobilisation rather than a formal appointment." },
  { year: "2026", city: "Johannesburg, South Africa", title: "The institution launched", line: "On 21 October 2026, during the fifth edition, 'Who Built the Builder?', ASEB Society was officially launched as a permanent continental institution advancing ecosystem building as a professional practice and a recognised profession across Africa. Nominations arrived from 52 countries, and the Ecosystem Tour took the field to Soweto." },
];

export type Person = { slug: string; name: string; role: string; base: string; group: "founder" | "executive" | "board" | "representation"; photo: string; summary: string; bio: string[]; linkedin?: string };

export const people: Person[] = [
  {
    slug: "mckevin-ayaba", name: "McKevin Ayaba", role: "Founder & Chief Executive Officer", base: "Johannesburg, South Africa", group: "founder", photo: "images/people/mckevin-ayaba-portrait.jpg", linkedin: "https://www.linkedin.com/in/mckevin-ayaba-89853220/",
    summary: "Startup ecosystem builder and institutional architect with more than 15 years across African entrepreneurial ecosystems, including hands-on ecosystem work in 34 African countries, working on the systems around founders rather than single programmes.",
    bio: [
      "His work sits at the intersection of ecosystem strategy and field building, entrepreneurship support infrastructure, policy and institutional design, and cross-border ecosystem coordination.",
      "He founded the Africa Startup Ecosystem Builders Summit and Awards to give ecosystem builders a place to reflect, connect and be recognised for long-term contribution. ASEB Society is the evolution of that work: a permanent institution to professionalise ecosystem building, preserve institutional memory and protect the integrity of the field beyond events and personalities.",
    ],
  },
  {
    slug: "nomalanga-sitole", name: "Nomalanga Sitole", role: "Communications and Narrative Lead", base: "South Africa", group: "executive", photo: "images/people/nomalanga-sitole.jpg",
    summary: "More than 20 years across broadcasting, event production and marketing leadership. Founder of TVW International and a Standard Bank Top Women Entrepreneur finalist.",
    bio: ["A multi-award-winning MC, facilitator, author and voice-over artist who has hosted major events for Nedbank, Liberty, FNB, ABSA, Investec and the Gauteng Legislature. At ASEB Society she shapes how the field's story is told."],
  },
  {
    slug: "sally-njoh-tabe", name: "Sally Njoh Tabe", role: "Stakeholder Engagement and Community Lead", base: "Cameroon", group: "executive", photo: "images/people/sally-njoh-tabe.jpg",
    summary: "CEO and Co-Founder of HappyMe Health and a researcher whose antimicrobial resistance work was named among Wiley's top cited articles.",
    bio: ["A Founder Institute and AWE alumna and intergovernmental liaison with YALDA. At ASEB Society she holds the community together across the continent: the relationships that make a continental institution feel personal."],
  },
  {
    slug: "ian-lorenzen", name: "Ian Lorenzen", role: "Chairman of the Board", base: "Partner and Executive Director, GrowthAfrica", group: "board", photo: "images/people/ian-lorenzen.jpg",
    summary: "More than a decade supporting African entrepreneurs, growth-focused SMEs, ecosystem actors and funders. One of the earliest voices to engage with the question behind the ASEB Summit & Awards in 2022.",
    bio: [
      "His work sits at the intersection of entrepreneurship development, business acceleration, ecosystem convening, partnership building and programme strategy. He is known for asking the difficult questions that ecosystem conversations often avoid, and for protecting the meaning of ecosystem building from becoming another diluted development term.",
      "He formally joined the ASEB work at the Nairobi edition in 2023 and has continued through Accra, Addis Ababa and Johannesburg. As Chairman of the Board of ASEB Society, he contributes to the year-round mission of building a professional home for ecosystem builders.",
    ],
  },
  {
    slug: "haymee-perez-cogle", name: "Haymée I. Pérez Cogle", role: "Country Partner for Angola · Regional Ambassador for Lusophone Africa", base: "Luanda, Angola", group: "representation", photo: "images/people/haymee-perez-cogle.jpg",
    summary: "More than 30 years across technology, telecommunications, entrepreneurship and innovation. Managing Director of Founder Institute Luanda and of Renascença Digital Consultoria.",
    bio: [
      "Through her venture-building work she has supported the launch and growth of more than 50 startups. She took part in the early development of internet and telecommunications infrastructure in Angola and brings an operational view of how ecosystems are built: through structure, trust, governance, capital readiness and long-term institutional commitment.",
      "As ASEB Society's first Country Partner, she extends the Society's reach across Angola, Mozambique, Cabo Verde, Guinea-Bissau and São Tomé and Príncipe, and contributes to the Africa Founder DNA Initiative.",
    ],
  },
  {
    slug: "patrice-habinshuti", name: "Dr Patrice Habinshuti", role: "Board Member · Global Partnerships (North America) · 2023 ASEB Award Winner", base: "United States and Rwanda", group: "board", photo: "images/people/patrice-habinshuti.jpg",
    summary: "Programme strategist, entrepreneurship development practitioner and institutional capacity builder, now based in the United States. Country Operations Director of Rwanda Business Development Center.",
    bio: [
      "His work spans enterprise development, youth innovation, investment readiness, governance and cross-border ecosystem mobilisation, including country engagement and delegation leadership for OSCARS Olympiads across Africa.",
      "Now based in the United States, he leads ASEB Society's North American partnerships: opening doors to US foundations, development finance institutions, universities, investors and the African diaspora, and connecting those resources back into African ecosystems. He remains a member of the UNDP Youth Startup Financing Facility for Africa ecosystem advisory group, keeping his East African operational foundation active.",
    ],
  },
  {
    slug: "stacey-menga", name: "Stacey Menga", role: "Board Member · Strategy and Programmes", base: "CEO, Minkoti Business Concierge · Nairobi, Kenya", group: "board", photo: "images/people/stacey-menga.jpg",
    summary: "Strategic management practitioner and entrepreneurship trainer. CEO of Minkoti Business Concierge and Founder of the Institute of Entrepreneurship and Innovations Training.",
    bio: [
      "Based in Kenya, Stacey holds an MBA in Strategic Management from the University of Nairobi. She leads Minkoti Business Concierge as CEO and founded the Institute of Entrepreneurship and Innovations Training, building the managerial and operational capability that growing enterprises depend on.",
      "At ASEB Society, she anchors the strategy and programme architecture: the design of programmes that turn ecosystem building from a gathering of actors into a disciplined, measurable practice across the continent.",
    ],
  },
];

// The unified governance structure. One institution, one governing Board, four pillars, clear executive
// accountability, specialist support where necessary, independent awards assessment. Read
// docs/GOVERNANCE.md before changing it, including its "Never reintroduce" list, which
// src/test/governance.test.ts enforces.
export type AuthorityKind = "Governing authority" | "Executive responsibility" | "Operational delivery" | "Advisory participation" | "Representation" | "Independent assessment";

export const governanceStructure: { key: string; name: string; kind: AuthorityKind; summary: string; holds: string; doesNot: string }[] = [
  { key: "board", name: "ASEB Society Board", kind: "Governing authority", summary: "Strategic direction, fiduciary oversight, institutional accountability, financial oversight and risk management.", holds: "Approves strategy, budgets, major partnerships, governing documents and the mandates of committees. Oversees every pillar and programme, the Summit & Awards included.", doesNot: "Run day to day operations, or select award recipients." },
  { key: "ceo", name: "Founder & Chief Executive Officer", kind: "Executive responsibility", summary: "Executive leadership, strategy implementation, institutional development, resource mobilisation, stakeholder relationships and programme accountability.", holds: "Leads the institution within the strategy and budget the Board approves, and answers to the Board for delivery across all four pillars.", doesNot: "Override the Board, or determine award recipients outside the approved assessment process." },
  { key: "secretariat", name: "ASEB Secretariat", kind: "Operational delivery", summary: "Institutional operations, membership administration, stakeholder engagement, communications, programme coordination and digital platform management.", holds: "Runs the institution's operations and records, under the direction of the Founder & Chief Executive Officer.", doesNot: "Set strategy, or approve its own mandate." },
  { key: "committees", name: "Programme Committees and Working Groups", kind: "Advisory participation", summary: "Specialist expertise, professional participation, technical advice and programme support, established according to institutional needs and approved mandates.", holds: "Advises within a written mandate, for a defined period. Summit editions may be supported by temporary programme committees and country host organising committees.", doesNot: "Carry governing, fiduciary or award selection authority, or exist as standing bodies without an approved mandate." },
  { key: "representation", name: "Country Partners and Ambassadors", kind: "Representation", summary: "National and regional representation, stakeholder mobilisation, local ecosystem engagement and continental institutional expansion.", holds: "Represents the Society in a country or region under an agreed mandate, and mobilises nominations and participation.", doesNot: "Commit the Society to agreements, or speak for it beyond that mandate." },
  { key: "jury", name: "Independent Awards Jury", kind: "Independent assessment", summary: "Independent assessment and selection of award recipients under approved awards criteria and integrity safeguards.", holds: "Assesses nominees and selects award recipients according to approved criteria and procedures, with declared conflicts of interest and recusal.", doesNot: "Govern the Society. Equally, no sponsor, leader or committee may determine winners outside the approved assessment process." },
];

// The one sentence used wherever the Summit is described in relation to the institution.
export const summitPositioning = "The Africa Startup Ecosystem Builders Summit & Awards is the flagship continental convening and recognition programme of ASEB Society, bringing together the people and institutions shaping African entrepreneurial ecosystems to exchange knowledge, advance professional practice, address shared challenges and recognise outstanding contributions to the field.";
export const summitGovernance = "The Summit operates within the institutional governance and strategic mandate of ASEB Society. Where necessary, individual Summit editions may be supported by temporary programme committees, country host organising committees and an independent awards assessment process.";

export const governancePrinciples = [
  { name: "Separation of convening from authority", line: "Convenings and visibility do not equal decision-making power." },
  { name: "Distributed responsibility", line: "Roles are shared, documented and time-bound, with clear checks and balances." },
  { name: "Neutrality and integrity", line: "Strict conflict-of-interest rules and documentation protect credibility." },
  { name: "Continuity beyond founders and funders", line: "Decisions, frameworks and learning are recorded so the institution grows stronger with every cycle." },
];

export const stewardshipGoals = [
  { name: "Legitimate Field Formation", line: "Ecosystem building must reflect the full realities of Africa, across geography, language, economy and context. A field defined only by capital cities, elite actors or donor-facing narratives is not legitimate.", practice: "Enable meaningful participation across countries, languages, professional roles and economic contexts.", through: "Country Partners, ASEB Circles, inclusive access" },
  { name: "Power-Sharing Discipline", line: "We promote practices that share credit, information, data and authority, so collaboration is structural, not performative.", practice: "Share knowledge, credit and meaningful participation in decisions.", through: "Playbook credits, ASEB Voices attribution" },
  { name: "Collective Stewardship Mandate", line: "Ecosystem builders are not owners of ecosystems. They are stewards of long-term outcomes.", practice: "Treat ecosystems as shared responsibilities rather than institutional possessions.", through: "Field Lab collaborations, additionality before expansion" },
  { name: "Continuity and Memory Infrastructure", line: "We prioritise documentation, shared learning and institutional memory so each generation of builders does not start from zero.", practice: "Preserve useful knowledge, relationships and experience beyond individual projects and funding cycles.", through: "The Playbook, ASEB Voices, the Field Registry" },
  { name: "Evidence and Accountability Regime", line: "Stories without evidence distort the field. Learning replaces hype and accountability replaces optics.", practice: "Distinguish activities, outputs, outcomes and unsupported claims.", through: "State of the Field, the Progress page" },
  { name: "Builder Protection and Sustainability", line: "Ecosystem building cannot rely on burnout, unpaid labour or permanent precarity. Builders must be sustained, not extracted.", practice: "Recognise the importance of viable roles, adequate resources and practitioner wellbeing, and avoid dependence on indefinite personal sacrifice and burnout.", through: "ASEB Circles, institutional funding" },
  { name: "Embedded Public Infrastructure", line: "We support efforts to embed ecosystem building into durable public systems and mandates, so progress does not reset with political or funding changes.", practice: "Encourage durable professional and institutional arrangements that can support collective economic development.", through: "ASEB Field Lab policy work" },
  { name: "Narrative Sovereignty and Knowledge Ownership", line: "African ecosystems must be documented and interpreted by those embedded in their realities.", practice: "Enable African practitioners to document, interpret and share the realities of their own ecosystems.", through: "ASEB Voices, State of the Field" },
  { name: "Signal Integrity and Field Legibility", line: "When everything looks like success, nothing is credible. We protect clear signals of contribution.", practice: "Recognise demonstrated contribution rather than visibility, popularity or titles alone.", through: "The Independent Awards Jury, the Field Registry" },
];

export const partnerTypes = [
  { name: "Ecosystem Partners", who: "Hubs, incubators, accelerators, networks and enterprise support organisations." },
  { name: "Policy and Public Agencies", who: "Ministries, SME and innovation agencies, municipalities and regional economic communities." },
  { name: "Funders and DFIs", who: "Development finance institutions, bilateral agencies, foundations and philanthropic capital." },
  { name: "Corporates", who: "Corporate innovation, enterprise and supplier development, and market-access partners." },
  { name: "Universities and Research", who: "Universities, think tanks and research centres producing evidence on African ecosystems." },
  { name: "Global Networks", who: "International networks and associations that advance ecosystem building as a practice." },
];

export const partnerCommitments = ["Mission alignment", "Long-term stewardship", "Resource contribution", "Knowledge sharing"];

export const countryPartnerDuties = [
  { k: "Engage practitioners", v: "Bring local ecosystem builders into the Society's work and help a country community of practice take shape." },
  { k: "Build relationships", v: "Develop institutional relationships with government, funders, universities and support organisations." },
  { k: "Mobilise knowledge", v: "Run contribution campaigns for the Playbook, ASEB Voices and State of the Field, in local languages where possible." },
  { k: "Collaborate across borders", v: "Connect the country to continental work, and mobilise nominations for the Summit & Awards without any role in selecting recipients." },
  { k: "Share local intelligence", v: "Keep the country page current and contribute evidence on local ecosystem conditions." },
  { k: "Report and account", v: "Report to the Secretariat under an approved mandate, with renewal based on agreed criteria." },
];

export const countryPartnerCriteria = [
  "At least five years of ecosystem-building practice in the country.",
  "Standing with government, funders and builders, evidenced by two references.",
  "No unresolved conflict of interest, such as a competing paid award in the same country.",
  "Capacity to commit six to ten hours a month.",
  "Acceptance of the Code of Practice and the Country Partner Agreement.",
];

export const countryLadder = [
  { name: "Ambassador", line: "An individual obligation of three to five hours a month." },
  { name: "Country Partner (Interim)", line: "Twelve months, with a defined first-year plan." },
  { name: "Country Partner", line: "Carries the Society's work in one country." },
  { name: "Regional Representative", line: "Coordinates Country Partners across a region: SADC, ECOWAS, EAC, Central, North or Lusophone Africa." },
];

export const ambassadorDuties = [
  { k: "Community stewardship", v: "Steward local gatherings, welcome and mentor new members, connect people across your network." },
  { k: "Field advocacy", v: "Champion ecosystem building as a profession and advocate for professional standards." },
  { k: "Partnership development", v: "Identify partnerships, make introductions and bridge African and global networks." },
  { k: "Knowledge contribution", v: "Contribute insights to the Circles, mentor emerging builders and document lessons." },
];

export const ambassadorTypes = [
  { name: "Ecosystem Builder", who: "Hub managers, accelerator directors and programme leads who know the work first-hand." },
  { name: "Investor", who: "Fund managers, angels and investment networks who strengthen capital conditions." },
  { name: "Policy", who: "Officials, advisors and advocates who shape ecosystem-enabling policy." },
  { name: "Corporate", who: "Corporate innovation and enterprise development leaders who open markets." },
  { name: "Academic", who: "Researchers and faculty studying entrepreneurship and ecosystem development." },
  { name: "Diaspora", who: "Connectors building trust and soft-landing infrastructure across corridors." },
  { name: "Climate and Green Economy", who: "Builders of climate, clean-energy, agri-climate and circular-economy support systems." },
];

export const programmeStandard = [
  { k: "Purpose", v: "Strengthens the conditions for founders, not only individual firms." },
  { k: "Practice", v: "States its theory of change against the seven conditions." },
  { k: "Evidence", v: "Reports outcomes using the Common Reporting Framework fields." },
  { k: "Credit", v: "Credits builders and partners accurately, under the Code of Practice." },
  { k: "Openness", v: "Shares summary data and lessons with the field through Insights." },
];

export const collaborationModels = [
  { name: "Co-convening", line: "A joint session or track at the Summit, an ASEB Voices session or a regional convening." },
  { name: "Co-delivery", line: "Joint delivery of an Academy course or a Field Lab project." },
  { name: "Data and evidence", line: "Shared indicators, datasets or co-authored research." },
  { name: "Recognition pathway", line: "A possible future route for programme alumni into Society pathways, once those pathways are established and approved." },
  { name: "Consortium", line: "Joint bids for funder tenders, through the Work With Us desk." },
];

export const climateRoles = [
  "Climate and clean-energy incubators and accelerators",
  "Agri-climate and food-systems programmes",
  "Green finance intermediaries and blended-finance structurers",
  "Climate fund officers at development finance institutions",
  "Circular-economy and waste-sector builders",
  "Water and resilience innovation programmes",
  "Just-transition and green-skills practitioners",
  "Carbon-market and MRV support organisations",
  "Municipal and city climate officers",
];

export type Sdg = { n: number; name: string; how: string; condition: string; primary?: boolean };
export const sdgs: Sdg[] = [
  { n: 1, name: "No Poverty", how: "Enterprise support that reaches informal and township businesses.", condition: "Market Access and Procurement", primary: true },
  { n: 2, name: "Zero Hunger", how: "Agri-food and agritech support systems.", condition: "Market Access and Procurement" },
  { n: 3, name: "Good Health and Well-being", how: "Health-innovation hubs, and fair work and well-being for builders.", condition: "Talent and Capability Development" },
  { n: 4, name: "Quality Education", how: "Entrepreneurship education and a professional Academy for builders.", condition: "Talent and Capability Development", primary: true },
  { n: 5, name: "Gender Equality", how: "Gender-intentional programme design and capital.", condition: "Capital Formation and Access", primary: true },
  { n: 6, name: "Clean Water and Sanitation", how: "Water-innovation programmes and pipelines.", condition: "Environmental and Contextual Constraints" },
  { n: 7, name: "Affordable and Clean Energy", how: "Clean-energy incubators and the pipelines that make capital deployable.", condition: "Environmental and Contextual Constraints" },
  { n: 8, name: "Decent Work and Economic Growth", how: "Jobs through firm creation and growth, and the transition from informal to formal (target 8.3).", condition: "Market Access and Procurement", primary: true },
  { n: 9, name: "Industry, Innovation and Infrastructure", how: "Innovation infrastructure: hubs, labs, startup acts and research systems.", condition: "Policy and Regulatory Environments", primary: true },
  { n: 10, name: "Reduced Inequalities", how: "Reach beyond capital cities, to youth, women, rural and diaspora builders.", condition: "Narrative, Distribution and Visibility", primary: true },
  { n: 11, name: "Sustainable Cities and Communities", how: "City ecosystems and township economic zones.", condition: "Trust, Coordination and Data", primary: true },
  { n: 12, name: "Responsible Consumption and Production", how: "Circular-economy programmes and green supplier development.", condition: "Environmental and Contextual Constraints" },
  { n: 13, name: "Climate Action", how: "Climate-ready ecosystems. Climate is a condition, not a vertical.", condition: "Environmental and Contextual Constraints", primary: true },
  { n: 14, name: "Life Below Water", how: "Blue-economy innovation programmes.", condition: "Environmental and Contextual Constraints" },
  { n: 15, name: "Life on Land", how: "Nature-based and restoration enterprise support.", condition: "Environmental and Contextual Constraints" },
  { n: 16, name: "Peace, Justice and Strong Institutions", how: "Startup acts, policy dialogue and accountable support institutions.", condition: "Policy and Regulatory Environments" },
  { n: 17, name: "Partnerships for the Goals", how: "Field-level coordination, shared data and multi-stakeholder partnerships (targets 17.16 to 17.18).", condition: "Trust, Coordination and Data", primary: true },
];

export const funderNeeds = [
  { need: "Theory of change and results framework", answer: "Seven conditions, mapped to SDG targets and the Africa Entrepreneurial Ecosystem Index." },
  { need: "Indicators and MEL", answer: "The Common Reporting Framework, the Ecosystem Stage Diagnostic and an annual State of the Field." },
  { need: "Value for money", answer: "Less duplication through the Programme Register, and a shared curriculum through the Academy." },
  { need: "Country coverage", answer: "Country Partners and Regional Representatives; Awards nominations from 52 countries in 2026." },
  { need: "Safeguarding and governance", answer: "One governing Board, a Charter, a Code of Practice, conflict of interest rules and an Independent Awards Jury that assesses nominees under approved criteria." },
  { need: "Localisation", answer: "African-led institution and African-authored knowledge, under Stewardship Goal 8." },
  { need: "Sustainability and exit", answer: "Builder Protection and Embedded Public Infrastructure goals; renewal and succession work in the Field Lab." },
];

export const waysToFund = [
  { name: "Core field infrastructure", line: "The platform, Field Registry, Programme Register and Insights." },
  { name: "A pillar or programme", line: "An Academy pilot or a Field Lab project, including work focused on women or youth." },
  { name: "A country or region", line: "Country Partner deployment, country convenings and the country page." },
  { name: "Research", line: "The State of the Field and the annual condition briefs." },
  { name: "Summit and Awards", line: "The annual convening and the recognition of the field." },
  { name: "Commissioned work", line: "Diagnostics, capacity building, MEL and design, through Work With Us." },
];

export const serviceLines = [
  { name: "Ecosystem diagnostics and mapping", titles: "Ecosystem mapping, landscape study, baseline assessment", evidence: "Field Registry; index partnership with i4Policy" },
  { name: "Capacity building for support organisations", titles: "Capacity building for incubators and business development service providers", evidence: "Academy: four courses" },
  { name: "Programme design and delivery", titles: "Design and implementation of entrepreneurship and acceleration programmes", evidence: "The builder lifecycle and the Circles model" },
  { name: "Monitoring, evaluation and learning", titles: "MEL framework, impact assessment, learning partner", evidence: "Common Reporting Framework; Metrics and Learning Lab" },
  { name: "Convenings and policy dialogue", titles: "Stakeholder convenings, multi-country summits, policy dialogue", evidence: "Five Summit editions in four countries since 2022" },
  { name: "Research and knowledge products", titles: "Research studies, case studies, knowledge management", evidence: "Insights and the Evidence Library" },
  { name: "Policy and startup-act support", titles: "Technical assistance on startup and SME policy", evidence: "Policy and Startup Acts course" },
  { name: "Recognition and awards design", titles: "Awards and competition design and management", evidence: "1,786 nominations, 52 countries, 145 finalists in 2026" },
  { name: "Country deployment", titles: "In-country implementation partner", evidence: "Country Partners and Regional Representatives" },
];

export const readiness = [
  "Registration certificate, constitution and not-for-profit status",
  "Tax clearance and VAT; CSD and B-BBEE in South Africa",
  "Audited financial statements",
  "Safeguarding, anti-fraud, data protection (POPIA), conflict-of-interest and procurement policies",
  "CVs of key experts in funder formats",
  "Past-performance records with referees",
  "Registrations: EU PIC, UNGM, AfDB DACON, World Bank vendor portal",
  "Professional indemnity and public liability insurance",
];

export const tenderSources = [
  { name: "EU Funding and Tenders Portal", note: "Organisations register once and receive a nine-digit Participant Identification Code.", href: "https://webgate.ec.europa.eu/funding-tenders-opportunities/spaces/OM/pages/1867804/Registration%20and%20validation%20of%20your%20organisation" },
  { name: "United Nations Global Marketplace", note: "One supplier registration for the UN system's procurement.", href: "https://www.ungm.org/Account/registration" },
  { name: "African Development Bank", note: "DACON consultant database, often requested in expressions of interest.", href: "https://www.afdb.org/en/projects-and-operations/procurement/frequently-asked-questions/acquisition-of-consultancy-services-individual-consultants" },
  { name: "World Bank Group", note: "Vendor Management Portal for operational consulting opportunities.", href: "https://www.worldbank.org/en/about/corporate-procurement/business-opportunities/operational-consulting-opportunities" },
  { name: "GIZ", note: "Country tender pages and the African Union e-tendering portal.", href: "https://au.giz.de/" },
];

export const insightCategories = [
  { name: "Research", line: "Studies and data on the conditions African founders face." },
  { name: "Case Studies", line: "How a programme, hub or policy actually worked, including what did not." },
  { name: "Tools and Frameworks", line: "Methods practitioners can use on Monday morning." },
  { name: "Practitioner Stories", line: "The builders, in their own words." },
];
