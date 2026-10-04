# DWC Books Design System

This document reverse-engineers the visual system in `DWC Books — Belajar dari Praktik, Bukan Sekadar Teori.html`. Values labeled **Source** are copied from the original CSS. Values labeled **Guidance** describe consistent usage or accessibility requirements; they are not present as CSS tokens in the reference.

## 1. Visual Direction

- High-contrast editorial sales page: white or near-black canvas, strong black typography, and a single red accent.
- Heavy headings and prices establish hierarchy; muted copy supplies supporting detail.
- Surfaces remain mostly flat. Cards use a soft neutral fill, thin border, and generous radius.
- Book imagery supplies most depth through hard or compact dark shadows.
- Layout is mobile-first, with fluid typography and auto-fitting grids.

## 2. Core Color Tokens

### Light theme

| Token | Value | Usage |
| --- | --- | --- |
| `--bg` | `#ffffff` | Page, sticky navigation, toast surface |
| `--fg` | `#111111` | Primary text, inherited links, dark labels |
| `--mut` | `#555555` | Secondary copy, captions, footer text |
| `--red` | `#d90f1c` | Brand accent, primary CTA, price, eyebrow, emphasis |
| `--card` | `#f6f4f3` | Card and feature-box surface |
| `--line` | `#e3dedb` | Section dividers, card borders, list dividers |

### Dark theme

| Token | Value | Usage |
| --- | --- | --- |
| `--bg` | `#0e0e0e` | Page, sticky navigation, toast surface |
| `--fg` | `#f4f1ef` | Primary text |
| `--mut` | `#aaaaaa` | Secondary copy and captions |
| `--red` | `#d90f1c` | Unchanged brand accent |
| `--card` | `#1a1a1a` | Card and feature-box surface |
| `--line` | `#2c2c2c` | Section dividers, card borders, list dividers |

### Fixed and effect colors

| Value | Usage |
| --- | --- |
| `#ffffff` | Text on red, selected-plan text, selected-plan button surface |
| `#111111` | Dark book cover and pill tag surface |
| `#444444` | Dark book-cover border |
| `rgba(0,0,0,.25)` | Hard cover shadow and toast shadow |
| `rgba(0,0,0,.3)` | Cover-image and gallery-image shadows |

Use semantic variables for every theme-sensitive color. Fixed white is reserved for content on red or black surfaces. The source leaves `--red` unchanged in dark mode. The production implementation keeps `--red: #d90f1c` on CTA surfaces and introduces `--accent-text: #ff5c66` on dark surfaces (`#d90f1c` on light surfaces) for readable eyebrow, links, prices, metrics, and outlined button labels.

## 3. Theme Behavior

```css
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { /* dark tokens */ }
}

:root[data-theme="dark"] { /* dark tokens */ }
```

- System dark preference applies unless the root explicitly has `data-theme="light"`.
- Explicit `data-theme="dark"` forces dark theme.
- No transition is defined for theme changes.
- Components inherit theme through semantic tokens; accent text gains a contrast adjustment in dark mode while red CTA surfaces remain unchanged.

## 4. Typography

### Font stack

```css
system-ui, -apple-system, "Segoe UI", Arial, sans-serif
```

No web font is loaded. Rendering follows the operating system UI font.

### Base text

| Property | Value |
| --- | --- |
| Font size | `16px` |
| Line height | `1.6` (`25.6px` computed at base size) |
| Weight | Browser default, typically `400` |
| Color | `var(--fg)` |

### Type scale

