# ASEB Society: Founding Organisational Profile and platform alignment

Branch `alignment/founding-profile`, from `main` at `7fac94b` (26 November 2026). Everything below was implemented and checked on a local build of this branch. Nothing here has reached www.asebsociety.org. It gets there only after the pull request is merged into `main`, Lovable syncs, and the owner publishes. The audit environment cannot reach production, so production is not verified.

## 1. Executive summary

The platform now argues for ASEB Society on its own terms. The homepage moves from the economics of interdependence and African economic realities to the human problem ("The field should not have to start from zero every time"), then to the Society's distinctive focus, "Building the field behind the ecosystem". Why We Exist gains "Not every activity builds an ecosystem", "The field is evolving. Its knowledge must endure." and an additionality commitment. Our Story carries the corrected chronology. The Summit and What We Build pages explain the annual cycle that joins the Summit to the Society. Invest leads with "Fund the infrastructure, not merely the activity" and separates institutional funding from Summit sponsorship.

The changes also removed overclaims that were already live:

- a five-step accreditation ladder ending in "ASEB Fellow", reviewed by a "Leadership Council"
- a "Research Council", a "partner council" and a "Country Partner Council"
- "ASEB designations"
- "ASEB Women" and "ASEB Youth"
- a claim that every nominee receives a Registry record
- "set and certify standards"

None of these had been approved. The only reference to ANDE, a citation on the Climate page, is gone, and so is the "why now" framing built on USAID's closure. A new test stops any of this returning. 182 tests pass, the build succeeds, and the changed pages show no automated accessibility violations and no horizontal overflow.

## 2. Existing implementation baseline

Already in place and preserved:

- the approved hero, the four pillars and the five knowledge products with their taglines
- The Field composer ("What is happening in your ecosystem?") at the top of the feed on desktop and mobile
- the nine ASEB Voices categories, with Founders' Voices as one of them
- the Playbook's living chapters with versions and contributions
- the Progress register's five statuses and the unified governance page
- country profiles, the Secretariat and editorial workspaces, and every database table and policy

## 3. Organisational profile reconciliation

| Profile element | Platform treatment |
| --- | --- |
| Founding proposition and "what the Society is not" | Homepage section "Building the field behind the ecosystem" |
| Economic rationale | Homepage "African economic realities", described in words. No new statistics (see section 10) |
| The structural gap ("when the work disappears") | Homepage continuity story, Why We Exist "Its knowledge must endure" |
| Positioning, additionality test | Why We Exist "Additionality before expansion", with no organisations named |
| Strategic context and landscape chapter | **Not transferred.** Confidential, kept out of the platform |
| Practice and profession, seven conditions, eight competencies | Homepage pair, ASEB Society Framework page, rewritten practice and profession definitions |
| Nine stewardship commitments | Governance page, each with "In practice" and the pillars that carry it |
| Four mandates, delivery model, success measures | Pillar pages at a glance, annual cycle, Progress "How the Society should be judged" |
| Digital infrastructure | Each product page states the problem it addresses |
| Participation, Country Partners and Ambassadors | Country Partners "Reach is not representation", proposed responsibilities |
| Heritage and historical figures | Our Story chronology, figures with reconciliation note |
| Flagship programme | Summit page cycle and positioning |
| Governance | Already unified (pull request 5). Stewardship goals now marked as commitments pending formal policy |
| Sustainability and investment | Invest page, six funding areas, sponsorship distinction |
| 2027 execution | Not published. It is an internal plan for the Board |

## 4. Institutional naming corrections

ASEB now means the Summit & Awards, and ASEB Society means the institution. Uses of "ASEB" alone for the Society were corrected:

- **Framework:** "ASEB Framework" became "ASEB Society Framework" on the Framework page, in metadata and on Discover.
- **Pages:** "What ASEB builds", "ASEB editors", "ASEB Ambassadors", "official ASEB guidance" and "Your ASEB account" now use ASEB Society. The same applies on the authentication, password reset, app and community guidelines metadata.
- **Code of Practice:** "ASEB Code of Practice" became "ASEB Society Code of Practice" on Join, Country Partners and Ambassadors.
- **Staff biographies and Registry:** "At ASEB she…" and "ASEB's reach" now name ASEB Society.
- **Proposed programme directions:** "ASEB Foundations", "ASEB Fellowship" and "ASEB Hub Standard" lost the ASEB prefix.

Uses of ASEB that mean the Summit ("ASEB 2026", "the ASEB archive", "2023 ASEB Award Winner") are correct and stay. The account emails already read "ASEB Society".

## 5. Public competitive reference audit

**Scope:**

- every source file under `src/` (pages, content, components, routes, email templates) and `registry.json`
- `public/sitemap.xml` and `robots.txt`
- the production build output

**Findings:**

