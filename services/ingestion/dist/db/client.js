"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPool = getPool;
exports.query = query;
exports.closePool = closePool;
const pg_1 = __importDefault(require("pg"));
const config_1 = require("../config");
const { Pool } = pg_1.default;
let pool = null;
function getPool() {
    if (!pool) {
        pool = new Pool({
            connectionString: config_1.config.database.url,
            max: 10,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 10000,
        });
    }
    return pool;
}
async function query(text, values) {
    return getPool().query(text, values);
}
async function closePool() {
    if (pool) {
        await pool.end();
        pool = null;
    }
}
//# sourceMappingURL=client.js.map