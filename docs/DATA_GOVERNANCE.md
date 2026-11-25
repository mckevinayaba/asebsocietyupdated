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

## The Living Village (migrations 0007 and 0008, prepared, not applied)

Apply in order, after 0006 and after a verified backup: `0007_living_village_shared_content.sql`, then `0008_community_media_storage.sql`. Then run `npm test`. The community security suite applies the same SQL and checks 29 rules.

### What changes for existing data

- `profiles` gains public-facing fields. Every existing profile starts **private**, so nobody becomes visible until they choose to.
- `is_secretariat()` is narrowed to administrators and reviewers, so the new editor and moderator roles never see membership records.
- The audit log accepts four new actions. No existing row is changed or removed.

### Editorial roles

| Role | Can | Cannot |
| --- | --- | --- |
| `moderator` | Publish, decline and hide posts, questions and answers. Resolve reports. Add notes | Make editorial decisions on stories, Playbook contributions, research or opportunities. See membership records |
| `editor` | Everything a moderator can, plus publish, schedule, feature and decline all kinds. Manage chapters, versions and Voices categories | See membership records. Change community mode |
| `secretariat_admin` | Everything above, plus open or close community publishing | Grant roles through the API |

Provision roles in the SQL editor, as the database owner, for verified accounts only:

```sql
insert into public.secretariat_roles (user_id, role, granted_note)
select id, 'editor', 'ASEB Voices and Playbook editor'
from auth.users
where lower(email) = lower('editor-email@example.org') and email_confirmed_at is not null;
```

### Community publishing

It starts pre-moderated. Open it from `/editorial` (Community settings) only after the Society approves community guidelines, contributor terms, a withdrawal procedure and a privacy notice. Those documents are not drafted as approved policy in this repository. `/community-guidelines` is a working summary and says so.

### Intellectual property and consent

Contributors keep ownership of their work. Each submission records permission to publish and, separately, permission for light edits. Withdrawal archives the item, which takes it off the platform. Approved contributor terms are still required, and nothing here claims legal compliance.

### Rollback for 0008 and 0007 (tested)

Export community content first, because these statements delete it. The bucket is removed only if it is empty. Delete its objects through the storage interface first if needed.

```sql
-- Rollback for 0008 then 0007. Export community content first: these statements delete it.
DROP POLICY IF EXISTS "Read community media" ON storage.objects;
DROP POLICY IF EXISTS "Remove own community media" ON storage.objects;
DROP POLICY IF EXISTS "Upload own community media" ON storage.objects;
DROP FUNCTION IF EXISTS public.media_is_public(text);
DELETE FROM storage.buckets WHERE id = 'community-media' AND NOT EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'community-media');

DROP POLICY IF EXISTS "Staff write own audit entries" ON public.secretariat_audit_log;
CREATE POLICY "Secretariat writes own audit entries" ON public.secretariat_audit_log FOR INSERT TO authenticated WITH CHECK (public.is_secretariat() AND actor_id = auth.uid());
DELETE FROM public.secretariat_audit_log WHERE action IN ('editorial_decision', 'report_resolved', 'setting_changed', 'chapter_changed');
ALTER TABLE public.secretariat_audit_log DROP CONSTRAINT secretariat_audit_log_action_check;
ALTER TABLE public.secretariat_audit_log ADD CONSTRAINT secretariat_audit_log_action_check CHECK (action IN ('note_added', 'review_stage_changed', 'records_exported'));

DROP TABLE IF EXISTS public.notifications, public.blocks, public.content_reports, public.follows, public.bookmarks, public.reactions, public.editorial_reviews, public.content_revisions CASCADE;
DROP TABLE IF EXISTS public.content_items CASCADE;
DROP TABLE IF EXISTS public.playbook_chapter_versions, public.playbook_chapters, public.voices_categories, public.platform_settings CASCADE;
DROP FUNCTION IF EXISTS public.enforce_content_lifecycle(), public.record_content_revision(), public.notify_on_content(), public.notify_on_review(), public.notify_on_follow(), public.audit_editorial_review() CASCADE;
DROP FUNCTION IF EXISTS public.content_authors(uuid[]), public.content_engagement(uuid[]), public.content_submitters(uuid[]), public.my_content(), public.profile_content(uuid, int), public.is_live_content(uuid), public.is_content_author(uuid), public.my_editorial_messages(), public.follower_count(uuid), public.public_profiles(uuid[], text, int), public.community_mode() CASCADE;
DROP FUNCTION IF EXISTS public.can_edit_content(), public.can_moderate(), public.is_verified_user(), public.has_staff_role(text[]) CASCADE;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS headline, DROP COLUMN IF EXISTS countries_of_operation, DROP COLUMN IF EXISTS expertise, DROP COLUMN IF EXISTS participation_paths, DROP COLUMN IF EXISTS links, DROP COLUMN IF EXISTS visibility, DROP COLUMN IF EXISTS home_preference, DROP COLUMN IF EXISTS guidelines_accepted_at, DROP COLUMN IF EXISTS onboarded_at;
-- Remove editor and moderator role rows. The enum values themselves stay: PostgreSQL cannot drop
-- enum values, and unused values are harmless.
DELETE FROM public.secretariat_roles WHERE role::text IN ('editor', 'moderator');
CREATE OR REPLACE FUNCTION public.is_secretariat() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT EXISTS (SELECT 1 FROM public.secretariat_roles r JOIN auth.users u ON u.id = r.user_id WHERE r.user_id = auth.uid() AND u.email_confirmed_at IS NOT NULL);
$$;
```
