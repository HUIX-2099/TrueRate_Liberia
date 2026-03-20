import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

interface AvailabilityReport {
  id: string
  itemType: "fuel" | "rice" | "cooking_gas" | "water" | "other"
  itemName: string
  available: boolean
  price?: number
  currency: "LRD" | "USD"
  location: string
  county: string
  lat?: number
  lng?: number
  waitTime?: string
  notes: string
  upvotes: number
  reportedAt: string
}

const reports: AvailabilityReport[] = [
  {
    id: "a1",
    itemType: "fuel",
    itemName: "Fuel (PMS)",
    available: true,
    price: 900,
    currency: "LRD",
    location: "Total Gas Station, Sinkor",
    county: "Montserrado",
    lat: 6.312,
    lng: -10.798,
    waitTime: "30 min queue",
    notes: "Open but long lines. Limit 5 gallons per vehicle.",
    upvotes: 18,
    reportedAt: new Date(Date.now() - 30 * 60_000).toISOString(),
  },
  {
    id: "a2",
    itemType: "fuel",
    itemName: "Fuel (PMS)",
    available: false,
    currency: "LRD",
    location: "NP Gas Station, Paynesville",
    county: "Montserrado",
    lat: 6.325,
    lng: -10.75,
    notes: "Ran out this morning. No ETA for restock.",
    upvotes: 12,
    reportedAt: new Date(Date.now() - 90 * 60_000).toISOString(),
  },
  {
    id: "a3",
    itemType: "rice",
    itemName: "Rice (25kg bag)",
    available: true,
    price: 4300,
    currency: "LRD",
    location: "Gobachop Market",
    county: "Montserrado",
    lat: 6.298,
    lng: -10.78,
    notes: "Multiple vendors have stock. Prices vary 4,100-4,500 LRD.",
    upvotes: 25,
    reportedAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
  },
  {
    id: "a4",
    itemType: "cooking_gas",
    itemName: "Cooking Gas (LPG 14kg)",
    available: true,
    price: 6000,
    currency: "LRD",
    location: "Congo Town, opposite ELWA junction",
    county: "Montserrado",
    lat: 6.305,
    lng: -10.78,
    waitTime: "No wait",
    notes: "Available but price went up from 5,500 last week.",
    upvotes: 8,
    reportedAt: new Date(Date.now() - 4 * 3600_000).toISOString(),
  },
  {
    id: "a5",
    itemType: "fuel",
    itemName: "Diesel",
    available: true,
    price: 850,
    currency: "LRD",
    location: "LBDI Gas Station, Bushrod Island",
    county: "Montserrado",
    lat: 6.34,
    lng: -10.81,
    waitTime: "15 min",
    notes: "Diesel available. PMS sold out.",
    upvotes: 15,
    reportedAt: new Date(Date.now() - 45 * 60_000).toISOString(),
  },
]

/** GET /api/community/availability */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const itemType = searchParams.get("type") ?? undefined

  let list = [...reports]
  if (itemType) list = list.filter((r) => r.itemType === itemType)

  list.sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime())

  return NextResponse.json({ reports: list, total: list.length })
}

/** POST /api/community/availability */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const report: AvailabilityReport = {
      id: `a_${Date.now()}`,
      itemType: body.itemType ?? "other",
      itemName: body.itemName ?? "Unknown",
      available: body.available ?? true,
      price: typeof body.price === "number" ? body.price : undefined,
      currency: body.currency ?? "LRD",
      location: body.location ?? "Unknown",
      county: body.county ?? "Montserrado",
      lat: typeof body.lat === "number" ? body.lat : undefined,
      lng: typeof body.lng === "number" ? body.lng : undefined,
      waitTime: body.waitTime,
      notes: body.notes ?? "",
      upvotes: 0,
      reportedAt: new Date().toISOString(),
    }

    reports.push(report)
    return NextResponse.json({ success: true, report })
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit report" }, { status: 400 })
  }
}
