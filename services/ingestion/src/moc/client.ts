import axios, { AxiosInstance, AxiosError } from "axios";
import { config } from "../config";
import { withRetry } from "../lib/retry";
import type { MoCCommodityResponse, MoCImportResponse } from "./types";

function createClient(): AxiosInstance {
  return axios.create({
    timeout: 30000,
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
  });
}

function getAuthHeaders(): Record<string, string> {
  const key = config.moc.apiKey;
  if (!key) return {};
  if (key.startsWith("Bearer ")) return { Authorization: key };
  return { "X-API-Key": key };
}

/** Fetch commodity prices from MoC. */
export async function fetchCommodityPrices(): Promise<MoCCommodityResponse> {
  const url = config.moc.commodityUrl;
  if (!url) {
    throw new Error("MOC_COMMODITY_URL is not set");
  }
  const client = createClient();
  const response = await withRetry(
    async () => {
      const res = await client.get<MoCCommodityResponse>(url);
      return res.data;
    },
    "fetchCommodityPrices"
  );
  return response;
}

/** Fetch import statistics from MoC. */
export async function fetchImportStatistics(): Promise<MoCImportResponse> {
  const url = config.moc.importUrl;
  if (!url) {
    throw new Error("MOC_IMPORT_URL is not set");
  }
  const client = createClient();
  const response = await withRetry(
    async () => {
      const res = await client.get<MoCImportResponse>(url);
      return res.data;
    },
    "fetchImportStatistics"
  );
  return response;
}

export function isAxiosError(err: unknown): err is AxiosError {
  return axios.isAxiosError(err);
}
