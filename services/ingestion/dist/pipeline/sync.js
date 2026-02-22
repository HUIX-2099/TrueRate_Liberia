"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCommoditySync = runCommoditySync;
exports.runImportSync = runImportSync;
exports.runFullSync = runFullSync;
const node_crypto_1 = require("node:crypto");
const client_1 = require("../moc/client");
const client_2 = require("../moc/client");
const commodity_1 = require("../moc/normalize/commodity");
const trade_1 = require("../moc/normalize/trade");
const queries_1 = require("../db/queries");
const logger_1 = require("../lib/logger");
const config_1 = require("../config");
function checksum(payload) {
    return (0, node_crypto_1.createHash)("sha256").update(JSON.stringify(payload)).digest("hex");
}
function bulletinId(source, payload) {
    const date = new Date().toISOString().slice(0, 10);
    const cs = checksum(payload);
    return `${source}-${date}-${cs.slice(0, 16)}`;
}
/** Run commodity price sync: fetch → raw store → normalize → store prices. */
async function runCommoditySync() {
    const source = queries_1.rawSource.commodity;
    if (!config_1.config.moc.commodityUrl) {
        logger_1.logger.warn("MOC_COMMODITY_URL not set; skipping commodity sync");
        await (0, logger_1.logIngestionError)({
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
    let rawId = null;
    try {
        const payload = await (0, client_1.fetchCommodityPrices)();
        const bid = bulletinId(source, payload);
        const cs = checksum(payload);
        rawId = await (0, queries_1.insertRawIngest)(source, bid, payload, cs);
        if (!rawId) {
            logger_1.logger.info("Commodity ingest skipped (idempotent duplicate)", {
                bulletinId: bid,
            });
            await (0, logger_1.logIngestionError)({
                source,
                status: "success",
                recordsOk: 0,
                recordsFail: 0,
                metadata: { reason: "idempotent_skip", bulletinId: bid },
            });
            return { success: true, recordsOk: 0, recordsFail: 0 };
        }
        const rawIdForRows = rawId;
        const rows = (0, commodity_1.normalizeCommodityResponse)(payload);
        for (const row of rows) {
            try {
                const commodityId = await (0, queries_1.upsertCommodity)({
                    externalId: row.externalId,
                    name: row.name,
                    unit: row.unit,
                    category: row.category ?? null,
                });
                await (0, queries_1.insertCommodityPrice)({
                    commodityId,
                    price: row.price,
                    currency: row.currency,
                    unit: row.unit,
                    effectiveDate: row.effectiveDate,
                    rawIngestId: rawIdForRows,
                });
                recordsOk++;
            }
            catch (err) {
                recordsFail++;
                logger_1.logger.error("Commodity price insert failed", {
                    row,
                    err: err instanceof Error ? err.message : String(err),
                });
            }
        }
        const status = recordsFail === 0 ? "success" : rows.length === 0 ? "failed" : "partial";
        await (0, logger_1.logIngestionError)({
            source,
            status,
            recordsOk,
            recordsFail,
            errorMessage: recordsFail > 0
                ? `${recordsFail} record(s) failed to insert`
                : undefined,
            metadata: { bulletinId: bid },
        });
        return {
            success: status !== "failed",
            recordsOk,
            recordsFail,
        };
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        logger_1.logger.error("Commodity sync failed", { err: message });
        await (0, logger_1.logIngestionError)({
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
async function runImportSync() {
    const source = queries_1.rawSource.trade;
    if (!config_1.config.moc.importUrl) {
        logger_1.logger.warn("MOC_IMPORT_URL not set; skipping import sync");
        await (0, logger_1.logIngestionError)({
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
        const payload = await (0, client_2.fetchImportStatistics)();
        const bid = bulletinId(source, payload);
        const cs = checksum(payload);
        const rawId = await (0, queries_1.insertRawIngest)(source, bid, payload, cs);
        if (!rawId) {
            logger_1.logger.info("Import ingest skipped (idempotent duplicate)", {
                bulletinId: bid,
            });
            await (0, logger_1.logIngestionError)({
                source,
                status: "success",
                recordsOk: 0,
                recordsFail: 0,
                metadata: { reason: "idempotent_skip", bulletinId: bid },
            });
            return { success: true, recordsOk: 0, recordsFail: 0 };
        }
        const rows = (0, trade_1.normalizeImportResponse)(payload);
        for (const row of rows) {
            try {
                const portId = await (0, queries_1.upsertPort)({
                    externalId: row.portExternalId,
                    name: row.portName,
                });
                const commodityId = await (0, queries_1.upsertCommodity)({
                    externalId: row.commodityExternalId,
                    name: row.commodityName,
                    unit: row.unit,
                });
                await (0, queries_1.insertTradeDeclaration)({
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
            }
            catch (err) {
                recordsFail++;
                logger_1.logger.error("Trade declaration insert failed", {
                    row,
                    err: err instanceof Error ? err.message : String(err),
                });
            }
        }
        const status = recordsFail === 0 ? "success" : rows.length === 0 ? "failed" : "partial";
        await (0, logger_1.logIngestionError)({
            source,
            status,
            recordsOk,
            recordsFail,
            errorMessage: recordsFail > 0
                ? `${recordsFail} record(s) failed to insert`
                : undefined,
            metadata: { bulletinId: bid },
        });
        return {
            success: status !== "failed",
            recordsOk,
            recordsFail,
        };
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        logger_1.logger.error("Import sync failed", { err: message });
        await (0, logger_1.logIngestionError)({
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
async function runFullSync() {
    logger_1.logger.info("Starting full sync");
    const [commodity, importResult] = await Promise.all([
        runCommoditySync(),
        runImportSync(),
    ]);
    logger_1.logger.info("Full sync completed", {
        commodity: { ...commodity },
        import: { ...importResult },
    });
}
//# sourceMappingURL=sync.js.map