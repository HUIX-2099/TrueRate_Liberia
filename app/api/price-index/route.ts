import { NextResponse } from "next/server"

import { getAggregatedRate } from "@/lib/api/multi-source-rates"
import { fetchLisgisPrices } from "@/lib/lisgis-prices"
import { PRICE_INDEX_BASKET_ID } from "@/lib/price-index/basket"

export const revalidate = 60 // Auto-update every minute

/**
 * Essential goods and services prices for Liberia (Liberia Price Index).
 * Prefers official LISGIS / Ministry of Commerce CPI data when available; falls back to CBL/market indicators.
 * Market risk, price stability, cost of living index, and affordability use the same basket (priceIndexBasketId).
 */
// Prices in LRD (USD equivalent shown in UI via rate). Source: LISGIS / Ministry of Commerce.
const BASE_ITEMS = [
  // Food
  { key: "rice-thai", name: "25kg Rice (Thai)", lrd: 1938.206, change: 0, category: "food", icon: "wheat" },
  { key: "rice-local", name: "25kg Rice (Local)", lrd: 2030.501, change: 0, category: "food", icon: "wheat" },
  { key: "palm-oil", name: "Palm Oil (gallon)", lrd: 1050, change: 0, category: "food", icon: "oil" },
  { key: "sugar", name: "Sugar (1kg)", lrd: 221.509, change: 0, category: "food", icon: "sugar" },
  { key: "flour", name: "Flour (25kg)", lrd: 2215.092, change: 0, category: "food", icon: "wheat" },
  { key: "bread", name: "Bread (loaf)", lrd: 166.132, change: 0, category: "food", icon: "bread" },
  { key: "chicken", name: "Chicken (1kg)", lrd: 646.069, change: 0, category: "food", icon: "chicken" },
  { key: "fish", name: "Fish (1kg)", lrd: 738.364, change: 0, category: "food", icon: "fish" },
  { key: "eggs", name: "Eggs (tray)", lrd: 406.1, change: 0, category: "food", icon: "egg" },
  { key: "onions", name: "Onions (1kg)", lrd: 184.591, change: 0, category: "food", icon: "food" },
  { key: "cassava", name: "Cassava (kg)", lrd: 73.836, change: 0, category: "food", icon: "food" },
  { key: "tomato", name: "Tomato (1kg)", lrd: 221.509, change: 0, category: "food", icon: "tomato" },
  { key: "pepper", name: "Pepper (1kg)", lrd: 276.887, change: 0, category: "food", icon: "pepper" },
  { key: "plantain", name: "Plantain (bunch)", lrd: 332.264, change: 0, category: "food", icon: "plantain" },
  { key: "beans", name: "Beans (1kg)", lrd: 369.182, change: 0, category: "food", icon: "wheat" },
  { key: "beef", name: "Beef (1kg)", lrd: 922.955, change: 0, category: "food", icon: "beef" },
  { key: "milk", name: "Milk (1L)", lrd: 461.478, change: 0, category: "food", icon: "milk" },
  { key: "potato", name: "Potato (1kg)", lrd: 184.591, change: 0, category: "food", icon: "potato" },
  { key: "stock-cubes", name: "Stock Cubes (pack)", lrd: 147.673, change: 0, category: "food", icon: "food" },
  { key: "spaghetti", name: "Spaghetti (500g)", lrd: 184.591, change: 0, category: "food", icon: "wheat" },
  { key: "sardines", name: "Sardines (tin)", lrd: 221.509, change: 0, category: "food", icon: "fish" },
  { key: "greens", name: "Greens (bundle)", lrd: 92.296, change: 0, category: "food", icon: "greens" },
  { key: "sweet-potato", name: "Sweet Potato (kg)", lrd: 92.296, change: 0, category: "food", icon: "potato" },
  // Fuel
  { key: "gas", name: "Gallon of Gas", lrd: 766.053, change: 0, category: "fuel", icon: "fuel" },
  { key: "diesel", name: "Gallon of Diesel", lrd: 821.43, change: 0, category: "fuel", icon: "fuel" },
  { key: "kerosene", name: "Kerosene (gallon)", lrd: 516.855, change: 0, category: "fuel", icon: "fuel" },
  { key: "cooking-gas", name: "Cooking Gas (14kg)", lrd: 3876.411, change: 0, category: "fuel", icon: "gas" },
  { key: "charcoal", name: "Charcoal (bag)", lrd: 1476.728, change: 0, category: "fuel", icon: "charcoal" },
  // Build (construction)
  { key: "cement", name: "Cement (50kg)", lrd: 1569.024, change: 0, category: "construction", icon: "cement" },
  { key: "steel", name: "Steel Rods (bundle)", lrd: 71067.535, change: 0, category: "construction", icon: "steel" },
  { key: "nails", name: "Nails (1kg)", lrd: 461.478, change: 0, category: "construction", icon: "steel" },
  { key: "paint", name: "Paint (gallon)", lrd: 4614.775, change: 0, category: "construction", icon: "paint" },
  { key: "plywood", name: "Plywood (sheet)", lrd: 6460.685, change: 0, category: "construction", icon: "plywood" },
  { key: "sand", name: "Sand (bag)", lrd: 553.773, change: 0, category: "construction", icon: "sand" },
  { key: "roofing-sheet", name: "Roofing Sheet (zinc)", lrd: 5168.548, change: 0, category: "construction", icon: "steel" },
  { key: "binding-wire", name: "Binding Wire (roll)", lrd: 3322.638, change: 0, category: "construction", icon: "steel" },
  { key: "door", name: "Door (standard)", lrd: 15690.235, change: 0, category: "construction", icon: "door" },
  { key: "window", name: "Window (standard)", lrd: 10152.505, change: 0, category: "construction", icon: "door" },
  { key: "paint-brush", name: "Paint Brush", lrd: 369.182, change: 0, category: "construction", icon: "paint" },
  { key: "gravel", name: "Gravel (bag)", lrd: 738.364, change: 0, category: "construction", icon: "sand" },
  // Household
  { key: "soap", name: "Laundry Soap (bar)", lrd: 92.296, change: 0, category: "household", icon: "soap" },
  { key: "salt", name: "Salt (1kg)", lrd: 110.755, change: 0, category: "household", icon: "salt" },
  { key: "toilet-soap", name: "Toilet Soap (bar)", lrd: 73.836, change: 0, category: "household", icon: "soap" },
  { key: "toothpaste", name: "Toothpaste (tube)", lrd: 276.887, change: 0, category: "household", icon: "toothpaste" },
  { key: "matches", name: "Matches (box)", lrd: 27.689, change: 0, category: "household", icon: "matches" },
  { key: "candles", name: "Candles (pack)", lrd: 147.673, change: 0, category: "household", icon: "candles" },
  { key: "mosquito-coil", name: "Mosquito Coil (pack)", lrd: 184.591, change: 0, category: "household", icon: "mosquito" },
  { key: "bleach", name: "Bleach (bottle)", lrd: 221.509, change: 0, category: "household", icon: "bleach" },
  { key: "washing-powder", name: "Washing Powder (1kg)", lrd: 461.478, change: 0, category: "household", icon: "soap" },
  { key: "toilet-paper", name: "Toilet Paper (roll)", lrd: 129.214, change: 0, category: "household", icon: "toilet-paper" },
  { key: "sanitary-pads", name: "Sanitary Pads (pack)", lrd: 369.182, change: 0, category: "household", icon: "sanitary" },
  { key: "batteries", name: "Batteries (pack of 4)", lrd: 276.887, change: 0, category: "household", icon: "batteries" },
  { key: "plastic-bucket", name: "Plastic Bucket", lrd: 553.773, change: 0, category: "household", icon: "bucket" },
  // Transport
  { key: "taxi-short", name: "Taxi (short trip, Monrovia)", lrd: 250, change: 0, category: "transport", icon: "fuel" },
  { key: "taxi-long", name: "Taxi (long trip, city)", lrd: 500, change: 0, category: "transport", icon: "fuel" },
  { key: "bus-city", name: "Bus (city route)", lrd: 75, change: 0, category: "transport", icon: "fuel" },
  { key: "motorcycle-short", name: "Motorcycle taxi (short)", lrd: 150, change: 0, category: "transport", icon: "fuel" },
]

