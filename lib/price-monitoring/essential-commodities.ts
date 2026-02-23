/**
 * Ministry-monitored essential commodities: Rice (25kg, 50kg), Cooking oil, Cement, Fuel, other staples.
 * Source IDs align with the Price Index basket (lib/price-index/basket) so COL, market risk, and affordability stay aligned.
 */

import type { EssentialCommodityItem } from "./types"

/** Essential goods monitored by the Ministry (Commerce Today / MoCI). Source IDs = Price Index basket. */
export const ESSENTIAL_COMMODITIES: EssentialCommodityItem[] = [
  { id: "rice-25kg", name: "Rice", unit: "25kg bag", sourceId: "rice", sourceMultiplier: 1, category: "food" },
  { id: "rice-50kg", name: "Rice", unit: "50kg bag", sourceId: "rice", sourceMultiplier: 2, category: "food" },
  { id: "cooking-oil", name: "Cooking oil", unit: "gallon", sourceId: "palm-oil", sourceMultiplier: 1, category: "food" },
  { id: "cement", name: "Cement", unit: "50kg bag", sourceId: "cement", sourceMultiplier: 1, category: "construction" },
  { id: "fuel", name: "Fuel (PMS)", unit: "gallon", sourceId: "fuel", sourceMultiplier: 1, category: "energy" },
  { id: "sugar", name: "Sugar", unit: "kg", sourceId: "sugar", sourceMultiplier: 1, category: "food" },
]

/** Source commodity IDs we need series for (unique). */
export function getEssentialSourceIds(): string[] {
  const ids = [...new Set(ESSENTIAL_COMMODITIES.map((c) => c.sourceId))]
  return ids
}

/** Default price when no series (LRD). Used for fuel/sugar if not in monitored list. */
export const DEFAULT_ESSENTIAL_PRICES: Record<string, number> = {
  rice: 4500,
  "palm-oil": 1000,
  cement: 3600,
  fuel: 1050,
  sugar: 220,
}
