# ASEB Society: intelligent community moderation and instant publishing

Branch `moderation/intelligent-publishing`, from `main` at `b36e23e` (27 November 2026).

## Production readiness decision

**Built and tested. Not ready to activate.** The system works end to end in code and in the database tests. Production stays exactly as it is today, pre-moderated, until five things are true:

1. Migration 0011 is applied after a verified backup.
2. `OPENAI_API_KEY` is added as a server secret in Lovable Cloud.
3. The Privacy Notice and Editorial and Moderation Policy drafts are approved and published.
4. The Society approves the use of the external service and its cross-border processing.
5. The rules are calibrated on a sample of real contributions.

Merging this branch changes nothing visible. The new Publish button appears only once a Secretariat administrator switches on automated publishing, and the server refuses that switch until the key exists.

## 1. Existing workflow findings

- **One model.** Posts, comments (answers), questions, articles, opportunities, stories, Playbook contributions and research all share `content_items`. They share one lifecycle trigger (`enforce_content_lifecycle`), one set of RLS policies, the editorial queue (`/editorial`), `editorial_reviews`, `content_reports`, in-app `notifications` and the Secretariat audit log.
- **Manual approval depended on two things.** The `community_mode` setting (`pre_moderated` by default) and the composer setting status `submitted`. Every community contribution waited for a moderator.
- **A security gap.** In `open` mode the database accepted `INSERT … status = 'published'` from any verified browser session, with no check of any kind. That mode could not have been used safely.
- **Gaps.** There were:
    - no automated checks
    - no appeals
    - no account restrictions
    - no rate limits or duplicate protection
    - no re-check of edits (authors simply could not edit published work)
    - no moderation records
- **Media.** A private bucket limited to JPEG, PNG and WebP up to 5 MB, readable by others only once a live public item uses the file. The type was checked from the declared content type only.

Nothing was duplicated. The existing queue, reviews, reports, notifications, audit log, editorial workspace and composer were all extended rather than replaced.

## 2. Changes implemented

**Database:** migration `0011_intelligent_community_moderation.sql`, registered in the journal.

**Server:**

| File | Role |
| --- | --- |
| `src/lib/moderation/rules.ts` | ASEB Society community rules and the decision engine |
| `src/lib/moderation/media.ts` | Attachment, ownership, file-type and video checks |
| `src/lib/moderation/provider.ts` | OpenAI Moderation API client |
| `src/lib/moderation/pipeline.ts` | The publishing pipeline, with dependencies injected for testing |
| `src/lib/moderation/engine.server.ts` | Server-only wiring to the service role and storage |
| `src/lib/community.functions.ts` | Save flow plus `recheckContribution`, `requestModerationReview`, `getMyModeration`, `getModerationWorkspace`, `resolveAppeal`, `restrictAccount`, `liftRestriction` and a guarded `setCommunityMode` |

**Interface:**

- **Composer:** Publish in automated mode, the publishing identity and visibility, a discreet guidelines notice, an inline video link field, location metadata stripped from photographs, and clear outcomes with "Try again", "Edit and publish again" and "Ask for a human review".
- **My contributions:** outcomes, retry, review requests, account standing, and editing of published work.
- **Report sheet:** new categories, with confidentiality stated.
- **`/editorial`:** two new views, Community exceptions and Account standing. It also shows the automated assessment on each item and adds a "Do not publish" decision.
- **Community Guidelines page:** a "How contributions are published" section.
- **Progress page:** updated statuses.

## 3. Database migrations

Migration 0011 is additive. It:

- **Publishing mode.** Retires `open`, converting it to `pre_moderated`, and adds `automated`.
- **States.** Adds `checking` and `restricted`.
- **Trigger.** Rewrites the lifecycle trigger.
- **Moderation records.** Adds `moderation_assessments` (append only), `moderation_appeals`, `account_restrictions` and `publishing_limit_problem()`.
- **Engine functions.** Adds `moderation_snapshot()` and `moderation_record_decision()`, both for the service role only.
- **Author functions.** Adds `my_moderation_outcomes()`, `my_account_standing()` and `request_moderation_review()`.
- **Indicators and reports.** Adds `moderation_indicators()` and the report limits.
- **Notifications and audit.** Adds a moderation notification kind, a `restricted` editorial decision and three new audit actions.

No row is deleted or rewritten, and nothing pending is published. Existing `submitted` items stay with moderators. Rollback steps are at the end of the migration file.

## 4. Security architecture

- **The only route to publication is the engine.**
    - An author can create a community contribution only as `draft`, `submitted` or `checking`.
    - `checking` is allowed only for community kinds, and only in automated mode.
    - Nothing is ever inserted as `published`.
    - Only `moderation_record_decision()` can move content out of `checking`. Its EXECUTE right is granted to the service role alone, and it sets a transaction-local engine flag. The trigger also refuses the flag when the session runs as `anon` or `authenticated`.
    - The tests prove an author cannot publish, restrict or escalate their own work, call the engine, read the snapshot, or set the flag themselves.
