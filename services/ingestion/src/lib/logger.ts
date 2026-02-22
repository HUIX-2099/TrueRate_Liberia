import { config } from "../config";
import { insertIngestionLog } from "../db/queries";

const levels = { debug: 0, info: 1, warn: 2, error: 3 } as const;
const currentLevel = levels[config.log.level] ?? 1;

function log(level: keyof typeof levels, message: string, meta?: object): void {
  if (levels[level] < currentLevel) return;
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

export const logger = {
  debug: (msg: string, meta?: object) => log("debug", msg, meta),
  info: (msg: string, meta?: object) => log("info", msg, meta),
  warn: (msg: string, meta?: object) => log("warn", msg, meta),
  error: (msg: string, meta?: object) => log("error", msg, meta),
};

/** Log an ingestion run to DB and console. */
export async function logIngestionError(params: {
  source: string;
  status: "success" | "partial" | "failed";
  recordsOk: number;
  recordsFail: number;
  errorMessage?: string | null;
  metadata?: object | null;
}): Promise<void> {
  try {
    await insertIngestionLog(params);
  } catch (err) {
    logger.error("Failed to write ingestion_logs", {
      err: err instanceof Error ? err.message : String(err),
    });
  }
  const level =
    params.status === "failed"
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
