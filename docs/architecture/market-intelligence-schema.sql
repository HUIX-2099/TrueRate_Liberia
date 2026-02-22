-- =============================================================================
-- TrueRate — Market Intelligence Data Integration Schema
-- =============================================================================
-- Tables: commodity_prices, import_statistics, trade_reports, market_indicators,
--         data_source_logs
-- Reference: data_sources (for FK from logs and fact tables)
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- REFERENCE: Data sources (feeds, APIs, bulletins)
-- =============================================================================

CREATE TABLE data_sources (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code          VARCHAR(64) NOT NULL UNIQUE,   -- e.g. moc_commodity, cbl_fx, lisgis_cpi
  name          VARCHAR(255) NOT NULL,
  source_type   VARCHAR(32) NOT NULL,          -- api, bulletin, scrape, manual
  base_url      VARCHAR(512),
  active        BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_data_sources_code ON data_sources (code);
CREATE INDEX idx_data_sources_active ON data_sources (active) WHERE active = true;

-- =============================================================================
-- REFERENCE: Commodities (shared by commodity_prices and import_statistics)
-- =============================================================================

CREATE TABLE IF NOT EXISTS commodities (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  external_id   VARCHAR(64) UNIQUE NOT NULL,
  name          VARCHAR(255) NOT NULL,
  unit          VARCHAR(32) NOT NULL,
  category      VARCHAR(64),
  hs_code       VARCHAR(32),
  active        BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_commodities_external_id ON commodities (external_id);
CREATE INDEX IF NOT EXISTS idx_commodities_category ON commodities (category);

-- =============================================================================
-- REFERENCE: Ports / regions (for import_statistics)
-- =============================================================================

CREATE TABLE IF NOT EXISTS ports (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  external_id   VARCHAR(64) UNIQUE NOT NULL,
  name          VARCHAR(255) NOT NULL,
  country_code  CHAR(2) NOT NULL DEFAULT 'LR',
  active        BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ports_country ON ports (country_code);

-- =============================================================================
-- commodity_prices — Time-series price data per commodity
-- =============================================================================
-- Relationship: data_sources (1) → (N) commodity_prices
--               commodities (1) → (N) commodity_prices
-- =============================================================================

CREATE TABLE commodity_prices (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  commodity_id    UUID NOT NULL REFERENCES commodities (id) ON DELETE RESTRICT,
  data_source_id  UUID NOT NULL REFERENCES data_sources (id) ON DELETE RESTRICT,
  price           NUMERIC(18, 4) NOT NULL,
  currency        CHAR(3) NOT NULL DEFAULT 'LRD',
  unit            VARCHAR(32) NOT NULL,
  effective_date  DATE NOT NULL,
  recorded_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata        JSONB
);

CREATE INDEX idx_commodity_prices_commodity_date
  ON commodity_prices (commodity_id, effective_date DESC);
CREATE INDEX idx_commodity_prices_effective_date
  ON commodity_prices (effective_date DESC);
CREATE INDEX idx_commodity_prices_data_source
  ON commodity_prices (data_source_id, effective_date DESC);
CREATE INDEX idx_commodity_prices_recorded_at
  ON commodity_prices (recorded_at DESC);

-- Optional: prevent duplicate (commodity, source, date) per day from same source
CREATE UNIQUE INDEX idx_commodity_prices_commodity_source_date
  ON commodity_prices (commodity_id, data_source_id, effective_date);

-- Optional: market_location for display/API (nullable; also storable in metadata)
ALTER TABLE commodity_prices
  ADD COLUMN IF NOT EXISTS market_location VARCHAR(255);

CREATE INDEX IF NOT EXISTS idx_commodity_prices_market_location
  ON commodity_prices (market_location) WHERE market_location IS NOT NULL;

-- =============================================================================
-- commodity_price_quotes — Flat shape for APIs/reports (id, commodity_name,
--   price, market_location, price_change_percentage, date, source)
-- =============================================================================

CREATE TABLE commodity_price_quotes (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  commodity_name          VARCHAR(255) NOT NULL,
  price                   NUMERIC(18, 4) NOT NULL,
  market_location         VARCHAR(255),
  price_change_percentage NUMERIC(8, 2),         -- e.g. -2.50 for -2.5%
  date                    DATE NOT NULL,
  source                  VARCHAR(64) NOT NULL,
  recorded_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_commodity_price_quotes_date ON commodity_price_quotes (date DESC);
CREATE INDEX idx_commodity_price_quotes_source ON commodity_price_quotes (source);
CREATE INDEX idx_commodity_price_quotes_commodity_name ON commodity_price_quotes (commodity_name, date DESC);
CREATE INDEX idx_commodity_price_quotes_market_location ON commodity_price_quotes (market_location) WHERE market_location IS NOT NULL;

-- =============================================================================
-- VIEW: v_commodity_price_quotes — Same columns from normalized tables
-- (commodity_prices + commodities + data_sources; price_change from LAG)
-- =============================================================================

CREATE OR REPLACE VIEW v_commodity_price_quotes AS
SELECT
  cp.id,
  c.name AS commodity_name,
  cp.price,
  cp.market_location,
  ROUND(
    (cp.price - LAG(cp.price) OVER w) * 100.0 / NULLIF(LAG(cp.price) OVER w, 0),
    2
  ) AS price_change_percentage,
  cp.effective_date AS date,
  ds.code AS source,
  cp.recorded_at
FROM commodity_prices cp
JOIN commodities c ON c.id = cp.commodity_id
JOIN data_sources ds ON ds.id = cp.data_source_id
WINDOW w AS (PARTITION BY cp.commodity_id, cp.data_source_id ORDER BY cp.effective_date);

-- =============================================================================
-- import_statistics — Aggregated import volumes/values by period, port, commodity
-- =============================================================================
-- Relationship: data_sources (1) → (N) import_statistics
--               commodities (1) → (N) import_statistics
--               ports (1) → (N) import_statistics
-- =============================================================================

CREATE TABLE import_statistics (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  data_source_id  UUID NOT NULL REFERENCES data_sources (id) ON DELETE RESTRICT,
  port_id         UUID REFERENCES ports (id) ON DELETE SET NULL,
  commodity_id    UUID REFERENCES commodities (id) ON DELETE RESTRICT,
  period_type     VARCHAR(16) NOT NULL,         -- day, week, month, quarter, year
  period_start    DATE NOT NULL,                 -- first day of period
  volume          NUMERIC(18, 4) NOT NULL,
  unit            VARCHAR(32) NOT NULL,
  value_local     NUMERIC(18, 4),                -- LRD
  value_usd       NUMERIC(18, 4),
  declaration_count INT,
  recorded_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata        JSONB
);

CREATE INDEX idx_import_statistics_period
  ON import_statistics (period_type, period_start DESC);
CREATE INDEX idx_import_statistics_commodity
  ON import_statistics (commodity_id, period_start DESC);
CREATE INDEX idx_import_statistics_port
  ON import_statistics (port_id, period_start DESC);
CREATE INDEX idx_import_statistics_data_source
  ON import_statistics (data_source_id, period_start DESC);

CREATE UNIQUE INDEX idx_import_statistics_unique
  ON import_statistics (data_source_id, period_type, period_start, port_id, commodity_id);

-- Optional: origin_country for import reporting (nullable; also storable in metadata)
ALTER TABLE import_statistics
  ADD COLUMN IF NOT EXISTS origin_country CHAR(2);

CREATE INDEX IF NOT EXISTS idx_import_statistics_origin_country
  ON import_statistics (origin_country) WHERE origin_country IS NOT NULL;

-- =============================================================================
-- import_demand_quotes — Flat shape for APIs/reports (id, product_category,
--   import_volume, origin_country, period, market_demand_score)
-- =============================================================================

CREATE TABLE import_demand_quotes (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_category    VARCHAR(128) NOT NULL,
  import_volume       NUMERIC(18, 4) NOT NULL,
  origin_country      CHAR(2),                   -- ISO 2-letter, e.g. LR, US
  period              VARCHAR(32) NOT NULL,       -- e.g. 2025-Q1, 2025-01
  market_demand_score NUMERIC(6, 2),              -- e.g. 0–100 or normalized
  recorded_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_import_demand_quotes_period ON import_demand_quotes (period);
CREATE INDEX idx_import_demand_quotes_product_category ON import_demand_quotes (product_category, period);
CREATE INDEX idx_import_demand_quotes_origin_country ON import_demand_quotes (origin_country) WHERE origin_country IS NOT NULL;
CREATE INDEX idx_import_demand_quotes_market_demand ON import_demand_quotes (market_demand_score DESC NULLS LAST);

-- =============================================================================
-- VIEW: v_import_demand_quotes — Same columns from normalized import_statistics
-- (import_statistics + commodities.category + origin_country)
-- =============================================================================

CREATE OR REPLACE VIEW v_import_demand_quotes AS
SELECT
  is_.id,
  COALESCE(c.category, c.name) AS product_category,
  is_.volume AS import_volume,
  is_.origin_country,
  to_char(is_.period_start, 'YYYY-MM') AS period,
  NULL::NUMERIC(6, 2) AS market_demand_score   -- populate from market_indicators or separate ETL
FROM import_statistics is_
JOIN commodities c ON c.id = is_.commodity_id;

-- =============================================================================
-- trade_reports — Published or generated trade reports (summary / document refs)
-- =============================================================================
-- Relationship: data_sources (1) → (N) trade_reports
-- =============================================================================

CREATE TABLE trade_reports (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  data_source_id  UUID NOT NULL REFERENCES data_sources (id) ON DELETE RESTRICT,
  report_type     VARCHAR(64) NOT NULL,         -- monthly_bulletin, annual_summary, ad_hoc
  report_code     VARCHAR(128),                 -- external report ID
  title           VARCHAR(512),
  period_start    DATE,                          -- coverage period
  period_end      DATE,
  published_at    TIMESTAMPTZ,
  file_url        VARCHAR(1024),                 -- optional link to PDF/Excel
  summary         JSONB,                        -- key metrics, highlights
  recorded_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata        JSONB
);

CREATE INDEX idx_trade_reports_data_source
  ON trade_reports (data_source_id);
CREATE INDEX idx_trade_reports_period
  ON trade_reports (period_start DESC, period_end DESC);
CREATE INDEX idx_trade_reports_type
  ON trade_reports (report_type);
CREATE INDEX idx_trade_reports_published
  ON trade_reports (published_at DESC NULLS LAST);
CREATE UNIQUE INDEX idx_trade_reports_source_code
  ON trade_reports (data_source_id, report_code) WHERE report_code IS NOT NULL;

-- =============================================================================
-- market_indicators — Computed or ingested indicators (indices, volatility, etc.)
-- =============================================================================
-- Relationship: data_sources (1) → (N) market_indicators
--               optional: commodity_id for commodity-specific indicators
-- =============================================================================

CREATE TABLE market_indicators (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  data_source_id  UUID NOT NULL REFERENCES data_sources (id) ON DELETE RESTRICT,
  commodity_id    UUID REFERENCES commodities (id) ON DELETE SET NULL,  -- null = market-wide
  indicator_type  VARCHAR(64) NOT NULL,         -- price_index, volatility, trend, spread
  indicator_code  VARCHAR(64),                  -- e.g. CPI_RICE, VOL_30D
  as_of_date      DATE NOT NULL,
  value           NUMERIC(18, 6) NOT NULL,
  unit            VARCHAR(16) NOT NULL,          -- percent, index_points, LRD
  recorded_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata        JSONB
);

CREATE INDEX idx_market_indicators_type_date
  ON market_indicators (indicator_type, as_of_date DESC);
CREATE INDEX idx_market_indicators_commodity
  ON market_indicators (commodity_id, as_of_date DESC) WHERE commodity_id IS NOT NULL;
CREATE INDEX idx_market_indicators_data_source
  ON market_indicators (data_source_id, as_of_date DESC);
CREATE INDEX idx_market_indicators_as_of_date
  ON market_indicators (as_of_date DESC);

CREATE UNIQUE INDEX idx_market_indicators_unique
  ON market_indicators (data_source_id, COALESCE(commodity_id::text, ''), indicator_type, indicator_code, as_of_date);

-- =============================================================================
-- market_balance_quotes — Flat shape for APIs/reports (id, commodity,
--   supply_level, demand_level, risk_index, date)
-- =============================================================================

CREATE TABLE market_balance_quotes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  commodity       VARCHAR(255) NOT NULL,
  supply_level    NUMERIC(8, 2),                -- e.g. 0–100 or normalized
  demand_level    NUMERIC(8, 2),
  risk_index      NUMERIC(8, 2),                -- e.g. 0–10 risk score
  date            DATE NOT NULL,
  recorded_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_market_balance_quotes_date ON market_balance_quotes (date DESC);
CREATE INDEX idx_market_balance_quotes_commodity ON market_balance_quotes (commodity, date DESC);
CREATE INDEX idx_market_balance_quotes_risk_index ON market_balance_quotes (risk_index DESC NULLS LAST);

-- =============================================================================
-- VIEW: v_market_balance_quotes — Same columns from market_indicators
-- (pivot supply_level, demand_level, risk_index by indicator_type)
-- =============================================================================

CREATE OR REPLACE VIEW v_market_balance_quotes AS
SELECT
  (array_agg(mi.id ORDER BY mi.indicator_type))[1] AS id,
  COALESCE(c.name, 'Market') AS commodity,
  MAX(mi.value) FILTER (WHERE mi.indicator_type = 'supply_level') AS supply_level,
  MAX(mi.value) FILTER (WHERE mi.indicator_type = 'demand_level') AS demand_level,
  MAX(mi.value) FILTER (WHERE mi.indicator_type = 'risk_index') AS risk_index,
  mi.as_of_date AS date
FROM market_indicators mi
LEFT JOIN commodities c ON c.id = mi.commodity_id
GROUP BY c.id, c.name, mi.as_of_date;

-- =============================================================================
-- data_source_logs — Ingestion and sync audit per source
-- =============================================================================
-- Relationship: data_sources (1) → (N) data_source_logs
-- =============================================================================

CREATE TABLE data_source_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  data_source_id  UUID NOT NULL REFERENCES data_sources (id) ON DELETE CASCADE,
  run_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  status          VARCHAR(16) NOT NULL,         -- success, partial, failed
  records_ingested INT NOT NULL DEFAULT 0,
  records_failed   INT NOT NULL DEFAULT 0,
  error_message   TEXT,
  duration_ms     INT,
  metadata        JSONB
);

CREATE INDEX idx_data_source_logs_source
  ON data_source_logs (data_source_id, run_at DESC);
CREATE INDEX idx_data_source_logs_run_at
  ON data_source_logs (run_at DESC);
CREATE INDEX idx_data_source_logs_status
  ON data_source_logs (status) WHERE status != 'success';

-- =============================================================================
-- UPDATED_AT TRIGGER
-- =============================================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'data_sources_updated_at') THEN
    CREATE TRIGGER data_sources_updated_at
      BEFORE UPDATE ON data_sources
      FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
  END IF;
END $$;

-- =============================================================================
-- RELATIONSHIP SUMMARY
-- =============================================================================
--
-- data_sources
--   ├── commodity_prices (data_source_id)
--   ├── import_statistics (data_source_id)
--   ├── trade_reports (data_source_id)
--   ├── market_indicators (data_source_id)
--   └── data_source_logs (data_source_id)
--
-- commodities
--   ├── commodity_prices (commodity_id)
--   ├── import_statistics (commodity_id)
--   └── market_indicators (commodity_id, optional)
--
-- ports
--   └── import_statistics (port_id)
--
