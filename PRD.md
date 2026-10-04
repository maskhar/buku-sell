# DWC Books — Product Requirements Document

## Project Summary and Source of Truth

Rebuild the supplied DWC Books single-page landing template as a production-ready, mobile-first website. Preserve its Indonesian copy, section order, six book covers, red/black/white visual identity, prices, CTA hierarchy, and conditional interactions. Improve implementation quality only where needed for responsiveness, accessibility, performance, compatibility, and deployment. The canonical visual and behavioral reference is `DWC Books — Belajar dari Praktik, Bukan Sekadar Teori.html`; its companion `.md` provides readable content. The supplied project brief adds production and validation requirements. This PRD lives at repository root because this assignment explicitly requests **only `PRD.md`**, despite the broader brief specifying `docs/PRD.md` for the eventual full build.

## Background, Objectives, and Audience

- **Background:** Dadik Wahyu Chang shares 25+ years of design, branding, business, creative-industry, and city-branding experience through six e-books. The landing page explains his practice-led approach, helps readers choose relevant titles, and presents bundled value and DWC.AI access.
- **Business objective:** Convert qualified visitors to a configured checkout for an individual e-book or a four-/six-book package without misleading claims or fabricated social proof.
- **User objective:** Understand book topics, author credibility, prices, bundle savings, purchase steps, and the stated DWC.AI bonus; choose a relevant offer and reach a working checkout.
- **Target users:** Indonesian readers and practitioners rebuilding businesses; building corporate brands; working in creative education/design; seeking creative thinking methods; managing city/regional identity; or exploring city monetization. Mobile visitors are the primary layout audience.
- **Primary conversion:** Click a purchase control and reach a valid checkout URL for the intended offer. Measure successful outbound checkout intent if analytics is configured; do not claim completed sales from clicks.
- **Secondary conversions:** Navigate to `#buku` or `#paket`, explore the six covers and need-based recommendations, open the author profile, or visit `dadikwahyuchang.id/ai`.

## Page Architecture and Content Inventory

Keep this order; conditional sections retain their original positions when enabled.

| Order | Section | Required content and intent |
| --- | --- | --- |
| 1 | Sticky navigation | DWC.BOOKS brand, external `Profil Dadik` link to `https://dadikwahyuchang.id`, `Beli` link to `#paket`. |
| 2 | Promotional bar, conditional | “Harga promo berakhir dalam” countdown; normal Rp174.000 versus Rp109.000 for six e-books. Hidden with no valid future deadline. |
| 3 | Hero | Eyebrow “E-Book Koleksi Pemikiran dan Praktik Baik”; H1 “Belajar dari praktik, bukan sekadar teori.”; original Dadik introduction; starting price Rp29.000; `Ambil 6 Buku — Rp109.000` to `#paket`; `Lihat Buku` to `#buku`; “Bayar → Download → Baca → Konsultasi dengan DWC.AI”. Adjacent card promises DWC.AI for one month and links to `https://dadikwahyuchang.id/ai`. |
| 4 | Proof metrics | 25+ years of practice, 6 e-books, 46 W Method stages, 1 month DWC.AI consultation. Preserve the reference figures, not invented testimonials or sales metrics. |
| 5 | Book-cover gallery | Six original embedded covers, same sequence as collection, horizontally scrollable with snap behavior. |
| 6 | Author profile (`#siapa`) | “25+ tahun belajar dari dunia nyata.”, Dadik biography and external profile link, quote about documenting, methodologizing, and sharing practice. |
| 7 | Why books exist | “Praktik baik tidak boleh berhenti pada satu orang.”, explanatory copy, progression from business through creativity/design/branding/city branding to city monetization. |
| 8 | Collection (`#buku`) | Six cards with original cover, title, description, and `Rp29.000 — Beli` action. |
| 9 | Testimonials, conditional | “Apa kata mereka?”; show only with genuine testimonial records. Initially hidden because reference array is empty. |
| 10 | Pricing (`#paket`) | Satu Buku: choose 1, Rp29.000; Paket 4 Buku: choose 4, Rp60.000, “Hemat Rp56.000”; Koleksi 6 Buku: all e-books + one month DWC.AI, Rp109.000, struck-through Rp174.000, “Hemat Rp65.000”, BEST VALUE emphasis. |
| 11 | DWC.AI bonus | “Bukan hanya membeli e-book.” and DWC.AI Agent description, 1-month access link, read/ask/discuss/practice sequence. |
| 12 | Needs guide | Six prompts linking to `#buku`, mapping each user need to its matching title. |
| 13 | Purchase steps | Pilih (one book/package), Isi data (name/WhatsApp/email), Bayar (transfer/QRIS/e-wallet), Download (link via email/WhatsApp), Akses DWC.AI (one month). These describe the external purchase journey, not an on-page form/payment processor. |
| 14 | Closing CTA | Original attributed Dadik quote, “Mulai dari satu buku. Rp29.000”, `Pilih Buku` and `Ambil Semuanya — Rp109.000` purchase controls. |
| 15 | Footer | “© DWC Books by Dadik Wahyu Chang” and external domain link. |
| 16 | Purchase toast, conditional | Fixed, unobtrusive status message only when genuine order records exist. Reference initially has none. |

