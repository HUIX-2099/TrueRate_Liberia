import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

export interface DataSourceEntry {
  id: string
  name: string
  description: string
  url: string | null
  type: "live" | "sample" | "derived"
  usedBy: string[]
}

/**
 * GET /api/market-intelligence/sources
 * Returns accurate data source attribution for the Market Intelligence dashboard.
 */
export async function GET() {
  const commodityUrl = process.env.MONITORING_COMMODITY_API_URL ?? null
  const importUrl = process.env.TRADE_ANALYTICS_IMPORT_API_URL ?? null

  const sources: DataSourceEntry[] = [
    {
      id: "commodity-prices",
      name: "Commodity prices",
      description: commodityUrl
        ? "Ministry of Commerce & Industry — Commerce Today monthly critical commodities bulletin and import document assessments."
        : "Sample data for demo. Set MONITORING_COMMODITY_API_URL for live MoCI/Commerce Today data.",
      url: commodityUrl || "https://www.moci.gov.lr/",
      type: commodityUrl ? "live" : "sample",
      usedBy: ["Commodity price trends", "Market risk", "Cost of living index"],
    },
    {
      id: "import-volumes",
      name: "Import / trade data",
      description: importUrl
        ? "Trade declarations and import volumes (e.g. Liberia Single Window, MoCI assessment data)."
        : "Sample data for demo. Set TRADE_ANALYTICS_IMPORT_API_URL for live import/trade data.",
      url: importUrl || "https://www.moci.gov.lr/",
      type: importUrl ? "live" : "sample",
      usedBy: ["Import volume trends", "Market risk"],
    },
    {
      id: "cbl-rates",
      name: "Exchange rates (USD/LRD)",
      description: "Central Bank of Liberia (CBL) — official buying/selling rates.",
      url: "https://www.cbl.org.lr/research/buying-selling-rates",
      type: "live",
      usedBy: ["Cost of living index", "FX comparison"],
    },
    {
      id: "market-risk",
      name: "Market risk & price stability",
      description: "Derived from commodity price volatility, import volume changes, and demand indicators.",
      url: null,
      type: "derived",
      usedBy: ["Market risk", "Price stability"],
    },
    {
      id: "sync",
      name: "Data sync logs",
      description: "Internal scheduler: CBL rates, commodity prices, and trade/import sync jobs (cron).",
      url: null,
      type: "derived",
      usedBy: ["Data sync logs"],
    },
  ]

  return NextResponse.json({
    sources,
    timestamp: new Date().toISOString(),
  })
}
