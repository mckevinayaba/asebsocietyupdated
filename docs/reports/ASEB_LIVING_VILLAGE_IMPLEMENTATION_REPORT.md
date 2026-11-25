# ASEB Society, The Living Village: implementation report

25 November 2026 · Branch `village/living-village` · Base `main` at `43961b7`

Classifications: **Implemented and verified**, **Implemented but not independently verified**, **Prepared but not applied**, **Partially implemented**, **Requires approval**, **Blocked**, **Not implemented**.

## 1. Executive summary

The approved platform has been extended into a participatory digital institution, without replacing it. Five knowledge products now share one content model and one set of rules for identity, consent, attribution, media, moderation and publication: The Field, the African Ecosystem Building Playbook, ASEB Voices, Ask the Village and State of the Field. Desktop gets a full professional workspace. Mobile keeps its five bottom destinations. "What is happening in your ecosystem?" is prominent on both.

All community functionality is connected to real database infrastructure: migrations 0007 and 0008, tested against PostgreSQL with 29 security and workflow rules. They are **prepared but not applied**, because this session has no access to the Lovable Cloud database. Until they are applied, every product shows its editorial frame and an honest "Opening soon" state. Community publishing starts pre-moderated, because community guidelines and contributor terms aren't yet approved.

## 2. Existing implementation reconciled

