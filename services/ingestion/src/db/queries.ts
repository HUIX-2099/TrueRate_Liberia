import { query } from "./client";

const RAW_SOURCE_COMMODITY = "moc_commodity_bulletin";
const RAW_SOURCE_TRADE = "moc_trade";

/** Insert raw payload for idempotency and audit. Returns id if inserted, null if duplicate. */
export async function insertRawIngest(
  source: string,
  bulletinId: string,
  payload: object,
  checksum: string
): Promise<string | null> {
  const q = `
    INSERT INTO moc_raw_ingest (source, bulletin_id, payload, checksum)
    VALUES ($1, $2, $3::jsonb, $4)
    ON CONFLICT (source, bulletin_id) DO NOTHING
    RETURNING id::text
  `;
  const res = await query<{ id: string }>(q, [
    source,
    bulletinId,
    JSON.stringify(payload),
    checksum,
  ]);
  const row = res.rows[0];
  return row?.id ?? null;
}

/** Get raw ingest id by source and bulletin_id (for linking normalized rows). */
export async function getRawIngestId(
  source: string,
  bulletinId: string
): Promise<string | null> {
  const res = await query<{ id: string }>(
    "SELECT id::text FROM moc_raw_ingest WHERE source = $1 AND bulletin_id = $2",
    [source, bulletinId]
  );
  return res.rows[0]?.id ?? null;
}

/** Upsert commodity by external_id; return id. */
export async function upsertCommodity(params: {
  externalId: string;
  name: string;
  nameAlt?: string | null;
  unit: string;
  category?: string | null;
  hsCode?: string | null;
}): Promise<string> {
  const q = `
    INSERT INTO commodities (external_id, name, name_alt, unit, category, hs_code)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (external_id) DO UPDATE SET
      name = EXCLUDED.name,
      name_alt = EXCLUDED.name_alt,
      unit = EXCLUDED.unit,
      category = EXCLUDED.category,
      hs_code = EXCLUDED.hs_code,
      updated_at = now()
    RETURNING id::text
  `;
  const res = await query<{ id: string }>(q, [
    params.externalId,
    params.name,
    params.nameAlt ?? null,
    params.unit,
    params.category ?? null,
    params.hsCode ?? null,
  ]);
  const row = res.rows[0];
  if (!row) throw new Error("upsertCommodity returned no row");
  return row.id;
}

/** Upsert port by external_id; return id. */
export async function upsertPort(params: {
  externalId: string;
  name: string;
  countryCode?: string;
}): Promise<string> {
  const q = `
    INSERT INTO ports (external_id, name, country_code)
    VALUES ($1, $2, $3)
    ON CONFLICT (external_id) DO UPDATE SET
      name = EXCLUDED.name,
      updated_at = now()
    RETURNING id::text
  `;
  const res = await query<{ id: string }>(q, [
    params.externalId,
    params.name,
    params.countryCode ?? "LR",
  ]);
  const row = res.rows[0];
  if (!row) throw new Error("upsertPort returned no row");
  return row.id;
}

/** Insert commodity price. */
export async function insertCommodityPrice(params: {
  commodityId: string;
  price: number;
  currency: string;
  unit: string;
  effectiveDate: string;
  rawIngestId: string | null;
  metadata?: object | null;
}): Promise<void> {
  await query(
    `INSERT INTO commodity_prices (
      commodity_id, price, currency, unit, source, effective_date, raw_ingest_id, metadata
    ) VALUES ($1::uuid, $2, $3, $4, 'moc', $5::date, $6::uuid, $7::jsonb)`,
    [
      params.commodityId,
      params.price,
      params.currency,
      params.unit,
      params.effectiveDate,
      params.rawIngestId,
      params.metadata ? JSON.stringify(params.metadata) : null,
    ]
  );
}

/** Insert trade declaration. */
export async function insertTradeDeclaration(params: {
  externalId: string | null;
  portId: string;
  commodityId: string;
  declarationDate: string;
  volume: number;
  unit: string;
  valueLocal: number | null;
  valueUsd: number | null;
  tariffCode: string | null;
  tariffAmount: number | null;
  rawIngestId: string | null;
  metadata?: object | null;
}): Promise<void> {
  await query(
    `INSERT INTO trade_declarations (
      external_id, port_id, commodity_id, declaration_date, volume, unit,
      value_local, value_usd, tariff_code, tariff_amount, source, raw_ingest_id, metadata
    ) VALUES ($1, $2::uuid, $3::uuid, $4::date, $5, $6, $7, $8, $9, $10, 'moc', $11::uuid, $12::jsonb)`,
    [
      params.externalId,
      params.portId,
      params.commodityId,
      params.declarationDate,
      params.volume,
      params.unit,
      params.valueLocal,
      params.valueUsd,
      params.tariffCode,
      params.tariffAmount,
      params.rawIngestId,
      params.metadata ? JSON.stringify(params.metadata) : null,
    ]
  );
}

/** Insert ingestion log. */
export async function insertIngestionLog(params: {
  source: string;
  status: "success" | "partial" | "failed";
  recordsOk: number;
  recordsFail: number;
  errorMessage?: string | null;
  metadata?: object | null;
}): Promise<void> {
  await query(
    `INSERT INTO ingestion_logs (source, status, records_ok, records_fail, error_message, metadata)
     VALUES ($1, $2, $3, $4, $5, $6::jsonb)`,
    [
      params.source,
      params.status,
      params.recordsOk,
      params.recordsFail,
      params.errorMessage ?? null,
      params.metadata ? JSON.stringify(params.metadata) : null,
    ]
  );
}

export const rawSource = {
  commodity: RAW_SOURCE_COMMODITY,
  trade: RAW_SOURCE_TRADE,
} as const;
