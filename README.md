# DWC Books

Production-ready React rebuild of DWC Books landing page. Implementation preserves original structure, Indonesian content, six book covers, pricing, responsive composition, dark-mode behavior, and optional sales interactions.

## Stack

- React 19 + TypeScript
- Vite
- Nginx production image
- Docker Compose on external `carubra-network`

## Local Development

Requirements: Node.js 22+ and npm.

```bash
npm ci
npm run dev
```

Open `http://localhost:5173`.

## Configuration

Copy `.env.example` to `.env`. All variables are optional; checkout buttons show a safe message when URLs are empty.

Checkout URLs:

- `VITE_CHECKOUT_SINGLE`, `VITE_CHECKOUT_FOUR`, `VITE_CHECKOUT_SIX`
- `VITE_CHECKOUT_BALIK`, `VITE_CHECKOUT_WMETHOD`, `VITE_CHECKOUT_DOSEEN`
- `VITE_CHECKOUT_MIRING`, `VITE_CHECKOUT_CITY`, `VITE_CHECKOUT_MONETIZED`

Optional interactions:

- `VITE_PROMO_DEADLINE`: ISO 8601 deadline, such as `2026-12-31T23:59:59+07:00`
- `VITE_TESTIMONIALS`: JSON array, for example `[{"nama":"Rina","kota":"Surabaya","teks":"Praktis dan jelas."}]`
- `VITE_ORDERS`: JSON array, for example `[{"nama":"Rina","kota":"Surabaya","item":"6 e-book","menit":5}]`

Google and SEO configuration:

- `VITE_GOOGLE_SITE_VERIFICATION`: verification token from Google Search Console.
- `VITE_GA4_MEASUREMENT_ID`: GA4 web stream ID such as `G-XXXXXXXXXX`.
- `VITE_GTM_CONTAINER_ID`: Google Tag Manager container ID such as `GTM-XXXXXXX`.

Choose **one** tracking method. If `VITE_GTM_CONTAINER_ID` is valid, the app loads GTM and ignores direct GA4 loading; configure the GA4 Google tag inside that GTM container. If GTM is empty, the app loads `VITE_GA4_MEASUREMENT_ID` directly. This avoids duplicate page views.

In GTM, create a Google tag for the GA4 measurement ID plus a custom-event trigger named `begin_checkout`, then publish the container. Do not add a separate GA4 tag outside this site or duplicate the Google tag in the reverse proxy. The app reports checkout intent only; the payment provider must report confirmed `purchase` events independently with a real transaction ID.

Google Analytics is consent-gated. No Google tracking script loads before the visitor grants analytics consent. Advertising storage, ad user data, and ad personalization remain denied. Valid checkout links emit the GA4 recommended `begin_checkout` event with IDR value and item data.

The canonical production URL is `https://buku.dadikwahyuchang.id/`. Static SEO files:

- `/robots.txt`
- `/sitemap.xml`
- `/kebijakan-privasi.html`

After deployment, add the domain property in Google Search Console, verify it, then submit `https://buku.dadikwahyuchang.id/sitemap.xml`.

Before going live, replace example values in `/kebijakan-privasi.html` if you add other data processors or collect personal information through other services. Google Search Console's DNS verification is an alternative if meta verification is unavailable.

### Demo Social Proof

Run a clearly labeled preview containing 40 synthetic testimonials and 100 simulated orders:

```bash
npm run dev:demo
```

For Docker, Compose reads `.env` automatically but does **not** read `.env.demo` automatically. Start the demo image with:

```bash
docker compose --env-file .env --env-file .env.demo up -d --build
```

Equivalent shortcut:

```bash
npm run docker:demo
```

Plain `docker compose up -d --build` remains the production-safe build and leaves demo mode disabled unless `VITE_SOCIAL_PROOF_MODE=demo` exists in `.env`.

Demo cards show a prominent `DATA DEMO` notice and every purchase toast starts with `[DEMO]`. Production builds remain empty unless `VITE_SOCIAL_PROOF_MODE=demo` is explicitly set. Never enable demo mode on a public production storefront.
Demo builds include `noindex, nofollow` so simulated testimonials cannot be indexed by search engines.

Testimonials render as a compact horizontal carousel. It auto-advances every 4.5 seconds, pauses during hover or keyboard focus, supports swipe/trackpad scrolling and arrow controls, and disables automatic movement when the visitor requests reduced motion.

Internal section navigation uses JavaScript scrolling rather than URL fragments. Buttons jump to books, packages, testimonials, or main content without leaving `#buku`, `#paket`, and similar hashes in the address bar. Legacy hash URLs still scroll to their target once, then clean the URL.

Vite embeds these values during build. Do not use secrets in any `VITE_*` variable. Rebuild after changing configuration.

## Quality Checks

```bash
npm run lint
npm run typecheck
npm run build
```

## Docker Deployment

Create external network once if platform has not already created it:

```bash
docker network create carubra-network
```

Build and start:

```bash
docker compose up -d --build
```

Service exposes port `80` inside `carubra-network` without publishing a host port. Connect an existing reverse proxy on that network to upstream `buku-sell:80`. Configure domain and TLS at that reverse proxy.

Inspect runtime:

```bash
docker compose ps
docker inspect buku-sell-buku-sell-1
```

Stop:

```bash
docker compose down
```

## Documentation

- `PRD.md`: product requirements and acceptance criteria
- `DESIGN_SYSTEM.md`: extracted design tokens and component rules
- `REFERENCE_AUDIT.md`: source-template inventory and behavior audit
- `AGENTS.md`: maintenance rules and mandatory validation

## Production Notes

- Replace placeholder checkout variables with real HTTPS payment URLs before launch.
- Supply only verified testimonials and purchase events.
- Canonical domain is `https://buku.dadikwahyuchang.id/`; configure DNS and reverse-proxy TLS externally.
- Original HTML and Markdown files remain as reference artifacts; production serves Vite `dist/` only.
