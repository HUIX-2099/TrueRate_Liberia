import type { MoCCommodityResponse, MoCCommodityPriceItem } from "../types";

export interface NormalizedCommodityPrice {
  externalId: string;
  name: string;
  unit: string;
  category?: string | null;
  effectiveDate: string;
  price: number;
  currency: string;
}

function parseDate(item: MoCCommodityPriceItem): string {
  const raw = item.date ?? item.effectiveDate ?? "";
  if (!raw) return new Date().toISOString().slice(0, 10);
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  return d.toISOString().slice(0, 10);
}

function toNumber(value: unknown): number {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string") {
    const n = parseFloat(value.replace(/,/g, ""));
    if (!Number.isNaN(n)) return n;
  }
  return 0;
}

/** Normalize MoC commodity response into a flat list of price records. */
export function normalizeCommodityResponse(
  data: MoCCommodityResponse
): NormalizedCommodityPrice[] {
  const items: MoCCommodityPriceItem[] =
    data.data ?? data.prices ?? data.items ?? [];
  const out: NormalizedCommodityPrice[] = [];

  for (const item of items) {
    const externalId =
      String(item.commodityId ?? item.commodityCode ?? "").trim() ||
      `name-${(item.name ?? "unknown").replace(/\s+/g, "-")}`;
    const name = String(item.name ?? "Unknown").trim();
    const unit = String(item.unit ?? "unit").trim();
    const price = toNumber(item.price);
    const effectiveDate = parseDate(item);
    const currency = String(item.currency ?? "LRD").trim().toUpperCase();

    if (!name || price <= 0) continue;

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
