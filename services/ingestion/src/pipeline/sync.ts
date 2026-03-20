import { createHash } from "node:crypto";
import { fetchCommodityPrices } from "../moc/client";
import { fetchImportStatistics } from "../moc/client";
import { normalizeCommodityResponse } from "../moc/normalize/commodity";
import { normalizeImportResponse } from "../moc/normalize/trade";
import {
  insertRawIngest,
  upsertCommodity,
  upsertPort,
  insertCommodityPrice,
  insertTradeDeclaration,
  rawSource,
} from "../db/queries";
import { logIngestionError, logger } from "../lib/logger";
import { config } from "../config";

function checksum(payload: object): string {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

function bulletinId(source: string, payload: object): string {
  const date = new Date().toISOString().slice(0, 10);
  const cs = checksum(payload);
  return `${source}-${date}-${cs.slice(0, 16)}`;
}

/** Run commodity price sync: fetch → raw store → normalize → store prices. */
export async function runCommoditySync(): Promise<{
  success: boolean;
  recordsOk: number;
  recordsFail: number;
}> {
  const source = rawSource.commodity;
  if (!config.moc.commodityUrl) {
    logger.warn("MOC_COMMODITY_URL not set; skipping commodity sync");
    await logIngestionError({
      source,
      status: "failed",
      recordsOk: 0,
      recordsFail: 0,
      errorMessage: "MOC_COMMODITY_URL not set",
    });
    return { success: false, recordsOk: 0, recordsFail: 0 };
  }

  let recordsOk = 0;
  let recordsFail = 0;
  let rawId: string | null = null;

  try {
    const payload = await fetchCommodityPrices();
    const bid = bulletinId(source, payload);
    const cs = checksum(payload);
    rawId = await insertRawIngest(source, bid, payload, cs);
    if (!rawId) {
      logger.info("Commodity ingest skipped (idempotent duplicate)", {
        bulletinId: bid,
      });
      await logIngestionError({
        source,
        status: "success",
        recordsOk: 0,
        recordsFail: 0,
        metadata: { reason: "idempotent_skip", bulletinId: bid },
      });
      return { success: true, recordsOk: 0, recordsFail: 0 };
    }
    const rawIdForRows = rawId;
    const rows = normalizeCommodityResponse(payload);

    for (const row of rows) {
      try {
        const commodityId = await upsertCommodity({
          externalId: row.externalId,
          name: row.name,
          unit: row.unit,
          category: row.category ?? null,
        });
        await insertCommodityPrice({
          commodityId,
          price: row.price,
          currency: row.currency,
          unit: row.unit,
          effectiveDate: row.effectiveDate,
          rawIngestId: rawIdForRows,
        });
        recordsOk++;
      } catch (err) {
        recordsFail++;
        logger.error("Commodity price insert failed", {
          row,
          err: err instanceof Error ? err.message : String(err),
        });
      }
    }

    const status =
      recordsFail === 0 ? "success" : rows.length === 0 ? "failed" : "partial";
    await logIngestionError({
      source,
      status,
      recordsOk,
      recordsFail,
      errorMessage:
        recordsFail > 0
          ? `${recordsFail} record(s) failed to insert`
          : undefined,
      metadata: { bulletinId: bid },
    });
    return {
      success: status !== "failed",
      recordsOk,
      recordsFail,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error("Commodity sync failed", { err: message });
    await logIngestionError({
      source,
      status: "failed",
      recordsOk,
      recordsFail,
      errorMessage: message,
      metadata: { stack: err instanceof Error ? err.stack : undefined },
    });
    return { success: false, recordsOk, recordsFail };
  }
}

/** Run import statistics sync: fetch → raw store → normalize → store declarations. */
export async function runImportSync(): Promise<{
  success: boolean;
  recordsOk: number;
  recordsFail: number;
}> {
  const source = rawSource.trade;
  if (!config.moc.importUrl) {
    logger.warn("MOC_IMPORT_URL not set; skipping import sync");
    await logIngestionError({
      source,
      status: "failed",
      recordsOk: 0,
      recordsFail: 0,
      errorMessage: "MOC_IMPORT_URL not set",
    });
    return { success: false, recordsOk: 0, recordsFail: 0 };
  }

  let recordsOk = 0;
  let recordsFail = 0;

  try {
    const payload = await fetchImportStatistics();
    const bid = bulletinId(source, payload);
    const cs = checksum(payload);
    const rawId = await insertRawIngest(source, bid, payload, cs);
    if (!rawId) {
      logger.info("Import ingest skipped (idempotent duplicate)", {
        bulletinId: bid,
      });
      await logIngestionError({
        source,
        status: "success",
        recordsOk: 0,
        recordsFail: 0,
        metadata: { reason: "idempotent_skip", bulletinId: bid },
      });
      return { success: true, recordsOk: 0, recordsFail: 0 };
    }

    const rows = normalizeImportResponse(payload);

    for (const row of rows) {
      try {
        const portId = await upsertPort({
          externalId: row.portExternalId,
          name: row.portName,
        });
        const commodityId = await upsertCommodity({
          externalId: row.commodityExternalId,
          name: row.commodityName,
          unit: row.unit,
        });
        await insertTradeDeclaration({
          externalId: row.externalId,
          portId,
          commodityId,
          declarationDate: row.declarationDate,
          volume: row.volume,
          unit: row.unit,
          valueLocal: row.valueLocal,
          valueUsd: row.valueUsd,
          tariffCode: row.tariffCode,
          tariffAmount: row.tariffAmount,
          rawIngestId: rawId,
        });
        recordsOk++;
      } catch (err) {
        recordsFail++;
        logger.error("Trade declaration insert failed", {
          row,
          err: err instanceof Error ? err.message : String(err),
        });
      }
    }

    const status =
      recordsFail === 0 ? "success" : rows.length === 0 ? "failed" : "partial";
    await logIngestionError({
      source,
      status,
      recordsOk,
      recordsFail,
      errorMessage:
        recordsFail > 0
          ? `${recordsFail} record(s) failed to insert`
          : undefined,
      metadata: { bulletinId: bid },
    });
    return {
      success: status !== "failed",
      recordsOk,
      recordsFail,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error("Import sync failed", { err: message });
    await logIngestionError({
      source,
      status: "failed",
      recordsOk,
      recordsFail,
      errorMessage: message,
      metadata: { stack: err instanceof Error ? err.stack : undefined },
    });
    return { success: false, recordsOk, recordsFail };
  }
}

/** Run both commodity and import sync. */
export async function runFullSync(): Promise<void> {
  logger.info("Starting full sync");
  const [commodity, importResult] = await Promise.all([
    runCommoditySync(),
    runImportSync(),
  ]);
  logger.info("Full sync completed", {
    commodity: { ...commodity },
    import: { ...importResult },
  });
}
