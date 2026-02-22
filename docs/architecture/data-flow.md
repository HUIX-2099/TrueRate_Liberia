# TrueRate Data Flow

## End-to-End Flow

```
MoC (Liberia)          Ingestion Layer           PostgreSQL / Redis           Services                Frontend
     │                         │                         │                         │                         │
     │  (1) Fetch / Receive     │                         │                         │                         │
     │ ───────────────────────►│                         │                         │                         │
     │                         │  (2) Validate & Store   │                         │                         │
     │                         │ ───────────────────────►│                         │                         │
     │                         │                         │  (3) Read / Events       │                         │
     │                         │                         │ ───────────────────────►│                         │
     │                         │                         │                         │  (4) Compute & Cache    │
     │                         │                         │◄─────────────────────── │                         │
     │                         │                         │                         │  (5) API request       │
     │                         │                         │                         │◄───────────────────────│
     │                         │                         │                         │  (6) Response (cached)  │
     │                         │                         │                         │───────────────────────►│
```

## 1. Data Ingestion Flow

### 1.1 Pull from Ministry of Commerce

- **Trigger:** Cron/scheduler (e.g. daily 06:00 UTC) or on-demand admin action.
- **Steps:**
  1. Ingestion service calls MoC endpoint (or scrapes published bulletin URL) with configured credentials.
  2. Raw response is validated (schema); invalid payloads are logged and not stored.
  3. Idempotency: `(source, bulletin_id, date)` — skip if already ingested.
  4. Raw payload stored in `moc_raw_ingest` (or similar); normalized records written to `commodity_prices`, `trade_declarations`, etc.
  5. Optional: emit domain event (e.g. `CommodityPricesIngested`) for downstream services.

### 1.2 Push (if MoC supports webhook)

- MoC sends POST to ingestion layer webhook URL.
- Same validate → idempotency → store pipeline; auth via shared secret or mTLS.

## 2. Ingestion → Database

| Step | Action | Table / Store |
|------|--------|----------------|
| Persist raw | Keep original MoC response for audit/replay | `moc_raw_ingest` |
| Normalize commodity | Map to canonical commodity IDs, units, dates | `commodity_prices`, `commodity_price_snapshots` |
| Normalize trade | Map to ports, HS codes, dates | `trade_declarations`, `import_summaries` |
| Cache invalidation | Delete or tag Redis keys for affected series | Redis: `tr:commodity:*`, `tr:trade:*` |

## 3. Services → Data

### 3.1 Commodity Price Analytics Service

- **Reads:** `commodity_prices`, `commodity_price_snapshots` (PostgreSQL).
- **Writes:** Optional materialized views or summary tables (e.g. daily aggregates); Redis cache for:
  - `tr:commodity:latest` — latest prices by commodity
  - `tr:commodity:series:{commodity_id}:{granularity}` — time series (TTL e.g. 5–15 min)

### 3.2 Trade/Import Analytics Service

- **Reads:** `trade_declarations`, `import_summaries`, `ports`, `commodities`.
- **Writes:** Aggregation cache in Redis:
  - `tr:trade:by_port:{period}`, `tr:trade:by_commodity:{period}` (TTL 1–24 h depending on freshness needs)

### 3.3 Market Risk Engine

- **Reads:** Commodity prices (DB or Redis), FX rates (existing CBL/multi-source APIs or DB).
- **Writes:** Risk metrics in Redis:
  - `tr:risk:var:{portfolio_or_market}`, `tr:risk:stress:*` (TTL e.g. 5–15 min)
- **Optional:** Persist daily risk snapshots in PostgreSQL for compliance/audit.

## 4. Frontend → User

1. **Next.js** requests data from **API Gateway / BFF** (e.g. `GET /api/commodity-prices`, `GET /api/trade/imports`, `GET /api/risk/summary`).
2. BFF calls one or more backend services (commodity, trade, risk); may use Redis cache when services are behind BFF.
3. BFF returns JSON; Next.js renders pages (e.g. Liberia market, analytics, risk dashboard).
4. Optional: Server Components fetch directly from BFF; Client Components use SWR/React Query with revalidate intervals.

## 5. Caching Strategy

| Layer | Key pattern | TTL | Invalidation |
|-------|-------------|-----|--------------|
| Commodity latest | `tr:commodity:latest` | 5 min | On new ingestion |
| Commodity series | `tr:commodity:series:{id}:d` | 15 min | On new ingestion for that commodity |
| Trade aggregates | `tr:trade:agg:{dim}:{period}` | 1 h | On new trade ingestion |
| Risk metrics | `tr:risk:var`, `tr:risk:stress:*` | 5 min | On schedule or price update |
| Rate limit | `tr:rl:{client}:{window}` | 1 min / 1 h | Sliding window |

## 6. Error and Retry Flow

- **Ingestion failures:** Log to `ingestion_logs`; retry with backoff (e.g. 3 attempts); dead-letter or alert after max retries.
- **Service failures:** BFF returns 503 or partial response; frontend shows cached or stale data with indicator.
- **Redis down:** Services fall back to PostgreSQL only; higher latency, no rate limiting (or use in-memory fallback with reduced limits).
