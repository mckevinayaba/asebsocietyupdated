# ASEB visual asset audit

## Collection

Fourteen event photographs, all authentic ASEB documentary photography credited "Photo: ASEB Society". None is generated. Eleven are stored in the repository under `public/images/events/`. Three (2022, 2024 and 2025 editions) are stored in Lovable's asset store and referenced through `src/assets/*.asset.json`. Speaker and leadership portraits are a separate set and are excluded from the repetition rules, since a person's portrait appears wherever that person does.

| Photograph | Size | Dimensions | Notes |
| --- | --- | --- | --- |
| aseb-community-gathering | 167 KB | 1248 × 832 | Home opening |
| aseb-networking | 185 KB | 1248 × 832 | ASEB Circles |
| aseb-summit-panel | 256 KB | 1600 × 865 | ASEB Field Lab |
| aseb-2025-addis-panel | 134 KB | 1344 × 768 | ASEB Academy |
| aseb-2026-recognised-builders | 247 KB | 1600 × 1066 | ASEB Summit & Awards, 2026 edition |
| aseb-2026-summit-delegates | 361 KB (was 663 KB) | 1536 × 957 | Our Story opening. Recompressed without visible loss |
| aseb-2023-nairobi | 161 KB | 1344 × 768 | Invest opening, 2023 edition |
| aseb-2024-accra-group | 129 KB | 1344 × 768 | Home question section |
| aseb-awards-stage-1, 2, 3 | 42, 36, 29 KB | 518, 465, 378 px wide | Low resolution. Small placements only, never a page opening |
| 2022 audience, 2024 discussion, 2025 delegates | Lovable asset store | Not measurable here | Edition photographs |

No two repository files are byte identical (SHA-256). No visually duplicate pair was found by inspection. The three stage photographs are distinct moments from the same ceremony.

## Repetition found and corrected

| Page | Before | After |
| --- | --- | --- |
| Our Story | The 2026 delegates photograph opened the page and appeared again in the edition record | Opening and 2026 edition use different photographs |
| Summit & Awards | The recognised builders photograph opened the page and appeared again in the gallery | Gallery uses five other photographs |
| Discover and Stories | The Addis Ababa panel appeared twice, through reused mandate slides | Mandate slides removed. Each edition appears once |
| Summit gallery | Closing tile read "The full gallery follows" | Closing tile links to every edition on asebs.com |
| Climate | A decorative reuse of the home opening photograph | Removed. The section ends on its actions |
| Home | The invest band carried a repeated background photograph | Removed. The band now relies on type and colour |

Measured on a local crawl of 14 photograph-bearing pages: four within-page repetitions before, zero after.

## Page and section usage inventory

| Page | Section | Photograph |
| --- | --- | --- |
| Home | Opening | aseb-community-gathering |
| Home | "Who invests in the people who make entrepreneurship possible?" | aseb-2024-accra-group |
| Home | Pillars | one per pillar, as below |
| What We Build, and each pillar page | ASEB Summit & Awards | aseb-2026-recognised-builders |
| | ASEB Circles | aseb-networking |
| | ASEB Academy | aseb-2025-addis-panel |
| | ASEB Field Lab | aseb-summit-panel |
| Our Story | Opening | aseb-2026-summit-delegates |
| Our Story | "Visibility is not infrastructure" | aseb-awards-stage-1 |
| Our Story, Discover | Editions 2022 to 2026 | 2022 audience, aseb-2023-nairobi, 2024 discussion, 2025 delegates, aseb-2026-recognised-builders |
| Invest in Our Mission | Opening | aseb-2023-nairobi |
| Summit & Awards | Opening | aseb-2026-recognised-builders |
| Summit & Awards | Gallery | delegates 2026, stage 1, stage 2, summit panel, stage 3 |
| Why We Exist | The whole economy | 2025 delegates |
| Get Involved | Closing | 2024 discussion |

The pillar photograph deliberately repeats between What We Build and that pillar's own page, so each mandate keeps one recognisable image. The edition photographs repeat between Our Story and Discover because both present the same record.

## Safeguards

`src/content/photography.ts` is now the single registry of photographs and their assignments. `src/test/photography.test.ts` fails the build if a photograph repeats within a page, two pages share an opening photograph, a low resolution photograph is used as an opening, a registry file is missing, alternative text is too thin, or a public page hardcodes an event photograph path instead of using the registry.

## Needs resources

The collection is small for a five-edition institution. The three stage photographs are too small for anything larger than a gallery tile. Higher resolution originals, and a captioned selection from each edition with year and city, would let every pillar page have more than one image. Where an edition year is unknown, captions say so rather than guessing.

## Screenshots

Before and after pairs are in `docs/reports/screenshots/`: `story-editions`, `summit-gallery`, `people-advisory`, `home-question`, `home-question-mobile` and `climate-close`, each with `-before` and `-after`. The three Lovable-hosted edition photographs show as grey frames in these local captures because they only load from Lovable hosting.
