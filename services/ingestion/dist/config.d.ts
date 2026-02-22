import "dotenv/config";
export declare const config: {
    readonly database: {
        readonly url: string;
    };
    readonly moc: {
        readonly commodityUrl: string;
        readonly importUrl: string;
        readonly apiKey: string;
    };
    readonly cron: {
        readonly schedule: string;
    };
    readonly retry: {
        readonly maxAttempts: number;
        readonly baseMs: number;
    };
    readonly log: {
        readonly level: "debug" | "info" | "warn" | "error";
    };
};
export declare function validateConfig(): void;
//# sourceMappingURL=config.d.ts.map