"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeCommodityResponse = normalizeCommodityResponse;
function parseDate(item) {
    const raw = item.date ?? item.effectiveDate ?? "";
    if (!raw)
        return new Date().toISOString().slice(0, 10);
    const d = new Date(raw);
    if (Number.isNaN(d.getTime()))
        return new Date().toISOString().slice(0, 10);
    return d.toISOString().slice(0, 10);
}
function toNumber(value) {
    if (typeof value === "number" && !Number.isNaN(value))
        return value;
    if (typeof value === "string") {
        const n = parseFloat(value.replace(/,/g, ""));
        if (!Number.isNaN(n))
            return n;
    }
    return 0;
}
/** Normalize MoC commodity response into a flat list of price records. */
function normalizeCommodityResponse(data) {
    const items = data.data ?? data.prices ?? data.items ?? [];
    const out = [];
    for (const item of items) {
        const externalId = String(item.commodityId ?? item.commodityCode ?? "").trim() ||
            `name-${(item.name ?? "unknown").replace(/\s+/g, "-")}`;
        const name = String(item.name ?? "Unknown").trim();
        const unit = String(item.unit ?? "unit").trim();
        const price = toNumber(item.price);
        const effectiveDate = parseDate(item);
        const currency = String(item.currency ?? "LRD").trim().toUpperCase();
        if (!name || price <= 0)
            continue;
        out.push({
            externalId,
            name,
            unit,
            category: item.category ? String(item.category).trim() : null,
            effectiveDate,
            price,
            currency,
        });
    }
    return out;
}
//# sourceMappingURL=commodity.js.map