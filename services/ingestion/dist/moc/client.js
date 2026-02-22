"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchCommodityPrices = fetchCommodityPrices;
exports.fetchImportStatistics = fetchImportStatistics;
exports.isAxiosError = isAxiosError;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
const retry_1 = require("../lib/retry");
function createClient() {
    return axios_1.default.create({
        timeout: 30000,
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    });
}
function getAuthHeaders() {
    const key = config_1.config.moc.apiKey;
    if (!key)
        return {};
    if (key.startsWith("Bearer "))
        return { Authorization: key };
    return { "X-API-Key": key };
}
/** Fetch commodity prices from MoC. */
async function fetchCommodityPrices() {
    const url = config_1.config.moc.commodityUrl;
    if (!url) {
        throw new Error("MOC_COMMODITY_URL is not set");
    }
    const client = createClient();
    const response = await (0, retry_1.withRetry)(async () => {
        const res = await client.get(url);
        return res.data;
    }, "fetchCommodityPrices");
    return response;
}
/** Fetch import statistics from MoC. */
async function fetchImportStatistics() {
    const url = config_1.config.moc.importUrl;
    if (!url) {
        throw new Error("MOC_IMPORT_URL is not set");
    }
    const client = createClient();
    const response = await (0, retry_1.withRetry)(async () => {
        const res = await client.get(url);
        return res.data;
    }, "fetchImportStatistics");
    return response;
}
function isAxiosError(err) {
    return axios_1.default.isAxiosError(err);
}
//# sourceMappingURL=client.js.map