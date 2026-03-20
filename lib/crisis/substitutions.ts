/**
 * Substitutions database: cheaper alternatives for common goods during a crisis.
 *
 * Each entry links a "primary" item (what people normally buy) to alternatives
 * that are cheaper, more available, or less affected by the price shock.
 */

export interface Substitution {
  id: string
  category: "food" | "energy" | "transport" | "construction" | "services"
  primary: {
    name: string
    unit: string
    typicalPrice: number
    currency: "LRD" | "USD"
  }
  alternatives: SubstitutionAlt[]
}

export interface SubstitutionAlt {
  name: string
  unit: string
  typicalPrice: number
  currency: "LRD" | "USD"
  savingsPercent: number
  availabilityNote: string
  tradeoff: string
}

export const SUBSTITUTIONS: Substitution[] = [
  {
    id: "rice",
    category: "food",
    primary: { name: "Imported rice (25kg)", unit: "bag", typicalPrice: 4200, currency: "LRD" },
    alternatives: [
      {
        name: "Local rice (Bassa, Lofa)",
        unit: "bag",
        typicalPrice: 3200,
        currency: "LRD",
        savingsPercent: 24,
        availabilityNote: "Seasonal; check Gobachop or Red Light markets",
        tradeoff: "Texture differs; takes slightly longer to cook",
      },
      {
        name: "Cassava / fufu flour",
        unit: "5kg bag",
        typicalPrice: 800,
        currency: "LRD",
        savingsPercent: 60,
        availabilityNote: "Widely available year-round",
        tradeoff: "Different meal; pair with soup for full nutrition",
      },
      {
        name: "Bulgur wheat",
        unit: "10kg",
        typicalPrice: 2500,
        currency: "LRD",
        savingsPercent: 40,
        availabilityNote: "Available at larger stores; sometimes donated stock",
        tradeoff: "Different texture and taste; very nutritious",
      },
    ],
  },
  {
    id: "cooking-fuel",
    category: "energy",
    primary: { name: "Gas (LPG 14kg cylinder)", unit: "refill", typicalPrice: 5500, currency: "LRD" },
    alternatives: [
      {
        name: "Charcoal",
        unit: "bag",
        typicalPrice: 1500,
        currency: "LRD",
        savingsPercent: 73,
        availabilityNote: "Widely available; buy from known sellers",
        tradeoff: "Slower cooking; more smoke; deforestation concern",
      },
      {
        name: "Coal pot (improved cookstove)",
        unit: "stove + fuel",
        typicalPrice: 2000,
        currency: "LRD",
        savingsPercent: 64,
        availabilityNote: "NGO-distributed improved stoves available in some areas",
        tradeoff: "One-time stove cost; then charcoal ongoing",
      },
    ],
  },
  {
    id: "generator",
    category: "energy",
    primary: { name: "Generator fuel (PMS/day)", unit: "gallon", typicalPrice: 800, currency: "LRD" },
    alternatives: [
      {
        name: "Solar lantern + phone charger",
        unit: "unit",
        typicalPrice: 3000,
        currency: "LRD",
        savingsPercent: 80,
        availabilityNote: "One-time purchase; available at electronic shops",
        tradeoff: "Lights and phone only; cannot power appliances",
      },
      {
        name: "Community charging station",
        unit: "per charge",
        typicalPrice: 50,
        currency: "LRD",
        savingsPercent: 94,
        availabilityNote: "Available in most neighborhoods",
        tradeoff: "Phone/device charging only; no home power",
      },
      {
        name: "Reduce generator hours (4h → 2h peak)",
        unit: "day",
        typicalPrice: 400,
        currency: "LRD",
        savingsPercent: 50,
        availabilityNote: "Behavioral change",
        tradeoff: "Less power; schedule heavy-use tasks during peak hours",
      },
    ],
  },
  {
    id: "transport-taxi",
    category: "transport",
    primary: { name: "Taxi fare (daily)", unit: "round trip", typicalPrice: 300, currency: "LRD" },
    alternatives: [
      {
        name: "Kekeh / tricycle",
        unit: "round trip",
        typicalPrice: 150,
        currency: "LRD",
        savingsPercent: 50,
        availabilityNote: "Widely available; some routes only",
        tradeoff: "Less comfortable; shared ride",
      },
      {
        name: "Motorcycle (okada)",
        unit: "round trip",
        typicalPrice: 200,
        currency: "LRD",
        savingsPercent: 33,
        availabilityNote: "Available but safety concerns",
        tradeoff: "Faster but less safe; no weather protection",
      },
      {
        name: "Walking (short distances)",
        unit: "trip",
        typicalPrice: 0,
        currency: "LRD",
        savingsPercent: 100,
        availabilityNote: "If distance is < 2km",
        tradeoff: "Time cost; not viable for longer distances",
      },
    ],
  },
  {
    id: "cooking-oil",
    category: "food",
    primary: { name: "Imported vegetable oil", unit: "gallon", typicalPrice: 2200, currency: "LRD" },
    alternatives: [
      {
        name: "Local palm oil",
        unit: "gallon",
        typicalPrice: 1500,
        currency: "LRD",
        savingsPercent: 32,
        availabilityNote: "Abundant locally; buy from market women",
        tradeoff: "Stronger flavor; not suitable for all dishes",
      },
      {
        name: "Coconut oil (local)",
        unit: "bottle",
        typicalPrice: 800,
        currency: "LRD",
        savingsPercent: 45,
        availabilityNote: "Seasonal; available in coastal markets",
        tradeoff: "Distinct taste; smaller quantities",
      },
    ],
  },
  {
    id: "cement",
    category: "construction",
    primary: { name: "Cement (50kg bag)", unit: "bag", typicalPrice: 2800, currency: "LRD" },
    alternatives: [
      {
        name: "Compressed earth blocks",
        unit: "per 100",
        typicalPrice: 8000,
        currency: "LRD",
        savingsPercent: 40,
        availabilityNote: "Available from local block makers; some NGO programs",
        tradeoff: "Different construction technique; suitable for residential",
      },
      {
        name: "Delay non-urgent construction",
        unit: "project",
        typicalPrice: 0,
        currency: "LRD",
        savingsPercent: 100,
        availabilityNote: "Wait for prices to stabilize",
        tradeoff: "Project delay; but prices may drop 15-30% post-crisis",
      },
    ],
  },
  {
    id: "water",
    category: "services",
    primary: { name: "Water delivery (barrel)", unit: "barrel", typicalPrice: 300, currency: "LRD" },
    alternatives: [
      {
        name: "Community pump/well",
        unit: "barrel",
        typicalPrice: 50,
        currency: "LRD",
        savingsPercent: 83,
        availabilityNote: "If available in your community",
        tradeoff: "May require boiling/treatment; transport effort",
      },
      {
        name: "Rainwater collection",
        unit: "barrel",
        typicalPrice: 0,
        currency: "LRD",
        savingsPercent: 100,
        availabilityNote: "Rainy season (May-Oct); need container",
        tradeoff: "Seasonal; requires filtration for drinking",
      },
    ],
  },
]

export function getSubstitutionsForCategory(category: Substitution["category"]): Substitution[] {
  return SUBSTITUTIONS.filter((s) => s.category === category)
}

export function getSubstitutionById(id: string): Substitution | undefined {
  return SUBSTITUTIONS.find((s) => s.id === id)
}

export function getAllCategories(): Substitution["category"][] {
  return [...new Set(SUBSTITUTIONS.map((s) => s.category))]
}
