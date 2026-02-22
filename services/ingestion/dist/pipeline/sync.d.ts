/** Run commodity price sync: fetch → raw store → normalize → store prices. */
export declare function runCommoditySync(): Promise<{
    success: boolean;
    recordsOk: number;
    recordsFail: number;
}>;
/** Run import statistics sync: fetch → raw store → normalize → store declarations. */
export declare function runImportSync(): Promise<{
    success: boolean;
    recordsOk: number;
    recordsFail: number;
}>;
/** Run both commodity and import sync. */
export declare function runFullSync(): Promise<void>;
//# sourceMappingURL=sync.d.ts.map