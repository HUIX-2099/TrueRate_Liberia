import { AxiosError } from "axios";
import type { MoCCommodityResponse, MoCImportResponse } from "./types";
/** Fetch commodity prices from MoC. */
export declare function fetchCommodityPrices(): Promise<MoCCommodityResponse>;
/** Fetch import statistics from MoC. */
export declare function fetchImportStatistics(): Promise<MoCImportResponse>;
export declare function isAxiosError(err: unknown): err is AxiosError;
//# sourceMappingURL=client.d.ts.map