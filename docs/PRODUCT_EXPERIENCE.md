# Product experience

## Principle

The mobile experience is an application from the first visit, before sign in or installation. Desktop is designed separately for its own interaction patterns but shares the same data, semantics and navigation logic.

## Application shell

| Element | Behaviour | Source |
| --- | --- | --- |
| Application bar | Fixed. Clear over the immersive home opening, solid on reading and work screens. Search (press `/` on desktop), menu, member access, Invest | `src/components/shell/AppBar.tsx` |
| Contextual tabs | Sticky under the bar, scroll sideways, current tab centred. Only implemented destinations | `src/components/shell/ContextTabs.tsx` |
| Bottom navigation | Five destinations on screens below 1024px: Home, Explore, Circles, Discover, You. Same before and after sign in | `src/components/shell/BottomNav.tsx` |
| Sheets | Bottom sheet on mobile, side panel on desktop, accessible dialog with focus trap | `src/components/shell/Sheet.tsx` |
| Search | Client side over pages, registry, evidence and countries. No external service | `src/lib/site-search.ts` |

Content is never hidden behind the bars. `.app-main` reserves space for the bottom navigation plus the safe area, and the viewport uses `viewport-fit=cover`.

## Immersive content

`/stories` is the full screen story viewer. It uses vertical swipe with snapping inside the viewer only, arrow keys, visible previous and next buttons and Escape to close. The contextual action rail offers Save, Share, Related and About. It shows no counts and plays no audio or video automatically. Ordinary pages never use snapping or forced full screen.

## Saved content

Saved items are stored on the device (`src/hooks/use-saved.ts`) and labelled "saved on this device". Member account sync needs a `saved_items` table and is listed as in development.

## Member and Secretariat

- `/app` keeps the global bottom navigation. Member sections become contextual top tabs on mobile and a left rail on desktop. `?tab=circles` deep links a section.
- `/secretariat` is the Secretariat workspace. See `docs/DATA_GOVERNANCE.md`.
- Sign in returns people to the page they asked for, validated as a same origin path.

## Progressive Web App

- `public/manifest.webmanifest` with icons generated from the official mark. A higher resolution master logo is needed for sharper icons.
- `public/sw.js` registers in production only, never inside an embedded preview frame. Static assets are cache first. Public pages are network first with the last copy and `offline.html` as fallbacks. Member, Secretariat, auth, `/you` and server function traffic is never cached, and neither is any request carrying an Authorization header.
- Update handling: a new version activates on next load and deletes older caches. Bump `VERSION` in `sw.js` when the caching policy changes.

## Not yet built

Notifications, discussions and reactions, video, AI personalisation and French. Each is absent rather than faked. See `docs/TRANSFORMATION_ROADMAP.md`.
