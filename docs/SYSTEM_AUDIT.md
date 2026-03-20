# TrueRate System Audit — Ministry of Commerce Data Modules

**Date:** 2025  
**Scope:** API & service validation, database, data pipeline, backend responses, frontend display, UI state, error handling, performance, security.

---

## 1. Issues Found

| Area | Issue | Severity |
|------|--------|----------|
| **API** | No single health check for all MoC data modules (commodity, trade, market risk, COL). | Medium |
| **API** | Market intelligence dashboard could receive non-JSON or error JSON from APIs; state could be left stale or partial. | Medium |
| **Frontend** | Dashboard showed "No commodity data" / "No volume data" with no guidance or retry. | Low |
| **Frontend** | Error state had no "Try again" action. | Low |
| **Logging** | No centralized request/error logger for API routes. | Low |
| **Performance** | No response caching documented; Redis not implemented (docs only). | Low |
| **Database** | Next.js app does not connect to PostgreSQL; ingestion service does. Tables `import_statistics`, `trade_reports`, `market_indicators`, `data_source_logs` exist in optional market-intelligence schema, not in current ingestion schema. | Info |
| **Cron** | Sync runs and scheduler state are in-memory; no persistence across restarts. | Info |

---

## 2. Fixes Applied

### 2.1 API & Service Validation

- **Added `GET /api/health/moc`** — Ministry of Commerce health check that probes:
  - Commodity prices: `/api/monitoring/volatility`
  - Trade/import analytics: `/api/trade-analytics/volumes`
  - Market risk: `/api/market-risk`
  - Cost of living: `/api/cost-of-living/dashboard`
  - Sync logs: `/api/sync-logs`
  - Scheduler: `/api/scheduler/runs`
- Returns structured JSON: `status` (ok | degraded | down), `checks` per module (status, latencyMs, message, optional data), `moc.syncSummary`, `timestamp`.
- **Existing** `GET /api/health` unchanged (rates: live, historical, predictions).

### 2.2 Frontend Display & Empty/Error States

- **Market Intelligence page** (`app/market-intelligence/page.tsx`):
  - Safer parsing: all API responses validated (array checks, fallbacks to `[]` or `null`) so partial/error responses do not corrupt state.
  - Error banner: added **Try again** button that clears error and refetches.
  - Empty commodity chart: message + “Run data sync (cron) or ensure monitoring APIs are available” + **Refresh** button.
  - Empty import chart: message + “Trade analytics data will appear after sync or when API is configured” + **Refresh** button.
  - Numeric fallbacks for market risk use `|| 0` so invalid numbers do not display as NaN.

### 2.3 Centralized Logging

- **Added `lib/logger.ts`**:
  - `logRequest({ method, path, statusCode, durationMs, service? })` — request logging.
  - `logError({ message, service?, error?, metadata? })` — error logging.
  - `getRecentLogs({ level?, limit? })` — in-memory buffer (last 200 entries) for inspection.
  - Logs to console and optional downstream (e.g. status endpoint can expose recent logs).

### 2.4 Caching (Performance)

- **Added `lib/cache.ts`** — in-memory TTL cache:
  - `getCached<T>(key)`, `setCached(key, value, ttlMs)`, `invalidateCache(keyPrefix)`, `cacheKey(path, searchParams)`.
  - Default TTL 60s; can be used in API routes for expensive GETs.
  - **Production:** Documented that Redis (`REDIS_URL`) can replace this with the same usage pattern.

### 2.5 Security (Existing)

- **Cron:** `GET/POST /api/cron/sync` protected by `CRON_SECRET` (Bearer or `x-cron-secret`).
- **Government APIs:** Auth, rate limiting, audit via `lib/government-security`.
- **Environment:** Sensitive keys (e.g. `CRON_SECRET`, `GOV_API_KEY`, `DATABASE_URL`) are env-based; no hardcoding.

---

## 3. Health Check Report

### Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /api/health` | Overall app: live rate, historical, predictions (ok / degraded / down). |
| `GET /api/health/moc` | MoC modules: commodity, trade, market risk, cost of living, sync logs, scheduler. |
| `GET /api/government/health` | Government integration (auth + rate limit required). |

### Example: MoC health response

