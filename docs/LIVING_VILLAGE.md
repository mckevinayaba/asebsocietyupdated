# The Living Village: product architecture

This is the authoritative description of ASEB Society's five digital knowledge products. It supersedes earlier notes about Stories from the Field and a standalone Founder Voices product.

## Institutional frame

- Tagline: **It Takes a Village.**
- Mandate: ASEB Society advances ecosystem building as a professional practice and a recognised profession, strengthening the people, institutions and systems that make entrepreneurship possible across Africa.
- The Founder's title is **Founder & Chief Executive Officer**.
- Four pillars, unchanged: ASEB Summit & Awards, ASEB Circles, ASEB Academy, ASEB Field Lab.
- The five products below are **not** pillars. They are knowledge, engagement and collective intelligence products that serve the pillars.

## The five products

| Product | Line | Address | Kinds of content |
| --- | --- | --- | --- |
| The Field | Africa's ecosystem building community. | `/the-field` | Updates, articles, opportunities, responses |
| The African Ecosystem Building Playbook | A book Africa writes together. | `/playbook` | Chapters, versions, structured contributions |
| ASEB Voices | Every ecosystem has a story. Every voice matters. | `/voices` | Stories in editorial categories |
| Ask the Village | No one has all the answers. | `/ask` | Questions and answers |
| State of the Field | Understanding the ecosystems we are building. | `/state-of-the-field` | Research, cases, observations |

`/the-field` is used because `/field` already holds the Roles in the Field pages.

## ASEB Voices consolidation

ASEB Voices is the single storytelling brand. Founders' Voices is one of nine editorial categories (Builders', Founders', Institutional, Research, Policy, Community, Capital, Diaspora, The Uncomfortable Truth). Categories are managed by editors in the database.

- `/founder-voices` redirects (301) to `/voices?category=founders`.
- `/stories-from-the-field` redirects (301) to `/voices`.
- `/stories`, the full screen archive viewer, is now titled "ASEB Voices: stories from the archive". No existing content was removed.

Founders' accounts are published as perspectives, never as verified evidence. There are no ratings, rankings or naming and shaming. Founders and institutions can respond to or corroborate a story through moderated responses.

## One shared content model

Every product writes to one table, `content_items`, distinguished by `kind`: post, article, voice, playbook_contribution, question, answer, research or opportunity. Shared infrastructure covers identity, attribution, consent, media, search, moderation, revisions, reactions, bookmarks, follows, reports and notifications. Responses are `answer` items with a `parent_id`, so a story, a post or a question can each gather responses. A Playbook contribution keeps its chapter. A story or question can be linked to a chapter or Field Lab enquiry by editors.

### Lifecycle

| Status | Who sets it |
| --- | --- |
| draft | Author. Private, even from editors |
| submitted | Author |
| under_review, revision_requested, accepted, scheduled, published, declined | Editors. Moderators for posts, questions and answers |
| archived | Author (withdrawal) or editors |

Rules enforced in the database (`enforce_content_lifecycle`):

- Nothing is published without the contributor's publication consent.
- Editors cannot change a contributor's text without edit consent.
- Authors cannot feature, hide, re-slug or self-publish.
- Stories, Playbook contributions, research and opportunities always need an editor.
- Community publishing has two modes (migration 0011). **Pre-moderated**, the default: posts, articles, questions, answers and opportunities wait for a moderator. **Automated**: they are checked by the moderation engine and published immediately when safe, with clear violations not published and uncertain cases escalated to people. Only a Secretariat administrator can switch modes, and the server refuses automated mode until the moderation key is configured. The retired 'open' mode, which let a browser publish without any check, no longer exists. See `docs/reports/ASEB_INTELLIGENT_COMMUNITY_MODERATION.md`.
- Scheduled items appear when their time arrives, without a background job.

### Attribution and privacy

Contributors choose to be credited by name, by initials or with the name withheld. `author_id` is never readable through the API, so unnamed work can't be linked to its author. Names come only from `content_authors()`, which honours the choice. Editors and moderators always see the real submitter through `content_submitters()`. Profiles are private by default. Public fields come only from `public_profiles()`, which never returns contact details or preferences.

### Engagement

Appreciate, Discuss, Save, Share and Report. Counts come only from real rows, through `content_engagement()`. Individual reactions are private. "For You" lists what matches the people, countries and topics you follow first, then everything else by date. It is a transparent filter, not an algorithm.

## Experiences

- **Desktop**: application bar with search, Create, notifications and You. The Field uses a left professional navigation, a centre composer and feed, and a right panel of real content (open Playbook calls, featured Voices, live questions, an invitation to invest). Reading pages for stories and research use their own single-column compositions.
- **Mobile**: the five bottom destinations stay (Home, Explore, Circles, Discover, You). For members, Home opens The Field. Discover's contextual tabs reach the Playbook, Voices, Ask the Village, State of the Field, Academy, Opportunities and Events. You's tabs reach profile, contributions, saved, following, membership and settings.
- **Composer**: "What is happening in your ecosystem?" sits at the top of The Field on every screen. Updates, photographs and video links open in a sheet. Articles, stories, Playbook contributions, questions, research and opportunities open the full editor at `/contribute`. Drafts are kept on the device while typing and can be saved to the account. Editing continues from My contributions.
- **Onboarding**: "Find your place in the village", with nine pathways (multiple choice), profile fields, visibility and a home preference. Preferences never grant membership, verification or authority.

## Media

Photographs go to the private `community-media` bucket (JPEG, PNG or WebP, 5 MB, limits enforced by storage). Others can read a photograph only once a live public item uses it. Videos are YouTube or Vimeo links. No video is hosted, which avoids paid infrastructure.

## Sharing

Every published item has a permanent URL. Story, question, research and Field item routes load public-only metadata on the server, using the publishable key, never the service role. Unpublished or private items get a generic, noindex preview. Each product has a branded 1200×630 preview image in `public/og/`.

## Before the migrations are applied

Every product page renders its editorial frame and shows an honest "Opening soon" state instead of content. Playbook chapters and Voices categories show the proposed lists from `src/content/products.ts`, which a test keeps identical to the migration seed.
