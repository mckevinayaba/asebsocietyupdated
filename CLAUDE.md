# ASEB Society platform: instructions for Claude Code

Read `AGENTS.md` first. It is shared with Lovable and its rules apply here too. Then read the documents in `docs/`, which are the institutional source of truth.

## Workflow

Claude Code → GitHub → Lovable. Lovable is connected to `main`. Work on a feature branch, open a pull request, and let the owner merge. Never force push, rebase or amend pushed commits, because that rewrites history on Lovable's side. A GitHub push is not a Lovable sync and a preview is not a production release. Say so plainly in every report.

Database changes are hand written SQL in `drizzle/migrations/`, registered in `drizzle/migrations/meta/_journal.json`. They are prepared in the repository and applied to Lovable Cloud by the project owner after a verified backup. This session has no access to the production database. Never claim a migration is applied unless the owner confirms it.

## Commands

- `npm test` runs every test, including `src/test/database-security.test.ts`, which applies all migrations to an in-memory PostgreSQL and checks access rules as visitors, members and Secretariat roles. Run it after any migration change.
- `npx tsc --noEmit -p .` type checks. `npx vite build` builds for production.
- `npm run sitemap` regenerates `public/sitemap.xml` after adding public routes or registry records.
- `npm run lint` reports many pre-existing Prettier formatting errors. Do not mass reformat files Lovable also edits.

## Architecture in one screen

- Public pages render inside `src/components/Layout.tsx`: application bar, contextual tabs, content, footer and persistent mobile bottom navigation. Navigation for every surface comes from `src/content/navigation.ts`.
- The institutional argument lives in `src/content/case.ts`. Statistics are published only when `verified` is true.
- Continental data lives in `src/content/continent.ts`. Representation appears only when confirmed in `src/content/institution.ts`.
- Progress statuses live in `src/content/progress.ts`. Update them with every release.
- The five knowledge products (The Field, the Playbook, ASEB Voices, Ask the Village, State of the Field) share one content model. Read `docs/LIVING_VILLAGE.md` before touching them. Community data is reached through `src/lib/community-data.ts` (reads) and `src/lib/community.functions.ts` (writes, with the user's own token).
- `/editorial` is the editorial and moderation workspace. Roles: secretariat_admin, secretariat_reviewer, editor, moderator.
- The Secretariat workspace is `/secretariat`. Security is enforced by row level security and the parameterless `is_secretariat()` function, not by the route guard.
- `src/dev/` and `/preview/*` are development only and are removed from production builds.

## Non negotiables

- Four pillars, never more without approval: ASEB Summit & Awards, ASEB Circles, ASEB Academy, ASEB Field Lab. The five knowledge products are not pillars.
- Tagline: It Takes a Village. The Founder is Founder & Chief Executive Officer.
- ASEB Voices is the only storytelling brand. Founders' Voices is a category. Never create a separate Founder Voices or Stories from the Field product.
- Never read or expose `content_items.author_id` outside the database. Use `content_authors()`.
- No sequential number badges, no emoji, no third party branding or social login, no generic icon grids. The only icons are the original line icons in `src/components/shell/Icons.tsx`, always with a label or accessible name.
- Never present planned work as delivered. Never invent people, testimonials, counts, funding, staff or impact.
- Nominations, recognitions, Field Registry records, registered accounts, approved members, Country Partners and Ambassadors are different things. Never conflate them.
- No Ecosystem Tax framing on the public platform.
- Every photograph is authentic ASEB photography credited "Photo: ASEB Society". If an edition year is unknown, the caption says so.
- Colours come from tokens in `src/styles.css`. No hardcoded hex values in components.
- Copy style: no em dashes, no semicolons in prose, minimal hyphens, British spelling.
