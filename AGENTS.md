<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Pages import Link/NavLink/useParams etc. from `@/lib/router`, a thin shim over TanStack Router kept from the React Router port; keep using it so page code stays simple.
- Public site pages live under the pathless `_site` layout (header/footer); `/app` sits outside it.
- Keep registry filtering in a pure shared module so directory behaviour can be tested independently of page rendering.
- Registry archive recognition and Society membership are distinct; never infer account membership from an awards listing.
- Public intake uses insert-only Cloud tables with pending status; never grant public reads of contact details or direct approval rights.
- Partnership interest forms share validation and one insert-only enquiry table, with explicit source-page/category mapping and database validation; this preserves private contact data and distinguishes commissioning requests from funder enquiries.
- Editorial pitches use the shared interest-form validation with a separate insert-only table so editorial and partnership review remain distinct.
- Member data is loaded and changed through authenticated server functions and owner-only RLS; editable profiles contain no authorization roles or membership approval status.
- Keep one root member-session subscriber; sign-out cancels queries, clears cached private data, clears the session and replaces navigation with the public auth page.
- `/app` is protected by the client-only `_authenticated` layout; public editorial and auth pages remain outside it.
- Keep public programme readiness and persona pathways in shared browser-safe content; homepage, programme pages and progress must use the same readiness source to avoid conflicting availability claims.
- Keep institutional mandates alongside service readiness in shared programme content; public presentation uses mandates while actions remain grounded in available services.
- Use the shared reveal observer for public editorial scroll motion and respect reduced-motion preferences; never hide first-viewport content for entrance effects.
- Programme interest forms share validated private intake; authenticated submissions derive ownership on the server and atomically synchronize Circle selections through the database trigger.
- Membership application reads use verified-email owner RLS; account creation never grants membership approval or exposes other applicants.
- Role pathways use shared browser-safe mappings and validated search parameters to connect registry, community and evidence views.
- Public pages render inside the application shell (`src/components/Layout.tsx`): fixed application bar, contextual tabs, footer and a five-tab mobile bottom navigation. All navigation comes from `src/content/navigation.ts`. Never add a second navigation source.
- The institutional case lives in `src/content/case.ts`. Publish a statistic only when its `verified` flag is true, and never invent funding amounts, testimonials, counts or impact.
- Country representation is published only when confirmed in `src/content/institution.ts`. Every other country reads as open.
- Secretariat access is enforced in the database by parameterless `is_secretariat()` checks and row level security. Roles are provisioned only by the database owner. Never add approval rights without an approved authorisation model.
- Migrations are hand-written SQL in `drizzle/migrations/` and must pass `src/test/database-security.test.ts`. They are applied to Lovable Cloud by the owner after a verified backup.
- `src/dev/` and `/preview/*` are development-only and must never ship demonstration data in production.
- See `CLAUDE.md` and `docs/` for the full institutional, design and data governance rules.
- The five knowledge products (The Field at /the-field, the Playbook, ASEB Voices, Ask the Village, State of the Field) share one content model and are not pillars. ASEB Voices is the only storytelling brand, and Founders' Voices is one of its categories. See docs/LIVING_VILLAGE.md.
- Community content lifecycle, consent, attribution and moderation are enforced in the database (migration 0007). Never publish without consent, never expose author_id, and never invent counts, followers or engagement.
- Community publishing mode is chosen by the Society owner; ordinary community kinds use automated checks when enabled, while stories, Playbook and research always keep editorial review.
- Mobile chrome scroll direction is shared by the public layout, and touch rails use ScrollRail with semantic tracks and button alternatives so navigation and discovery remain accessible.
- Continental discovery derives all displayed counts and representation from the shared country profiles, never from inferred membership or activity.
- Speaker and leadership portrait frames use contain rather than cover so authentic source photographs are never cropped by the presentation layer.
- Governance is one institution with one governing Board over all four pillars (`docs/GOVERNANCE.md`, `governanceStructure` in `src/content/institution.ts`). The Summit & Awards is the flagship programme of ASEB Society, not a separately governed institution. Never add a Summit Advisory Board, a three layer governance model, an advisory body without an approved mandate and appointed members, or "Advisory Board Member" titles. Award recipients are selected only by the Independent Awards Jury.
- Public narrative: ASEB means the Summit & Awards and ASEB Society means the institution (launched 21 October 2026). Never use ASEB alone for the Society. Never name, compare with or cite the closure of another organisation to justify the Society, and never publish the internal Organisational Profile or its landscape analysis. Founding proposition copy lives in `src/content/proposition.ts`. Never present accreditation, certification, designations, councils or advisory bodies that are not approved.
- Community moderation: contributions are published only by the trusted moderation engine (`moderation_record_decision`, service role only) or by moderators. Never add a client path that sets `published`, never publish when a moderation check fails, never send account or profile data to the external moderation service, and never restrict criticism of institutions or ASEB Society. See `docs/reports/ASEB_INTELLIGENT_COMMUNITY_MODERATION.md`.
