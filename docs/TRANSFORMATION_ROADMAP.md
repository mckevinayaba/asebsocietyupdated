# Transformation roadmap

| Workstream | Status |
| --- | --- |
| A. Engineering foundation | Done: baseline, security migration prepared, security tests, documentation |
| B. Visual experience and application shell | Done: tokens, shell, home, cinematic openings, story viewer |
| C. Institutional public platform | Done: home, Why We Exist, Our Story, Invest, Countries, Discover, Progress, Summit link |
| D. Secretariat operations | Built and tested. Live once migration 0006 is applied and a role is provisioned |
| E. Continental and member infrastructure | Partly done: directory and profiles. Next: representatives table, registry migration, profile visibility controls, saved items table |
| F. Launch readiness | Partly done: PWA, sitemap, robots, accessibility scan, overflow checks. Next: performance measurement on real devices, French |

## Living Village (this release)

Built and tested: the shared content model (0007), private media storage (0008), the five products, the composer, onboarding, profiles, My contributions, notifications, the editorial workspace, sharing metadata and preview images. Live once the migrations are applied.

## Next, in priority order

1. Apply migrations 0006, 0007 and 0008 after backup. Provision the Founder as Secretariat administrator and at least one editor. Verify real names appear in /secretariat.
2. Decide the membership approval authority. Then add approve and decline as an audited database function.
3. Add `saved_items` with owner-only access, and sync device saves on sign in.
4. Add a `representatives` table with appointment periods and publication status, and an admin view for Country Partner and Ambassador decisions.
5. Migrate the Field Registry to the database, preserving slugs and sources, with editorial review states.
6. Notification records with honest delivery states, using existing infrastructure only.
7. Profile visibility preferences and public practitioner profiles.
8. Measure Core Web Vitals on a mid-range Android phone over a constrained connection. Add responsive image sizes (`srcset`) for the largest photographs.
9. French, after professional translation.
10. Circles discussion with moderation, once facilitators and policies exist.
