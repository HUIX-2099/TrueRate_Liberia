"use strict";
/**
 * HTTP trigger for manual/cron-triggered sync.
 * POST /sync with Authorization: Bearer <CRON_SECRET> or x-cron-secret: <CRON_SECRET> runs full sync.
 * No dependency on express; uses Node.js http.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = require("node:http");
const sync_1 = require("./pipeline/sync");
const client_1 = require("./db/client");
const logger_1 = require("./lib/logger");
const config_1 = require("./config");
const PORT = parseInt(process.env.TRIGGER_PORT ?? "3456", 10);
const CRON_SECRET = process.env.CRON_SECRET ?? "";
function auth(req) {
    if (!CRON_SECRET)
        return false;
    const authHeader = req.headers["authorization"];
    const secretHeader = req.headers["x-cron-secret"];
    const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    return bearer === CRON_SECRET || secretHeader === CRON_SECRET;
}
const server = (0, node_http_1.createServer)(async (req, res) => {
    if (req.method === "POST" && (req.url === "/sync" || req.url === "/internal/sync")) {
        if (!auth(req)) {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Unauthorized" }));
            return;
        }
        try {
            const [commodity, importResult] = await Promise.all([
                (0, sync_1.runCommoditySync)(),
                (0, sync_1.runImportSync)(),
            ]);
            const success = commodity.success && importResult.success;
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({
                success,
                commodity: { success: commodity.success, recordsOk: commodity.recordsOk, recordsFail: commodity.recordsFail },
                import: { success: importResult.success, recordsOk: importResult.recordsOk, recordsFail: importResult.recordsFail },
            }));
        }
        catch (err) {
            logger_1.logger.error("Sync trigger failed", { err: err instanceof Error ? err.message : String(err) });
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({
                error: "Sync failed",
                message: err instanceof Error ? err.message : String(err),
            }));
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
    logger_1.logger.info("Ingestion trigger server listening", { port: PORT, path: "/sync" });
});
process.on("SIGINT", () => {
    server.close(() => {
        (0, client_1.closePool)().then(() => process.exit(0));
    });
});
process.on("SIGTERM", () => {
    server.close(() => {
        (0, client_1.closePool)().then(() => process.exit(0));
    });
});
(0, config_1.validateConfig)();
//# sourceMappingURL=trigger.js.map