```json
{
  "status": "ok",
  "checks": {
    "commodity_prices": { "status": "ok", "latencyMs": 120, "data": { "seriesCount": 3 } },
    "trade_import_analytics": { "status": "ok", "latencyMs": 80, "data": { "periodCount": 24 } },
    "market_risk": { "status": "ok", "latencyMs": 95, "data": { "marketRiskScore": 25, "priceStabilityIndex": 72 } },
    "cost_of_living": { "status": "ok", "latencyMs": 200, "data": { "hasIndex": true } },
    "sync_logs": { "status": "ok", "latencyMs": 5 },
    "scheduler": { "status": "ok", "latencyMs": 4 }
  },
  "moc": { "syncSummary": [{ "source": "CBL rates", "lastSync": "...", "status": "success" }] },
  "timestamp": "2025-02-22T..."
}
```

### Running health checks

```bash
# Overall app
curl -s http://localhost:3000/api/health | jq .

# MoC modules
curl -s http://localhost:3000/api/health/moc | jq .
```

---

## 4. Database Validation

### Next.js app

- The **Next.js app does not connect to PostgreSQL**. It uses:
  - In-memory or sample data for trade analytics, regulatory, alerts, etc., when env URLs are not set.
  - Optional `TRADE_ANALYTICS_IMPORT_API_URL` and `MONITORING_COMMODITY_API_URL` to point to an ingestion/backend API.

### Ingestion service (PostgreSQL)

- **Location:** `services/ingestion/`
- **Connection:** `DATABASE_URL` in `services/ingestion/.env` (see `services/ingestion/.env.example`).
- **Schema:** Apply `docs/architecture/database-schema.sql`. Required tables for current ingestion:
  - `commodities`, `ports`, `moc_raw_ingest`, `commodity_prices`, `trade_declarations`, `ingestion_logs`
- **Optional schema:** `docs/architecture/market-intelligence-schema.sql` adds `import_statistics`, `trade_reports`, `market_indicators`, `data_source_logs` (for future expansion).

### Validating database

1. Apply schema:
   ```bash
   psql "$DATABASE_URL" -f docs/architecture/database-schema.sql
   ```
2. Run ingestion (from repo root):
   ```bash
   cd services/ingestion && pnpm install && pnpm start
   ```
3. Check tables and recent logs:
   ```sql
   SELECT COUNT(*) FROM commodity_prices;
   SELECT COUNT(*) FROM trade_declarations;
   SELECT * FROM ingestion_logs ORDER BY run_at DESC LIMIT 5;
   ```

### Seed data

- If DB is empty, ingestion will populate it when MoC URLs are set (`MOC_COMMODITY_URL`, `MOC_IMPORT_URL` in ingestion config).
- App uses sample/fixture data when no external API is configured (see `lib/trade-analytics/data.ts`, `lib/monitoring/commodity-data.ts`).

### MoCI website data (moci.gov.lr)

