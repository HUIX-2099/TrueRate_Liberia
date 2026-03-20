# Commodity Price Monitoring Engine

Tracks price trends, detects spikes, correlates commodity prices with exchange rate (USD/LRD), and generates alerts. Data is provided by a configurable source (sample data by default; plug in your DB or API via env).

## Features

- **Price trends** — Linear regression slope, moving average, direction (up/down/stable) over configurable window.
- **Spike detection** — Day-over-day % change and/or z-score thresholds.
- **FX correlation** — Pearson correlation between commodity price series and CBL/market USD/LRD rate over overlapping dates.
- **Alerts** — Rules evaluate trends/spikes/correlation and create alerts (in-memory store); list and acknowledge via API.
- **Cost of Living Index** — Basket index (base period = 100), equal-weight across monitored commodities.
- **Price volatility charts** — Rolling coefficient-of-variation series per commodity for charting.
- **Forex impact insights** — Correlation + beta (sensitivity to USD/LRD) and short narrative per commodity.
- **Market inflation indicators** — MoM and YoY % change of the commodity basket with per-commodity breakdown.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/monitoring/overview` | Full run: trends, spikes, correlations, and newly generated alerts. Query: `days`, `spikePercent`, `spikeZ`, `alerts=false` to skip alert evaluation. |
| GET | `/api/monitoring/trends` | Price trends only. Query: `days`, `commodityId`, `window`. |
| GET | `/api/monitoring/spikes` | Detected spikes. Query: `days`, `commodityId`, `percentThreshold`, `zScoreThreshold`. |
| GET | `/api/monitoring/correlation` | Commodity vs USD/LRD correlation. Query: `days`, `commodityId`. |
| GET | `/api/monitoring/alerts` | List alerts. Query: `acknowledged=true|false`, `severity`, `limit`. |
| POST | `/api/monitoring/alerts` | Acknowledge alert. Body: `{ "id": "alt_..." }`. |
| GET | `/api/monitoring/cost-of-living` | Cost of living index (basket = 100 at base). Query: `days`, `baseDate`. |
| GET | `/api/monitoring/volatility` | Price volatility chart data (rolling CV %). Query: `days`, `window`, `commodityId`. |
| GET | `/api/monitoring/forex-impact` | Forex impact insights (correlation, beta, narrative). Query: `days`, `commodityId`. |
| GET | `/api/monitoring/inflation` | Market inflation indicators (MoM, YoY). Query: `days`. |

## Configuration

- **MONITORING_COMMODITY_API_URL** — If set, commodity price series are fetched from this URL (query params: `days`, `commodityId`). Response shape: `{ commodityId?, commodityName?, series: [{ date, value }] }`.
- **MONITORING_COMMODITIES** — JSON array of `{ id, name }` for monitored commodities. Default: Rice, Palm Oil, Cement.

Exchange rate series use existing CBL historical and multi-source rate logic (`lib/cbl-rates`, `lib/api/multi-source-rates`).

## Usage in code

```ts
import { runMonitoring } from "@/lib/monitoring/commodity-engine/engine"

const result = await runMonitoring({ days: 30, spikePercentThreshold: 15 })
// result.trends, result.spikes, result.correlations, result.alertsGenerated
```
