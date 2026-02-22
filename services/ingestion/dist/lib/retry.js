"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withRetry = withRetry;
const config_1 = require("../config");
async function withRetry(fn, context) {
    const { maxAttempts, baseMs } = config_1.config.retry;
    let lastError = null;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        }
        catch (err) {
            lastError = err instanceof Error ? err : new Error(String(err));
            if (attempt === maxAttempts)
                break;
            const delay = baseMs * Math.pow(2, attempt - 1);
            await new Promise((r) => setTimeout(r, delay));
        }
    }
    throw lastError ?? new Error(`${context}: unknown error after ${maxAttempts} attempts`);
}
//# sourceMappingURL=retry.js.map