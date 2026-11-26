// The institutional progress register. One honest status per capability.
// Measured impact is never claimed here; event measures are labelled as such.

export type ProgressStatus = "Operational" | "In development" | "Planned" | "Subject to funding" | "Subject to institutional approval";
export type ProgressItem = { area: string; name: string; status: ProgressStatus; detail: string; to?: string };

export const progressStatuses: { status: ProgressStatus; line: string }[] = [
  { status: "Operational", line: "Live and in use today." },
  { status: "In development", line: "Being built or prepared now." },
  { status: "Planned", line: "Designed and scheduled, not yet started." },
  { status: "Subject to funding", line: "Ready to begin when resourced." },
  { status: "Subject to institutional approval", line: "Awaits a decision by the Board or Secretariat." },
];

export const progressRegister: ProgressItem[] = [
  { area: "Summit & Awards", name: "Annual Summit and Awards", status: "Operational", detail: "Five editions held since 2022. The 2027 edition is announced for Mayotte.", to: "/summit" },
  { area: "Membership", name: "Membership applications", status: "Operational", detail: "Applications are stored privately and are pending Secretariat review.", to: "/join" },
  { area: "Membership", name: "Member accounts and profiles", status: "Operational", detail: "Email and password accounts with private, editable professional profiles.", to: "/auth" },
  { area: "Membership", name: "Membership approval decisions", status: "Subject to institutional approval", detail: "The authority to approve or decline applications has not yet been formally established." },
  { area: "Membership", name: "Membership fees", status: "Subject to institutional approval", detail: "No fee is charged. Any fee requires explicit institutional approval." },
  { area: "Secretariat", name: "Secretariat membership workspace", status: "Operational", detail: "Live for authorised Secretariat staff. Approval decisions await an approved authority." },
  { area: "ASEB Circles", name: "Circle preferences", status: "Operational", detail: "Preferences are saved and synchronised with member accounts.", to: "/communities" },
  { area: "ASEB Circles", name: "Facilitated Circles and discussion", status: "In development", detail: "Requires facilitators, moderation arrangements and activity plans before launch." },
  { area: "ASEB Academy", name: "Learning priorities intake", status: "Operational", detail: "Practitioners can register learning priorities and preferred formats.", to: "/learning" },
  { area: "ASEB Academy", name: "Courses and professional credentials", status: "Subject to funding", detail: "No courses or credentials are offered yet. They need curriculum, faculty and assessment." },
  { area: "ASEB Field Lab", name: "Research and policy collaboration intake", status: "Operational", detail: "Organisations can propose collaborations with defined scope and partners.", to: "/field-lab" },
  { area: "ASEB Field Lab", name: "Field Lab projects", status: "Subject to funding", detail: "Projects begin when scope, partners and resources are agreed." },
  { area: "Continental network", name: "Country Partner and Ambassador applications", status: "Operational", detail: "Applications are stored for Secretariat review. One Country Partner is confirmed, for Angola.", to: "/countries" },
  { area: "Continental network", name: "Country network activation", status: "Subject to funding", detail: "Recruiting, onboarding and supporting representation across more countries." },
  { area: "Knowledge", name: "Field Registry and Evidence Library", status: "Operational", detail: "180 archive records and research summarised for practice.", to: "/registry" },
  { area: "Knowledge products", name: "The Field community", status: "Operational", detail: "Members can publish updates, articles and opportunities. Every contribution is reviewed before it appears.", to: "/the-field" },
  { area: "Knowledge products", name: "ASEB Voices", status: "Operational", detail: "Stories are submitted, reviewed by an editor and published with the contributor's consent.", to: "/voices" },
  { area: "Knowledge products", name: "The African Ecosystem Building Playbook", status: "Operational", detail: "Fourteen chapters are open for contributions. No chapter is published as a standard yet.", to: "/playbook" },
  { area: "Knowledge products", name: "Ask the Village", status: "Operational", detail: "Questions and answers are reviewed by moderators before they appear.", to: "/ask" },
  { area: "Knowledge products", name: "State of the Field", status: "Operational", detail: "Evidence can be submitted with its method and coverage and is reviewed by an editor. The first continental report is subject to funding.", to: "/state-of-the-field" },
  { area: "Knowledge products", name: "Open community publishing", status: "Subject to institutional approval", detail: "Requires approved community guidelines, contributor terms and a privacy notice. Until then every contribution is reviewed first." },
  { area: "Knowledge", name: "Saved content", status: "Operational", detail: "Members save contributions to their account. Visitors can save on their device." },
  { area: "Communications", name: "In-app notifications", status: "Operational", detail: "Activity on your contributions appears inside the platform." },
  { area: "Communications", name: "Account emails", status: "Operational", detail: "Sign-up confirmation and password reset emails are sent as ASEB Society." },
  { area: "Communications", name: "Email acknowledgement of enquiries and submissions", status: "Planned", detail: "Form submissions are stored and acknowledged on screen. Email receipts are not sent yet." },
  { area: "Digital", name: "Installable application", status: "Operational", detail: "The platform can be added to a phone's home screen where the browser supports it." },
  { area: "Digital", name: "French language edition", status: "Planned", detail: "Follows professional translation. No automated translations are published." },
];
