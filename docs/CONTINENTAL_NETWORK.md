# Continental network

## Model

- **Country Partners** are credible organisations with formally agreed institutional representation, national engagement and local delivery responsibilities.
- **Ambassadors** are individual practitioners with defined advocacy, relationship, mobilisation and representation mandates: country, regional and, when approved, thematic.
- Representation is published only after authorised approval. Applying never confers an appointment, and representatives never gain database or administrative access by default.

## Data

`src/content/continent.ts` holds the 54 sovereign states, grouped by the five African Union regions, plus territories classified separately. Mayotte is the only territory today, because it is the announced 2027 Summit host.

Confirmed representation today:

| Country | Representation | Source |
| --- | --- | --- |
| Angola | Country Partner: Haymée I. Pérez Cogle | Leadership register, `src/content/institution.ts` |
| Angola, Mozambique, Cabo Verde, Guinea-Bissau, São Tomé and Príncipe | Regional Ambassador for Lusophone Africa (regional coverage, not a national appointment) | Same |

Every other country shows "representation open". No national ecosystem statistics are estimated. A country profile lists what it will eventually hold, and marks each item as available or not yet available.

## Historical participation is not representation

Field Registry records (Awards recognition) appear on country profiles as archive records, with a note that they are not Society membership. 2026 nominations from 52 countries are an event measure and are never shown as national presence.

## Applications and workflow

Country Partner and Ambassador applications use the existing insert-only `partnership_enquiries` table (`country_partner_eoi` and `ambassador_eoi`). The Secretariat workspace lists them under Partnership enquiries.

Prepared next, subject to approval: a `representatives` table for appointment records, territories, agreement dates, renewal dates and activity reports, with status management that publishes a representative only after approval.

## Field Registry

180 static records across 40 named countries plus 7 continental records, in `src/content/registry.json`. Original slugs, URLs, sources, biographies and recognitions are preserved. A database migration for the registry is planned but not started, and award recipients are never converted into members.