- **Decisions bind to exact content.** Each decision carries a fingerprint (MD5 of title, summary, body, media and details). A decision on text that changed during the check is recorded as stale and changes nothing.
- **Edits are checked again.** Editing published community work sends it back to `checking` (or to `submitted` when pre-moderated), and it disappears until it is decided again. Metadata-only changes to published work are refused.
- **Failures never publish.** A provider timeout, an error, a missing key or an attachment read failure records an `error` assessment. The item stays private in `checking` and can be retried by the author or a moderator.
- **Moderation records.** Assessments are append only: no API role, not even the service role, can update or delete them. Moderators read them. Authors see only the outcome and the reason written for them.
- **Abuse limits.** These are enforced in the database for authors:
    - 10 contributions in 10 minutes
    - 60 a day
    - no duplicate of the same text and kind (with the same parent) within a day
    - an active temporary pause or suspension blocks publishing
- **Reports.** A person can send 20 reports a day and cannot report their own work. A report never changes content.
- **Secrets.** `OPENAI_API_KEY` and the service role are used only in server code (`engine.server.ts`, `provider.ts`, loaded inside server handlers). The production build was searched: neither the key name, the OpenAI address nor the engine functions appear in any browser asset.
- **Data minimisation.** The engine reads only the contribution's own fields and photographs. Photographs reach the provider through signed links that expire after two minutes. No name, email, profile or membership data is sent.
- **Server-side request forgery.** The server never fetches contributors' links. Links are parsed and judged as text. Video links are reduced to canonical YouTube or Vimeo addresses, and the video itself is not inspected.
- **Attachments.**
    - Ownership of the uploader's own folder is checked against the path pattern.
    - The file must exist, and size is limited to 5 MB.
    - The real type is read from the file's first bytes, so a renamed file is rejected.
    - Photographs are re-drawn in the browser before upload, which removes embedded location data where the browser allows.
    - Restricted and unpublished photographs stay private under the existing storage policy.

## 5. Moderation decision rules

The most serious outcome wins, in the order restrict, then escalate, then publish.

