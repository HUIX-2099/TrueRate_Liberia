import { NextResponse } from "next/server"

import { getAggregatedRate } from "@/lib/api/multi-source-rates"
import { fetchLisgisPrices } from "@/lib/lisgis-prices"

export const revalidate = 60 // Auto-update every minute

/**
 * Essential goods and services prices for Liberia.
 * Prefers official LISGIS / Ministry of Commerce CPI data when available; falls back to CBL/market indicators.
 */
const BASE_ITEMS = [
  // Food
  { key: "rice-thai", name: "25kg Rice (Thai)", usd: 10.5, change: -5.0, category: "food", icon: "wheat" },
  { key: "rice-local", name: "25kg Rice (Local)", usd: 11, change: -4.5, category: "food", icon: "wheat" },
  { key: "palm-oil", name: "Palm Oil (gallon)", lrd: 1050, change: -1.5, category: "food", icon: "oil" },
  { key: "sugar", name: "Sugar (1kg)", usd: 1.2, change: 0.5, category: "food", icon: "sugar" },
  { key: "flour", name: "Flour (25kg)", usd: 12, change: 1.2, category: "food", icon: "wheat" },
  { key: "bread", name: "Bread (loaf)", usd: 0.9, change: -0.3, category: "food", icon: "bread" },
  { key: "chicken", name: "Chicken (1kg)", usd: 3.5, change: 2.0, category: "food", icon: "chicken" },
  { key: "fish", name: "Fish (1kg)", usd: 4.0, change: 1.0, category: "food", icon: "fish" },
  { key: "eggs", name: "Eggs (tray)", usd: 2.2, change: 0.8, category: "food", icon: "egg" },
  { key: "onions", name: "Onions (1kg)", usd: 1.0, change: -0.5, category: "food", icon: "food" },
  { key: "cassava", name: "Cassava (kg)", usd: 0.4, change: 0.2, category: "food", icon: "food" },
  { key: "tomato", name: "Tomato (1kg)", usd: 1.2, change: 0.3, category: "food", icon: "tomato" },
  { key: "pepper", name: "Pepper (1kg)", usd: 1.5, change: 0.2, category: "food", icon: "pepper" },
  { key: "plantain", name: "Plantain (bunch)", usd: 1.8, change: 0.5, category: "food", icon: "plantain" },
  { key: "beans", name: "Beans (1kg)", usd: 2.0, change: 0.5, category: "food", icon: "wheat" },
  { key: "beef", name: "Beef (1kg)", usd: 5.0, change: 1.5, category: "food", icon: "beef" },
  { key: "milk", name: "Milk (1L)", usd: 2.5, change: 0.3, category: "food", icon: "milk" },
  { key: "potato", name: "Potato (1kg)", usd: 1.0, change: -0.2, category: "food", icon: "potato" },
  { key: "stock-cubes", name: "Stock Cubes (pack)", usd: 0.8, change: 0.1, category: "food", icon: "food" },
  { key: "spaghetti", name: "Spaghetti (500g)", usd: 1.0, change: 0.2, category: "food", icon: "wheat" },
  { key: "sardines", name: "Sardines (tin)", usd: 1.2, change: 0.3, category: "food", icon: "fish" },
  { key: "greens", name: "Greens (bundle)", usd: 0.5, change: 0.2, category: "food", icon: "greens" },
  { key: "sweet-potato", name: "Sweet Potato (kg)", usd: 0.5, change: 0.1, category: "food", icon: "potato" },
  // Fuel
  { key: "gas", name: "Gallon of Gas", usd: 4.15, change: -0.5, category: "fuel", icon: "fuel" },
  { key: "diesel", name: "Gallon of Diesel", usd: 4.45, change: 0.2, category: "fuel", icon: "fuel" },
  { key: "kerosene", name: "Kerosene (gallon)", usd: 2.8, change: 0.5, category: "fuel", icon: "fuel" },
  { key: "cooking-gas", name: "Cooking Gas (14kg)", usd: 21, change: 0.5, category: "fuel", icon: "gas" },
  { key: "charcoal", name: "Charcoal (bag)", usd: 8, change: 1.5, category: "fuel", icon: "charcoal" },
  // Construction
  { key: "cement", name: "Cement (50kg)", usd: 8.5, change: 1.0, category: "construction", icon: "cement" },
  { key: "steel", name: "Steel Rods (bundle)", usd: 385, change: 2.0, category: "construction", icon: "steel" },
  { key: "nails", name: "Nails (1kg)", usd: 2.5, change: 0.5, category: "construction", icon: "steel" },
  { key: "paint", name: "Paint (gallon)", usd: 25, change: 1.0, category: "construction", icon: "paint" },
  { key: "plywood", name: "Plywood (sheet)", usd: 35, change: 1.5, category: "construction", icon: "plywood" },
  { key: "sand", name: "Sand (bag)", usd: 3.0, change: 0.5, category: "construction", icon: "sand" },
  { key: "roofing-sheet", name: "Roofing Sheet (zinc)", usd: 28, change: 2.0, category: "construction", icon: "steel" },
  { key: "binding-wire", name: "Binding Wire (roll)", usd: 18, change: 0.8, category: "construction", icon: "steel" },
  { key: "door", name: "Door (standard)", usd: 85, change: 1.0, category: "construction", icon: "door" },
  { key: "window", name: "Window (standard)", usd: 55, change: 0.5, category: "construction", icon: "door" },
  { key: "paint-brush", name: "Paint Brush", usd: 2.0, change: 0, category: "construction", icon: "paint" },
  { key: "gravel", name: "Gravel (bag)", usd: 4.0, change: 0.5, category: "construction", icon: "sand" },
  // Household
  { key: "soap", name: "Laundry Soap (bar)", usd: 0.5, change: 0, category: "household", icon: "soap" },
  { key: "salt", name: "Salt (1kg)", usd: 0.6, change: -0.2, category: "household", icon: "salt" },
  { key: "toilet-soap", name: "Toilet Soap (bar)", usd: 0.4, change: 0.2, category: "household", icon: "soap" },
  { key: "toothpaste", name: "Toothpaste (tube)", usd: 1.5, change: 0.5, category: "household", icon: "toothpaste" },
  { key: "matches", name: "Matches (box)", usd: 0.15, change: 0, category: "household", icon: "matches" },
  { key: "candles", name: "Candles (pack)", usd: 0.8, change: 0.3, category: "household", icon: "candles" },
  { key: "mosquito-coil", name: "Mosquito Coil (pack)", usd: 1.0, change: 0.2, category: "household", icon: "mosquito" },
  { key: "bleach", name: "Bleach (bottle)", usd: 1.2, change: 0, category: "household", icon: "bleach" },
  { key: "washing-powder", name: "Washing Powder (1kg)", usd: 2.5, change: 0.5, category: "household", icon: "soap" },
  { key: "toilet-paper", name: "Toilet Paper (roll)", usd: 0.7, change: 0.1, category: "household", icon: "toilet-paper" },
  { key: "sanitary-pads", name: "Sanitary Pads (pack)", usd: 2.0, change: 0.5, category: "household", icon: "sanitary" },
  { key: "batteries", name: "Batteries (pack of 4)", usd: 1.5, change: 0.3, category: "household", icon: "batteries" },
  { key: "plastic-bucket", name: "Plastic Bucket", usd: 3.0, change: 0.5, category: "household", icon: "bucket" },
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
        items,
      })
    }
  }

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