- **ANDE:** one citation, on the Climate page ("ANDE, Township Economies in South Africa"). Removed, together with the clause it supported.
- **USAID:** the Why We Exist "why now" panel cited USAID's closure and lost USAID funding. Removed.
- **Other organisations kept, because none is competitive positioning:**
    - i4Policy is a confirmed ASEB Society Knowledge Partner and a co-author of cited research.
    - AGCAE and Utrecht University are cited research authors.
    - AfriLabs, ASSEK, ENRICH in Africa, Endeavor and others appear only as recognised people and institutions in the Field Registry.
    - Founder Institute and GrowthAfrica appear only in people's biographies.
- **Database:** published community content in production could not be searched from here. The owner should search /editorial for "ANDE" after release.
- **Internal Organisational Profile:**
    - not in the repository, any public folder or the build
    - the Board edition drafted in Claude Docs is private and internal, because it contains the landscape analysis
    - it must not be published as is
- **Malformed reference:** the duplicated URL in reference 11 of the internal profile was not reproduced anywhere.

## 6. Founding narrative enhancements

New content model `src/content/proposition.ts` holds:

- the proposition and the three levels of intervention
- the continuity story, the five activity examples and the ten continuity risks
- the additionality questions and the annual cycle
- the Summit and Society relationship
- the seven forms of standing, the product problems, the six contribution campaigns and the intended measures

## 7. Homepage changes

The new order is:

1. the hero, unchanged apart from its photo caption
2. the economics of interdependence
3. African economic realities
4. the continuity story
5. building the field behind the ecosystem, with the three levels and the practice and profession pair
6. the four pillars, with the cycle statement
7. the five knowledge products
8. continental network, then credibility
9. funding
10. membership

The old "institutional solution" section and the structural challenge tabs were consolidated, because both remain on Why We Exist. The page is no longer, overall.

## 8. Professional field differentiation

The `ThreeLevels` component is a stratified composition, not three cards. Entrepreneurship development rests on ecosystem development, which rests on the professional field. Each stratum is a keyboard-operable tab revealing what that level builds and who does it, and the foundation is marked as the Society's distinctive focus. Screenshots: `screenshots/alignment/home-levels-1440.jpg`, `home-levels-390.jpg`.

## 9. Human storytelling improvements

`ContinuityStory` sets the illustrative practitioner against an authentic Accra 2024 photograph. A thread weakens with each break ("A grant ends. A programme concludes. An institution changes leadership. Experienced practitioners move on."). It is labelled "An illustrative professional situation, not a documented case". Nobody in the photograph is said to have lived it.

## 10. Economic evidence verification

Primary sources (AfDB, ILO, the Public Investment Corporation) could not be reached from this environment, as every request failed at DNS. So:

- No new statistic was added.
- The youth labour market figure stays unpublished, marked unverified.
- African economic realities are described in words: formal and informal, rural and urban, young people entering labour markets, women and youth founders, finance, infrastructure, institutions, markets and sectors.
- The remaining Soweto figures on the Climate page cite only the PIC source and need checking against it.

## 11. Professional practice and profession positioning

The practice and profession definitions follow the directive on the Framework page and the homepage. The "recognition pathway" ladder on What We Build, the app's side panel and an unused self-assessment were replaced by "Different forms of standing, kept distinct". There are seven forms, each with its status, and accreditation is marked "Subject to institutional approval". The unused ladder self-assessment and its tests were deleted.

## 12. Framework and stewardship alignment

The seven conditions and eight domains are unchanged. Claims that every lesson is tagged and awards are judged against the domains were softened to what is true. The domains are now described as competence, not an accreditation standard. Each stewardship goal carries "In practice" wording and the pillars that carry it, and the goals are marked as published commitments still being formalised for Board approval.

## 13. Institutional history corrections

The chronology follows the leadership-supplied record:

- 2023: conversations began
- 2024: they deepened
- 2025: the intention was announced, with Ethiopian mobilisation that is not an appointment
- 21 October 2026: ASEB Society officially launched

An outdated duplicate timeline in `site.ts` was deleted. The historical figures keep their reconciliation note and are labelled as Summit & Awards figures, not Society membership or impact. Different edition photographs are already enforced by the photography test.

## 14. Summit and Society relationship

The `AnnualCycle` component (Listen, Develop, Convene, Follow through) sits on the Summit page and What We Build, under "The Summit brings the field together. The Society sustains the work throughout the year." The relationship sentence is used consistently, and asebs.com stays the Summit's home. A first ring design overlapped its text, so it was redrawn as a sequence with a return path (`screenshots/alignment/build-cycle-1440.jpg`).

## 15. Four institutional pillars

Each pillar page now has an "at a glance" band: the problem it addresses, who it is for, status today and contribution to the mandate. It joins the existing purpose, participation and programme directions. Programme directions are labelled as directions, and only what the status line describes is operating.

## 16. Five digital knowledge products

Each product page now states the structural problem it addresses. The taglines were already correct.

## 17 and 18. Desktop and mobile professional experience

Unchanged and preserved: the desktop application shell, the right panel, the mobile bottom navigation and the composer at the top of The Field. No navigation destination was added.

