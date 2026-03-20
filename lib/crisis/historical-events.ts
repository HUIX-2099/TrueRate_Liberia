/**
 * Historical economic crises and price shocks in Liberia.
 *
 * Used by the Crisis History Timeline and predictive models.
 * Each event records what happened, how prices moved, and recovery time.
 */

export interface CrisisEvent {
  id: string
  title: string
  date: string
  endDate?: string
  category: "fuel" | "currency" | "food" | "policy" | "global" | "conflict"
  severity: "minor" | "moderate" | "major" | "severe"
  summary: string
  details: string
  priceImpacts: PriceImpact[]
  governmentResponse: string[]
  recoveryDays: number | null
  lessonsLearned: string[]
  /** What you could have done to save money */
  whatIf: string
}

export interface PriceImpact {
  item: string
  beforePrice: number
  peakPrice: number
  afterPrice: number
  currency: "LRD" | "USD"
  changePercent: number
}

export const CRISIS_HISTORY: CrisisEvent[] = [
  {
    id: "fuel-hike-2026-mar",
    title: "March 2026 Fuel Price Hike",
    date: "2026-03-01",
    category: "fuel",
    severity: "major",
    summary: "Government raised fuel pump prices amid rising global oil costs and LRD depreciation.",
    details: "The Liberia Petroleum Refining Company (LPRC) announced an increase in the pump price of gasoline following sustained increases in global crude oil prices and continued depreciation of the Liberian dollar. The hike immediately impacted transportation costs and began cascading through food and essential goods markets.",
    priceImpacts: [
      { item: "Fuel (PMS/gallon)", beforePrice: 700, peakPrice: 900, afterPrice: 850, currency: "LRD", changePercent: 28.6 },
      { item: "Taxi fare (Monrovia)", beforePrice: 125, peakPrice: 175, afterPrice: 150, currency: "LRD", changePercent: 40 },
      { item: "Rice (25kg bag)", beforePrice: 4000, peakPrice: 4500, afterPrice: 4200, currency: "LRD", changePercent: 12.5 },
      { item: "USD/LRD rate", beforePrice: 185, peakPrice: 195, afterPrice: 190, currency: "LRD", changePercent: 5.4 },
    ],
    governmentResponse: [
      "LPRC announced new regulated pump prices",
      "Ministry of Commerce monitoring price gouging",
      "CBL intervened in forex market to stabilize LRD",
    ],
    recoveryDays: null,
    lessonsLearned: [
      "Fuel price hikes hit transport fares within 24 hours",
      "Food prices follow with 3-7 day lag",
      "Local alternatives (charcoal, local rice) become cost-effective during hikes",
      "Group buying helps reduce per-unit costs",
    ],
    whatIf: "If you had stocked up on fuel and rice 1 week before, you would have saved ~LRD 2,500 per household.",
  },
  {
    id: "lrd-depreciation-2023",
    title: "2023 LRD Depreciation Crisis",
    date: "2023-06-01",
    endDate: "2023-10-15",
    category: "currency",
    severity: "severe",
    summary: "LRD depreciated sharply from 155 to over 190 per USD in 4 months, driving widespread price increases.",
    details: "A combination of foreign reserve depletion, election uncertainty, and reduced diaspora remittances triggered rapid LRD depreciation. Imported goods prices surged, particularly rice, fuel, and medicine. The CBL attempted multiple interventions with limited success until political stability returned post-election.",
    priceImpacts: [
      { item: "USD/LRD rate", beforePrice: 155, peakPrice: 192, afterPrice: 180, currency: "LRD", changePercent: 23.9 },
      { item: "Rice (25kg bag)", beforePrice: 3200, peakPrice: 4500, afterPrice: 3800, currency: "LRD", changePercent: 40.6 },
      { item: "Fuel (PMS/gallon)", beforePrice: 575, peakPrice: 750, afterPrice: 680, currency: "LRD", changePercent: 30.4 },
      { item: "Cement (50kg bag)", beforePrice: 2200, peakPrice: 3000, afterPrice: 2600, currency: "LRD", changePercent: 36.4 },
    ],
    governmentResponse: [
      "CBL forex auctions to stabilize rate",
      "Government appeal to diaspora for remittance support",
      "Temporary import duty waivers on essential goods",
      "Price monitoring task force activated",
    ],
    recoveryDays: 135,
    lessonsLearned: [
      "Election periods create currency uncertainty — plan ahead",
      "Having savings in USD provided protection",
      "Local food production buffered some households",
      "Mobile money transfers were faster during bank disruptions",
    ],
    whatIf: "If you had converted LRD savings to USD at 155, you would have preserved 19% more purchasing power.",
  },
  {
    id: "fuel-shortage-2022",
    title: "2022 Fuel Shortage",
    date: "2022-03-15",
    endDate: "2022-05-01",
    category: "fuel",
    severity: "major",
    summary: "Global supply chain disruptions post-Ukraine conflict caused fuel shortages and price spikes across West Africa.",
    details: "The Russia-Ukraine conflict disrupted global energy markets, causing fuel shortages across West Africa including Liberia. Gas stations ran dry for days, and when fuel was available, prices were significantly higher. Black market fuel prices tripled in some areas.",
    priceImpacts: [
      { item: "Fuel (PMS/gallon)", beforePrice: 480, peakPrice: 750, afterPrice: 600, currency: "LRD", changePercent: 56.3 },
      { item: "Diesel (gallon)", beforePrice: 450, peakPrice: 700, afterPrice: 550, currency: "LRD", changePercent: 55.6 },
      { item: "Transport fares", beforePrice: 100, peakPrice: 200, afterPrice: 130, currency: "LRD", changePercent: 100 },
      { item: "Rice (25kg)", beforePrice: 3000, peakPrice: 3800, afterPrice: 3300, currency: "LRD", changePercent: 26.7 },
    ],
    governmentResponse: [
      "Emergency fuel imports negotiated with regional partners",
      "Anti-hoarding enforcement at gas stations",
      "Price cap on transportation fares (partially enforced)",
      "LPRC increased strategic fuel reserves",
    ],
    recoveryDays: 47,
    lessonsLearned: [
      "Global conflicts can cause local shortages within weeks",
      "Having alternative energy (solar, charcoal) provided resilience",
      "Community information sharing about fuel availability was critical",
      "Black market prices can be 2-3x regulated prices",
    ],
    whatIf: "Households with solar lanterns saved ~LRD 15,000 in generator fuel during the shortage.",
  },
  {
    id: "rice-crisis-2021",
    title: "2021 Rice Price Surge",
    date: "2021-09-01",
    endDate: "2021-12-15",
    category: "food",
    severity: "moderate",
    summary: "Import disruptions and LRD weakness caused rice prices to spike 30% in 3 months.",
    details: "Shipping container shortages and port congestion delayed rice imports to Liberia. Combined with gradual LRD depreciation, the price of a 25kg bag of rice rose from ~2,800 LRD to over 3,600 LRD. Lower-income households shifted to cassava and local alternatives.",
    priceImpacts: [
      { item: "Rice (25kg bag)", beforePrice: 2800, peakPrice: 3650, afterPrice: 3100, currency: "LRD", changePercent: 30.4 },
      { item: "Palm oil (gallon)", beforePrice: 1400, peakPrice: 1800, afterPrice: 1550, currency: "LRD", changePercent: 28.6 },
      { item: "Sugar (kg)", beforePrice: 200, peakPrice: 280, afterPrice: 230, currency: "LRD", changePercent: 40 },
    ],
    governmentResponse: [
      "Ministry of Commerce price monitoring intensified",
      "Emergency rice imports through ECOWAS channels",
      "Local rice production incentives announced",
    ],
    recoveryDays: 105,
    lessonsLearned: [
      "Rice import dependency makes Liberia vulnerable to global shipping disruptions",
      "Households that mixed local and imported rice saved significantly",
      "Bulk buying cooperatives got better prices than individual buyers",
      "Early warning from global shipping data could have given 2-3 weeks notice",
    ],
    whatIf: "Buying 2 bags at pre-crisis price (LRD 5,600) vs peak price (LRD 7,300) = LRD 1,700 savings.",
  },
  {
    id: "covid-shock-2020",
    title: "COVID-19 Economic Shock",
    date: "2020-03-20",
    endDate: "2020-09-30",
    category: "global",
    severity: "severe",
    summary: "Pandemic lockdowns disrupted trade, remittances collapsed, and prices spiked across all categories.",
    details: "COVID-19 restrictions severely disrupted Liberia's economy. Border closures reduced imports, diaspora remittances fell by an estimated 25%, and the LRD weakened significantly. Markets were disrupted and essential goods became scarce in rural areas.",
    priceImpacts: [
      { item: "Rice (25kg bag)", beforePrice: 2500, peakPrice: 3500, afterPrice: 2900, currency: "LRD", changePercent: 40 },
      { item: "USD/LRD rate", beforePrice: 150, peakPrice: 175, afterPrice: 165, currency: "LRD", changePercent: 16.7 },
      { item: "Hand sanitizer", beforePrice: 200, peakPrice: 1500, afterPrice: 350, currency: "LRD", changePercent: 650 },
      { item: "Face masks (box)", beforePrice: 500, peakPrice: 3000, afterPrice: 800, currency: "LRD", changePercent: 500 },
    ],
    governmentResponse: [
      "State of emergency declared",
      "Essential goods price controls",
      "Food distribution programs in vulnerable communities",
      "CBL forex market interventions",
      "Diaspora engagement for remittance support",
    ],
    recoveryDays: 195,
    lessonsLearned: [
      "Diversified income sources provided more resilience",
      "Community savings groups were crucial during lockdowns",
      "Digital payments reduced need for cash during restrictions",
      "Local food production reduced dependence on imports",
    ],
    whatIf: "Households with 3-month emergency funds weathered the crisis without borrowing.",
  },
  {
    id: "ebola-economic-2014",
    title: "2014 Ebola Economic Crisis",
    date: "2014-06-01",
    endDate: "2015-05-01",
    category: "conflict",
    severity: "severe",
    summary: "Ebola epidemic devastated the economy: trade collapsed, prices surged, and recovery took over a year.",
    details: "The 2014-2015 Ebola epidemic caused massive economic disruption. Agricultural production fell, trade routes were blocked by quarantine zones, and foreign investment fled. GDP contracted by an estimated 1.6% and prices for basic goods surged dramatically, particularly in affected counties.",
    priceImpacts: [
      { item: "Rice (25kg bag)", beforePrice: 1800, peakPrice: 3200, afterPrice: 2200, currency: "LRD", changePercent: 77.8 },
      { item: "Fuel (gallon)", beforePrice: 350, peakPrice: 500, afterPrice: 400, currency: "LRD", changePercent: 42.9 },
      { item: "USD/LRD rate", beforePrice: 82, peakPrice: 105, afterPrice: 90, currency: "LRD", changePercent: 28 },
    ],
    governmentResponse: [
      "State of emergency and quarantine zones",
      "International aid mobilization",
      "Emergency food distribution",
      "Post-Ebola economic recovery program",
    ],
    recoveryDays: 330,
    lessonsLearned: [
      "Health crises quickly become economic crises",
      "Rural areas were hit hardest by supply disruptions",
      "Community-level food reserves can bridge short-term gaps",
      "Diversified food sources reduce vulnerability",
    ],
    whatIf: "Communities with local food gardens maintained food security 60% longer than those dependent solely on markets.",
  },
]

export function getCrisisById(id: string): CrisisEvent | undefined {
  return CRISIS_HISTORY.find((e) => e.id === id)
}

export function getCrisesByCategory(category: CrisisEvent["category"]): CrisisEvent[] {
  return CRISIS_HISTORY.filter((e) => e.category === category)
}

export function getRecentCrises(limit = 5): CrisisEvent[] {
  return [...CRISIS_HISTORY]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
}

export function getAverageRecoveryDays(): number {
  const withRecovery = CRISIS_HISTORY.filter((e) => e.recoveryDays != null)
  if (withRecovery.length === 0) return 0
  return Math.round(withRecovery.reduce((s, e) => s + (e.recoveryDays ?? 0), 0) / withRecovery.length)
}
