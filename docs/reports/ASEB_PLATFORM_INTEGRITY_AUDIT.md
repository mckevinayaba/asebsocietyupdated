# ASEB platform integrity audit

Branch `quality/launch-readiness`, from `main` at `fd8d6be` (26 November 2026). Every result below was measured on a local build of this branch. The live site at www.asebsociety.org could not be reached from the audit environment, because its network policy blocks the domain, so **nothing here certifies production**. `scripts/check-links.mjs` repeats the link audit against production in one command (see the Production Verification Report).

## Links and routes

| Check | Result |
| --- | --- |
| Pages crawled locally | 49 seed pages, 310 distinct internal links |
| Broken internal links | 0 |
| Empty or `#` links | 0 |
| Page errors during crawl | 0 |
| Links pointing at the old site's own domain (asebsociety.org/about/team and similar) | 6 found, 6 removed or replaced with internal links |
| Old paths `/about/team`, `/about/goals`, `/about/governance` | Now permanent (301) redirects to `/people`, `/governance` and `/governance` |
| External links | 33 distinct. Not verifiable from this environment. Listed in the Remediation Report for the owner to check with `npm run check:links` |
| Broken images | Only the three photographs stored in Lovable's asset store (2022, 2024, 2025 editions). They are served by Lovable hosting and cannot load on a local server. Verify on production |

The Leadership Advisory Council "Source: ASEB Society, Our People" link pointed at `asebsociety.org/about/team`, a path that no longer exists on the new platform. It has been removed. The Advisory Council section was later removed altogether, because no approved mandate or appointed members exist. See the governance correction below.

`src/test/link-integrity.test.ts` now resolves every navigation, footer, tab, discovery, story, mandate and investment destination against the real route tree, and fails the build if a full link to the platform's own domain, an empty link, or a Lovable or localhost link reappears.

## Navigation

The four pillars appear as ASEB Summit & Awards, ASEB Circles, ASEB Academy and ASEB Field Lab, and nothing else is presented as a pillar. The five knowledge products are grouped under The Village. Founders' Voices exists only as a category of ASEB Voices. The old `/founder-voices` and `/stories-from-the-field` paths redirect into ASEB Voices. A professional profiles directory (`/members`) was added to Explore so that profiles are no longer reachable only by direct link.

## Dead ends closed

Governance, Framework and Community Guidelines previously ended with no next step. Each now offers a relevant route onward (investment, progress, people, the Playbook, The Field, contributing).

## Placeholder and pre-launch language

Removed or replaced: "Recording to be added", "Recording and slides to be added to the library", "The full gallery follows", and "More photographs from the Summit floor to follow". The loading fallback for the knowledge products is now an honest error state ("could not be loaded just now", with a retry button and an email route) instead of an "opening soon" promise. A repository search finds no "coming soon", "opening soon" or lorem text in public copy.

## Branding

| Item | Result |
| --- | --- |
| Stronger ecosystems. Stronger economies. | Consistent wherever used |
| It Takes a Village. | Consistent, 9 uses |
| Founder & Chief Executive Officer | Consistent for the Founder. "Founder and CEO" appears only in other people's own titles, quoted from their organisations |
| Chief Ecosystem Officer | No remaining uses |
| Em dashes in public copy | 26 removed (pages, programme copy and 24 in Field Registry citations). None remain |
| Founder Voices or Stories from the Field as products | None. Only redirect comments |
| Ecosystem Tax framing | None |

## Auth email branding

In code, account emails are sent as "ASEB Society" from `noreply@notify.asebsociety.org`, using templates in `src/lib/email-templates/`. The word "Asebsocietyupdated" does not appear anywhere in the repository. Whether the live emails actually use these templates depends on Lovable's email configuration and the DNS records for notify.asebsociety.org, which could not be checked from here. See the Launch Blockers Register.

## Security

`npm test` applies all eleven migrations to an in-memory PostgreSQL and checks access as visitors, members and every Secretariat and editorial role. 182 tests pass. Demonstration content is confirmed absent from the production bundle (the preview chunks are 170 and 94 bytes and answer "not found"). The unused social login helper Lovable generated (`src/integrations/lovable/index.ts`) is not referenced by any interface.

## Accessibility and layout

axe-core (WCAG 2.0, 2.1 and 2.2 A and AA rules) reported no violations on 31 page and width combinations covering every major surface. Horizontal overflow results across ten widths are recorded in the Release Readiness Report. Automated tools catch a portion of accessibility issues, so a manual screen reader pass is still recommended.

## Institutional governance correction (added 26 November 2026)

The Governance page presented an outdated three layer structure: the Board of ASEB Society, a Summit and Awards Advisory Board and Field Councils and Working Groups, under the headline "Three layers, each with a defined mandate." That contradicted the institution's direction of one governing Board over the whole institution. The Leadership page also carried an Advisory Council placeholder with no approved mandate or members, a "Board and Advisory Board" heading, and an "Advisory Board Member" title. The Field Registry described two Board members by former advisory titles. Two funder-facing lines referred to an advisory board for Summit integrity.

All public references are corrected on branch `governance/unified-structure`. The Governance page now opens with "One institution. Shared purpose. Clear accountability." and presents six structures in a responsive structure diagram, with each kind of authority distinguished. The structures are the ASEB Society Board, the Founder & Chief Executive Officer, the ASEB Secretariat, Programme Committees and Working Groups, Country Partners and Ambassadors, and the Independent Awards Jury. The Summit & Awards is described everywhere with the approved positioning, as the flagship programme of ASEB Society. The Advisory Council placeholder is removed. `src/test/governance.test.ts` fails the build if any outdated term returns.

Not verifiable from here: database-managed content on production (published community items could mention the old structure), asebs.com (no access), and the Charter and other governing documents (not in the repository). Exact corrections and decisions required are in `docs/GOVERNANCE.md`.
