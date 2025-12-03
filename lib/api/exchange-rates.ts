import { unstable_cache } from "next/cache"

const EXCHANGE_RATE_API_KEY = process.env.EXCHANGE_RATE_API_KEY || "demo"
const BASE_URL = "https://v6.exchangerate-api.com/v6"

export interface ExchangeRateData {
  base: string
  target: string
  rate: number
  lastUpdate: string
  source: string
}

export interface HistoricalRateData {
  date: string
  rate: number
}

// Fetch live exchange rate from ExchangeRate-API
async function fetchLiveRate(): Promise<ExchangeRateData> {
  try {
    const response = await fetch(`${BASE_URL}/${EXCHANGE_RATE_API_KEY}/pair/USD/LRD`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rate")
    }

    const data = await response.json()

    return {
      base: "USD",
      target: "LRD",
      rate: data.conversion_rate || 185.5,
      lastUpdate: new Date().toISOString(),
      source: "ExchangeRate-API",
    }
  } catch (error) {
    console.error("[v0] Error fetching live rate:", error)
    // Fallback to mock data
    return {
      base: "USD",
      target: "LRD",
      rate: 185.5,
      lastUpdate: new Date().toISOString(),
      source: "Fallback",
    }
  }
}

// Cache the live rate fetch
export const getLiveExchangeRate = unstable_cache(async () => fetchLiveRate(), ["live-exchange-rate"], {
  revalidate: 3600, // 1 hour
  tags: ["exchange-rate"],
})

// Get historical rates (simulated with variations)
export async function getHistoricalRates(days = 30): Promise<HistoricalRateData[]> {
  const currentRate = (await getLiveExchangeRate()).rate
  const data: HistoricalRateData[] = []

  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    // Add realistic variance
    const variance = (Math.random() - 0.5) * 10
    const rate = currentRate + variance - i * 0.1 // Gradual trend

    data.push({
      date: date.toISOString().split("T")[0],
      rate: Number.parseFloat(rate.toFixed(2)),
    })
  }

  return data
}

// Get rates from multiple money changers (simulated with real API as base)
export async function getMoneyChangerRates() {
  const baseRate = (await getLiveExchangeRate()).rate

  return [
    {
      id: "1",
      name: "Central Bank of Liberia",
      location: "Broad Street, Monrovia",
      buyRate: baseRate - 2,
      sellRate: baseRate + 2,
      rating: 5.0,
      verified: true,
      reviews: 1250,
      lastUpdate: new Date().toISOString(),
      trend: "stable",
    },
    {
      id: "2",
      name: "First International Bank",
      location: "Carey Street, Monrovia",
      buyRate: baseRate - 3,
      sellRate: baseRate + 3,
      rating: 4.8,
      verified: true,
      reviews: 892,
      lastUpdate: new Date().toISOString(),
      trend: "up",
    },
    {
      id: "3",
      name: "Lonestar Money Transfer",
      location: "Randall Street, Monrovia",
      buyRate: baseRate - 4,
      sellRate: baseRate + 4,
      rating: 4.6,
      verified: true,
      reviews: 634,
      lastUpdate: new Date().toISOString(),
      trend: "down",
    },
    {
      id: "4",
      name: "Orange Money Exchange",
      location: "Tubman Boulevard, Sinkor",
      buyRate: baseRate - 5,
      sellRate: baseRate + 5,
      rating: 4.7,
      verified: true,
      reviews: 521,
      lastUpdate: new Date().toISOString(),
      trend: "stable",
    },
    {
      id: "5",
      name: "Red Light Market Changers",
      location: "Red Light Market, Paynesville",
      buyRate: baseRate - 8,
      sellRate: baseRate + 6,
      rating: 4.2,
      verified: false,
      reviews: 287,
      lastUpdate: new Date().toISOString(),
      trend: "up",
    },
  ]
}
