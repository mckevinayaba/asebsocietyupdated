# ASEB release readiness report

This report covers the code on branch `quality/launch-readiness`. It says whether the branch is safe to merge, not whether the live site is ready. The second question is answered in the Final Launch Readiness Report.

## Verdict: ready to merge

| Gate | Result | Evidence |
| --- | --- | --- |
| Type check | Pass | `npx tsc --noEmit -p .`, no errors |
| Tests | Pass, 182 of 182 | `npm test`, 15 files, including database security, link integrity, photography and governance |
| Production build | Pass | `npx vite build` |
| Demonstration content excluded | Pass | Preview chunks are 170 and 94 bytes and answer not found |
| Internal links | Pass | 0 broken of 310 |
| Horizontal overflow | Pass | 58 routes at 320, 360, 390, 430, 768, 1024, 1280, 1440, 1536 and 1920 px, 580 page loads, no overflow, no page errors |
| Accessibility, automated | Pass | axe-core WCAG 2.2 A and AA, 31 page and width combinations, 0 violations |
| Photographic repetition | Pass | 0 within-page repeats, enforced by test |
| Copy style | Pass | No em dashes, no placeholder phrases, branding consistent |
| Database changes | None in this branch | No migration was added or changed |

## Risks on merge

Low. The changes are copy, photographs, links, one new public route (`/members`), three redirects, tests, a link checker, a CI workflow and documents. No database, authentication or security policy is changed. The CI workflow uses `bun install --frozen-lockfile`, so it fails clearly if the lockfile and `package.json` drift apart, which is the intended behaviour.

## After merging

Lovable syncs from `main`. Publish in Lovable to put the changes on www.asebsociety.org, then work through the Production Verification Report.
