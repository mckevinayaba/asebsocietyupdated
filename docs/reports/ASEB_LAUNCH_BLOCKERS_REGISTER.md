# ASEB launch blockers register

Status on 26 November 2026. "Open" means not verified, not that it is known to be broken. Owner is who can close it.

| ID | Blocker | Severity | Owner | How to close | Status |
| --- | --- | --- | --- | --- | --- |
| B1 | This branch is not yet on the live site | Critical | Founder | Merge the pull request, let Lovable sync, publish in Lovable | Open |
| B2 | Production not verified by anyone with access (domain, SSL, redirects, pages, images) | Critical | Founder | Follow the Production Verification Report, record results | Open |
| B3 | No published Privacy Notice while the site collects personal information | Critical | Founder and legal adviser | Review `docs/legal/PRIVACY_NOTICE_DRAFT.md`, appoint an Information Officer, publish and link from footer and forms | Open |
| B4 | No published Terms of Use or Contributor Terms | High | Founder and legal adviser | Review the drafts in `docs/legal/`, approve, publish | Open |
| B5 | Database backup time not confirmed | High | Founder via Lovable | Lovable: More → Database → Manage → Backups. Record the newest backup time | Open |
| B6 | Auth email sender, branding and DNS not verified | High | Founder via Lovable | One test signup, check sender "ASEB Society" from notify.asebsociety.org, logo and wording | Open |
| B7 | Three edition photographs in Lovable's asset store not verified on production | Medium | Founder | Open Our Story on production and check the 2022, 2024 and 2025 photographs | Open |
| B8 | 33 external links unchecked | Medium | Founder or Secretariat | `BASE=https://www.asebsociety.org npm run check:links` | Open |
| B9 | No Secretariat or editorial account provisioned and tested on production | High | Founder | Provision a verified account as described in `docs/DATA_GOVERNANCE.md`, sign in to /secretariat and /editorial | Open |
| B10 | Editorial and Moderation Policy not approved | Medium | Secretariat | Approve the draft before opening community publishing | Open |
| B11 | Accessibility checked by automated tools only | Low | Secretariat | One manual pass with a phone screen reader on Home, Invest and Join | Open |

Blockers B1, B2, B3 and B5 must close before any public launch announcement. The others should close within the first two weeks.
