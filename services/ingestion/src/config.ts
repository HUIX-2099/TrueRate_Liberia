import "dotenv/config";

export const config = {
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
    level: (process.env.LOG_LEVEL ?? "info") as "debug" | "info" | "warn" | "error",
  },
} as const;

export function validateConfig(): void {
  if (!config.database.url) {
    throw new Error("DATABASE_URL is required");
  }
}
