# ASEB Society digital transformation: implementation report

25 November 2026 · Branch `transform/institutional-platform` · Base `main` at `62d56c2`

Status classifications used throughout: **Implemented and verified**, **Implemented but not independently verified**, **Prepared but not applied**, **Partially implemented**, **Requires approval**, **Blocked**, **Not implemented**.

## 1. Executive summary

The platform has been rebuilt around the institutional case and a mobile application shell, without replacing the project or its stack. A first-time visitor now meets the economic problem, the institution's answer and an investment pathway before any Summit history. Phones get an application frame from the first visit. The Secretariat has a secure membership workspace, and the database access model behind it has been written, tested against real PostgreSQL and documented. It still has to be applied to Lovable Cloud.

Two things could not be done from this environment. The production database is not reachable, so the Secretariat migration is prepared but not applied and no real member names have been seen. The African Development Bank site is blocked by network policy, so its youth labour statistic is held back rather than published unverified.

## 2. Existing architecture verified

TanStack Start 1.168 with TanStack Router 1.170, React 19, Vite 8, Tailwind CSS v4, TanStack Query, Supabase client libraries on Lovable Cloud PostgreSQL, server functions in `src/lib/member.functions.ts`, Vitest. Migrations are hand-written SQL in `drizzle/migrations/` (0000 to 0005 at baseline). Package manager is Bun (`bun.lock`). `.env` in git holds only publishable keys. No `CLAUDE.md` existed. The comprehensive Lovable audit and previous implementation reports referred to in the directive are not in the repository, so the audit's figures were checked against the code where possible. **Implemented and verified.**

The directive mentions an uploaded TikTok screenshot. No image was attached to this session. The interaction principles it describes (clear contextual top navigation, persistent bottom navigation, a floating right-side action rail, content as the visual focus) were implemented from the written description, using authentic ASEB photography. **Partially implemented: the reference image itself was not available.**

## 3. Approved institutional decisions implemented

| Decision | Status |
| --- | --- |
| Positioning, philosophy, promise and "Invest in Our Mission" as primary action | Implemented and verified |
| Four pillars intact, ASEB Circles name retained | Implemented and verified (unit test) |
| Movement to institution, editions and figures moved to Our Story | Implemented and verified |
| Ecosystem Tax removed from public content | Implemented and verified (search of `src`, unit test on discovery content) |
| Leadership cumulative figures shown with provenance, not as verified | Implemented and verified |
| Mayotte 2027 discoverable without unconfirmed details | Implemented and verified |
| Country Partners and Ambassadors central to expansion | Partially implemented (directory, profiles, intake. Appointment records not yet built) |
| No unapproved fees, budgets, staff or funding claims | Implemented and verified |

## 4. Design system implementation

Tokens extended in `src/styles.css`: a night cinematic surface, motion durations and curves, sheet and bar elevation, hero and title type scales, shell dimensions and safe areas. Newsreader and Hanken Grotesk kept. Original line icons on one grid, used only for navigation and actions. Details in `docs/DESIGN_SYSTEM.md`. **Implemented and verified.**

## 5. Desktop experience

Desktop navigation: About, Our Work, Explore, Knowledge and Get Involved as editorial menus, plus search (with `/` shortcut), member access and a persistent Invest button. Contextual section tabs under the bar. **Implemented and verified.** The member workspace keeps its left rail and right panel. A fuller desktop member workspace with global search and contextual panels is **Partially implemented**.

## 6. Mobile application experience

Fixed application bar (clear on the immersive opening, solid elsewhere), contextual tabs that scroll sideways, a persistent five-tab bottom navigation (Home, Explore, Circles, Discover, You) shared with the member app, bottom sheets for menu, search and details, safe-area padding with `viewport-fit=cover`. **Implemented and verified** in Chromium at phone widths. **Implemented but not independently verified** on physical iOS and Android devices.

Full-screen Field stories with vertical swipe, keyboard and button alternatives and a Save, Share, Related and About rail. No counts, no autoplay. **Implemented and verified.**

## 7. Screenshots and preview routes

Screenshots from the development build are in `docs/reports/screenshots/`: home (desktop and 390px), Invest, Stories, Discover, Countries, Angola profile, Progress, Why We Exist, and the Secretariat workspace (desktop and 390px). The Secretariat screenshots use **labelled demonstration data** from the development-only route `/preview/secretariat`. That route answers "not found" in production, and its data module is absent from the production build (verified by searching `.output`).

New public routes: `/invest`, `/countries`, `/countries/$slug`, `/discover`, `/stories`, `/you`. New protected route: `/secretariat`. All existing public URLs are preserved.

