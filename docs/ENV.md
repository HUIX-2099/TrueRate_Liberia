# Environment Variables

Use `.env.local` for local development and set these in your deployment (e.g. Vercel) for production.

## Required for full functionality

| Variable | Description | Default / fallback |
|---------|-------------|--------------------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps (Places, Geocoding) — client + server | `demo` (demo data only) |
| `GOOGLE_MAPS_API_KEY` | Server-only Maps API key (optional if `NEXT_PUBLIC_*` set) | Same as above or `demo` |
| `EXCHANGE_RATE_API_KEY` | ExchangeRate-API v6 for USD/LRD (optional; free APIs used if unset) | `demo` (other sources used) |

## Optional / feature-specific

| Variable | Description | Default |
|---------|-------------|---------|
| `RESEND_API_KEY` | Resend.com — for digest / email | — (digest send returns 503 if unset) |
| `DIGEST_FROM_EMAIL` | From address for digest emails | `TrueRate <onboarding@resend.dev>` |
| `DIGEST_CRON_SECRET` or `CRON_SECRET` | Secret for cron-triggered digest send | — (request must send `Authorization: Bearer <secret>` or `x-cron-secret`) |
| `RATE_REPORTS_LIMIT` | Max community rate reports returned (GET) | 100 (capped at 200) |
| `BASE_URL` | App base URL (e.g. for integration tests) | `http://localhost:3000` |
| `MONITORING_COMMODITY_API_URL` | Commodity data URL for market intelligence | — |
| `TRADE_ANALYTICS_IMPORT_API_URL` | Import analytics URL | — |

## Ingestion service (`services/ingestion`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Database connection string |
| `MOC_COMMODITY_URL`, `MOC_IMPORT_URL`, `MOC_API_KEY` | Ministry of Commerce API |
| `CRON_SCHEDULE` | Cron expression (default `0 6 * * *`) |
| `RETRY_MAX_ATTEMPTS`, `RETRY_BASE_MS` | Retry config |
| `LOG_LEVEL` | `debug` \| `info` \| `warn` \| `error` |

---

**Rates not updating?** Check that CBL and Xe (or other sources in `lib/api/multi-source-rates.ts`) are reachable from your deployment. In restricted networks, the app falls back to a hardcoded indicative rate and logs to the server.
