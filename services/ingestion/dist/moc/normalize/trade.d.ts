import type { MoCImportResponse } from "../types";
export interface NormalizedImportDeclaration {
    externalId: string | null;
    portExternalId: string;
    portName: string;
    commodityExternalId: string;
    commodityName: string;
    declarationDate: string;
    volume: number;
    unit: string;
    valueLocal: number | null;
    valueUsd: number | null;
    tariffCode: string | null;
    tariffAmount: number | null;
}
/** Normalize MoC import response into a list of declaration records. */
export declare function normalizeImportResponse(data: MoCImportResponse): NormalizedImportDeclaration[];
//# sourceMappingURL=trade.d.ts.map