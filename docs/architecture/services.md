# TrueRate Service Structure

## Repository Layout (Recommended)

Two options: **monorepo** (single repo, multiple packages) or **multi-repo**. Below is a monorepo layout that fits the existing TrueRate Next.js app.

```
truerate_liberia/
├── apps/
│   ├── web/                    # Next.js frontend (current app root content)
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── package.json
│   └── gateway/                # Optional: standalone Node BFF (or use Next.js API routes)
│       ├── src/
│       └── package.json
├── services/
│   ├── ingestion/              # Secure data ingestion layer
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── moc/
│   │   │   │   ├── client.ts       # MoC API client
│   │   │   │   ├── commodity.ts    # Parse & map commodity data
│   │   │   │   └── trade.ts        # Parse & map trade data
│   │   │   ├── pipeline/
│   │   │   │   ├── validate.ts
│   │   │   │   ├── idempotency.ts
│   │   │   │   └── store.ts
│   │   │   └── config.ts
│   │   └── package.json
│   ├── commodity-analytics/    # Commodity price analytics
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── routes/
│   │   │   │   ├── prices.ts
│   │   │   │   └── indices.ts
│   │   │   ├── analytics/
│   │   │   │   ├── aggregates.ts
│   │   │   │   └── series.ts
│   │   │   └── cache.ts
│   │   └── package.json
│   ├── trade-analytics/       # Trade/import analytics
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── routes/
│   │   │   │   ├── imports.ts
│   │   │   │   └── summaries.ts
│   │   │   ├── analytics/
│   │   │   └── cache.ts
│   │   └── package.json
│   └── risk-engine/            # Market risk engine
│       ├── src/
│       │   ├── index.ts
│       │   ├── routes/
│       │   │   └── metrics.ts
│       │   ├── risk/
│       │   │   ├── var.ts
│       │   │   ├── stress.ts
│       │   │   └── limits.ts
│       │   └── cache.ts
│       └── package.json
├── packages/
│   ├── db/                     # Shared PostgreSQL client & migrations
│   │   ├── src/
│   │   │   ├── client.ts
│   │   │   └── migrations/
│   │   └── package.json
│   ├── redis/                  # Shared Redis client & key helpers
│   │   ├── src/
│   │   │   ├── client.ts
│   │   │   └── keys.ts
│   │   └── package.json
│   └── types/                  # Shared DTOs and domain types
│       ├── src/
│       │   ├── commodity.ts
│       │   ├── trade.ts
│       │   └── risk.ts
│       └── package.json
├── package.json                # Workspace root (npm/pnpm workspaces)
├── docker-compose.yml
└── docs/
    └── architecture/
```

## Service APIs (Contract Summary)

### Data Ingestion Layer

- **Internal only** (not exposed to frontend).
- **Endpoints (examples):**
  - `POST /ingest/commodity` — body: raw or normalized commodity payload; idempotency key in header.
  - `POST /ingest/trade` — body: raw or normalized trade payload; idempotency key in header.
  - `GET /ingest/health` — health check.
- **Scheduler:** Invokes MoC client and then `POST /ingest/commodity` and `/ingest/trade` with fetched data.

### Commodity Price Analytics Service

| Method | Path | Description |
|--------|------|-------------|
| GET | `/prices/latest` | Latest price per commodity (from cache or DB) |
| GET | `/prices/series?commodityId=&from=&to=&granularity=d\|w\|m` | Time series |
| GET | `/prices/indices?from=&to=` | Simple price indices (e.g. base period = 100) |
| GET | `/commodities` | List of commodities with IDs and units |

### Trade/Import Analytics Service

| Method | Path | Description |
|--------|------|-------------|
| GET | `/imports/summary?period=month\|quarter\|year&from=&to=` | Aggregate imports by period |
| GET | `/imports/by-port?period=&from=&to=` | Imports by port |
| GET | `/imports/by-commodity?period=&from=&to=` | Imports by commodity |
| GET | `/imports/trends?commodityId=&period=` | Trend metrics (e.g. YoY growth) |

### Market Risk Engine

| Method | Path | Description |
|--------|------|-------------|
| GET | `/risk/var?market=commodity\|fx&confidence=95\|99` | Value-at-Risk metrics |
| GET | `/risk/stress?scenario=price_shock\|fx_shock` | Stress test results |
| GET | `/risk/limits` | Current limits and breach status |
| GET | `/risk/summary` | Summary for dashboard (VaR + stress + limits) |

### API Gateway / BFF (Next.js or standalone)

- **Frontend-facing:** `GET /api/commodity-prices/*`, `GET /api/trade/*`, `GET /api/risk/*`.
- **Implementation:** Next.js route handlers in `app/api/` that call the services above (via HTTP or shared `packages/db` + `packages/redis` if colocated); optional Redis cache at BFF for hot paths.

## Technology Stack per Service

| Component | Runtime | Framework | DB Access | Cache |
|-----------|---------|-----------|-----------|--------|
| Ingestion | Node.js | Express/Fastify | PostgreSQL (write) | Redis (idempotency, rate limit) |
| Commodity analytics | Node.js | Express/Fastify | PostgreSQL (read) | Redis (read-through) |
| Trade analytics | Node.js | Express/Fastify | PostgreSQL (read) | Redis (read-through) |
| Risk engine | Node.js | Express/Fastify | PostgreSQL (read), FX/price inputs | Redis (output cache) |
| Gateway/BFF | Node.js | Next.js API or Express | — | Redis (optional) |
| Web | Node.js | Next.js 16 | — | — |

## Shared Packages

- **packages/db:** Pool creation, migrations (e.g. node-pg-migrate or Drizzle), typed queries; used by ingestion + all analytics services.
- **packages/redis:** Client, key builders (`tr:commodity:*`, etc.), TTL constants; used by all services.
- **packages/types:** TypeScript types and Zod schemas for commodity, trade, risk; shared by ingestion and services.

## Environment Variables (per service)

- **Ingestion:** `MOC_BASE_URL`, `MOC_API_KEY` (or cert path), `DATABASE_URL`, `REDIS_URL`, `INGESTION_CRON` (optional).
- **Commodity/Trade/Risk:** `DATABASE_URL`, `REDIS_URL`, `SERVICE_PORT`; Risk may also need `CBL_RATES_URL` or existing FX API URL.
- **Gateway/Next.js:** `COMMODITY_SERVICE_URL`, `TRADE_SERVICE_URL`, `RISK_SERVICE_URL`, `REDIS_URL` (optional for BFF cache).
