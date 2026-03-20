# Liberia Revenue Authority — TrueRate Integration & Benefits

This document outlines how the **Liberia Revenue Authority (LRA)** can link to and benefit from TrueRate Liberia’s platform: reference exchange rates for customs valuation, data integration, and partnership options.

---

## Why This Fits

- **Customs valuation** requires a consistent **USD/LRD exchange rate** for converting invoice values, assessing duties, and reporting. TrueRate provides a transparent, multi-source **reference rate** (market and CBL official) plus history and predictions.
- **TrueRate** already has a **trade-aware** data model: `trade_declarations` and `import_summaries` include `value_local`, `value_usd`, `tariff_code`, and `tariff_amount`; ingestion supports MoCI and can be extended for LRA or Single Window data.
- **LRA** benefits from:
  - **Valuation consistency:** One trusted rate (or choice of official vs market) for customs and tax purposes.
  - **Transparency:** Public can see the same rate LRA uses or references, reducing disputes and improving compliance.
  - **Analytics:** Trade volumes, values, and forex pressure in one place, with optional LRA data alongside MoCI.

---

## 1. Data Integration (LRA ↔ TrueRate)

### 1.1 TrueRate as reference rate for LRA

- **Use case:** LRA systems (e.g. ASYCUDA/Single Window) or manual valuation use a **reference USD/LRD rate** for converting declared values and computing duties.
- **TrueRate provides:** Live rate, CBL official rate, historical series, and (optional) rate-on-date for past declarations via API.
- **Action:** LRA can consume TrueRate’s public API (e.g. `GET /api/rates/live` or `GET /api/v1/rate`) for the reference rate, or use an agreed “rate of the day” published by TrueRate (aligned with CBL or market, per policy).

### 1.2 TrueRate ingesting LRA / customs data (optional)

- **Source:** If LRA publishes **customs/tax bulletins**, declaration aggregates, or an API (e.g. monthly collections, key commodities, ports), TrueRate can add a **dedicated ingestion source** (e.g. `lra_bulletin` or `lra_api`).
- **Schema fit:** Existing `trade_declarations` has `tariff_code`, `tariff_amount`, `value_local`, `value_usd`, and `source`; a new source value (e.g. `lra`) would allow LRA-sourced records alongside `moc` without schema change.
- **Benefit:** One national view of trade and forex pressure; LRA data can enrich market intelligence and cross-check with MoCI.

### 1.3 LRA as authoritative source for tariff and tax context

- **Recommendation (docs):** TrueRate already lists **LRA** in [data-sources-recommendations.md](../data-sources-recommendations.md) for “Customs/tax context” (API/Doc if available).
- **Use:** Tariff changes, tax bulletins, or valuation guidelines from LRA can inform narrative and regulatory modules (e.g. `TradePolicyUpdate` with `source: "LRA"` in `lib/regulatory/types.ts`).

---

## 2. User-Facing Benefits for LRA

| Benefit | How TrueRate delivers it |
|--------|---------------------------|
| **Single reference rate (USD/LRD)** | Live rate, CBL official, history, and predictions so LRA (and declarants) use one transparent rate for valuation and reporting. |
| **Rate-on-date for past declarations** | Historical API so duties and audits can apply the rate that was in effect on the declaration date. |
| **Valuation and duty consistency** | Converter and (future) duty-estimate tools use the same rate, reducing disputes and improving taxpayer compliance. |
| **Trade and revenue context** | Market intelligence: import volumes/values, commodity trends, and forex pressure that put revenue and collections in context. |
| **Trust and transparency** | Public and businesses see the same reference rate; community rate reports and fraud reporting support trust in the rate environment. |

---

## 3. Concrete Integration Options

### 3.1 LRA systems consuming TrueRate API

- **Live rate:** `GET /api/rates/live` or `GET /api/v1/rate` returns `rate`, `cblRate`, `sources`, `timestamp`.
- **Historical rate:** `GET /api/v1/historical` or historical-by-source for **rate on a given date** (e.g. for past declarations).
- **Policy:** Agree whether LRA uses “official (CBL)” only, “market” only, or a defined rule (e.g. CBL for valuation, TrueRate market for analytics). TrueRate can expose both and document the methodology.

### 3.2 LRA-focused dashboard or page (optional)

- A dedicated **“For Government / LRA”** view (or section) showing:
  - Current reference rate (and CBL official), with clear labeling.
  - Short-term rate forecast and history.
  - Links to API docs and rate-on-date usage.
- Optional: **embeddable widget** (e.g. “Reference rate powered by TrueRate”) for LRA intranet or public portal.

### 3.3 API for valuation and duty tools

- **Public:** Existing endpoints for live rate, history, and predictions.
- **Extended:** If needed, a **rate-on-date** endpoint, e.g. `GET /api/rates/on-date?date=YYYY-MM-DD` returning the reference rate for that date (from historical series), for use in audits and back-dated declarations.
- **Documentation:** Clear API docs and (if agreed) API keys for higher limits or SLA for LRA systems.

### 3.4 Tariff and tax narrative

- **Regulatory/trade policy:** TrueRate can surface LRA tariff or tax updates (when published) in the regulatory module and market intelligence narrative, with attribution to LRA.
- **Methodology:** “Customs valuation uses [CBL/TrueRate reference] rate as of [date]” in public methodology text, agreed with LRA.

---

## 4. What TrueRate Needs from LRA

- **Rate policy (optional):** Confirmation whether LRA uses CBL only or is open to a transparent market-based reference (e.g. TrueRate) for valuation or for analytics.
- **Data access (optional):** If LRA wishes to appear in TrueRate’s trade/revenue view: bulletins, aggregates, or API (e.g. monthly collections, key commodities/ports) that TrueRate can ingest with clear attribution and data governance.
- **Partnership (optional):** MoU or simple agreement to:
  - Use TrueRate as a **reference** for the exchange rate in communications, systems, or internal tools (with agreed methodology).
  - Allow TrueRate to name LRA in dashboards and methodology (and vice versa: LRA to credit TrueRate where they use the rate).

---

## 5. Technical Readiness (Current Repo)

- **Rates:** Live and historical APIs exist (`/api/rates/live`, `/api/v1/rate`, `/api/v1/historical`); CBL and multi-source aggregation are implemented.
- **Schema:** `trade_declarations` and `import_summaries` already have `tariff_code`, `tariff_amount`, `value_local`, `value_usd`, and `source`; adding an LRA source is a configuration/ingestion change.
- **Regulatory:** `lib/regulatory/types.ts` supports `TradePolicyUpdate` and `PriceControlPolicy` with `source`/`authority` (e.g. `"LRA"`).
- **Docs:** [data-sources-recommendations.md](../data-sources-recommendations.md) already recommends LRA for customs/tax context; this document and API docs can be extended for LRA-specific usage.

---

## Summary

The **Liberia Revenue Authority** can link to TrueRate by (1) **consuming TrueRate’s reference USD/LRD rate** (and optional rate-on-date) for customs valuation and reporting, and (2) optionally **supplying or allowing ingestion of LRA trade/tax data** so TrueRate can present a unified view of trade and forex. LRA benefits from a single, transparent reference rate, consistency in valuation, and better context for revenue and compliance; TrueRate benefits from a high-profile public-sector use case and potential data partnership. Next steps are agreeing rate policy (CBL vs market reference) and whether LRA will provide any public data feed, then implementing any rate-on-date endpoint and (optional) LRA ingestion or dashboard.
