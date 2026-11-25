// DEVELOPMENT ONLY. Demonstration data for reviewing the Secretariat workspace design.
// These people do not exist. This module is loaded only when import.meta.env.DEV is true,
// so production builds never include it.
import { Workspace } from "@/pages/Secretariat";

const day = (n: number) => new Date(Date.UTC(2026, 10, 24 - n, 9, 30)).toISOString();
const app = (i: number, over: Record<string, string>) => ({
  id: `00000000-0000-4000-8000-00000000000${i}`, name: `Sample Applicant ${i}`, email: `applicant${i}@example.org`, country: "Kenya", city: "Nairobi", role: "ecosystem-builder", job_title: "Programme lead",
  organisation: "Example Hub", membership_type: "individual", intent: "member", operating_countries: "Kenya, Uganda", focus_areas: "investment readiness", work_description: "Demonstration text describing a practitioner's work with early-stage founders. Not a real application.",
  profile_url: "https://example.org", phone: "", status: "pending", review_stage: "received", created_at: day(i), ...over,
});
const data = {
  state: "ready" as const, isAdmin: true, loadedAt: new Date().toISOString(),
  applications: [app(1, {}), app(2, { name: "Sample Applicant 2", country: "Ghana", city: "Accra", review_stage: "under_review" }), app(3, { country: "South Africa", city: "Johannesburg", membership_type: "organisation", review_stage: "information_requested" })],
  accounts: [
    { id: "10000000-0000-4000-8000-000000000001", email: "applicant1@example.org", email_confirmed: true, created_at: day(1), last_sign_in_at: day(0), name: "Sample Applicant 1", country: "Kenya", organisation: "Example Hub", primary_role: "ecosystem-builder" },
    { id: "10000000-0000-4000-8000-000000000009", email: "account9@example.org", email_confirmed: false, created_at: day(5), last_sign_in_at: null, name: "Sample Account 9", country: "Nigeria", organisation: "", primary_role: "" },
  ],
  circles: [{ user_id: "10000000-0000-4000-8000-000000000001", circle_key: "regional:East" }, { user_id: "10000000-0000-4000-8000-000000000001", circle_key: "group:hubs" }],
  enquiries: [{ id: "e1", kind: "country_partner_eoi", source: "/country-partners", email: "partner@example.org", name: "Sample Contact", organisation: "Example Institution", country: "Zambia", summary: "Demonstration enquiry text.", status: "pending", submittedAt: day(2) }],
  interests: [{ id: "i1", kind: "academy_interest", source: "/learning", email: "learner@example.org", name: "Sample Learner", organisation: "Example University", country: "Senegal", linkedAccount: false, submittedAt: day(3) }],
  pitches: [], submissions: [],
};

export default function SecretariatDemo() {
  return <Workspace data={data} demo onRefresh={() => undefined} onStage={async () => undefined} onExport={async () => undefined} />;
}