## 8. Public website transformation

Home page sections, in order: cinematic introduction, economic imperative, the overlooked question, the institutional solution with an interactive theory of change, four mandate panels (challenge, purpose, contribution, where it stands, pathway), continental network index, credibility, institutional investment and professional participation. Why We Exist rewritten. Our Story rebuilt as the archive. Progress gained a five-status register. Summit page links asebs.com and Mayotte 2027. **Implemented and verified.**

## 9. Funding and partnership experience

`/invest` covers the structural problem, intervention logic, eight investment areas with intended outcomes, plain operational readiness, accountability and an institutional enquiry form. The form writes to the existing `partnership_enquiries` table through the validated `/funders` source, so no schema change was needed. Document requests are recorded as an interest option and answered only once material is approved. All form confirmations now state the submission time, say that no email receipt is sent, and no longer promise reply times. **Implemented and verified** for rendering and validation. **Implemented but not independently verified** for a live submission to production, which was deliberately not done from this environment.

## 10. Secretariat administration

`/secretariat` shows reconciled people (applications matched to accounts by email), Circle selections, partnership, Country Partner and Ambassador enquiries, programme interest, pitches and registry submissions. It supports search, filters, a detail panel, review stages, append-only internal notes and an audited CSV export with formula injection protection. It shows honest states when the migration is missing or the user holds no role. There are no approve or decline controls. **Implemented and verified** in code and tests. **Prepared but not applied** in production, because it depends on migration 0006.

## 11. Membership data preservation and reconciliation

No production record was read, changed or deleted. The audit baseline counts (nine applications, two profiles, three Circle selections) are not hardcoded anywhere. Reconciliation logic treats applications and accounts as possibly the same person and never treats an account as membership (unit tested). The member app now scopes its application list to the caller's own email. **Implemented and verified.** Seeing real names **Requires approval** and the migration.

## 12. Country Partner and Ambassador infrastructure