### Six-book inventory

| Checkout key | Title | Reference description | Need matched |
| --- | --- | --- | --- |
| `balik` | Balik Jungkir | Perjalanan bisnis dari nol, naik, jatuh, dan bangkit kembali. | Rebuild a business. |
| `wmethod` | W Method | Metodologi membangun corporate brand dalam 46 tahapan, dari identifikasi hingga evaluasi. | Build a brand/company. |
| `doseen` | Doseen Desoon | Panduan praktis desain dan masa depan pendidikan kreatif. | Education/design. |
| `miring` | Berpikir Miring | Pola pikir kreatif yang out of the box untuk menemukan kemungkinan baru. | Creative thinking. |
| `city` | City Branding | Membangun identitas kota dengan legitimasi internasional. Kota bukan sekadar logo. | City/regional identity. |
| `monetized` | The Monetized City | Bagaimana identitas dan kekuatan lokal menjadi nilai ekonomi daerah. | City economic value. |

## Functional and Interaction Requirements

1. Render all always-on sections and exact reference copy/pricing in the stated order. Use structured shared book data so gallery, collection, and recommendations do not drift. Keep original covers; if extracting embedded base64 assets, preserve image quality and correct ordering.
2. Internal links reach existing `#buku` and `#paket` targets without sticky navigation hiding headings. External links retain their reference destinations. Use links for navigation and buttons for checkout actions.
3. Gallery supports horizontal native touch/trackpad scrolling and snap points. Do not replace with an automatic carousel or require hover.
4. Apply automatic system dark mode via `prefers-color-scheme`; honor explicit `data-theme="light"` and `data-theme="dark"` if theme state is used. Avoid theme flash and unreadable text in either mode; no new visible theme control is required by the reference.
5. Testimonials are absent when the dataset is empty; with verified records, show each quote plus name and optional city. Never synthesize names, quotes, or locations; treat supplied strings as text, not HTML.
6. Countdown stays hidden unless a valid future deadline is configured. When present, show hours:minutes:seconds, update about once per second, and hide/expire gracefully at zero. A missing, invalid, or past deadline must not expose a broken timer or fabricated urgency.
7. Purchase toast stays hidden without authentic order data. With records, show supplied name/city/item and optional elapsed minutes, announce politely via status/live region, avoid obstructing controls or shifting layout, and respect reduced motion. Never invent purchase events.

## Checkout Requirements and Known Configuration Gap

The reference defines nine checkout keys: `single`, `four`, `six`, `balik`, `wmethod`, `doseen`, `miring`, `city`, `monetized`. All URLs are **blank** in the supplied HTML. Every six-book card routes through its own book key; pricing cards use `single`, `four`, and `six`; closing CTA uses `single` and `six`. Preserve this mapping in maintainable configuration. Validate destinations before navigation; no empty, malformed, or unsafe URL should be opened. Missing checkout configuration produces clear, accessible, user-facing feedback, not a dead control or silent failure. The reference uses a browser alert; a nonblocking accessible message is an acceptable production improvement.

`Pilih Buku` on the single-book pricing card and closing CTA maps to `single` in the original source, even though the label implies a selection step. Do not invent a picker or redirect it to a different product; any eventual external single-book checkout must support the promised selection, or the merchant must supply a verified equivalent. The four-book checkout must likewise support selecting four titles; its included titles are not specified in the source. DWC.AI is explicitly promised with the six-book package and described in hero/bonus messaging; the source does not establish bonus eligibility for single- or four-book purchases. Confirm offer fulfillment and real payment destinations with the merchant before accepting live transactions. Actual payment collection, e-book delivery, and account provisioning belong to the external checkout/fulfillment provider; the landing page must not falsely claim they have been implemented.

## Responsive and Visual Requirements

