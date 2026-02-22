import type { MoCCommodityResponse } from "../types";
export interface NormalizedCommodityPrice {
    externalId: string;
    name: string;
    unit: string;
    category?: string | null;
    effectiveDate: string;
    price: number;
    currency: string;
}
/** Normalize MoC commodity response into a flat list of price records. */
export declare function normalizeCommodityResponse(data: MoCCommodityResponse): NormalizedCommodityPrice[];
//# sourceMappingURL=commodity.d.ts.map