54 sovereign states by African Union region, Mayotte as a classified territory, country profiles that show only confirmed representation (Angola's Country Partner, and Lusophone regional coverage), Field Registry records labelled as archive recognition, and application pathways. **Implemented and verified.** Appointment records, terms and activity reporting: **Not implemented** (designed in `docs/CONTINENTAL_NETWORK.md`).

## 13. Backend changes

New server functions in `src/lib/secretariat.functions.ts`: overview, notes, add note, set review stage, record export, access check. All run with the signed-in user's own token, so row level security decides what is returned. Registry gained validated `type` and `country` URL filters. Sign in preserves a validated same-origin destination. **Implemented and verified.**

## 14. Database migrations

`drizzle/migrations/0006_secretariat_access_and_security_hardening.sql`, registered in the journal. It is additive only. It adds roles, parameterless role checks, read policies, a column-limited review stage update, an account reconciliation function, append-only notes and an admin-only audit log with triggers. **Prepared but not applied.** It was verified by applying migrations 0000 to 0006 to PGlite (PostgreSQL in memory) with Supabase's default privileges simulated. The documented rollback was also tested, and it preserves intake data and access.

## 15. Security findings and remediation

| Finding | Remediation | Status |
| --- | --- | --- |
| `create_member_profile()` executable by PUBLIC | Revoked. Profile creation on sign up still works (tested) | Prepared but not applied |
| `is_verified_application_owner(text)` | Kept for authenticated (needed by policy, cannot enumerate), revoked from anon | Prepared but not applied |
| Default privileges would let a new update policy change approval status | Table-wide UPDATE revoked, column-only grant for `review_stage`. Caught by the new tests before release | Prepared but not applied |
| Secretariat read access would leak into the member view | Member query scoped to own email | Implemented and verified |
| Self elevation | No API path grants roles, including for admins (tested) | Prepared but not applied |
| Unverified email holding a role | Ignored by role checks (tested) | Prepared but not applied |
| Open redirect after sign in | Same-origin validation (tested) | Implemented and verified |
| Private screens indexed | robots rules and `noindex` on private routes | Implemented and verified |

The Supabase security advisor was not run against production, because the project is not reachable from this session. **Blocked.**

## 16. Accessibility results

axe-core 4.10 (WCAG 2.0 A and AA, 2.1 AA, 2.2 AA rules) on home (390 and 1440), Invest, Countries, Discover, Our Story, Why We Exist, Progress, Stories and the Secretariat preview: one issue type found (photo credit contrast), fixed in the shared component, then zero violations. Keyboard support was built for tabs, sheets, the theory of change and the story viewer. Reduced motion disables all animation. **Implemented and verified** (automated). Screen reader testing on devices: **Not implemented**.

## 17. Performance results

Production build: main script about 113 KB gzipped, with route-level code splitting from TanStack Router. Images lazy-load below the fold, and the opening image uses `fetchPriority="high"`. Core Web Vitals on a real mid-range Android device over a constrained network: **Not implemented** (not measured). Responsive `srcset` images are recommended next.

## 18. PWA implementation

Manifest, icons from the official mark, standalone display, theme colours, shortcuts, offline page and a service worker with a privacy-safe caching policy. It registers in production only and never inside embedded previews. **Implemented but not independently verified** for installation on real devices. Icons are slightly soft because the source mark is 271 pixels wide, so a high-resolution master logo is needed.

## 19. SEO implementation

Canonical URLs and Open Graph metadata on new and rewritten routes, a 270-URL sitemap with a generator script, robots rules excluding private screens, and preserved public URLs. Structured data: **Not implemented**. Canonical tags on every older route: **Partially implemented**.

## 20. Automated and manual testing

| Check | Result |
| --- | --- |
| Baseline tests before changes | 7 files, 36 tests passing |
| Tests after changes | 9 files, 63 tests passing, including 12 database security tests and 15 platform tests |
| Type check | Passing |
| Production build | Passing |
| Lint | Pre-existing Prettier errors across the codebase, not mass reformatted to avoid conflicts with Lovable |
| Overflow at 360, 390, 430, 768, 1024, 1440, 1536 | No overflow on 37 routes, no page errors |
| Signed-out protected routes | Redirect to sign in with destination preserved |
| Visual review | Screens inspected and refined. Phone hero, grid overflow, interior hero contrast and demo labelling were all fixed after review |
| Authentication, form submission and admin access against production | Not run, deliberately, to avoid writing to production from this environment |

## 21. Files created and modified

Created: shell components (`src/components/shell/*`), `TheoryOfChange`, `MandatePanels`, `ContinentalField`, content modules (`navigation`, `case`, `continent`, `discover`, `progress`), `secretariat.ts`, `secretariat.functions.ts`, `site-search.ts`, `seo.ts`, `use-saved.ts`, pages (Invest, Countries, Discover, Stories, You, Secretariat), new routes, `src/dev/secretariat-demo.tsx`, migration 0006, two test files, PWA files in `public/`, `scripts/generate-sitemap.mjs`, `CLAUDE.md` and `docs/*`.

Modified: Layout, Footer, Photo, EoiForm, AppShell, Home, Why We Exist, Our Story, Progress, Summit, Registry, People, form confirmations on five pages, auth and protected routes, root head, `styles.css`, `site.ts`, generated database types, `package.json`, `AGENTS.md`. Removed: the replaced `Header.tsx`.

## 22. Git branch and commit information

Branch `transform/institutional-platform`, five commits in reviewable workstreams. See `docs/IMPLEMENTATION_LOG.md`.

## 23. GitHub push status

Recorded in the pull request. A push confirms GitHub received the commits, nothing more.

## 24. Lovable synchronisation status

**Not verified.** Lovable is connected to `main`, so these changes reach Lovable only after the pull request is merged. Whether Lovable previews feature branches was not verified from this environment.

## 25. Outstanding limitations

Migration 0006 not applied. Real member names not yet visible. AfDB statistic unverified. No email notifications. Saved items on device only. No representative appointment records. Registry still static. No French. No structured data. No real-device performance or screen reader testing. Icons need a higher-resolution logo. The 2022 edition has no authorised photograph in the archive, and the 2022 story slide uses an Awards photograph whose year is not recorded (the caption says so).

## 26. Required approvals

Apply migration 0006 after backup and provision the Founder as Secretariat administrator. Define the membership approval authority. Approve or verify the AfDB statistic and the cumulative figures. Approve release of concept notes. Approve the visual direction shown in the screenshots. Approve production publication.

## 27. Production release readiness

The code is ready for review and merge: tests, types, build, accessibility scans and overflow checks pass. The Secretariat becomes useful only after the migration is applied. Production publication **Requires approval**. Follow `docs/PRODUCTION_RELEASE_CHECKLIST.md`.

## 28. Rollback procedures

- **Code:** revert the merge commit on `main` with a new commit (never force push), or revert individual workstream commits.
- **Database:** the tested rollback SQL for migration 0006 is in `docs/DATA_GOVERNANCE.md`. Export notes and audit rows first if they hold anything.
- **Service worker:** to retire it, ship a `sw.js` that deletes all caches and unregisters itself, and remove the registration component.
