# ASEB post launch operating plan

Written for a Secretariat of one to three people. It assumes no paid tools.

## Every day (15 minutes)

Check /secretariat for new applications, enquiries and nominations. Acknowledge institutional enquiries by email the same working day, since the platform does not send acknowledgements yet. Check /editorial for reports on community content.

## Every week (one hour)

Review and decide on contributions in the editorial queue, with a reason for every decline. Export new applications for the membership review, which the platform records in the audit log. Run `npm run check:links` against production, or ask a developer to.

## Every month

Update `src/content/progress.ts` so the Progress page matches reality. Review the Field Registry for corrections. Confirm a recent database backup in Lovable. Publish at least one ASEB Voices story and one Playbook entry so the knowledge products stay alive.

## Every quarter

Review the Privacy Notice and Editorial Policy once approved. Review Secretariat and editorial roles, removing anyone who no longer needs access. Report progress to funders using counts from the database, not estimates.

## Measuring without paid analytics

The platform already holds the numbers that matter most for an institution at this stage, and they are more honest than page view counts: applications received, approved members, public profiles, contributions submitted and published, institutional enquiries, and countries represented. The Secretariat can read these in /secretariat and /editorial. If the Society later wants visitor counts, a privacy respecting, cookie free tool should be chosen and approved first, and added to the Privacy Notice before it is switched on. No analytics tool has been added.

## Release discipline

Changes go Claude Code → GitHub branch → pull request → owner merges → Lovable syncs and publishes. The Quality workflow must pass before merging. Database changes are prepared as SQL in the repository and applied only after a verified backup. Never present planned work as delivered.
