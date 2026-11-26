# Governance: the institutional source of truth

**Governing principle.** One institution. One governing Board. Four institutional pillars. Clear executive accountability. Specialist support where necessary. Independent awards assessment.

This direction was set by the Founder & Chief Executive Officer in November 2026. It is the institution's direction. Where it requires a Board resolution or a change to the Charter or other governing documents, it is a **proposal for formal adoption** until the Board resolves it. The public Governance page says so.

## The structure

| Structure | Kind of authority | Responsible for | Does not |
| --- | --- | --- | --- |
| ASEB Society Board | Governing authority | Strategic direction, fiduciary oversight, institutional accountability, financial oversight and risk management across every pillar, the Summit & Awards included | Run operations or select award recipients |
| Founder & Chief Executive Officer | Executive responsibility | Executive leadership, strategy implementation, institutional development, resource mobilisation, stakeholder relationships, programme accountability | Override the Board or determine award recipients |
| ASEB Secretariat | Operational delivery | Operations, membership administration, stakeholder engagement, communications, programme coordination, digital platform management | Set strategy |
| Programme Committees and Working Groups | Advisory participation | Specialist expertise and programme support under a written, time bound mandate | Govern, hold fiduciary authority, select award recipients, or exist without an approved mandate |
| Country Partners and Ambassadors | Representation | National and regional representation, mobilisation and engagement under an agreed mandate | Commit the Society beyond that mandate |
| Independent Awards Jury | Independent assessment | Assessing nominees and selecting award recipients under approved criteria, with conflict of interest declarations and recusal | Govern the Society |

No sponsor, leader or committee determines award recipients outside the approved assessment process.

## The Summit & Awards

> The Africa Startup Ecosystem Builders Summit & Awards is the flagship continental convening and recognition programme of ASEB Society, bringing together the people and institutions shaping African entrepreneurial ecosystems to exchange knowledge, advance professional practice, address shared challenges and recognise outstanding contributions to the field.

The Summit operates within the institutional governance and strategic mandate of ASEB Society. Individual editions may be supported by temporary programme committees, country host organising committees and an independent awards assessment process. It is never presented as a separately governed institution.

## Never reintroduce

- A "Summit and Awards Advisory Board", "Summit Advisory Board" or any standing Summit governance body, including the same body under a new name.
- A "three layers" governance model.
- An Advisory Council, or any advisory body, unless it has an approved mandate and formally appointed members. No placeholders.
- "Advisory Board Member" as a public title.
- Award winners chosen by anyone other than the Independent Awards Jury.

The wording lives in `src/content/institution.ts` (`governanceStructure`, `summitPositioning`, `summitGovernance`). `src/test/governance.test.ts` fails the build if the outdated structure returns.

## Existing appointments and records

Presentation has changed. Appointments have not. Nothing on the platform terminates or alters an appointment.

| Person | Previously shown as | Now shown as | Needs a Board decision |
| --- | --- | --- | --- |
| Ian Lorenzen | Registry: "Founding Advisory Board Member & Strategy Lead". Biography: "Strategic Advisor" | Chairman of the Board, as the Leadership page already stated | Confirm the Chairman appointment is formally recorded |
| Dr Patrice Habinshuti | Registry: "East Africa Regional Representative · Advisory Board Member" | Board Member · Global Partnerships (North America), as the Leadership page already stated | Confirm that his advisory appointment is superseded by Board membership |
| Haymée I. Pérez Cogle | "Country Partner for Angola · Regional Ambassador for Lusophone Africa · Advisory Board Member", listed with the Board | Country Partner for Angola · Regional Ambassador for Lusophone Africa, listed under Country Partners and Ambassadors | Decide how her Advisory Board appointment maps into the unified structure: Board membership, a programme committee mandate, or conclusion by agreement. Until then the appointment stands and its documentation is unchanged |

The previous wording is preserved in the repository history (commit before this change) and in this table.

## The Advisory Council

The Leadership page described an Advisory Council "being assembled". No approved mandate, appointment records or members exist in the repository or on the platform. The placeholder has been removed. If specialist advice is needed, it is established as a programme committee with a written mandate.

## asebs.com

asebs.com is the Summit & Awards programme site. This session has no access to its source or content, so it could not be checked. Corrections required there, if present:

1. Remove any "Advisory Board" or "Summit Advisory Board" page, section or title, and any listing of members under it.
2. Describe the Summit with the positioning sentence above and state that it operates within the governance of ASEB Society, linking to www.asebsociety.org/governance.
3. Describe award selection as made by the Independent Awards Jury under approved criteria.
4. Use "Founder & Chief Executive Officer" for the Founder.
5. Replace any people titled "Advisory Board Member" with their current roles, after the Board decisions above.

## Governing documents

The Charter, Code of Conduct and Transparency policy are referenced on the platform but are not in this repository, so they could not be reviewed against this structure. Before formal adoption, check each for references to the Summit and Awards Advisory Board or to three governance layers, and prepare the resolution that adopts this structure.
