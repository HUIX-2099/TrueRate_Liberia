import cron from "node-cron";
import { config, validateConfig } from "./config";
import { closePool } from "./db/client";
import { runFullSync, runCommoditySync, runImportSync } from "./pipeline/sync";
import { logger } from "./lib/logger";

function parseArgs(): { once: boolean; commodityOnly: boolean; importsOnly: boolean } {
  const args = process.argv.slice(2);
  return {
    once: args.includes("--once"),
    commodityOnly: args.includes("--commodity"),
    importsOnly: args.includes("--imports"),
  };
}

async function main(): Promise<void> {
  validateConfig();

  const { once, commodityOnly, importsOnly } = parseArgs();

  if (once) {
    if (commodityOnly) {
      await runCommoditySync();
    } else if (importsOnly) {
      await runImportSync();
    } else {
      await runFullSync();
    }
    await closePool();
    process.exit(0);
    return;
  }

  // Scheduled runs
  const schedule = config.cron.schedule;
  if (!schedule || schedule === "none") {
    logger.warn("CRON_SCHEDULE not set or disabled; no scheduled sync");
    await closePool();
    process.exit(0);
    return;
  }

  if (!cron.validate(schedule)) {
    logger.error("Invalid CRON_SCHEDULE", { schedule });
    process.exit(1);
  }

  logger.info("Ingestion service started", {
    cronSchedule: schedule,
    commodityUrl: config.moc.commodityUrl ? "set" : "not set",
    importUrl: config.moc.importUrl ? "set" : "not set",
  });

  cron.schedule(schedule, async () => {
    logger.info("Cron triggered: running full sync");
    try {
      await runFullSync();
    } catch (err) {
      logger.error("Cron sync failed", {
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
  logger.info("Shutting down");
  closePool().then(() => process.exit(0));
});
process.on("SIGTERM", () => {
  logger.info("Shutting down");
  closePool().then(() => process.exit(0));
});
