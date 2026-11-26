# ASEB user journey audit

Each journey was walked on a local build of this branch at 390 px (phone) and 1440 px (desktop). No form was submitted, because the local build talks to the production database and the audit must not create test records there. Form behaviour after submission is therefore verified by the database security suite (which proves who can write and read each table), not by live submission.

| Journey | Path | Result | Remaining concern |
| --- | --- | --- | --- |
| First visit, understand the Society | Home → Why We Exist → Our Story | Clear. Each page ends with a next step | None |
| Understand the four pillars | What We Build → each pillar page | Clear. Each pillar has its own photograph, status stated plainly | Circles, Academy and Field Lab are honestly labelled as in development |
| Funder or DFI | Home → Invest in Our Mission → enquiry form | Complete. Investment areas, readiness, accountability, enquiry with consent | No acknowledgement email is sent. The on-screen confirmation says so |
| Nominate or apply for membership | Get Involved → Join | Form renders, required fields marked, consent captured | Submission not tested live |
| Create an account and sign in | Sign in → Create account → email confirmation | Interface complete | Delivery and branding of the confirmation email not verifiable from here |
| Complete a profile | Onboarding → profile form | Starts private, visibility choices explained | None |
| Read and contribute knowledge | The Field, ASEB Voices, Playbook, Ask the Village, State of the Field → Contribute | Complete. Pre-moderated, with permission to publish and permission to edit | Contributor Terms not yet approved |
| Find people | Explore → Professional profiles, or Field Registry | Both reachable from navigation. Registry records and member profiles are clearly separated | The profiles directory is empty until members make profiles public |
| Country representation | Country Partners, Ambassadors | Clear distinction between the two, linked to each other | None |
| Secretariat review | /secretariat, /editorial | Role gated in the database | Needs a provisioned verified account on production |
| Share a page | Share action on knowledge items, Open Graph tags on public routes | Native share sheet on phones, copy link on desktop | Social previews need checking on production with each network's debugger |
| Lost or old link | /about/team, /founder-voices and other old paths | Redirect to the right page | None |
| Error | Knowledge service unavailable | Honest message, retry button, email route | None |

## Funding conversion

The Invest page answers the questions a programme officer asks in the order they ask them: the structural problem, the intended theory of change, where money goes, what exists today, how the Society answers for funds, then the enquiry. No funding amounts or targets are published, which is correct until the Board approves them. The single largest conversion gap is the absence of approved institutional documents (concept note, programme proposals, governance framework). The form lets a funder request them, and the Secretariat needs them ready to send.
