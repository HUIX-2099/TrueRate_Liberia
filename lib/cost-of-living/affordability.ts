import type { AffordabilityIndex } from "./types"

/**
 * Compute affordability index from base and current basket averages.
 * Index = 100 * (baseAvg / currentAvg). 100 = same as base; >100 = more affordable, <100 = less.
 */
export function computeAffordabilityIndex(
  baseBasketAvg: number,
  currentBasketAvg: number,
  baseDate: string,
  currentDate: string
): AffordabilityIndex {
  if (currentBasketAvg <= 0) {
    return {
      index: 100,
      baseDate,
      currentDate,
      baseBasketAvg,
      currentBasketAvg,
      label: "stable",
    }
  }
  const index = Number((100 * (baseBasketAvg / currentBasketAvg)).toFixed(2))
  let label: AffordabilityIndex["label"] = "stable"
  if (index >= 120) label = "much_more_affordable"
  else if (index >= 105) label = "more_affordable"
  else if (index <= 80) label = "much_less_affordable"
  else if (index <= 95) label = "less_affordable"

  return {
    index,
    baseDate,
    currentDate,
    baseBasketAvg: Number(baseBasketAvg.toFixed(4)),
    currentBasketAvg: Number(currentBasketAvg.toFixed(4)),
    label,
  }
}