| Role | Source rule | Notes |
| --- | --- | --- |
| Display / `h1` | `clamp(34px, 7vw, 64px)` | Weight `900`, line-height `1.1`, tracking `-.02em` |
| Section / `h2` | `clamp(26px, 4.5vw, 40px)` | Weight `900`, line-height `1.1`, tracking `-.02em` |
| Card / `h3` | Inherits heading style | Book cards override to `19px` |
| Price hero | `clamp(40px, 8vw, 72px)` | Weight `900`, line-height `1`, red |
| Package price | `34px` | Weight `900` |
| Quote | `clamp(20px, 3vw, 28px)` | Weight `800` |
| Logo | `20px` | Weight `900` |
| Eyebrow | `12px` | Weight `700`, tracking `.25em`, uppercase, red |
| Body | `16px` | Line-height `1.6` |
| Supporting/card copy | `14px` | Muted where `.m` or `.book p` applies |
| Caption/proof label/toast | `13px` | Proof label and toast use muted/semantic text |
| Tag | `11px` | Weight `800`, white on black |

All `h1`, `h2`, and `h3` elements use `margin: 0 0 14px`. Numeric countdown output uses `font-variant-numeric: tabular-nums`.

## 5. Spacing System

The source does not define spacing variables. Reuse these exact recurring values before introducing new increments.

| Tier | Values | Observed usage |
| --- | --- | --- |
| Micro | `2px`, `3px`, `4px`, `5px`, `6px`, `8px`, `10px` | Gallery inset, tag padding, radii, heading/card detail gaps |
| Control | `12px`, `14px`, `16px`, `18px` | Countdown, buttons, nav links, rows, grids, quote inset |
| Component | `20px`, `22px`, `26px`, `32px` | Container gutter, card padding, button horizontal padding, hero gap |
| Section | `36px`, `64px` | Compact sections/footer and default section rhythm |

Canonical recipes:

- Page gutter: `20px` per side.
- Standard section: `64px 0`.
- Compact sections: `32px 0` or `36px 0` through inline overrides.
- Card padding: `22px`.
- Primary button padding: `14px 26px`.
- Compact nav button padding: `8px 16px`.
- Grid gap: `18px`; testimonial/card sub-grid gap: `16px`; steps gap: `14px`; proof gap: `12px`.

## 6. Layout and Container

### Global box model

- `box-sizing: border-box` applies globally.
- Root adds `env(safe-area-inset-top, 0px)` and `env(safe-area-inset-bottom, 0px)` padding.
- `html` uses smooth scrolling.
- `body` has zero margin.

### Main container

```css
.w {
  max-width: 1040px;
  margin: 0 auto;
  padding: 0 20px;
}
```

The usable content width is at most `1000px` because the declared `1040px` width includes `20px` padding on both sides under `border-box`.

### Structural layouts

| Pattern | Source rule |
| --- | --- |
| Hero | One-column grid, `gap: 32px`, vertically centered |
| Hero desktop | `grid-template-columns: 1.3fr 1fr` at `800px` and wider |
| General cards | `repeat(auto-fit, minmax(280px, 1fr))`, gap `18px` |
| Steps | `repeat(auto-fit, minmax(170px, 1fr))`, gap `14px` |
| Testimonials | Horizontal carousel, `16px` gap, `220–280px` cards, x-axis scroll snap |
| Proof metrics | `repeat(auto-fit, minmax(140px, 1fr))`, gap `12px` |
| Book row | Flex row, gap `16px` |
| Gallery | Horizontal flex scroller, gap `18px`, mandatory x-axis scroll snap |

## 7. Responsive Rules

The stylesheet contains one explicit viewport breakpoint:

```css
@media (min-width: 800px) {
  .hero { grid-template-columns: 1.3fr 1fr; }
}
```

Responsive behavior elsewhere is intrinsic:

- `h1`, `h2`, hero price, quotes, and proof metrics scale with `clamp()` and viewport units.
- General cards, steps, and proof grids wrap automatically when their minimum column width no longer fits.
- Testimonials use compact horizontal cards: approximately `260px` on phones and `280px` on desktop, with auto-advance every `4.5s`, manual 44px arrow controls, hover/focus pause, touch scrolling, and reduced-motion opt-out.
- Container stays fluid until `1040px`, with fixed `20px` side padding.
- Gallery remains a horizontal scrolling strip at every width; images stay `250px` high and snap to the start edge.
- Navigation remains one flex row with `space-between`; no narrow-screen navigation override exists.
- Buttons are inline by default and may wrap naturally; package-card buttons use `width: 100%`.
- Viewport uses `width=device-width, initial-scale=1, viewport-fit=cover` and does not disable zoom.

