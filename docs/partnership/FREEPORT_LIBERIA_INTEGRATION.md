# Freeport of Liberia — TrueRate Integration & Benefits

This document outlines how the **Freeport of Liberia (FOL)** can link to and benefit from TrueRate Liberia’s platform: data integration, user-facing tools, and partnership options.

---

## Why This Fits

- **TrueRate** already has a **port-aware** trade and import data model: `ports`, `trade_declarations`, and `import_summaries` are in the schema; ingestion supports `portCode` / `portName` from Ministry of Commerce (MoCI) data.
- **Freeport** is a major entry point for trade and forex flows. Linking FOL to TrueRate gives:
  - **Transparency:** Public view of trade volumes and values tied to the port.
  - **FX clarity:** Importers, exporters, and changers can use one trusted USD/LRD rate for planning and conversion.
  - **Market intelligence:** Commodity and demand trends that flow through the port, aligned with national data.

---

## 1. Data Integration (Freeport ↔ TrueRate)

### 1.1 TrueRate ingesting Freeport / MoCI data

- **Source:** MoCI (or FOL, if they publish) trade/import data that includes **port of entry** (e.g. Freeport code/name).
- **Today:** Ingestion expects `portCode` / `portName` per declaration; these are normalized into the `ports` table and linked to `trade_declarations` and `import_summaries`.
- **Action:** Ensure **Freeport of Liberia** is present as a port in the reference data (e.g. `ports.external_id` = MoCI’s code for Freeport). Then all declarations that list Freeport will automatically appear in port-level analytics.

### 1.2 Freeport-specific feed (optional)

- If FOL provides its own feed (e.g. vessel calls, declarations, or aggregated monthly stats), TrueRate can add a **dedicated ingestion source** (e.g. `freeport_bulletin` or `freeport_api`) and map it into the same `trade_declarations` / `import_summaries` and `ports` model so Freeport appears alongside other ports in one place.

---

## 2. User-Facing Benefits for Freeport Stakeholders

| Benefit | How TrueRate delivers it |
|--------|----------------------------|
| **Single reference rate (USD/LRD)** | Live rate, history, and predictions so importers/exporters and money changers at or serving the port use one transparent rate for contracts and conversions. |
| **Port-level trade visibility** | Dashboards and APIs that show import volumes/values **by port** (including Freeport), by commodity and period — once port-coded data is ingested. |
| **Commodity and demand context** | Market intelligence: commodity prices, demand patterns, and forex pressure that put Freeport’s flows in a national context. |
| **Planning and budgeting** | Converter, bulk converter, and (future) cost-of-living / import cost tools so businesses and individuals can plan in LRD using a consistent rate. |
| **Fraud and trust** | Community rate reports and fraud reporting improve trust in rates used around the port and in Monrovia. |

---

## 3. Concrete Integration Options

### 3.1 Freeport as a named port in TrueRate

- Add **Freeport of Liberia** to the `ports` table (if not already present) with the official MoCI/FOL port code.
- Ensure ingestion (MoCI or FOL feed) uses that code so all relevant declarations are linked to Freeport.
- Expose **by-port** analytics in the Market Intelligence UI and via API (e.g. `GET /api/trade-analytics/import-volumes?port=freeport`).

### 3.2 Freeport-focused dashboard or page

- A dedicated **“Freeport”** view (or a “Ports” view with Freeport selected by default) showing:
  - Latest USD/LRD rate and short-term forecast.
  - Import volumes/values through Freeport by period and commodity (from `import_summaries` / trade analytics).
  - Links to converter, alerts, and market intelligence.
- Optional: embeddable widget (e.g. live rate + “Powered by TrueRate”) for FOL website or intranet.

### 3.3 API for port operations and partners

- **Public:** Existing or new APIs for live rate, history, and predictions (already in place).
- **Port-level:** New or extended endpoints, e.g.:
  - `GET /api/trade/imports?portId=<freeport_id>&period=month` for volumes/values.
  - `GET /api/trade/forex-pressure` (or similar) to show demand pressure that may affect rates relevant to import-heavy activity at Freeport.
- If FOL or MoCI have systems that consume data, TrueRate can provide stable, documented APIs (and optional API keys for higher limits).

### 3.4 Alerts and outreach

- **Rate alerts:** Freeport-based businesses and changers can subscribe to SMS or push alerts when the rate moves beyond a threshold, so they can time conversions.
- **Content:** Blog posts or short reports (e.g. “Trade through Freeport and the USD/LRD rate”) using TrueRate’s trade and rate data, with attribution to FOL where agreed.

---

## 4. What TrueRate Needs from Freeport / MoCI

- **Port code:** Official code or identifier for “Freeport of Liberia” in MoCI (or FOL) data so we can map declarations to the correct `ports` row.
- **Data access:** Either (a) MoCI data that includes port of entry (including Freeport), or (b) a Freeport-specific feed (API/CSV/Excel) that TrueRate can ingest on a schedule.
- **Partnership (optional):** MoU or simple agreement to:
  - Use TrueRate as a reference for the exchange rate in communications or internal tools.
  - Allow TrueRate to name Freeport in dashboards and reports (and vice versa: TrueRate to be credited by FOL where they use our data).

---

## 5. Technical Readiness (Current Repo)

- **Schema:** `ports`, `trade_declarations`, `import_summaries` and market intelligence schema already support port-level data.
- **Ingestion:** `services/ingestion`, MoC types (`portCode`, `portName`), and normalizers can map Freeport data into these tables.
- **Analytics:** `lib/trade-analytics` (import volumes, demand patterns, forex pressure) can be extended to filter or aggregate by `port_id` (e.g. Freeport).
- **APIs:** Trade analytics routes exist; adding a `port` or `portId` query parameter would enable Freeport-specific responses.
- **UI:** Market Intelligence page and future “Ports” or “Freeport” view can consume these APIs.

---

## Summary

The **Freeport of Liberia** can link to TrueRate by (1) being registered as a port and receiving port-coded trade data into the same pipeline TrueRate uses for MoCI, and (2) using TrueRate’s rate, converter, and market intelligence for transparency and operations. TrueRate benefits from a clear, high-profile use case (port-linked trade and FX); Freeport benefits from a single reference rate, port-level visibility, and better context for stakeholders. Next steps are agreeing the Freeport port code and data source, then implementing the by-port filtering and (optionally) a Freeport-focused dashboard or API.
