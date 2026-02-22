-- TrueRate Fintech Architecture — PostgreSQL Schema
-- Ministry of Commerce (MoC) integration: commodity prices, trade/import data, risk metadata

-- =============================================================================
-- EXTENSIONS & SETTINGS
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- REFERENCE DATA (Ministry of Commerce alignment)
-- =============================================================================

CREATE TABLE commodities (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  external_id   VARCHAR(64) UNIQUE NOT NULL,  -- MoC commodity code or ID
  name          VARCHAR(255) NOT NULL,
  name_alt      VARCHAR(255),
  unit          VARCHAR(32) NOT NULL,         -- e.g. kg, bag, MT, L
  category      VARCHAR(64),                  -- e.g. food, construction
  hs_code       VARCHAR(32),                  -- Harmonized System code if applicable
  active        BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ports (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  external_id   VARCHAR(64) UNIQUE NOT NULL,  -- MoC port code
  name          VARCHAR(255) NOT NULL,
  country_code  CHAR(2) NOT NULL DEFAULT 'LR',
  active        BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- RAW INGESTION (audit & replay)
-- =============================================================================

CREATE TABLE moc_raw_ingest (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source        VARCHAR(64) NOT NULL,         -- e.g. moc_commodity_bulletin, moc_trade
  bulletin_id   VARCHAR(128),                 -- external bulletin/feed ID
  ingested_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  payload       JSONB NOT NULL,
  checksum      VARCHAR(64),                  -- SHA-256 of payload for idempotency
  UNIQUE (source, bulletin_id)
);

CREATE INDEX idx_moc_raw_ingest_source ON moc_raw_ingest (source);
CREATE INDEX idx_moc_raw_ingest_ingested_at ON moc_raw_ingest (ingested_at DESC);

-- =============================================================================
-- COMMODITY PRICES (from MoC)
-- =============================================================================

CREATE TABLE commodity_prices (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  commodity_id  UUID NOT NULL REFERENCES commodities (id),
  price         NUMERIC(18, 4) NOT NULL,
  currency      CHAR(3) NOT NULL DEFAULT 'LRD',
  unit          VARCHAR(32) NOT NULL,         -- denormalized for history
  source        VARCHAR(64) NOT NULL DEFAULT 'moc',
  effective_date DATE NOT NULL,               -- date the price applies to
  recorded_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  raw_ingest_id UUID REFERENCES moc_raw_ingest (id),
  metadata      JSONB
);

CREATE INDEX idx_commodity_prices_commodity_date ON commodity_prices (commodity_id, effective_date DESC);
CREATE INDEX idx_commodity_prices_effective_date ON commodity_prices (effective_date DESC);
CREATE INDEX idx_commodity_prices_source ON commodity_prices (source);

-- Optional: daily snapshot for fast “latest price” and analytics
CREATE TABLE commodity_price_snapshots (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  commodity_id  UUID NOT NULL REFERENCES commodities (id),
  snapshot_date DATE NOT NULL,
  price_min     NUMERIC(18, 4),
  price_max     NUMERIC(18, 4),
  price_avg     NUMERIC(18, 4),
  price_close   NUMERIC(18, 4),
  sample_count  INT NOT NULL DEFAULT 0,
  UNIQUE (commodity_id, snapshot_date)
);

CREATE INDEX idx_commodity_price_snapshots_commodity ON commodity_price_snapshots (commodity_id, snapshot_date DESC);

-- =============================================================================
-- TRADE / IMPORT DATA (from MoC)
-- =============================================================================

CREATE TABLE trade_declarations (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  external_id   VARCHAR(128) UNIQUE,          -- MoC declaration ID
  port_id       UUID REFERENCES ports (id),
  commodity_id  UUID REFERENCES commodities (id),
  declaration_date DATE NOT NULL,
  volume        NUMERIC(18, 4) NOT NULL,     -- in commodity unit
  unit          VARCHAR(32) NOT NULL,
  value_local   NUMERIC(18, 4),               -- LRD
  value_usd     NUMERIC(18, 4),
  tariff_code   VARCHAR(32),
  tariff_amount NUMERIC(18, 4),
  source        VARCHAR(64) NOT NULL DEFAULT 'moc',
  recorded_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  raw_ingest_id UUID REFERENCES moc_raw_ingest (id),
  metadata      JSONB
);

CREATE INDEX idx_trade_declarations_port ON trade_declarations (port_id, declaration_date DESC);
CREATE INDEX idx_trade_declarations_commodity ON trade_declarations (commodity_id, declaration_date DESC);
CREATE INDEX idx_trade_declarations_date ON trade_declarations (declaration_date DESC);

CREATE TABLE import_summaries (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  period_type   VARCHAR(16) NOT NULL,         -- day, week, month, quarter, year
  period_start  DATE NOT NULL,
  port_id       UUID REFERENCES ports (id),
  commodity_id  UUID REFERENCES commodities (id),
  volume_total  NUMERIC(18, 4) NOT NULL,
  value_local_total NUMERIC(18, 4),
  value_usd_total   NUMERIC(18, 4),
  declaration_count INT NOT NULL DEFAULT 0,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (period_type, period_start, port_id, commodity_id)
);

CREATE INDEX idx_import_summaries_period ON import_summaries (period_type, period_start DESC);
CREATE INDEX idx_import_summaries_commodity ON import_summaries (commodity_id, period_start DESC);

-- =============================================================================
-- MARKET RISK (metadata & limits; metrics can be cached in Redis)
-- =============================================================================

CREATE TABLE risk_limits (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          VARCHAR(64) NOT NULL UNIQUE,
  market        VARCHAR(32) NOT NULL,         -- commodity, fx, combined
  limit_type    VARCHAR(32) NOT NULL,         -- var_95, var_99, max_drawdown
  value         NUMERIC(18, 6) NOT NULL,
  unit          VARCHAR(16) NOT NULL,         -- LRD, USD, percent
  active        BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE risk_snapshots (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  snapshot_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  market        VARCHAR(32) NOT NULL,
  var_95        NUMERIC(18, 6),
  var_99        NUMERIC(18, 6),
  stress_shock  NUMERIC(18, 6),
  metrics       JSONB,
  UNIQUE (snapshot_at, market)
);

CREATE INDEX idx_risk_snapshots_at ON risk_snapshots (snapshot_at DESC);

-- =============================================================================
-- INGESTION LOGS (errors, retries)
-- =============================================================================

CREATE TABLE ingestion_logs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source        VARCHAR(64) NOT NULL,
  run_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  status        VARCHAR(16) NOT NULL,         -- success, partial, failed
  records_ok    INT NOT NULL DEFAULT 0,
  records_fail  INT NOT NULL DEFAULT 0,
  error_message TEXT,
  metadata      JSONB
);

CREATE INDEX idx_ingestion_logs_source ON ingestion_logs (source, run_at DESC);

-- =============================================================================
-- ROW-LEVEL UPDATED_AT TRIGGER (example)
-- =============================================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER commodities_updated_at
  BEFORE UPDATE ON commodities
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER ports_updated_at
  BEFORE UPDATE ON ports
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER risk_limits_updated_at
  BEFORE UPDATE ON risk_limits
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- =============================================================================
-- REDIS KEY DESIGN (reference; not executed in PostgreSQL)
-- =============================================================================
--
-- Namespace: tr:
--
-- Commodity:
--   tr:commodity:latest                    → Hash or JSON (commodity_id → latest price)
--   tr:commodity:series:{commodity_id}:d   → Sorted set or list (date → price), TTL 15m
--   tr:commodity:series:{commodity_id}:w   → weekly
--   tr:commodity:series:{commodity_id}:m   → monthly
--
-- Trade:
--   tr:trade:agg:port:{period}:{period_start}   → JSON, TTL 1h
--   tr:trade:agg:commodity:{period}:{period_start}
--   tr:trade:trend:{commodity_id}:{period}     → JSON, TTL 1h
--
-- Risk:
--   tr:risk:var:{market}                  → JSON (e.g. var_95, var_99), TTL 5m
--   tr:risk:stress:{scenario}             → JSON, TTL 5m
--   tr:risk:limits                        → JSON, TTL 5m
--
-- Ingestion / rate limit:
--   tr:idempotency:{source}:{bulletin_id} → "1", TTL 24h
--   tr:rl:{client_id}:{window}            → counter, TTL 1m or 1h
--
-- Session (optional):
--   tr:session:{session_id}               → JSON, TTL 24h
--
