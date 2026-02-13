import { NextResponse } from "next/server"

import { getAggregatedRate } from "@/lib/api/multi-source-rates"

export const revalidate = 60 // Auto-update every minute

/**
 * Indicative commodity prices (USD/LRD) for Liberia.
 * Sources: CBL Monthly Economic Reviews, LISGIS, market surveys.
 * LISGIS CPI Excel contains indices, not retail prices—use these base values with live LRD rate.
 */
const BASE_ITEMS = [
  { key: "rice-thai", name: "25kg Rice (Thai)", usd: 10.5, change: -5.0, category: "food", icon: "wheat" },
  { key: "rice-local", name: "25kg Rice (Local)", usd: 11, change: -4.5, category: "food", icon: "wheat" },
  { key: "gas", name: "Gallon of Gas", usd: 4.15, change: -0.5, category: "fuel", icon: "fuel" },
  { key: "diesel", name: "Gallon of Diesel", usd: 4.45, change: 0.2, category: "fuel", icon: "fuel" },
  { key: "cement", name: "Cement (50kg)", usd: 8.5, change: 1.0, category: "construction", icon: "cement" },
  { key: "steel", name: "Steel Rods (bundle)", usd: 385, change: 2.0, category: "construction", icon: "steel" },
  { key: "palm-oil", name: "Palm Oil (gallon)", lrd: 1050, change: -1.5, category: "food", icon: "oil" },
  { key: "cooking-gas", name: "Cooking Gas (14kg)", usd: 21, change: 0.5, category: "fuel", icon: "gas" },
]

export async function GET() {
  const { rate, sources, timestamp } = await getAggregatedRate()

  const items = BASE_ITEMS.map((item) => {
    if (typeof item.usd === "number") {
      return {
        name: item.name,
        category: item.category,
        change: item.change,
        priceUSD: item.usd,
        priceLRD: item.usd * rate,
        icon: item.icon,
      }
    }

    const lrd = item.lrd ?? 0
    return {
      name: item.name,
      category: item.category,
      change: item.change,
      priceUSD: lrd / rate,
      priceLRD: lrd,
      icon: item.icon,
    }
  })

  return NextResponse.json({
    rate,
    updatedAt: timestamp,
    sources: sources?.length ? sources : ["LISGIS"],
    sourceUrl: "https://lisgis.gov.lr/pricestats.php",
    items,
  })
}
