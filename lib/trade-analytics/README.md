# Trade Analytics Engine

Analyzes import volumes, detects demand patterns, generates market demand scores, forecasts forex pressure, and stores historical trend snapshots.

## Features

- **Import volume analysis** — Aggregate by period, category, and origin; totals and share percentages.
- **Demand patterns** — Detect rising/falling/stable/seasonal patterns per category with trend strength and growth rate.
- **Market demand score** — 0–100 score from volume level, trend direction, growth, and stability; overall or per category.
- **Forex pressure forecast** — Pressure index (0–100), import bill (USD/LRD), outlook (easing/stable/building/high), and narrative.
- **Historical trends** — Store snapshots on each run (in-memory; plug in DB via `TRADE_ANALYTICS_IMPORT_API_URL` or persistence layer); list by period/since/limit or get by id.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/trade-analytics/overview` | Full run: volumes, patterns, scores, forex pressure, and stored snapshot. Query: `periods`, `category`, `storeHistory=false`. |
| GET | `/api/trade-analytics/volumes` | Import volume analysis only. Query: `periods`, `category`, `originCountry`. |
| GET | `/api/trade-analytics/demand-patterns` | Demand patterns per category. Query: `periods`, `category`. |
| GET | `/api/trade-analytics/market-demand-score` | Market demand score(s). Query: `periods`, `period`, `category`. |
| GET | `/api/trade-analytics/forex-pressure` | Forex pressure forecast. Query: `periods`, `period`, `fxRate`. |
| GET | `/api/trade-analytics/historical-trends` | List stored snapshots. Query: `period`, `since`, `limit`, or `id` for single. |

## Configuration

- **TRADE_ANALYTICS_IMPORT_API_URL** — If set, import records are fetched from this URL (query params: `periods`, `category`, `originCountry`). Response shape: `{ records: [{ period, productCategory, originCountry?, volume, valueUsd?, valueLocal? }] }`. Otherwise sample data is used.

Forex pressure uses the same FX series as the monitoring engine (CBL / multi-source rates).

## Usage in code

```ts
import { runTradeAnalytics } from "@/lib/trade-analytics/engine"

const result = await runTradeAnalytics({ periods: 24, storeHistory: true })
// result.volumeAnalysis, result.demandPatterns, result.marketDemandScores,
// result.forexPressure, result.historicalSnapshot
```