| Source | Restrict | Escalate |
| --- | --- | --- |
| OpenAI categories (provider's own calibrated flags) | sexual/minors, hate/threatening, harassment/threatening, illicit/violent, sexual | hate, harassment, violence, violence/graphic, illicit, self-harm (all kinds) |
| OpenAI review bands (initial, uncalibrated, escalate only) | | sexual/minors ≥ 0.05, hate/threatening and harassment/threatening ≥ 0.3, sexual and hate ≥ 0.4 |
| Links | script, data or file links; credentials in the URL; raw IP addresses; program downloads | shortened links, internationalised lookalike domains, unencrypted account pages |
| Fraud (English, French, Portuguese) | | processing or registration fees, pay to unlock, guaranteed returns, "double your money", funding through WhatsApp or Telegram |
| Privacy | | card or identity numbers passing the Luhn check, IBAN-like numbers, passwords or PINs |
| Impersonation | | speaking officially for ASEB Society, unless the author holds a staff role |
| Spam | | more than six links, mostly capitals, long repeated characters, the same link three times |
| Attachments | not the author's file, missing, over 5 MB, not a real image, unsupported video provider | |

Criticism is protected by design. No rule reads sentiment. The model's general harassment flag only escalates, with a reason telling the author that criticism of work, institutions and policies is welcome. Tests confirm that critical posts about government programmes, accelerators, banks and ASEB Society itself, in three languages, publish.

Every rule and threshold lives in `src/lib/moderation/rules.ts` (`categoryRules`, the pattern lists). Changing them is a reviewed code change, recorded in Git.

## 6. User experience changes

- **Composer.** It keeps "What is happening in your ecosystem?". In automated mode:
    - The button reads Publish, and safe contributions publish without any extra step.
    - The permanent "every contribution is reviewed" notice is replaced by one quiet line linking to the Community Guidelines.
    - Drafts and preview are unchanged.
    - The publishing name and the visibility are shown above the button.
- **Outcomes.**
    - **Published:** "Your contribution is live."
    - **Sent to a moderator:** "A moderator is taking a quick look", with the reason, and it stays private.
    - **Not published:** "Not published", with the reason, "This was an automated assessment, not a judgement about you", Edit and publish again, and Ask for a human review.
    - **Check failed:** "Saved privately. Not published yet", with Try again.
- **Notifications.** In-app notifications are sent for publication, escalation, restriction, appeal outcomes and account responses.

## 7. External service requirements

- An OpenAI account and an API key with access to `/v1/moderations` (model `omni-moderation-latest`), saved as the server secret `OPENAI_API_KEY` in Lovable Cloud.
- Confirmation of OpenAI's data usage and retention terms for moderation requests, and a POPIA cross-border transfer basis. These are marked [confirm] in the Privacy Notice draft.

## 8. Cost implications

OpenAI has offered the Moderation API free of charge, but this could not be checked from this environment. Confirm the current terms before activation.

Each contribution makes:

- **No call** when a local rule already restricts it.
- **One call** for text, plus the first photograph.
- **One more call** for each additional photograph.

Request volume is bounded by the database limits: 10 contributions in 10 minutes and 60 a day per person. No paid service, model training or infrastructure was added. Supabase storage and database use are unchanged apart from the small assessment records.

## 9. Testing results

| Check | Result |
| --- | --- |
| `npx tsc --noEmit -p .` | Clean |
| `npm test` | 17 files, 239 tests passed |
| `src/test/moderation-security.test.ts` | 21 tests. Run against the real migrations in PostgreSQL as visitors, authors, readers, moderators, administrators and the service role. Covers: modes, the open-mode bypass closed, no direct publishing, engine-only transitions, fingerprints, failure stays private, edits re-checked, restricted and escalated work private, author edits and retries, moderator decisions, appeals (own only, once, audit, notification), duplicates, rate limits, warnings, pauses and suspension permissions, report categories and limits, indicators, editorial kinds unchanged |
| `src/test/moderation-engine.test.ts` | 36 tests. Covers: legitimate posts in English, French and Portuguese; five critical posts; restriction of threats, explicit content and minors; escalation of discrimination and self-harm; five fraud patterns in three languages; malicious and suspicious links; privacy, impersonation and spam; real-byte image checks; folder ownership; video normalisation; disguised and oversized files; pipeline publishes safe content; never publishes on service failure; skips the external call for clear local violations; ignores stale work |
| Existing security suites | `database-security` and `community-security` still pass against migration 0011 |
| Accessibility (axe, WCAG 2.2 A and AA) | No violations on `/community-guidelines` (390 and 1440 px), `/progress`, `/the-field` (390 and 1440 px) and `/contribute` |
| Layout | No horizontal overflow on six affected pages at ten widths, 320 to 1920 px |
| Build | Succeeds. No key, OpenAI address or engine function in browser assets |

**Not tested, and why:**

- **The OpenAI model itself.** There is no key in this environment, and its servers are not reachable from here. Accuracy across English, French, Portuguese and other African languages and dialects is therefore unmeasured. The tests prove ASEB Society's response to classifications, not the classifications.
- **The signed-in journey on a live backend.** The automated-mode composer, the editorial views and the report sheet were type-checked and logic-tested, but not clicked through. Doing that needs migration 0011 applied, a test account and the key.
- **Production.** Not touched or verified.

## 10. Outstanding limitations

- **Calibration.** Review bands and rules are initial values. Before activation, run 100 to 200 real, varied contributions (including French, Portuguese, Arabic, Swahili and code-switched text) through the engine with a moderator reviewing every outcome, then adjust `categoryRules`.
- **Fraud, misinformation and serious allegations** cannot be judged reliably by patterns or the general model. Those cases escalate to people, and fraud patterns will miss new wording.
- **Videos** are validated as links only. Their content is not moderated.
- **Location stripping** relies on the browser re-drawing the photograph. If that fails, the original is uploaded. The server checks type and size but does not re-encode.
- **Circles discussions** do not exist yet as a content type. When they are built, they should use `is_community_kind`.
- **Rate limits are counts**, not a dedicated limiter, and are deliberately generous for professionals.
- **Retention** of assessment records is proposed (24 months) but not automated.
- **Moderation indicators** are counts only. Response-time measures need decision timestamps per case, which a later version can derive from `editorial_reviews`.

## 11. Privacy and policy requirements

These drafts now describe automated assessment, the external provider, what is and is not sent, outcomes, appeals, account responses, reports and retention:

- `docs/legal/PRIVACY_NOTICE_DRAFT.md`
- `docs/legal/EDITORIAL_AND_MODERATION_POLICY_DRAFT.md`
- the Community Guidelines page

All remain drafts. Before activation, the Society must:

1. Approve and publish the Privacy Notice, the Community Guidelines and the Editorial and Moderation Policy.
2. Appoint an Information Officer.
3. Confirm the cross-border basis for sending content to OpenAI.
4. Approve the retention period.

## 12. Deployment and rollback

**Deploy, in this order:**

1. Back up the Lovable Cloud database and confirm the backup.
2. Merge the pull request. Lovable syncs `main`. Nothing visible changes.
3. Apply migration 0011 in Lovable. If production was in `open` mode, it becomes `pre_moderated`.
4. Add `OPENAI_API_KEY` in Lovable Cloud secrets.
5. Calibrate (section 10) with a staff test account. Do not use real members.
6. Once approvals are in place, a Secretariat administrator opens `/editorial`, then Settings, and chooses "Automated, with people handling exceptions". The change is recorded in the audit log.

**Instant rollback:** choose Pre-moderated in `/editorial` Settings. New contributions immediately wait for moderators again, and published content is unaffected.

**Full rollback:** see the SQL notes at the end of migration 0011. Export `moderation_assessments`, `moderation_appeals` and `account_restrictions` first.

## 13. Status of this work

| Stage | Status |
| --- | --- |
| Repository changes | Complete on `moderation/intelligent-publishing` |
| GitHub push and pull request | See the pull request |
| Lovable sync | After the owner merges. Not verified here |
| Migration 0011 applied | No. Applied by the owner after backup |
| Production activation | No. Requires the approvals and secret above |
