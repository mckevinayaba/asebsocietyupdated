// Pure Secretariat helpers. No network or database access here, so reconciliation and export
// behaviour can be tested on their own. Server access lives in secretariat.functions.ts.

export const reviewStages = ["received", "under_review", "information_requested", "incomplete"] as const;
export type ReviewStage = (typeof reviewStages)[number];

export const reviewStageLabel: Record<ReviewStage, string> = {
  received: "Received",
  under_review: "Under review",
  information_requested: "Information requested",
  incomplete: "Incomplete",
};

// The approval decision is a separate field. Only "pending" exists in practice until an
// approval authority is formally approved; the labels keep the distinction visible.
export const decisionLabel: Record<string, string> = {
  pending: "Decision pending",
  approved: "Approved member",
  declined: "Declined",
};

export const noteSubjects = ["membership_application", "account", "partnership_enquiry", "programme_interest", "insight_pitch", "registry_submission"] as const;
export type NoteSubject = (typeof noteSubjects)[number];

export type ApplicationRecord = {
  id: string;
  name: string;
  email: string;
  country: string;
  city: string;
  role: string;
  job_title: string;
  organisation: string;
  membership_type: string;
  intent: string;
  operating_countries: string;
  focus_areas: string;
  work_description: string;
  profile_url: string;
  phone: string;
  status: string;
  review_stage: string;
  created_at: string;
};

export type AccountRecord = {
  id: string;
  email: string;
  email_confirmed: boolean;
  created_at: string;
  last_sign_in_at: string | null;
  name: string;
  country: string;
  organisation: string;
  primary_role: string;
};

export type PersonRow = {
  key: string;
  name: string;
  email: string;
  country: string;
  applications: ApplicationRecord[];
  account: AccountRecord | null;
  circles: string[];
};

const normaliseEmail = (email: string) => email.trim().toLowerCase();

// One row per person, matched on email. A registered account is never treated as an approved
// member, and an application without an account is shown as such.
export function reconcile(applications: ApplicationRecord[], accounts: AccountRecord[], circleRows: { user_id: string; circle_key: string }[]): PersonRow[] {
  const people = new Map<string, PersonRow>();
  const circlesByUser = new Map<string, string[]>();
  for (const row of circleRows) circlesByUser.set(row.user_id, [...(circlesByUser.get(row.user_id) ?? []), row.circle_key]);
  for (const account of accounts) {
    const key = normaliseEmail(account.email);
    people.set(key, { key, name: account.name, email: account.email, country: account.country, applications: [], account, circles: circlesByUser.get(account.id) ?? [] });
  }
  for (const application of applications) {
    const key = normaliseEmail(application.email);
    const existing = people.get(key);
    if (existing) {
      existing.applications.push(application);
      if (!existing.name) existing.name = application.name;
      if (!existing.country) existing.country = application.country;
    } else {
      people.set(key, { key, name: application.name, email: application.email, country: application.country, applications: [application], account: null, circles: [] });
    }
  }
  const latest = (row: PersonRow) => Math.max(...row.applications.map((a) => Date.parse(a.created_at)), row.account ? Date.parse(row.account.created_at) : 0);
  return [...people.values()].sort((a, b) => latest(b) - latest(a));
}

export function personState(row: PersonRow): string {
  const application = row.applications[0];
  if (application?.status === "approved") return "Approved member";
  if (application?.status === "declined") return "Declined applicant";
  if (application && row.account) return row.account.email_confirmed ? "Applicant with verified account" : "Applicant, account email unverified";
  if (application) return "Applicant without an account";
  return row.account?.email_confirmed ? "Registered account, no application" : "Registered account, email unverified";
}

export function matchesQuery(row: PersonRow, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [row.name, row.email, row.country, row.account?.organisation ?? "", ...row.applications.flatMap((a) => [a.organisation, a.role, a.job_title, a.city])].join(" ").toLowerCase();
  return q.split(/\s+/).every((part) => haystack.includes(part));
}

// CSV export with formula injection protection for spreadsheet software.
export function toCsv(rows: Record<string, string | number | boolean | null | undefined>[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0] ?? {});
  const cell = (value: unknown) => {
    let text = value === null || value === undefined ? "" : String(value);
    if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  return [headers.join(","), ...rows.map((row) => headers.map((h) => cell(row[h])).join(","))].join("\r\n");
}

export function peopleToExportRows(rows: PersonRow[]) {
  return rows.map((row) => {
    const application = row.applications[0];
    return {
      name: row.name,
      email: row.email,
      country: row.country,
      state: personState(row),
      application_submitted: application?.created_at ?? "",
      review_stage: application ? reviewStageLabel[application.review_stage as ReviewStage] ?? application.review_stage : "",
      decision: application ? decisionLabel[application.status] ?? application.status : "",
      role: application?.role ?? row.account?.primary_role ?? "",
      organisation: application?.organisation || row.account?.organisation || "",
      account_registered: row.account?.created_at ?? "",
      account_email_verified: row.account ? row.account.email_confirmed : "",
      circle_selections: row.circles.length,
    };
  });
}
