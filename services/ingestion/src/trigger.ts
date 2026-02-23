/**
 * HTTP trigger for manual/cron-triggered sync.
 * POST /sync with Authorization: Bearer <CRON_SECRET> or x-cron-secret: <CRON_SECRET> runs full sync.
 * No dependency on express; uses Node.js http.
 */

import { createServer } from "node:http";
import { runCommoditySync, runImportSync } from "./pipeline/sync";
import { closePool } from "./db/client";
import { logger } from "./lib/logger";
import { validateConfig } from "./config";

const PORT = parseInt(process.env.TRIGGER_PORT ?? "3456", 10);
const CRON_SECRET = process.env.CRON_SECRET ?? "";

function auth(req: import("node:http").IncomingMessage): boolean {
  if (!CRON_SECRET) return false;
  const authHeader = req.headers["authorization"];
  const secretHeader = req.headers["x-cron-secret"];
  const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  return bearer === CRON_SECRET || secretHeader === CRON_SECRET;
}

const server = createServer(async (req, res) => {
  if (req.method === "POST" && (req.url === "/sync" || req.url === "/internal/sync")) {
    if (!auth(req)) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Unauthorized" }));
      return;
    }
    try {
      const [commodity, importResult] = await Promise.all([
        runCommoditySync(),
        runImportSync(),
      ]);
      const success = commodity.success && importResult.success;
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success,
          commodity: { success: commodity.success, recordsOk: commodity.recordsOk, recordsFail: commodity.recordsFail },
          import: { success: importResult.success, recordsOk: importResult.recordsOk, recordsFail: importResult.recordsFail },
        }),
      );
    } catch (err) {
      logger.error("Sync trigger failed", { err: err instanceof Error ? err.message : String(err) });
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          error: "Sync failed",
          message: err instanceof Error ? err.message : String(err),
        }),
      );
    }
    return;
  }

  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, service: "ingestion-trigger" }));
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, () => {
  logger.info("Ingestion trigger server listening", { port: PORT, path: "/sync" });
});

process.on("SIGINT", () => {
  server.close(() => {
    closePool().then(() => process.exit(0));
  });
});
process.on("SIGTERM", () => {
  server.close(() => {
    closePool().then(() => process.exit(0));
  });
});

validateConfig();
