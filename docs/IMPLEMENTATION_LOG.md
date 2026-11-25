# Implementation log

## 25 November 2026, branch `transform/institutional-platform`

Baseline on `main` at `62d56c2`: 7 test files and 36 tests passing, type check passing, production build passing, no uncommitted changes.

| Commit | Workstream |
| --- | --- |
| Prepare Secretariat access model and security hardening migration | A. Migration 0006, PGlite security tests |
| Add Secretariat membership workspace | D. `/secretariat`, reconciliation, notes, export, member app scoping |
| Add installable app, offline fallback, sitemap and indexing rules | F. Manifest, icons, service worker, sitemap, robots, SEO helper |
| Rebuild the public platform around an application shell and the institutional case | B and C. Shell, home, Why We Exist, Our Story, Invest, Countries, Discover, Stories, You, Progress |
| Documentation, accessibility fix and implementation report | A and F |

Final state: 9 test files and 63 tests passing, type check passing, production build passing, no WCAG 2.2 AA violations in automated scans of ten key screens, no horizontal overflow on 37 routes at seven widths.

Blocked: the production database is not reachable from this environment (migration 0006 not applied), and the AfDB source is blocked by network policy (statistic not published).

## 25 November 2026, branch `village/living-village`

Base: `main` at `43961b7`, unchanged since the transformation merge.

| Commit | Workstream |
| --- | --- |
| Prepare the Living Village shared content model, private media storage and tests | Database: migrations 0007 and 0008, 25 tests |
| Build the five knowledge products on the shared content model | The Field, Voices, Playbook, Ask, State of the Field, editor, sharing |
| Integrate the village into navigation, home, profiles and editorial tools | Shell, home, onboarding, You, editorial workspace, Invest |
| Verify, document and finish the Living Village | Tests, accessibility, responsiveness, docs, report |

Final state: 11 test files and 105 tests passing, type check and build passing, no WCAG 2.2 AA violations in 20 automated scans, no horizontal overflow on 56 routes at ten widths.
