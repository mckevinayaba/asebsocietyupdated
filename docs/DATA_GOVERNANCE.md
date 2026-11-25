# Data governance

## Production records that must be preserved

`public.membership_applications`, `public.profiles`, `public.circle_memberships`, `public.partnership_enquiries`, `public.programme_interests`, `public.insight_pitches`, `public.registry_submissions`, `auth.users` and storage assets. Never delete, truncate, reseed or overwrite them, and never replace real records with demonstration data. Demonstration data exists only in `src/dev/` and is removed from production builds.

## Access model (migration 0006, prepared, not applied)

| Who | Can | Cannot |
| --- | --- | --- |
| Visitor | Submit intake forms | Read any intake row |
| Signed-in member | Read and edit own profile and Circles, read own applications by verified email | Read anyone else's data, call Secretariat functions |
| `secretariat_reviewer` | Read all intake, reconcile accounts, change review stage, add notes, export | Change approval status, contact details, delete rows, read the audit log, grant roles |
| `secretariat_admin` | Everything a reviewer can, plus read the audit log | Change approval status, grant roles through the API |

Enforcement is in the database. `is_secretariat()` and `is_secretariat_admin()` take no parameters, so nobody can probe another account. A role held by an account with an unverified email is ignored. The `/secretariat` route guard and server role check only shape the interface.

Approval and decline decisions are deliberately absent. They need an approved authorisation model first.

## Applying migration 0006

1. Take and verify a backup of the Lovable Cloud database.
2. Apply `drizzle/migrations/0006_secretariat_access_and_security_hardening.sql` through Lovable's migration flow or SQL editor.
3. Confirm with `npm test` locally that the security suite still passes against the same SQL.
4. Provision the first administrator in the SQL editor, as the database owner. Replace the email with the Founder's verified account email:

```sql
insert into public.secretariat_roles (user_id, role, granted_note)
select id, 'secretariat_admin', 'Initial provisioning: Founder and CEO'
from auth.users
where lower(email) = lower('founder-email@example.org') and email_confirmed_at is not null;
```

5. Sign in and open `/secretariat`. It should list real names. If it says "not switched on", the migration is not applied. If it says the account holds no role, the provisioning query matched no verified account.

## Rollback for 0006

The migration is additive. To roll back without touching intake data:

```sql
drop trigger if exists audit_review_stage on public.membership_applications;
drop trigger if exists audit_secretariat_note on public.secretariat_notes;
drop function if exists public.audit_review_stage();
drop function if exists public.audit_secretariat_note();
drop policy if exists "Secretariat updates review stage" on public.membership_applications;
drop policy if exists "Secretariat reads applications" on public.membership_applications;
drop policy if exists "Secretariat reads profiles" on public.profiles;
drop policy if exists "Secretariat reads circle selections" on public.circle_memberships;
drop policy if exists "Secretariat reads programme interest" on public.programme_interests;
drop policy if exists "Secretariat reads partnership enquiries" on public.partnership_enquiries;
drop policy if exists "Secretariat reads editorial pitches" on public.insight_pitches;
drop policy if exists "Secretariat reads registry submissions" on public.registry_submissions;
revoke select on public.partnership_enquiries, public.insight_pitches, public.registry_submissions from authenticated;
revoke update (review_stage) on public.membership_applications from authenticated;
drop function if exists public.secretariat_list_accounts();
drop table if exists public.secretariat_audit_log;
drop table if exists public.secretariat_notes;
drop function if exists public.is_secretariat_admin();
drop function if exists public.is_secretariat();
drop table if exists public.secretariat_roles;
drop type if exists public.secretariat_role;
-- Keeping review_stage is harmless. Drop it only if required:
-- alter table public.membership_applications drop column review_stage;
```

Dropping the notes and audit tables deletes their rows, so export them first if they hold anything.

## Security findings

| Item | Finding | Action |
| --- | --- | --- |
| `create_member_profile()` | SECURITY DEFINER trigger function with default EXECUTE for PUBLIC | Revoked. Triggers do not check EXECUTE, so sign up still creates profiles (tested) |
| `is_verified_application_owner(text)` | SECURITY DEFINER, needed by the applicant read policy, only compares against the caller's own verified email | Kept for authenticated, revoked from anon |
| Supabase default privileges | New tables may grant full rights to API roles | Every new table revokes first, then grants the minimum. Applications get column-only UPDATE |
| Member app applications | Would show all applications to Secretariat users once read access exists | Scoped to the caller's own email |
| `.env` in git | Holds only publishable keys and URLs, no service secrets | No change. Never commit service keys |

## Privacy

Applicant names, emails, phone numbers and professional details are never exposed through public endpoints. Exports are recorded in the audit log before the file is produced. Consider South Africa's POPIA obligations and other regimes as the Society expands. Technical controls alone do not make the Society legally compliant, and nothing on the platform claims they do.

## Notifications

There is no email delivery today. Forms show an honest on-screen confirmation with the time, and say that no email receipt is sent. A future notification table must record intent separately from confirmed delivery.
