/**
 * Sync job definitions: CBL rates, commodity prices, trade/import data.
 * Each job fetches data (warm cache / verify connectivity) and returns a result for logging.
 */

import type { SyncJobDef, JobRunResult } from "./types"
import { fetchCblHistoricalRates } from "@/lib/cbl-rates"
import { getCommodityPriceSeries, getMonitoredCommodities } from "@/lib/monitoring/commodity-data"
import { getImportRecords } from "@/lib/trade-analytics/data"

async function cblRatesJob(): Promise<JobRunResult> {
  try {
    const { historical } = await fetchCblHistoricalRates(90)
    return {
      success: true,
      recordsCount: historical.length,
      message: historical.length ? "CBL rates synced" : "No rates returned",
    }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    }
  }
}

async function commodityPricesJob(): Promise<JobRunResult> {
  try {
    const commodities = getMonitoredCommodities()
    let total = 0
    for (const c of commodities) {
      const { series } = await getCommodityPriceSeries({ commodityId: c.id, commodityName: c.name, days: 90 })
      total += series.length
    }
    return {
      success: true,
      recordsCount: total,
      message: `${commodities.length} commodity series`,
    }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    }
  }
}

async function tradeImportJob(): Promise<JobRunResult> {
  try {
    const records = await getImportRecords({ periods: 24 })
    return {
      success: true,
      recordsCount: records.length,
      message: "Import volumes by period",
    }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    }
  }
}

/** All registered sync jobs with schedules. */
export const SYNC_JOBS: SyncJobDef[] = [
  {
    id: "cbl_rates",
    name: "CBL rates",
    schedule: { type: "interval", minutes: 15 },
    run: cblRatesJob,
  },
  {
    id: "commodity_prices",
    name: "Commodity prices",
    schedule: { type: "interval", minutes: 60 },
    run: commodityPricesJob,
  },
  {
    id: "trade_import",
    name: "Trade / import data",
    schedule: { type: "interval", minutes: 120 },
    run: tradeImportJob,
  },
]
