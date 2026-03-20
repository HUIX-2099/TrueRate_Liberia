/**
 * Fuel Price Cascade Model for Liberia.
 *
 * Models how a change in fuel (PMS) prices ripples through the economy:
 *   fuel -> transport -> food -> construction -> electricity -> services -> overall COL
 *
 * Multiplier coefficients are Liberia-specific estimates based on:
 *   - Transport: fuel is ~40-60% of operating cost for taxis/kekeh/buses
 *   - Food: transport cost embedded in market price + fuel for processing
 *   - Construction: delivery logistics + machinery fuel
 *   - Electricity: generator fuel (majority of Liberia relies on gensets)
 *   - Services: indirect pass-through from all above
 *
 * Coefficients are configurable and should be refined with real data over time.
 */

export interface CascadeSector {
  id: string
  name: string
  icon: string
  /** How much a 1% fuel increase raises prices in this sector (e.g. 0.7 = 0.7%) */
  multiplier: number
  /** Delay in days before the price increase is fully felt */
  lagDays: number
  description: string
  /** Sub-items within this sector */
  items: CascadeItem[]
}

export interface CascadeItem {
  name: string
  unit: string
  /** Multiplier specific to this item (overrides sector default if set) */
  multiplier?: number
  basePrice: number
  currency: "LRD" | "USD"
}

export interface CascadeResult {
  fuelChangePercent: number
  sectors: SectorImpact[]
  totalMonthlyImpactLRD: number
  totalMonthlyImpactUSD: number
  overallCOLChangePercent: number
  timestamp: string
}

export interface SectorImpact {
  sectorId: string
  sectorName: string
  icon: string
  changePercent: number
  lagDays: number
  items: ItemImpact[]
  monthlyImpactLRD: number
}

export interface ItemImpact {
  name: string
  unit: string
  oldPrice: number
  newPrice: number
  change: number
  currency: "LRD" | "USD"
}

export const CASCADE_SECTORS: CascadeSector[] = [
  {
    id: "transport",
    name: "Transportation",
    icon: "Bus",
    multiplier: 0.70,
    lagDays: 1,
    description: "Fuel is 40-60% of operating cost for taxis, kekeh, and buses",
    items: [
      { name: "Taxi fare (Monrovia)", unit: "trip", basePrice: 150, currency: "LRD" },
      { name: "Kekeh fare", unit: "trip", basePrice: 75, currency: "LRD" },
      { name: "Bus fare (intercity)", unit: "trip", basePrice: 500, currency: "LRD" },
      { name: "Motorcycle (okada)", unit: "trip", basePrice: 100, currency: "LRD" },
    ],
  },
  {
    id: "food",
    name: "Food & Groceries",
    icon: "ShoppingBasket",
    multiplier: 0.35,
    lagDays: 3,
    description: "Transport cost is embedded in market prices; imported goods hit harder",
    items: [
      { name: "Rice (25kg bag)", unit: "bag", basePrice: 4200, currency: "LRD" },
      { name: "Palm oil", unit: "gallon", basePrice: 1800, currency: "LRD" },
      { name: "Imported goods (flour, sugar)", unit: "basket", multiplier: 0.45, basePrice: 3500, currency: "LRD" },
      { name: "Local vegetables", unit: "bundle", multiplier: 0.15, basePrice: 200, currency: "LRD" },
      { name: "Bread", unit: "loaf", basePrice: 150, currency: "LRD" },
      { name: "Eggs", unit: "tray", basePrice: 1200, currency: "LRD" },
    ],
  },
  {
    id: "construction",
    name: "Construction",
    icon: "Building2",
    multiplier: 0.40,
    lagDays: 7,
    description: "Delivery logistics and machinery fuel raise material costs",
    items: [
      { name: "Cement (50kg bag)", unit: "bag", basePrice: 2800, currency: "LRD" },
      { name: "Steel rods", unit: "bundle", basePrice: 12000, currency: "LRD" },
      { name: "Sand delivery", unit: "truck", multiplier: 0.60, basePrice: 15000, currency: "LRD" },
      { name: "Block delivery", unit: "truck", multiplier: 0.55, basePrice: 8000, currency: "LRD" },
    ],
  },
  {
    id: "electricity",
    name: "Electricity / Generator",
    icon: "Zap",
    multiplier: 0.85,
    lagDays: 0,
    description: "Most households and businesses rely on fuel generators",
    items: [
      { name: "Generator fuel (daily)", unit: "day", multiplier: 1.0, basePrice: 800, currency: "LRD" },
      { name: "Charging station fee", unit: "charge", multiplier: 0.50, basePrice: 50, currency: "LRD" },
      { name: "Small business genset", unit: "day", multiplier: 0.90, basePrice: 2500, currency: "LRD" },
    ],
  },
  {
    id: "services",
    name: "Services & Other",
    icon: "Briefcase",
    multiplier: 0.20,
    lagDays: 14,
    description: "Indirect pass-through from transport, food, and energy costs",
    items: [
      { name: "Water delivery", unit: "barrel", multiplier: 0.35, basePrice: 300, currency: "LRD" },
      { name: "Laundry services", unit: "load", basePrice: 500, currency: "LRD" },
      { name: "Mobile data / airtime", unit: "month", multiplier: 0.10, basePrice: 1500, currency: "LRD" },
      { name: "Healthcare visit", unit: "visit", multiplier: 0.15, basePrice: 2000, currency: "LRD" },
    ],
  },
]

