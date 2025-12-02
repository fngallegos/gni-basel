## GNI Basel — Quiet-Lux Art Week Guide

This repo powers the “GNI Picks” MVP for Basel/Art Week takeovers. It is intentionally narrow in scope: ingest a single curated CSV, surface GNI-vetted events, let guests save them to “My Week,” and keep concierge CTAs within arm’s reach.

### Commands

```bash
npm run dev      # HTTPS dev server (self-signed cert in /certs)
npm run build    # Production bundle + type check
npm run start    # Serve last build
npm run lint     # ESLint (Next + Core Web Vitals)
```

> Dev runs with `--experimental-https`. Trust/import `certs/localhost-cert.pem` if your browser blocks `https://localhost:3000`.

### Repo structure

- `src/app/` – App Router routes, global layout, and the concierge intake endpoint (`api/concierge`).
- `src/components/` – Client components (filters, cards, hero shell).
- `src/lib/events.ts` – Parses the canonical CSV string and exposes helpers.
- `src/data/events.csv.ts` – Template-string CSV (177 rows in production) consumed by the parser.
- `src/types/` – Shared TypeScript contracts.

### Manual QA expectations

1. Run `npm run lint` and `npm run build` before sharing work.
2. Smoke-test the home feed (search + filters, route cards, concierge modal) and `/my-week` saved state.
3. Capture viewport + browser details for manual QA notes.

### Product guardrails

- Quiet-lux black/white palette; adjust colors only through `globals.css`.
- Concierge CTA in every surface (event cards, route cards, hero) plus monetization links (Lite Pass, White-Glove deposit).
- Routes are curated, not random slices; they reference explicit event IDs from the CSV.
- CSV is the single data source—update `src/data/events.csv.ts` if you need new events.

Keep PRs concise, favor editorial copy over hype, and ship with zero build/type errors.