- **Source:** [https://www.moci.gov.lr/](https://www.moci.gov.lr/) — Ministry of Commerce & Industry (Commerce Today bulletin, news, documents).
- **Implementation:** `lib/moci/` — `fetchMociPageData()` fetches the homepage and parses it with Cheerio to extract:
  - News & press releases (title, date, URL)
  - Commerce Today bulletin references and publication link
  - Recent and key document links (PDFs)
- **API:** `GET /api/moci` — returns scraped page data; optional query `?include=commodity|import|all` adds generated commodity/import fixture data (Commerce Today–style) for dashboards when no official MoC API is configured.
- **Fixture data:** `generateMociCommodityData()` and `generateMociImportData()` in `lib/moci/generate-commodity-data.ts` produce sample prices and import records (LRD, typical Liberian commodities). Not a substitute for official APIs; use for demos or when `MOC_COMMODITY_URL` / `MOC_IMPORT_URL` are unset.
- **Relationship to ingestion:** The ingestion service (`services/ingestion`) expects JSON from `MOC_COMMODITY_URL` and `MOC_IMPORT_URL`. The MoCI website is HTML; this module provides scraped metadata and optional in-app fixture data. To feed ingestion from moci.gov.lr you would need a separate scraper that outputs the same JSON shape or adapt the ingestion client to consume `/api/moci?include=all`.

---

## 5. Data Pipeline Check

- **Cron:** Vercel Cron hits `GET /api/cron/sync` every 15 minutes (`vercel.json`). With `CRON_SECRET` set, requests must include the secret.
- **Scheduler:** `lib/scheduler` runs due jobs (CBL rates, commodity prices, trade import) with retry (3 attempts, exponential backoff) and logs to in-memory store.
- **Sync logs:** `GET /api/sync-logs` returns last run per job from scheduler; `GET /api/scheduler/runs` returns full run history.
- **Failure recovery:** Each job uses `runJobWithRetry`; failures are logged with status and error message.

---

## 6. Backend Response Testing

- All listed APIs return JSON. Errors use `{ error: string, detail?: string }` with appropriate status codes (400, 401, 404, 429, 500).
- MoC health (`/api/health/moc`) validates responses (e.g. `series`, `volumeAnalysis`, `marketRiskScore`) and returns structured checks.

---

## 7. Testing Summary

| Test | How |
|------|-----|
| Commodity API | `curl -s http://localhost:3000/api/monitoring/volatility?days=30` → expect `series` array. |
| Trade/import API | `curl -s http://localhost:3000/api/trade-analytics/volumes?periods=12` → expect `volumeAnalysis` array. |
| Market risk API | `curl -s http://localhost:3000/api/market-risk?days=30` → expect `marketRiskScore`, `priceStabilityIndex`. |
| Cost of living API | `curl -s http://localhost:3000/api/cost-of-living/dashboard?days=30` → expect `costOfLivingIndex`, `aggregatedPrices`. |
| Sync logs | `curl -s http://localhost:3000/api/sync-logs` → expect `logs` array. |
| MoC health | `curl -s http://localhost:3000/api/health/moc` → expect `status`, `checks` with per-module status. |
| MoCI website data | `curl -s http://localhost:3000/api/moci` → expect `page` (news, bulletins, documents), `source`, `fetchedAt`. `?include=all` adds `commodity` and `import` arrays. |
| Dashboard UI | Open `/market-intelligence`; verify KPIs, charts, sync logs; test Refresh and Try again on error. |
| Cron (local) | `curl -s -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/sync` → expect `ran`, `summary`. |

---

## 8. Automated Integration Tests

- **Location:** `tests/integration/moc-api.test.mjs`
- **Runner:** Node.js built-in test runner (`node --test`). No Jest or other dependency.
- **Script:** `pnpm test:integration` (see `package.json`).

**What is tested:**

| Test | Endpoint | Assertions |
|------|----------|------------|
| Health | `GET /api/health` | status ok/degraded/down, checks object, timestamp |
| MoC health | `GET /api/health/moc` | status, checks (commodity_prices, trade_import_analytics, market_risk, cost_of_living, sync_logs, scheduler), moc.syncSummary array |
| Commodity | `GET /api/monitoring/volatility?days=7&window=7` | 200, `series` array |
| Trade | `GET /api/trade-analytics/volumes?periods=6` | 200, `volumeAnalysis` array |
| Market risk | `GET /api/market-risk?days=30` | 200, marketRiskScore/priceStabilityIndex/riskLabel present |
| Cost of living | `GET /api/cost-of-living/dashboard?days=30` | 200, aggregatedPrices array, costOfLivingIndex/affordabilityIndex object or null |
| Sync logs | `GET /api/sync-logs` | 200, `logs` array |
| Scheduler | `GET /api/scheduler/runs?limit=5` | 200, `runs` array |
| Regulatory | `GET /api/regulatory/overview` | 200, tradePolicyCount, priceControlCount, recentRegulationChanges |

**How to run:**

```bash
# App must be running (e.g. pnpm dev in another terminal)
BASE_URL=http://localhost:3000 pnpm test:integration

# Or with default BASE_URL=http://localhost:3000
pnpm test:integration
```

CI can start the app (`pnpm build && pnpm start`), wait for readiness, then run `pnpm test:integration` with `BASE_URL=http://localhost:3000`.

---

## 9. Service Monitoring Dashboard

- **Route:** `/admin/monitoring`
- **File:** `app/admin/monitoring/page.tsx`

**Features:**

- **Ministry data services tab:** Fetches `GET /api/health/moc`; shows overall MoC status (ok/degraded/down) and per-check cards: Commodity prices, Trade/import analytics, Market risk engine, Cost of living index, Sync logs, Data sync scheduler. Each card shows status badge, latency (ms), and optional message/data. Data sync summary lists last run per source (from `moc.syncSummary`).
- **Rate APIs tab:** Fetches `GET /api/health`; shows Live rate API, Historical rates, Predictions API with status and latency.
- **Auto-refresh:** Polls every 30 seconds.
- **Quick links:** System status page, Market intelligence, API health MoC (JSON).

Use for operations to see all Ministry data services and rate APIs in one place.

---

## 10. System Status Page (Ministry Data Services)

- **Route:** `/status`
- **File:** `app/status/page.tsx`

**Updates:**

- **Dual health fetch:** Page now requests both `GET /api/health` and `GET /api/health/moc` in parallel.
- **Rate sources & APIs:** Existing section (live, historical, predictions) unchanged.
- **Ministry of Commerce data services:** New section with overall MoC status and per-service rows: Commodity prices, Trade/import analytics, Market risk engine, Cost of living index, Sync logs, Data sync scheduler. Each row shows status icon, label, latency, message, and status badge. Data sync summary (last run per source) shown when available.
- **Link:** “Monitoring dashboard” button to `/admin/monitoring`.
- **Refresh:** Single “Refresh” button and 60s auto-refresh still apply to both sections.

The status page is the single place for “all Ministry data services status” plus rate APIs.

---

## 11. Steps to Run System Locally

### Prerequisites

- Node 18+
- pnpm (or npm)

### 1. Next.js app

```bash
cd /path/to/truerate_liberia
pnpm install
cp .env.example .env   # if present; add CRON_SECRET, GOV_API_KEY, etc. as needed
pnpm dev
```

- App: http://localhost:3000  
- Health: http://localhost:3000/api/health  
- MoC health: http://localhost:3000/api/health/moc  
- Market Intelligence: http://localhost:3000/market-intelligence  
- System status (all services): http://localhost:3000/status  
- Monitoring dashboard: http://localhost:3000/admin/monitoring  

### 2. Run integration tests

```bash
# With app running (pnpm dev)
BASE_URL=http://localhost:3000 pnpm test:integration
```

### 3. Optional: Ingestion service (PostgreSQL)

```bash
# In another terminal
export DATABASE_URL="postgresql://user:pass@localhost:5432/truerate"
psql "$DATABASE_URL" -f docs/architecture/database-schema.sql

cd services/ingestion
pnpm install
# Set .env: DATABASE_URL, MOC_COMMODITY_URL, MOC_IMPORT_URL (if available)
pnpm start
```

### 4. Optional: Trigger data sync (cron)

```bash
export CRON_SECRET="your-secret"
curl -s -H "Authorization: Bearer $CRON_SECRET" "http://localhost:3000/api/cron/sync"
```

### 5. Environment variables (summary)

| Variable | Where | Purpose |
|----------|--------|---------|
| `CRON_SECRET` | App | Protect `/api/cron/sync` |
| `GOV_API_KEY`, `GOV_API_KEYS` | App | Government API auth |
| `GOV_ENCRYPTION_KEY` | App | Field-level encryption (gov) |
| `DATABASE_URL` | Ingestion only | PostgreSQL for ingestion |
| `TRADE_ANALYTICS_IMPORT_API_URL` | App | Override trade data source |
| `MONITORING_COMMODITY_API_URL` | App | Override commodity data source |

---

## 12. Summary

- **MoC health:** `/api/health/moc` covers commodity, trade, market risk, cost of living, sync, and scheduler.
- **Frontend:** Market Intelligence dashboard hardened with safe parsing, empty states, and error retry.
- **Logging:** Centralized `lib/logger.ts` for request and error logs.
- **Cache:** In-memory TTL cache in `lib/cache.ts` for optional use; Redis recommended for production.
- **Database:** Documented ingestion schema and validation steps; app remains stateless without direct DB.
- **Security:** Cron and government routes protected; env-based configuration.
- **Integration tests:** `tests/integration/moc-api.test.mjs` — automated API tests via `pnpm test:integration` (Node test runner).
- **Service monitoring dashboard:** `/admin/monitoring` — MoC and rate API status with tabs and 30s refresh.
- **System status page:** `/status` — shows both rate APIs and all Ministry of Commerce data services status, plus sync summary and link to monitoring dashboard.

All Ministry of Commerce data modules are wired, covered by health checks, integration tests, and status/monitoring UI.
