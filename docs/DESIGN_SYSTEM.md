# Design system

All tokens live in `src/styles.css`. Components use tokens, never hardcoded colours.

## Colour

| Token | Use |
| --- | --- |
| `ink` | Primary text, primary buttons |
| `ivory`, `paper`, `linen` | Light editorial surfaces, from page to panel to inset |
| `night`, `night-2`, `night-line` | Cinematic surfaces: hero grades, theory of change, investment, story viewer |
| `signal` | Burnt orange. Primary conversion, selected states, focus outline |
| `ember` | Terracotta. Figures, emphasis, link hover |
| `teal`, `teal-soft` | Institutional accents and "operational" status |
| `umber`, `sand` | Eyebrows and labels on light and dark surfaces |
| `stone`, `hairline` | Secondary text and rules |

Light surfaces carry reading, research and work. Night surfaces are used only where immersion helps: the opening, the theory of change, the investment section and stories. Every screen is never dark.

## Typography

Newsreader (optical sizing) for headlines and long reading, Hanken Grotesk for interface, labels, data and tables. Both were kept because they already serve cinematic headlines and dense interface text well, and both support the Latin characters French and Portuguese need.

| Token | Use |
| --- | --- |
| `text-hero` | Cinematic openings, from 34px on phones |
| `text-title` | Section titles |
| `text-display-*` | Interior page titles |
| `.eyebrow` | Section labels with a signal rule |
| `.numeral` | Figures with tabular lining numerals |

Mobile headlines are sized so the next action stays visible on a 360px screen.

## Space, shape, elevation

The `.wrap` gutter is 20px on phones, 32px on tablets and 40px on desktops. `.section` is 72px or 128px vertical. Radii stay at 2 to 4px, except sheets (14px top corners) and round action buttons. Elevation is reserved for floating layers: `--shadow-bar`, `--shadow-sheet` and `--shadow-navigation`. Hairline rules and open grids replace card boxes.

## Motion

| Token | Value |
| --- | --- |
| `--duration-fast` | 160ms, feedback |
| `--duration-base` | 260ms, sheets and navigation |
| `--duration-slow` | 520ms, theory of change |
| `--ease-quiet`, `--ease-emphasis` | Standard and arrival curves |

The hero photograph drifts slowly. Sections reveal once on scroll and never hide content in the first viewport. `prefers-reduced-motion` disables all animation, and every interaction works without it.

## Status language

Status uses a small dot and words, never a badge: teal for operational, signal for in development. The Progress page adds planned, subject to funding and subject to institutional approval.

## Icons

Only the original line icons in `src/components/shell/Icons.tsx`, drawn on a 24px grid with a 1.6 stroke. They are used only for navigation and contextual actions, always with a text label or accessible name.

## Breakpoints

640, 768, 1024 (the shell switches from bottom navigation to the desktop bar here), 1280. Verified at 360, 390, 430, 768, 1024, 1440 and 1536 with no horizontal overflow.
