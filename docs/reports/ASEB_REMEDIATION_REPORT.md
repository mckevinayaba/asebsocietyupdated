# ASEB remediation report

Everything listed as corrected exists on the branch `quality/launch-readiness`. It reaches the live site only after the pull request is merged into `main` and Lovable publishes. A GitHub push is not a Lovable sync, and a Lovable preview is not a production release.

## Corrected

1. Six links to the old site's own domain removed or replaced, including the Leadership Advisory Council source link.
2. Permanent redirects for `/about/team`, `/about/goals` and `/about/governance`.
3. Advisory Council section rewritten to state plainly that no members are appointed yet.
4. Dead ends closed on Governance, Framework and Community Guidelines.
5. Professional profiles directory added at `/members` and linked from Explore, so profiles are no longer orphaned.
6. "Opening soon" loading fallback replaced with an honest error state that offers a retry and an email route.
7. Placeholder phrases removed ("Recording to be added", "slides to be added", "The full gallery follows", "More photographs to follow").
8. Progress statuses brought in line with what is operational. Email acknowledgement of enquiries is honestly listed as Planned.
9. Photographic repetition within pages reduced from four cases to zero. Every public page now draws its photographs from one registry.
10. Heaviest photograph recompressed from 663 KB to 361 KB without visible loss.
11. Em dashes removed from all public copy (26 instances).
12. Unused `MandateExplorer` component deleted.
13. Database test harness updated to mirror how Lovable created the community media bucket, so the security suite reflects production.

## Permanent safeguards added

1. `src/test/link-integrity.test.ts`: every internal destination must resolve to a real route, and no self-domain, empty, Lovable or localhost link may appear.
2. `src/test/photography.test.ts`: no within-page repetition, unique page openings, no low resolution openings, no hardcoded photograph paths.
3. `scripts/check-links.mjs` (`npm run check:links`): crawls any deployed copy of the site, including production, with read-only requests, and reports broken internal links, broken images and failing external links.
4. `.github/workflows/quality.yml`: free GitHub Actions run of the type check, all tests and the production build on every pull request and every push to `main`. No secrets needed. Nothing is deployed by it.

## Partially corrected

1. Legal and policy documents. Drafts of the Privacy Notice, Terms of Use, Contributor Terms and Editorial and Moderation Policy are in `docs/legal/`. They are not approved and not published.
2. External links. 33 external links were collected but could not be checked from the audit environment. Run `npm run check:links` with `BASE=https://www.asebsociety.org`.

## Needs Lovable configuration or confirmation

1. Confirm that the three edition photographs stored in Lovable's asset store load on www.asebsociety.org (Our Story, Discover, Why We Exist, Get Involved).
2. Confirm in Lovable that custom auth email templates are active, that emails arrive from notify.asebsociety.org, and that the sender domain's DNS records (SPF, DKIM) are verified. Send one test signup to an address the Founder controls and check the sender name and logo.
3. Confirm the latest database backup time and that migrations 0000 to 0010 are all applied.
4. Confirm the custom domain, SSL certificate and that asebsociety.org redirects to www.asebsociety.org (or the reverse, consistently).
5. Turn on GitHub Actions for the repository if it is not already on (Settings, Actions).

## Needs approval

1. The four legal and policy drafts.
2. Opening community publishing beyond pre-moderation.
3. Any public figures for funding targets, member counts or impact.
4. Advisory Council appointments.

## Needs resources

1. Higher resolution and more varied photography from each edition.
2. Approved institutional documents for funders (concept note, programme proposals, governance framework).
3. At least one moderator besides the Founder.
4. An appointed Information Officer under POPIA.

## Blockers outside the repository

The audit environment cannot reach www.asebsociety.org, lovable.app or most external hosts. The proposal to widen its network was declined, so all production checks are handed to the owner with exact steps in the Production Verification Report.

## External links to verify

asebs.com (several pages), ilo.org, undp.org, businessday.ng, techcabal.com, afdb.org, standardbank.co.za, pic.gov.za, andeglobal.org, au.giz.de, ungm.org, europa.eu, worldbank.org, uu.nl, data.mendeley.com, agcae.africa, africa.ecosystem.build, climatepolicyinitiative.org, sdgs.un.org and linkedin.com profiles.