/**
 * COL sector weights for overall cost-of-living impact.
 * Based on typical Liberian household expenditure shares.
 */
const COL_WEIGHTS: Record<string, number> = {
  transport: 0.18,
  food: 0.42,
  construction: 0.08,
  electricity: 0.15,
  services: 0.17,
}

export function computeCascadeImpact(
  fuelChangePercent: number,
  exchangeRate: number = 190,
): CascadeResult {
  const sectors: SectorImpact[] = CASCADE_SECTORS.map((sector) => {
    const sectorChange = fuelChangePercent * sector.multiplier

    const items: ItemImpact[] = sector.items.map((item) => {
      const itemMultiplier = item.multiplier ?? sector.multiplier
      const itemChange = fuelChangePercent * itemMultiplier
      const priceChange = item.basePrice * (itemChange / 100)
      return {
        name: item.name,
        unit: item.unit,
        oldPrice: item.basePrice,
        newPrice: Math.round(item.basePrice + priceChange),
        change: Math.round(priceChange),
        currency: item.currency,
      }
    })

    const monthlyImpactLRD = items.reduce((sum, it) => {
      const freq = estimateMonthlyFrequency(it.name)
      return sum + it.change * freq
    }, 0)

    return {
      sectorId: sector.id,
      sectorName: sector.name,
      icon: sector.icon,
      changePercent: Number(sectorChange.toFixed(2)),
      lagDays: sector.lagDays,
      items,
      monthlyImpactLRD: Math.round(monthlyImpactLRD),
    }
  })

  const totalMonthlyImpactLRD = sectors.reduce((s, sec) => s + sec.monthlyImpactLRD, 0)
  const totalMonthlyImpactUSD = Number((totalMonthlyImpactLRD / exchangeRate).toFixed(2))

  const overallCOLChangePercent = sectors.reduce((sum, sec) => {
    const weight = COL_WEIGHTS[sec.sectorId] ?? 0
    return sum + sec.changePercent * weight
  }, 0)

  return {
    fuelChangePercent,
    sectors,
    totalMonthlyImpactLRD,
    totalMonthlyImpactUSD,
    overallCOLChangePercent: Number(overallCOLChangePercent.toFixed(2)),
    timestamp: new Date().toISOString(),
  }
}

function estimateMonthlyFrequency(itemName: string): number {
  const lower = itemName.toLowerCase()
  if (lower.includes("daily") || lower.includes("genset")) return 30
  if (lower.includes("trip") || lower.includes("fare")) return 25
  if (lower.includes("charge")) return 20
  if (lower.includes("bread")) return 20
  if (lower.includes("rice") || lower.includes("bag")) return 1
  if (lower.includes("gallon") || lower.includes("oil")) return 2
  if (lower.includes("eggs") || lower.includes("tray")) return 4
  if (lower.includes("vegetables") || lower.includes("bundle")) return 8
  if (lower.includes("water")) return 8
  if (lower.includes("truck")) return 0.5
  if (lower.includes("month") || lower.includes("data")) return 1
  if (lower.includes("visit")) return 0.5
  return 4
}