- `main` was unchanged since the merge of [mckevinayaba/asebsocietyupdated#2](https://github.com/mckevinayaba/asebsocietyupdated/pull/2). No concurrent Lovable edits were found. `AGENTS.md` was present (a session notice wrongly reported it missing).
- No village, biological ecosystem or editorial artwork exists in the repository or Lovable's asset store, which holds one photograph. Authentic ASEB photography is used. **Requires approval** for any conceptual artwork.
- Stories from the Field and Founder Voices were never separate products. The only related piece was the full screen archive viewer at `/stories`, now part of ASEB Voices.
- `/field` already served Roles in the Field, so The Field lives at `/the-field`. All existing URLs are preserved.
- Title corrected to "Founder & Chief Executive Officer" in the leadership, speaker and registry records. **Implemented and verified** (test).

## 3. Five digital knowledge products

| Product | Address | Status |
| --- | --- | --- |
| The Field | `/the-field`, `/the-field/$slug` | Implemented. Live after migrations |
| The Playbook | `/playbook`, `/playbook/$slug` | Implemented. Chapters visible now as proposed topics |
| ASEB Voices | `/voices`, `/voices/$slug` | Implemented. Archive stories visible now |
| Ask the Village | `/ask`, `/ask/$slug` | Implemented. Live after migrations |
| State of the Field | `/state-of-the-field`, `/state-of-the-field/$slug` | Implemented. Evidence Library visible now |

None is presented as a pillar (test). Full architecture: `docs/LIVING_VILLAGE.md`.

## 4. ASEB Voices consolidation

ASEB Voices is the dominant editorial brand, with nine editor-managed categories. `/founder-voices` and `/stories-from-the-field` redirect (301). The archive viewer is retitled. No content or submission was deleted. **Implemented and verified.**

## 5. Founder participation architecture

Founders' Voices category with topic guidance, an explicit statement that accounts are perspectives and not verified evidence, no ratings or naming and shaming, editorial review of sensitive claims, and moderated responses that let founders corroborate or respond to published stories. A founder story is stored with the evidence class "founder perspective". **Implemented and verified** (rendering and tests). Live after migrations.

## 6. Desktop professional experience

Application bar with search, Create, notifications and You. The Field workspace has left professional navigation, a centre composer and feed, and a right panel of real content (open Playbook calls, featured Voices, live questions, an invitation to invest) that shows open calls rather than fake activity when empty. Long-form story and research pages use their own single-column compositions. **Implemented and verified** at 1024 to 1920 pixels.

## 7. Mobile professional experience

Five bottom destinations unchanged. Home opens The Field for signed-in members. Discover tabs reach the Playbook, Voices, Ask the Village, State of the Field, Academy, Opportunities and Events. You tabs reach profile, contributions, saved, following, membership and settings. Bottom sheets handle the composer, reports and notifications, and the editor's action bar sits above the bottom navigation and safe area. **Implemented and verified** at 320 to 768 pixels in Chromium. **Implemented but not independently verified** on physical devices and with on-screen keyboards.

## 8. Contribution composer implementation

"What is happening in your ecosystem?" sits at the top of The Field on every width, with Write a post, Photograph, Video, Article, The Playbook, Your voice, Ask the Village and Opportunity. Quick updates open in a sheet. Other kinds open the full editor. Visitors are sent to sign in and returned. **Implemented and verified.**

## 9. Publishing workflows

One editor for eight content kinds, with kind-specific fields, device autosave for interrupted sessions, drafts saved to the account, preview, private photo upload, YouTube or Vimeo links, visibility, attribution, publication and edit consent, and clear feedback on submission. "Continue editing" works for drafts and revision requests. Lifecycle, consent and role rules are enforced in the database. **Implemented and verified** (29 database tests, 13 model tests). Live after migrations.

## 10. Playbook implementation

14 proposed chapters, seeded in the database and mirrored in the app (parity test). Each has a public URL, a status, an open call, the current published version, published contributions, a follow button and a structured contribution form (perspective, challenge, approach, outcomes, lessons, references). Editors can create, edit, reorder, archive and publish versioned chapter text. No chapter is presented as a standard. Chapters are shown without number badges. **Implemented and verified.**

## 11. Editorial and moderation workflows

`/editorial` provides a review queue across all products with the real submitter, consent and evidence details, a message to the author, private notes, publish, schedule, accept, request revision, decline, hide, restore and feature, plus full history. It also covers reports, chapters and versions, Voices categories and the community publishing switch (administrators only). Moderators handle community content. Editorial kinds need an editor. **Implemented and verified** (database tests). The interface is **Implemented but not independently verified** with a live signed-in role.

## 12. Ask the Village

Questions, answers, "useful" marking that orders answers, follow question, an unanswered view, reporting, a disclaimer that answers aren't official ASEB guidance, and routes into Circles, Playbook calls and Field Lab. **Implemented and verified.** Live after migrations.

## 13. State of the Field

Evidence submission with evidence class, coverage, method and source. Classification guidance, the existing Evidence Library alongside, and no national statistics. **Implemented and verified.** Live after migrations. A continental report is **Subject to funding**.

## 14. Onboarding and profiles

"Find your place in the village" offers nine multi-select pathways, profile fields, private-by-default visibility, a home preference and guideline acceptance. Public profiles come only through a function that never returns contact details or preferences, and they're labelled as participation, not membership or accreditation. Follow and real follower counts. **Implemented and verified.** Live after migrations.

## 15. Social sharing and organic growth infrastructure

Every published item has a permanent URL. Item routes load public-only metadata on the server (publishable key, never the service role). Unpublished items get a generic noindex preview (verified in server-rendered HTML). Five branded 1200×630 preview images use the official mark, the brand fonts and authentic photography. There's native share or copy link everywhere, and the sitemap is extended to 290 URLs. **Implemented and verified.** Per-item generated images and downloadable contributor graphics are **Not implemented**.

## 16. Institutional funding conversion

Invest in Our Mission stays prominent. New investment areas cover the Playbook, Voices and institutional memory, and knowledge accessibility. Twelve ways to contribute beyond money each link to a working route, and the enquiry form gained matching options. No amounts or commitments are published. **Implemented and verified.**

## 17. Homepage enhancements

Tagline "It Takes a Village." and the approved mandate statement. Hero tabs for Our Purpose, The Field and Following. The economics of interdependence is presented as one argument among many. "From the village" shows the latest live item per product, or its real open call, and sits below credibility so the investment case stays dominant. No Summit counters added. **Implemented and verified.**

## 18. Media and visual assets

Existing authentic photography only. Photographs are private uploads in the `community-media` bucket (5 MB, JPEG, PNG or WebP, enforced by storage), readable by others only once a live public item uses them. Responsive image variants and focal points are **Not implemented**.

## 19. Backend and database changes

- **0007:** editor and moderator roles; a narrowed `is_secretariat()`; platform settings; profile fields; Voices categories; Playbook chapters and versions; `content_items` with lifecycle trigger and revisions; editorial reviews; reactions, bookmarks, follows, reports and blocks; notifications with triggers; public profile, author, submitter, engagement and own-content functions; extended audit actions.
- **0008:** the storage bucket and its policies.

Server functions are in `src/lib/community.functions.ts` and public metadata in `src/lib/community.public.ts`. **Prepared but not applied.**

## 20. Data preservation

Every change is additive. Existing profiles become private by default and gain empty fields. No existing record is changed, and the rollback for 0007 and 0008 was tested against PGlite: membership data, Secretariat access and public submissions survive. **Implemented and verified** (simulation). Production backup: **Requires approval and owner action**.

## 21. Security and permissions

Highlights, all tested:

- `author_id` is not readable, so unnamed work can't be unmasked.
- Drafts are private even from editors.
- Nothing publishes without consent, and text can't be edited without consent.
- Roles can't be self-granted, and unverified emails hold no role.
- Editors and moderators can't read membership records.
- Reactions are private, and counts come only from real rows.
- Reports are visible only to the reporter and moderators.
- Media stays private until its item is published.

A flaw found in my own design (authorship exposure) and two policy regressions were caught by the tests and fixed before commit. The production security advisor was not run (no access). **Blocked.**

## 22. Secretariat functionality

`/secretariat` from the previous release is unchanged and links to `/editorial`. Membership management is unaffected by the new roles. **Implemented and verified** (code and tests). Live after 0006.

## 23. Accessibility and performance

axe-core WCAG 2.2 AA scans of 20 screens: one target-size issue found in the workspace navigation and fixed, then zero violations. Responsive: 56 routes at 320, 360, 390, 430, 768, 1024, 1280, 1440, 1536 and 1920 pixels. One overflow at 320 pixels (a long headline word) was fixed by stepping down display sizes below 360 pixels, then rechecked. Main script about 106 KB gzipped. Real-device, screen reader and constrained-network testing: **Not implemented**.

## 24. Rendered screenshots and preview routes

Screenshots are in `docs/reports/screenshots/village/`. The Field and ASEB Voices with content use the development-only `/preview/village` route, with labelled demonstration content that is removed from production builds (verified). Other screenshots show the real pre-migration state.

## 25. Automated test results

11 files and 105 tests pass, up from 7 files and 36 tests before the transformation programme:

- 29 community database tests
- 12 Secretariat database tests
- 13 community model tests
- 15 platform tests
- the existing suites

The type check and production build pass. Lint has pre-existing Prettier errors that were not mass reformatted.

## 26. Git commits and push status

Commits on `village/living-village`, in workstreams: database layer, knowledge products, integration, verification and documentation. The push status is recorded in the pull request.

## 27. Lovable synchronisation status

**Not verified.** Lovable follows `main`, so these changes reach Lovable only after the pull request is merged.

## 28. Outstanding limitations and approvals

- Apply 0006, 0007 and 0008 after backup, then provision an administrator, editors and moderators.
- Approve community guidelines, contributor terms, a withdrawal procedure and a privacy notice before opening community publishing.
- Approve any conceptual artwork.
- Not built:
  - email and push delivery
  - audio and video hosting
  - per-item preview images
  - responsive image variants
  - a database-backed sitemap for published items
  - representative appointment records
  - French
  - a desktop article editor with rich formatting (plain text with headings, quotes and lists is supported)
- Discussions on Circles, and Circle-specific feeds, are not yet connected.

## 29. Production release readiness

The code is ready for review and merge. Before migrations, the public site works fully, with honest "Opening soon" states. After migrations and role provisioning, the community is functional in pre-moderated mode. Production publication **Requires approval**. Follow `docs/PRODUCTION_RELEASE_CHECKLIST.md`.

## 30. Rollback procedures

- **Code:** revert the merge commit on `main` with a new commit. Never force push.
- **Database:** the tested rollback SQL for 0008 and 0007 is in `docs/DATA_GOVERNANCE.md`. Export community content first. The added enum values remain and are harmless.
- **Storage:** the bucket is removed only when empty.
