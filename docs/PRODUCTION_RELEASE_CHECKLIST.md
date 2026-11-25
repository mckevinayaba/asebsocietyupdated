# Production release checklist

Before merging to `main` (which syncs to Lovable):

- [ ] `npm test` passes, including the database security suite.
- [ ] `npx tsc --noEmit -p .` passes.
- [ ] `npx vite build` succeeds and `.output` contains no `Sample Applicant` text.
- [ ] Public routes checked at 360, 390, 430, 768, 1024, 1440 and 1536 with no horizontal overflow.
- [ ] Automated accessibility scan shows no WCAG 2.2 AA violations on the home, Invest, Countries, Discover, Story, Why We Exist, Progress and Stories pages.
- [ ] No unverified statistic is published (`verified: false` items stay hidden).
- [ ] Progress register reflects this release.
- [ ] `npm run sitemap` run if public routes or registry records changed.

After merging:

- [ ] Confirm the commit appears in the Lovable editor. A GitHub merge alone does not prove this.
- [ ] Review the Lovable preview on a phone and a desktop.
- [ ] Submit an enquiry form on the preview and confirm the on-screen acknowledgement.

Living Village:

- [ ] `.output` contains no "demonstration content" text from `src/dev/`.
- [ ] Before migrations: every product page shows "Opening soon", not errors.
- [ ] After migrations: submit a post, a story and a question as a verified member, and confirm none appear publicly until an editor or moderator publishes them.
- [ ] An item published without a name shows no profile link, and its page source contains no author identifier.

Database changes:

- [ ] Verified backup taken before applying any migration.
- [ ] Migration applied and listed in Lovable Cloud.
- [ ] Rollback SQL ready (see `docs/DATA_GOVERNANCE.md`).

Publishing:

- [ ] Owner approval to publish to production.
- [ ] After publishing, open the live site, sign in, and open `/secretariat` with the provisioned account.
