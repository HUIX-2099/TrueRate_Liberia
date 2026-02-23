/**
 * Single source of truth for the Liberia Price Index basket.
 * Market risk, price stability, cost of living index, and affordability
 * all use this basket so metrics are aligned with the Price Index.
 */

export const PRICE_INDEX_BASKET_ID = "liberia-essential" as const

export interface PriceIndexBasketItem {
  id: string
  name: string
  unit: string
  category: "food" | "energy" | "construction" | "other"
}

/** Commodities that form the Price Index basket (equal-weight index, COL, affordability, market risk volatility). */
export const PRICE_INDEX_BASKET: PriceIndexBasketItem[] = [
  { id: "rice", name: "Rice", unit: "25kg bag", category: "food" },
  { id: "palm-oil", name: "Palm Oil", unit: "gallon", category: "food" },
  { id: "cement", name: "Cement", unit: "50kg bag", category: "construction" },
  { id: "fuel", name: "Fuel (PMS)", unit: "gallon", category: "energy" },
  { id: "sugar", name: "Sugar", unit: "kg", category: "food" },
]

/** IDs only, for volatility/COL series lookups. */
export function getPriceIndexBasketIds(): string[] {
  return PRICE_INDEX_BASKET.map((c) => c.id)
}

/** Shape expected by getMonitoredCommodities: { id, name }. */
export function getPriceIndexBasketForMonitoring(): Array<{ id: string; name: string }> {
  return PRICE_INDEX_BASKET.map((c) => ({ id: c.id, name: c.name }))
}
