/** Insert raw payload for idempotency and audit. Returns id if inserted, null if duplicate. */
export declare function insertRawIngest(source: string, bulletinId: string, payload: object, checksum: string): Promise<string | null>;
/** Get raw ingest id by source and bulletin_id (for linking normalized rows). */
export declare function getRawIngestId(source: string, bulletinId: string): Promise<string | null>;
/** Upsert commodity by external_id; return id. */
export declare function upsertCommodity(params: {
    externalId: string;
    name: string;
    nameAlt?: string | null;
    unit: string;
    category?: string | null;
    hsCode?: string | null;
}): Promise<string>;
/** Upsert port by external_id; return id. */
export declare function upsertPort(params: {
    externalId: string;
    name: string;
    countryCode?: string;
}): Promise<string>;
/** Insert commodity price. */
export declare function insertCommodityPrice(params: {
    commodityId: string;
    price: number;
    currency: string;
    unit: string;
    effectiveDate: string;
    rawIngestId: string | null;
    metadata?: object | null;
}): Promise<void>;
/** Insert trade declaration. */
export declare function insertTradeDeclaration(params: {
    externalId: string | null;
    portId: string;
    commodityId: string;
    declarationDate: string;
    volume: number;
    unit: string;
    valueLocal: number | null;
    valueUsd: number | null;
    tariffCode: string | null;
    tariffAmount: number | null;
    rawIngestId: string | null;
    metadata?: object | null;
}): Promise<void>;
/** Insert ingestion log. */
export declare function insertIngestionLog(params: {
    source: string;
    status: "success" | "partial" | "failed";
    recordsOk: number;
    recordsFail: number;
    errorMessage?: string | null;
    metadata?: object | null;
}): Promise<void>;
export declare const rawSource: {
    readonly commodity: "moc_commodity_bulletin";
    readonly trade: "moc_trade";
};
//# sourceMappingURL=queries.d.ts.map