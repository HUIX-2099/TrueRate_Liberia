# Environment variables

Optional env vars used by TrueRate Liberia.

## SMS alerts (optional)

To send real SMS when users subscribe to rate alerts, configure a provider in `.env.local`:

- **SMS_PROVIDER** – `twilio` or `africas_talking`
- **SMS_API_KEY** – Provider API key (or use provider-specific names below)

### Twilio

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER` (e.g. +1234567890)

### Africa's Talking

- `AFRICAS_TALKING_API_KEY`
- `AFRICAS_TALKING_USERNAME`
- `AFRICAS_TALKING_SENDER_ID` (optional)

The subscribe API stores subscriptions regardless; when these are set, you can extend `app/api/sms/subscribe/route.ts` to send a confirmation SMS or register the number with your provider.

## Ingestion & cron sync (optional)

Used by the Ministry of Commerce data ingestion service and the Next.js cron route that triggers it.

### Ingestion service (`services/ingestion`)

- **DATABASE_URL** – Required. PostgreSQL connection string.
- **MOC_COMMODITY_URL** – MoCI commodity prices endpoint (optional).
- **MOC_IMPORT_URL** – MoCI import statistics endpoint (optional).
- **MOC_API_KEY** – Optional API key for MoCI.
- **CRON_SCHEDULE** – Cron expression (e.g. `0 6 * * *` for daily 06:00 UTC); set to `none` to disable.
- **CRON_SECRET** – Secret for HTTP trigger; required when running the trigger server.
- **TRIGGER_PORT** – Port for trigger HTTP server (default `3456`).
- **RETRY_MAX_ATTEMPTS**, **RETRY_BASE_MS**, **LOG_LEVEL** – Retry and logging.

### Next.js app (cron route)

Cron-triggered sync from the Next.js app is **disabled**. The route `GET/POST /api/cron/sync` always returns 503. To run sync on a schedule, use the ingestion service (cron daemon `npm start` or trigger server `npm run trigger`) elsewhere; no Next.js env vars are used for sync.

## SME / Business digest email (optional)

Weekly or daily digest (rate, price index, market risk) sent via [Resend](https://resend.com).

- **RESEND_API_KEY** – Resend API key (required to send).
- **DIGEST_FROM_EMAIL** – Sender address and name, e.g. `TrueRate Digest <digest@yourdomain.com>`. Defaults to `TrueRate <onboarding@resend.dev>` for Resend’s test domain.
- **DIGEST_CRON_SECRET** – Secret for triggering send (optional; falls back to **CRON_SECRET**). Send request: `POST /api/digest/send` with `Authorization: Bearer <secret>` or `x-cron-secret: <secret>`.

Subscribe: `POST /api/digest/subscribe` with `{ "email": "...", "frequency": "weekly" | "daily" }`. Unsubscribe: `POST /api/digest/unsubscribe` with `{ "email": "..." }`. Schedule a cron (e.g. Monday 08:00) to call `POST /api/digest/send` with the secret to email all subscribers.
