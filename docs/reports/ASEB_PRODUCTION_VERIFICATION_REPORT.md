# ASEB production verification report

## What was verified, and what was not

The audit environment's network policy blocks www.asebsociety.org and lovable.app (HTTP 403 from the proxy). A request to widen that policy was declined. **No production check in this report has been performed by the audit.** Every result below is either measured on a local production build of this branch, or left for the owner to complete with the exact steps given. Nothing here claims the live site is correct.

## Measured on a local production build of this branch

| Check | Result |
| --- | --- |
| Type check | Passes, no errors |
| Tests | 176 pass across 14 files, including the database security suite against all eleven migrations |
| Production build | Succeeds |
| Demonstration content in the production bundle | Absent. `/preview/*` answers not found |
| Largest client script, compressed | about 104 KB |
| Broken internal links | 0 across 310 links |
| WCAG 2.2 A and AA automated violations | 0 across 31 page and width combinations |

## For the owner to verify on production

Record the date, the result and who checked it for each line.

| Area | Step | Expected |
| --- | --- | --- |
| Lovable status | In Lovable, confirm the latest commit from `main` is synced and published | The merge commit of this branch's pull request |
| Domain | Open https://www.asebsociety.org and https://asebsociety.org | Both load, one redirects to the other |
| SSL | Click the padlock | Valid certificate for the domain |
| Old paths | Open /about/team | Lands on /people |
| Links | `BASE=https://www.asebsociety.org npm run check:links` | "No broken links found", external failures reviewed one by one |
| Photographs | Our Story, scroll the edition record | All five edition photographs visible |
| Database | Lovable: More → Database → Migrations | 0000 to 0010 applied |
| Backups | Lovable: More → Database → Manage → Backups | A backup from the last 24 hours |
| Auth | Create an account with an address you control | Email from "ASEB Society" at notify.asebsociety.org, ASEB logo, no "Asebsocietyupdated" |
| Password reset | Request a reset for the same address | Branded email, link works, returns to the site |
| Storage | Contribute a story with an image as a test member, then withdraw it | Upload succeeds, image private until published |
| Secretariat | Provision your verified account as `secretariat_admin`, open /secretariat | Real applications listed, no errors |
| Editorial | Open /editorial | Review queue loads |
| Environment | In Lovable, confirm no service role key is exposed to the client | Only the publishable key is present in the browser |
| Social previews | Paste the home page and an ASEB Voices story into LinkedIn's Post Inspector | Correct title, description and ASEB photograph |
| Performance | Run PageSpeed Insights on the home page, phone setting | Record the scores. Aim for Largest Contentful Paint under 2.5 s |

Once these are recorded, update the Launch Blockers Register.