## 19. ASEB Voices and founder participation

There is a new "We want your story" section with the invitation the directive describes, a place for founders in Founders' Voices, the consent, edit and withdrawal safeguards, and four story prompts. Stories are labelled as personal accounts, not verified evidence.

## 20. Living Playbook alignment

There is a new "Open calls for knowledge" section with all six campaign prompts. Each prompt links to the product that takes the answer and can be passed on by LinkedIn, WhatsApp or email. They are labelled as prompts, not quotations.

## 21. Continental participation

The Country Partners page gains "Reach is not representation". It separates five things:

- appointed representatives (one)
- applicants
- emerging mobilisation (Ethiopia)
- proposed relationships
- historical event reach (52 countries)

Duties were recast as proposed responsibilities under approved mandates. Nomination mobilisation now carries no role in selecting recipients, and the "Country Partner Council" seat is gone.

## 22. Governance consistency

The unified governance from pull request 5 holds. The "Research Council" (Get Involved and Partners), "partner council" (Partners) and "Country Partner Council" (Country Partners) were removed, because none is approved. The test now fails if any of them returns.

## 23. Institutional funding proposition

- **Headline:** "Fund the infrastructure, not merely the activity" on Invest and the homepage.
- **Funding areas:** six, labelled as proposed, not costed or committed.
- **Two opportunities:** institutional funding is distinguished from Summit sponsorship.
- **Twelve ways to support:** the directive's list, each mapped to a working destination.

The enquiry form and its database path are unchanged.

## 24. Public document safeguards

No public profile download exists, and none is shown. No internal document is in the repository or `public/`. A future public edition is specified in the blueprint.

## 25. Photographic inventory and changes

No new photographs were available, and no assignment changed. The continuity story uses the Accra 2024 photograph already assigned to that homepage section. The photography tests still pass.

## 26. Link verification

Every new link resolves to a route, and the test checks the activity and campaign destinations. Share links go to LinkedIn, WhatsApp and email. External links were not checked from here; use `npm run check:links` against production.

## 27 and 28. Backend, data preservation, security and permissions

There are no migrations and no changes to tables, policies, server functions or authentication. No test or production data was created.

## 29. Accessibility and performance

**Accessibility.** axe-core WCAG 2.2 A and AA ran on:

- `/`, `/why-aseb`, `/invest`, `/country-partners`, `/voices`, `/progress` and `/circles` at 390 px
- `/what-we-build`, `/playbook` and `/governance` at 1440 px
- `/summit` and `/framework` at 390 px, rechecked after the fixes

Three issues were found and fixed: two small orange labels with low contrast, and the Framework table's scroll region, which was not keyboard focusable. None remains. The new tabs follow the existing pattern, with arrow keys and roving focus. Reduced motion is respected through the existing classes.

**Performance.** The main client script is about 104 KB compressed, slightly smaller than before. There are no new images.

**Layout.** 15 changed pages at all ten widths from 320 to 1920 px have no horizontal overflow.

## 30. Desktop and mobile screenshots

`docs/reports/screenshots/alignment/` holds 18 images at 1440 and 390 px covering:

- the three levels and the continuity story
- the activity explorer and the knowledge section on Why We Exist
- the cycle and the standing section on What We Build
- Country Partners, the Voices invitation and Invest sponsorship

## 31. Automated testing results

- `npx tsc --noEmit -p .` is clean.
- `npm test`: 15 files, 182 tests passed, including the new `src/test/institutional-narrative.test.ts` (9 tests). The removed ladder self-assessment took 9 tests with it.
- `npx vite build` succeeds.

## 32 to 34. GitHub, Lovable and production status

- **GitHub:** committed on `alignment/founding-profile` and pushed, with a pull request opened. See the pull request for commit hashes.
- **Lovable:** sync happens only after the owner merges into `main`. Not verified here.
- **Production:** not published and not verified.

## 35. Outstanding approvals and limitations

1. Verify the Soweto figures against the PIC source, or remove them.
2. Approve the mission wording: `statements.mission` still mentions credentials, while no credentials are offered.
3. Approve a public edition of the Organisational Profile before any download appears.
4. Search production community content for references to other organisations after release.
5. Correct asebs.com where it presents the Summit as separate from the Society. There is no access from here.
6. Have a professional editor review the new copy, and run a manual screen reader pass.
7. Formal Board adoption of the governance structure and stewardship policy.
8. The launch blockers already registered (privacy notice, backup, live verification) still stand.

## 36. Final launch readiness recommendation

The decision is **CONDITIONAL GO**, unchanged. This branch removes a real credibility risk: unapproved credentials and councils, and outside-organisation framing, were live. It also makes the institutional case far clearer. The conditions for a launch announcement are unchanged. Merge and publish this branch and the governance branch, verify production, publish an approved privacy notice and confirm a recent backup. The final launch decision remains with ASEB Society leadership.
