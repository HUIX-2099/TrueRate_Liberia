"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const config_1 = require("./config");
const client_1 = require("./db/client");
const sync_1 = require("./pipeline/sync");
const logger_1 = require("./lib/logger");
function parseArgs() {
    const args = process.argv.slice(2);
    return {
        once: args.includes("--once"),
        commodityOnly: args.includes("--commodity"),
        importsOnly: args.includes("--imports"),
    };
}
async function main() {
    (0, config_1.validateConfig)();
    const { once, commodityOnly, importsOnly } = parseArgs();
    if (once) {
        if (commodityOnly) {
            await (0, sync_1.runCommoditySync)();
        }
        else if (importsOnly) {
            await (0, sync_1.runImportSync)();
        }
        else {
            await (0, sync_1.runFullSync)();
        }
        await (0, client_1.closePool)();
        process.exit(0);
        return;
    }
    // Scheduled runs
    const schedule = config_1.config.cron.schedule;
    if (!schedule || schedule === "none") {
        logger_1.logger.warn("CRON_SCHEDULE not set or disabled; no scheduled sync");
        await (0, client_1.closePool)();
        process.exit(0);
        return;
    }
    if (!node_cron_1.default.validate(schedule)) {
        logger_1.logger.error("Invalid CRON_SCHEDULE", { schedule });
        process.exit(1);
    }
    logger_1.logger.info("Ingestion service started", {
        cronSchedule: schedule,
        commodityUrl: config_1.config.moc.commodityUrl ? "set" : "not set",
        importUrl: config_1.config.moc.importUrl ? "set" : "not set",
    });
    node_cron_1.default.schedule(schedule, async () => {
        logger_1.logger.info("Cron triggered: running full sync");
        try {
            await (0, sync_1.runFullSync)();
        }
        catch (err) {
            logger_1.logger.error("Cron sync failed", {
                err: err instanceof Error ? err.message : String(err),
            });
        }
    });
}
main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
});
process.on("SIGINT", () => {
    logger_1.logger.info("Shutting down");
    (0, client_1.closePool)().then(() => process.exit(0));
});
process.on("SIGTERM", () => {
    logger_1.logger.info("Shutting down");
    (0, client_1.closePool)().then(() => process.exit(0));
});
//# sourceMappingURL=index.js.map