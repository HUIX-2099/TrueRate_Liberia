/**
 * Generate commodity and import-style data from MoCI context.
 * Commerce Today reports key commodities (rice, palm oil, petroleum, etc.) and import data.
 * Use when no official MoC API is configured — provides realistic fixture data for dashboards.
 */

import type { MociCommodityItem, MociImportItem } from "./types"

const COMMODITIES = [
  { id: "rice", name: "Rice", unit: "bag (25kg)", category: "food" },
  { id: "palm-oil", name: "Palm Oil", unit: "gallon", category: "food" },
  { id: "cement", name: "Cement", unit: "bag (50kg)", category: "construction" },
  { id: "petroleum-pms", name: "Petroleum (PMS)", unit: "gallon", category: "energy" },
  { id: "sugar", name: "Sugar", unit: "kg", category: "food" },
]

function randomInRange(min: number, max: number): number {
  return Math.round((min + Math.random() * (max - min)) * 100) / 100
}

/** Generate commodity price snapshot in MoCI/Commerce Today style (LRD). */
export function generateMociCommodityData(period: string): MociCommodityItem[] {
  const basePrices: Record<string, [number, number]> = {
    rice: [4200, 5200],
    "palm-oil": [850, 1200],
    cement: [3200, 4000],
    "petroleum-pms": [950, 1100],
    sugar: [180, 250],
  }
  return COMMODITIES.map((c) => {
    const [lo, hi] = basePrices[c.id] ?? [100, 500]
    return {
      commodityId: c.id,
      name: c.name,
      unit: c.unit,
      category: c.category,
      effectiveDate: period,
      price: randomInRange(lo, hi),
      currency: "LRD",
      source: "moci_bulletin_fixture",
    }
  })
}

/** Generate import/trade snapshot in MoCI style (from import documents / Commerce Today). */
export function generateMociImportData(period: string, count = 12): MociImportItem[] {
  const items: MociImportItem[] = []
  const categories = ["Rice", "Palm Oil", "Cement", "Machinery", "Petroleum", "Electronics"]
  const units = ["MT", "gallon", "bag", "unit", "kg"]
  for (let i = 0; i < count; i++) {
    const name = categories[i % categories.length]
    const volume = randomInRange(100, 5000)
    const valueUsd = volume * randomInRange(0.3, 1.2)
    const valueLocal = valueUsd * randomInRange(180, 195)
    items.push({
      commodityName: name,
      declarationDate: period,
      volume,
      unit: units[i % units.length],
      valueUsd: Math.round(valueUsd * 100) / 100,
      valueLocal: Math.round(valueLocal * 100) / 100,
      source: "moci_bulletin_fixture",
    })
  }
  return items
}
