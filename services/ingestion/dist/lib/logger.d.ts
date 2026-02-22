export declare const logger: {
    debug: (msg: string, meta?: object) => void;
    info: (msg: string, meta?: object) => void;
    warn: (msg: string, meta?: object) => void;
    error: (msg: string, meta?: object) => void;
};
/** Log an ingestion run to DB and console. */
export declare function logIngestionError(params: {
    source: string;
    status: "success" | "partial" | "failed";
    recordsOk: number;
    recordsFail: number;
    errorMessage?: string | null;
    metadata?: object | null;
}): Promise<void>;
//# sourceMappingURL=logger.d.ts.map