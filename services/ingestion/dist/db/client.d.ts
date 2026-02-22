import pg from "pg";
export declare function getPool(): pg.Pool;
export declare function query<T extends pg.QueryResultRow = pg.QueryResultRow>(text: string, values?: unknown[]): Promise<pg.QueryResult<T>>;
export declare function closePool(): Promise<void>;
//# sourceMappingURL=client.d.ts.map