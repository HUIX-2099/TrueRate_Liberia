import { NextResponse } from "next/server"

import { getAggregatedRate } from "@/lib/api/multi-source-rates"

const BASE_ITEMS = [
  { name: "25kg Rice (Thai)", usd: 14, change: 2.5, category: "food", icon: "wheat" },
  { name: "25kg Rice (Local)", usd: 15, change: 1.8, category: "food", icon: "wheat" },
  { name: "Gallon of Gas", usd: 4.02, change: -0.5, category: "fuel", icon: "fuel" },
  { name: "Gallon of Diesel", usd: 4.33, change: 0.3, category: "fuel", icon: "fuel" },
  { name: "Cement (50kg)", usd: 8, change: 1.2, category: "construction", icon: "cement" },
  { name: "Steel Rods (bundle)", usd: 400, change: 3.5, category: "construction", icon: "steel" },
  { name: "Palm Oil (gallon)", lrd: 1000, change: -1.0, category: "food", icon: "oil" },
  { name: "Cooking Gas (14kg)", usd: 20, change: 0, category: "fuel", icon: "gas" },
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
    sources,
    items,
  })
}
