# TrueRate — Priority Data Requirements & Sources  
## Phase 2: Data Requirements & System Design

**Document type:** Data requirements specification  
**Version:** 1.0  
**Aligned with:** Partnership proposal, existing MoC ingestion service

---

## 1. Priority Data Sources

| Priority | Source | Description | Current status |
|----------|--------|-------------|----------------|
| **1** | **Business registration database** | Licensed businesses (e.g. money changers); name, license status, validity. | Requested; integration TBD post-MoU. |
| **2** | **Commodity price monitoring data** | Official prices by commodity (rice, palm oil, cement, etc.), unit, effective date, currency. | **In scope** — ingestion service and schema exist (`commodity_prices`, MoC normalizers). |
| **3** | **Trade / import statistics** | Declarations or aggregates: port, commodity, date, volume, value (LRD/USD), tariff. | **In scope** — ingestion and schema exist (`trade_declarations`, `import_summaries`). |
| **4** | **Business licensing status** | Current license status for verification (e.g. active/suspended/expired). | Requested; schema can extend `business_licenses` or similar. |
| **5** | **Consumer complaint records (aggregated)** | Counts or indicators by category/region; no personal data. | Requested; use for risk/fraud indicators only. |

---

## 2. Data Request Formats

TrueRate can accept ministry data in the following ways (to be confirmed in DSA):

| Format | Use case | Notes |
|--------|----------|--------|
| **API (REST)** | Commodity prices, trade stats, licensing status | Preferred; supports scheduled sync and near-real-time updates. |
| **CSV / Excel** | Bulletins, periodic reports | Parsers can be added in `services/ingestion/src/moc/` and fed into existing normalizers. |
| **JSON (file or API)** | Same as API | Current normalizers expect JSON-like structures; see `services/ingestion/src/moc/types.ts`. |
| **Scheduled reports** | Monthly/quarterly summaries | Manual or automated upload to a designated endpoint; then same validation and storage pipeline. |

---

## 3. Expected API/File Shapes (Reference)

Existing ingestion is built for the following shapes (adapt to actual MoCI API):

### 3.1 Commodity prices

- **Fields:** commodityId/commodityCode, name, unit, category, date/effectiveDate, price, currency.  
- **Containers:** `data`, `prices`, or `items` array.  
- **See:** `services/ingestion/src/moc/types.ts` → `MoCCommodityPriceItem`, `MoCCommodityResponse`.

### 3.2 Trade / import

- **Fields:** portCode, portName, commodityCode/commodityId, commodityName, date/declarationDate, volume, unit, valueLocal/valueLrd, valueUsd, tariffCode, tariffAmount.  
- **Containers:** `data`, `declarations`, or `imports` array.  
- **See:** `services/ingestion/src/moc/types.ts` → `MoCImportItem`, `MoCImportResponse`.

### 3.3 Business licensing (future)

- **Proposed fields:** businessId, businessName, licenseType, status (e.g. active/suspended/expired), validFrom, validTo, region/county (optional).  
- **Format:** To be agreed with MoCI; API or CSV both acceptable.

---

## 4. Data Validation Rules

- **Schema validation:** All incoming payloads validated (e.g. Zod or JSON Schema) before write.  
- **Idempotency:** Raw ingest keyed by `(source, bulletin_id)` or checksum; duplicates skipped.  
- **Referential integrity:** Commodities and ports resolved by `external_id`; unknown codes logged and optionally create new reference rows or skip.  
- **Date and numeric:** effective_date/declaration_date required; price/volume/value must be non-negative where applicable.

---

## 5. Security and Access

- **Credentials:** MoCI API keys or auth tokens in environment/secrets only.  
- **Network:** All ministry data enters via the ingestion layer; no direct public DB access.  
- **Audit:** Every ingest run and failure logged in `ingestion_logs`; raw payloads in `moc_raw_ingest` for replay/audit.

---

## 6. Related Deliverables

- **System architecture:** `docs/architecture/system-architecture.md`  
- **Data pipeline design:** `docs/architecture/data-pipeline-design.md`  
- **Database schema:** `docs/architecture/database-schema.sql`, `docs/architecture/data-schema-overview.md`  
- **Ingestion service:** `services/ingestion/README.md`, `services/ingestion/src/moc/`
