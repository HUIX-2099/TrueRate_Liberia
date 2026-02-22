"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.validateConfig = validateConfig;
require("dotenv/config");
exports.config = {
    database: {
        url: process.env.DATABASE_URL ?? "",
    },
    moc: {
        commodityUrl: process.env.MOC_COMMODITY_URL ?? "",
        importUrl: process.env.MOC_IMPORT_URL ?? "",
        apiKey: process.env.MOC_API_KEY ?? "",
    },
    cron: {
        schedule: process.env.CRON_SCHEDULE ?? "0 6 * * *",
    },
    retry: {
        maxAttempts: Math.max(1, parseInt(process.env.RETRY_MAX_ATTEMPTS ?? "3", 10)),
        baseMs: Math.max(500, parseInt(process.env.RETRY_BASE_MS ?? "2000", 10)),
    },
    log: {
        level: (process.env.LOG_LEVEL ?? "info"),
    },
};
function validateConfig() {
    if (!exports.config.database.url) {
        throw new Error("DATABASE_URL is required");
    }
}
//# sourceMappingURL=config.js.map