export async function GET() {
  const { rate, sources, timestamp } = await getAggregatedRate()

  const lisgis = await fetchLisgisPrices()
  if (lisgis?.items?.length) {
    const lrdValues = lisgis.items.map((i) => i.priceLRD ?? 0).filter((v) => v > 0)
    const allSame = lrdValues.length > 0 && lrdValues.every((v) => v === lrdValues[0])
    const allSuspiciouslyLow = lrdValues.length > 0 && lrdValues.every((v) => v < 500)
    if (!allSame && !allSuspiciouslyLow) {
      const items = lisgis.items.map((item) => ({
        key: (item.key ?? item.name?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") ?? "") || undefined,
        name: item.name,
        category: item.category,
        change: item.change ?? 0,
        priceLRD: item.priceLRD ?? 0,
        priceUSD: (item.priceLRD ?? 0) / rate,
        icon: item.icon,
      }))
      return NextResponse.json({
        rate,
        updatedAt: lisgis.lastUpdated ?? timestamp,
        referenceMonth: lisgis.referenceMonth,
        sources: ["LISGIS", "Ministry of Commerce"],
        sourceUrl: "https://lisgis.gov.lr/pricestats.php",
        priceIndexBasketId: PRICE_INDEX_BASKET_ID,
        items,
      })
    }
  }

  const items = BASE_ITEMS.map((item) => {
    const lrd = item.lrd ?? 0
    return {
      key: item.key,
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
    priceIndexBasketId: PRICE_INDEX_BASKET_ID,
    items,
  })
}
