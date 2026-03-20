# TrueRate Data Ingestion Service

Node.js service that fetches **commodity prices** and **import statistics** from the Ministry of Commerce Liberia (MoC), normalizes the data, and stores it in PostgreSQL. Supports scheduled cron sync and one-off runs.

## Features

- **Fetch commodity prices** from MoC (configurable URL)
- **Fetch import statistics** from MoC (configurable URL)
- **Scheduled cron sync** (e.g. daily at 06:00 UTC)
- **Retry logic** with exponential backoff (axios + custom retry wrapper)
- **Data normalization** from API shape to TrueRate schema (commodities, ports, commodity_prices, trade_declarations)
- **Error logging** to console and `ingestion_logs` table
- **PostgreSQL storage** (raw payloads in `moc_raw_ingest`, normalized rows in commodity/trade tables)
- **Idempotency** via raw ingest checksum; duplicate payloads are skipped

## Stack

- **TypeScript**
- **axios** — HTTP client for MoC API
- **node-cron** — scheduled sync
- **pg** — PostgreSQL client
- **dotenv** — environment config

## Setup

1. **Install dependencies**

   ```bash
   cd services/ingestion && npm install
   ```

2. **PostgreSQL schema**

   Ensure the [architecture database schema](../../docs/architecture/database-schema.sql) is applied (tables: `commodities`, `ports`, `moc_raw_ingest`, `commodity_prices`, `trade_declarations`, `ingestion_logs`).

3. **Environment**

   Copy `.env.example` to `.env` and set:

   - `DATABASE_URL` — required
   - `MOC_COMMODITY_URL` — MoC commodity prices endpoint (optional; if unset, commodity sync is skipped)
   - `MOC_IMPORT_URL` — MoC import statistics endpoint (optional; if unset, import sync is skipped)
   - `MOC_API_KEY` — optional API key or Bearer token
   - `CRON_SCHEDULE` — e.g. `0 6 * * *` for daily 06:00 UTC; set to `none` or leave empty to disable cron
   - `RETRY_MAX_ATTEMPTS`, `RETRY_BASE_MS` — retry behavior
   - `LOG_LEVEL` — `debug` | `info` | `warn` | `error`

## Scripts

| Command | Description |
|--------|-------------|
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled service (cron daemon) |
| `npm run dev` | Run with ts-node (cron daemon) |
| `npm run sync` | One-off full sync (commodity + imports), then exit |
| `npm run sync:commodity` | One-off commodity sync only |
| `npm run sync:imports` | One-off import sync only |
| `npm run trigger` | Run HTTP trigger server (POST /sync with CRON_SECRET runs sync) |
| `npm run trigger:dev` | Run trigger server with ts-node |

To allow Vercel Cron (or another scheduler) to trigger sync, run the trigger server (e.g. on a small host or serverless), set `CRON_SECRET` and `TRIGGER_PORT`, and configure the Next.js app with `ENABLE_CRON_SYNC=true`, `INGESTION_SERVICE_URL`, and `CRON_SECRET`. The route `POST /api/cron/sync` will then call the ingestion service.

## API shape (MoC)

The normalizers expect JSON responses. Adapt `src/moc/types.ts` and the normalizers under `src/moc/normalize/` to match the real MoC API.

- **Commodity**: array of items with fields such as `commodityId`/`commodityCode`, `name`, `unit`, `date`/`effectiveDate`, `price`, `currency`. Supported keys are in `MoCCommodityPriceItem`.
- **Import**: array of items with `portCode`, `portName`, `commodityCode`/`commodityId`, `commodityName`, `date`/`declarationDate`, `volume`, `unit`, `valueLocal`/`valueLrd`, `valueUsd`, etc. See `MoCImportItem`.

If the Ministry provides CSV or Excel, add a parser in `src/moc/` and pass the parsed structure into the existing normalizers.
