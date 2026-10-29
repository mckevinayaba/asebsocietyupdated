# ASEB platform rollout

- [x] 1. Refine registry discovery, record provenance, Evidence Library discovery and the ecosystem-tax narrative.
- [x] 2. Enable Lovable Cloud and persist membership applications, profile-claim requests and registry submissions for review.
- [x] 3. Enable member accounts, private editable profiles and saved Circle join/leave selections; verify sign-in, persistence, privacy and sign-out.

## Limitations
- Circle conversations, Academy lessons and automatic registry publication remain unavailable; current content marks their status.
- Google/Lovable provider settings enabled; external provider round-trips and password-reset email delivery have not been exercised.
- Signed-out hard refresh of `/app` recovers to `/auth` but emits a router hydration warning in the preview; signed-in profile/Circle workflows pass.