Practical width interpretation:

| Width | Expected layout |
| --- | --- |
| `< 800px` | Single-column hero; auto-fit grids collapse according to their minimum widths |
| `>= 800px` | Hero becomes `1.3fr / 1fr`; all other layouts remain auto-fit |
| `>= 1040px` | Container stops growing and centers |

## 8. Components

### Navigation

- Sticky at safe-area top: `position: sticky; top: env(safe-area-inset-top, 0px)`.
- Surface `var(--bg)` with `1px solid var(--line)` bottom border.
- Layer `z-index: 9`.
- Inner height `56px`, horizontal flex alignment, vertically centered.
- Logo weight `900`, size `20px`; `.BOOKS` segment uses red.

### Buttons

Primary button:

```css
display: inline-block;
background: var(--red);
color: #fff;
padding: 14px 26px;
border: 2px solid var(--red);
border-radius: 10px;
font-size: 16px;
font-weight: 800;
text-decoration: none;
cursor: pointer;
```

Outline button changes only `background: transparent` and `color: var(--red)`. Package buttons span full card width. Inside the selected red package, the button becomes white with red text and white border.

States absent from source: `:hover`, `:active`, `:focus-visible`, and `:disabled`. Add states without changing dimensions so controls do not shift.

### Cards and boxes

```css
background: var(--card);
border: 1px solid var(--line);
border-radius: 16px;
padding: 22px;
```

- Pricing cards center-align content.
- Selected pricing card changes surface and border to red, with white text.
- No default box shadow appears on cards.

### Book cards

- Flex row with `16px` gap.
- Cover slot is fixed at `96px` wide and `136px` high.
- Generated cover radius: `4px 8px 8px 4px`.
- Generated cover padding `10px`, size `13px`, weight `900`.
- Generated cover shadow: `4px 4px 0 rgba(0,0,0,.25)`.
- Real cover image width `96px`, height auto, radius `4px`, shadow `4px 4px 10px rgba(0,0,0,.3)`.
- Book title `19px`; description `14px`, muted, margin `0 0 10px`.

### Pricing tag

- Black pill, white text.
- `11px`, weight `800`.
- Padding `3px 10px`, radius `99px`, bottom margin `8px`.

### Quote

- Left border `5px solid var(--red)`.
- Left padding `18px`.
- Fluid `20px–28px` text at weight `800`.
- Default margin removed.

### Need links

- Block-level row with `14px 0` padding.
- `1px solid var(--line)` bottom divider.
- Inherit text color and remove underline.
- Recommended item title uses red bold text.

### Gallery

- Horizontal overflow, mandatory x-axis snap.
- Padding `8px 2px 18px`; gap `18px`.
- Images: `250px` high, auto width, radius `6px`.
- Shadow: `5px 6px 14px rgba(0,0,0,.3)`.

### Countdown banner

- Hidden by default with `display: none`.
- Red surface, white centered text.
- Padding `8px 12px`, size `14px`, weight `700`.
- Countdown number size `16px`, tabular figures.

### Toast

- Fixed `14px` from left and `14px + safe-area inset` from bottom.
- Maximum width `300px`.
- Theme surface/text, `1px` theme border, `4px` red left border.
- Radius `10px`, padding `10px 14px`, size `13px`.
- Shadow `0 6px 20px rgba(0,0,0,.25)`.
- Hidden state: opacity `0`, translated down `12px`; shown state: opacity `1`, no transform.
- Transition shorthand `.4s`; layer `z-index: 20`; pointer events disabled.
- HTML supplies `role="status"` and `aria-live="polite"`.

## 9. Borders, Radius, and Shadows

### Borders

| Token/recipe | Value |
| --- | --- |
| Standard divider | `1px solid var(--line)` |
| Primary button | `2px solid var(--red)` |
| Quote accent | `5px solid var(--red)` |
| Toast accent | `4px solid var(--red)` |
| Dark cover | `1px solid #444444` |

