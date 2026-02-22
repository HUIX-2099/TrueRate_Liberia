"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.logIngestionError = logIngestionError;
const config_1 = require("../config");
const queries_1 = require("../db/queries");
const levels = { debug: 0, info: 1, warn: 2, error: 3 };
const currentLevel = levels[config_1.config.log.level] ?? 1;
function log(level, message, meta) {
    if (levels[level] < currentLevel)
        return;
    const ts = new Date().toISOString();
    const payload = meta ? ` ${JSON.stringify(meta)}` : "";
    const line = `[${ts}] ${level.toUpperCase()} ${message}${payload}`;
    switch (level) {
        case "error":
            console.error(line);
            break;
        case "warn":
            console.warn(line);
            break;
        default:
            console.log(line);
    }
}
exports.logger = {
    debug: (msg, meta) => log("debug", msg, meta),
    info: (msg, meta) => log("info", msg, meta),
    warn: (msg, meta) => log("warn", msg, meta),
    error: (msg, meta) => log("error", msg, meta),
};
/** Log an ingestion run to DB and console. */
async function logIngestionError(params) {
    try {
        await (0, queries_1.insertIngestionLog)(params);
    }
    catch (err) {
        exports.logger.error("Failed to write ingestion_logs", {
            err: err instanceof Error ? err.message : String(err),
        });
    }
    const level = params.status === "failed"
        ? "error"
        : params.status === "partial"
            ? "warn"
            : "info";
    log(level, `Ingestion ${params.source}: ${params.status}`, {
        recordsOk: params.recordsOk,
        recordsFail: params.recordsFail,
        errorMessage: params.errorMessage,
    });
}
//# sourceMappingURL=logger.js.map