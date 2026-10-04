# DWC Books Engineering Guide

## Product Intent
- Preserve reference visual identity and Indonesian copy before making improvements.
- Keep page mobile-first, accessible, fast, and deployable as static files.
- Treat `DWC Books — Belajar dari Praktik, Bukan Sekadar Teori.html` as canonical reference.

## Architecture
- React + TypeScript + Vite application lives in `src/`.
- Content, book metadata, and public configuration live in `src/data.ts`.
- Visual tokens and responsive rules live in `src/styles.css` and must match `DESIGN_SYSTEM.md`.
- Static book covers live in `public/covers/`; do not re-embed them as base64.

## Change Rules
- Preserve all six books, prices, section order, and checkout keys.
- Never commit real secrets. `VITE_*` values are public and embedded at build time.
- Keep testimonials, countdown, and social-proof toast hidden when their data is empty.
- Keep checkout fallback clear when a payment URL is unavailable.
- Verify at 320, 360, 375, 390, 414, 768, 1024, 1280, and 1440 pixels after layout changes.

## Required Validation
Run before completion:

```bash
npm run lint
npm run typecheck
npm run build
docker compose config
docker compose build
```

For runtime QA, ensure external network exists, run `docker compose up -d`, verify HTTP 200, then confirm container attachment to `carubra-network`.