### Radius scale

| Radius | Usage |
| --- | --- |
| `4px` | Cover images |
| `4px 8px 8px 4px` | Generated book cover silhouette |
| `6px` | Gallery images |
| `10px` | Buttons and toast |
| `16px` | Cards and boxes |
| `99px` | Pill tag |

### Shadow scale

| Role | Value |
| --- | --- |
| Hard cover offset | `4px 4px 0 rgba(0,0,0,.25)` |
| Cover image | `4px 4px 10px rgba(0,0,0,.3)` |
| Gallery image | `5px 6px 14px rgba(0,0,0,.3)` |
| Floating toast | `0 6px 20px rgba(0,0,0,.25)` |

## 10. Motion

- Global anchor scrolling uses `scroll-behavior: smooth`.
- Toast enters over `.4s` by changing opacity and transform.
- No custom easing is specified, so browser default `ease` applies.
- No other animation or transition tokens exist.

## 11. Accessibility

### Present in source

- Semantic headings, sections, links, buttons, blockquote, and footer.
- Responsive viewport allows user zoom.
- Safe-area insets support notched and gesture-based devices.
- Toast uses polite live-region semantics.
- Dark mode follows system preference and supports explicit overrides.
- Base text is `16px` with `1.6` line-height.
- Text is not globally truncated.

### Required safeguards when extending the system

- Add a visible `:focus-visible` treatment to every link and button. Guidance: `2px–3px` outline with at least `2px` offset and sufficient contrast in both themes.
- Preserve native button semantics. Some CTA anchors in the source carry `data-buy`; interactive behavior must remain keyboard-operable.
- Keep touch targets at least `44px × 44px`; default buttons satisfy height, but small navigation links may need expanded hit areas.
- Add `@media (prefers-reduced-motion: reduce)` to disable smooth scrolling and toast transform transitions.
- Do not use red alone to communicate selection, errors, or urgency; pair it with labels, icons, or state text.
- Verify contrast for red text on both theme backgrounds, muted text, thin borders, disabled states, and white text on red. Target WCAG AA: `4.5:1` for normal text and `3:1` for large text/UI graphics.
- Supply meaningful `alt` text for book covers and gallery images; decorative images should use empty alt text.
- Keep heading order sequential and retain one page-level `h1`.
- Horizontal gallery needs keyboard-accessible scrolling and a visible focus state for any interactive contents.
- Avoid auto-start countdown urgency unless the deadline is real and announced accessibly; dynamic updates should not create excessive live-region noise.

Recommended reduced-motion override:

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  #toast { transition: none; transform: none; }
}
```

## 12. Canonical Token Map

The original CSS defines only colors. This map preserves exact source values while giving recurring primitives stable names for future extraction:

```css
:root {
  /* Source color tokens */
  --color-bg: #fff;
  --color-fg: #111;
  --color-muted: #555;
  --color-brand: #d90f1c;
  --color-card: #f6f4f3;
  --color-line: #e3dedb;

  /* Source-derived primitives */
  --container-max: 1040px;
  --gutter: 20px;
  --section-space: 64px;
  --card-space: 22px;
  --grid-gap: 18px;
  --radius-image: 4px;
  --radius-gallery: 6px;
  --radius-control: 10px;
  --radius-card: 16px;
  --radius-pill: 99px;
  --border-standard: 1px solid var(--color-line);
  --shadow-cover-hard: 4px 4px 0 rgba(0,0,0,.25);
  --shadow-cover: 4px 4px 10px rgba(0,0,0,.3);
  --shadow-gallery: 5px 6px 14px rgba(0,0,0,.3);
  --shadow-toast: 0 6px 20px rgba(0,0,0,.25);
  --breakpoint-hero: 800px;
}
```

These aliases are documentation only. Existing implementation names remain `--bg`, `--fg`, `--mut`, `--red`, `--card`, and `--line`.