- Implement mobile-first; inspect widths 320, 360, 375, 390, 414, 768, 1024, 1280, and 1440px. No unintended page-level horizontal scroll; gallery overflow is intentional.
- At narrow widths, keep navigation, prices, headings, images, CTA text, and book cards readable. Wrap or stack actions rather than clipping them; stack pricing cards cleanly, and keep touch targets ideally at least 44px.
- Preserve reference proportions where feasible: centered max-width 1040px container with 20px side padding; sticky 56px navigation; hero single column below its 800px two-column breakpoint; responsive grids for proof, collection, pricing, testimonials, and purchase steps; section borders and generous spacing. Adapt geometry when needed to prevent overflow.
- Maintain original red `#d90f1c`, white/light surfaces and near-black type, bordered rounded cards, outlined secondary CTAs, highlighted red six-book package, book-image shadows, left-accented quotes, and simple footer. Dark mode uses reference background `#0e0e0e`, foreground `#f4f1ef`, card `#1a1a1a`, and border `#2c2c2c`. Do not introduce decorative gradients, stock imagery, unrelated animations, or new major sections.
- Honor viewport safe-area insets for sticky navigation and fixed toast. Preserve interaction without hover on touch devices.

## Accessibility, SEO, Performance, and Browser Support

- Use `lang="id"`, semantic landmarks, one H1, logical heading order, real links/buttons, descriptive cover alt text, visible keyboard focus, adequate contrast in both themes, readable text at 320px, and no keyboard traps. Status feedback should use `role="status"`/polite `aria-live`; avoid noisy countdown announcements every second. Respect reduced-motion preferences for scrolling and toast animation.
- Set meaningful reference-aligned title and description; supply viewport and production-appropriate robots metadata, canonical-ready configuration once the real domain/path is known, Open Graph and Twitter card metadata grounded in actual content and assets, and theme color if appropriate. Do not invent a canonical URL, preview image, favicon, or sales claims.
- Keep JavaScript and dependencies small; preserve cover quality while serving assets efficiently, dimension images to avoid layout shifts, defer noncritical media where useful, and avoid large blocking bundles. Static assets should support compression and safe cache headers under production hosting. Visual fidelity takes priority over marginal micro-optimizations.
- Support current evergreen Chrome, Edge, Firefox, and Safari, including mobile Safari and Android Chrome. Functional navigation, checkout fallback, and content must not depend on hover or an unsupported browser API.
- Maintain a small, understandable frontend (preferred React/Vite/TypeScript for the full build), with repeatable production build and deployable static hosting. The broader project brief requires Docker multi-stage build, Nginx/static serving, and attachment to the existing external `carubra-network`; this PRD does not itself implement those deliverables.

## Acceptance Criteria

1. At each specified viewport, sections appear in reference order; six original covers and descriptions match their titles, with no unintended horizontal overflow or clipped CTA; both light and dark themes remain legible.
2. Navigation and hero/guide anchors reach correct sections; gallery scrolls on touch; all external links match source destinations.
3. Rp29.000, Rp60.000, Rp109.000, Rp174.000, Rp56.000, and Rp65.000 appear only in their reference offer contexts. No new eligibility or price claims are added.
4. Each of nine configured checkout keys dispatches to its matching valid destination; an unconfigured or invalid key provides accessible feedback and never navigates to an invalid location. Live checkout readiness remains blocked until merchant URLs and offer fulfillment are verified.
5. With empty testimonial/order arrays and deadline, testimonials, toast, and countdown are absent. With real data and future deadline, each appears and behaves as specified; countdown expiry hides urgency; data is rendered safely.
6. Keyboard navigation, headings, image alternatives, live-region behavior, touch targets, theme contrast, and reduced-motion behavior pass manual checks; no broken controls or console errors remain.
7. Production metadata accurately describes page; image rendering avoids visible layout shifts; build output is deployable. For the eventual full project, lint, typecheck, build, Docker build/runtime, responsive review, and final reference audit must be reported with actual results, not presumed success.

## Out of Scope

Redesign, new marketing copy or pricing, invented testimonials/orders/deadlines, checkout URLs not supplied by the merchant, on-page payment gateway or checkout form, user accounts, DWC.AI implementation, e-book delivery/backend fulfillment, analytics dashboards, and new major site sections. The reference's purchase steps describe an external service journey; they do not authorize building these systems into the landing page.

## Definition of Done

The eventual website faithfully renders reference content and conditional states, meets responsive/accessibility/SEO/performance requirements above, maps every purchase action safely, and passes real build/runtime and visual checks. Production transaction readiness additionally requires merchant-supplied working checkout URLs, verified selection behavior for `single`/`four`, and fulfillment of advertised downloads and DWC.AI access. With the supplied blank checkout configuration, document the limitation explicitly rather than claim payment flow is live.
