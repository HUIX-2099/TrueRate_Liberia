-- TrueRate — Business licenses (Ministry of Commerce alignment)
-- Optional migration for Phase 4: business verification from MoCI license data.
-- Apply after database-schema.sql. When MoCI provides license data, ingestion can populate this table.

CREATE TABLE IF NOT EXISTS business_licenses (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  external_id        VARCHAR(128) UNIQUE NOT NULL,  -- MoCI business/license ID
  business_name      VARCHAR(255) NOT NULL,
  license_type       VARCHAR(64) NOT NULL,           -- e.g. money_changer, bureau
  status             VARCHAR(32) NOT NULL,           -- active, suspended, expired
  region             VARCHAR(128),                   -- county or area
  valid_from         DATE,
  valid_until        DATE,
  source             VARCHAR(64) NOT NULL DEFAULT 'moc',
  raw_ingest_id      UUID REFERENCES moc_raw_ingest (id),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_business_licenses_external_id ON business_licenses (external_id);
CREATE INDEX idx_business_licenses_status ON business_licenses (status) WHERE status = 'active';
CREATE INDEX idx_business_licenses_valid_until ON business_licenses (valid_until);

CREATE TRIGGER business_licenses_updated_at
  BEFORE UPDATE ON business_licenses
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- Comment: lib/verification can be updated to read from this table when populated (e.g. by ingestion).
