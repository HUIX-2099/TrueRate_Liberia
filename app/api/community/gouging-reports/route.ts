import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

interface GougingReport {
  id: string
  itemName: string
  reportedPrice: number
  fairPrice: number
  overchargePercent: number
  location: string
  county: string
  lat?: number
  lng?: number
  description: string
  upvotes: number
  downvotes: number
  verified: boolean
  createdAt: string
}

const reports: GougingReport[] = [
  {
    id: "g1",
    itemName: "Fuel (PMS)",
    reportedPrice: 1050,
    fairPrice: 900,
    overchargePercent: 16.7,
    location: "Sinkor Gas Station, Tubman Blvd",
    county: "Montserrado",
    lat: 6.3106,
    lng: -10.7969,
    description: "Charging 1,050 LRD per gallon when regulated price is 900 LRD",
    upvotes: 34,
    downvotes: 2,
    verified: true,
    createdAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
  },
  {
    id: "g2",
    itemName: "Rice (25kg bag)",
    reportedPrice: 5200,
    fairPrice: 4200,
    overchargePercent: 23.8,
    location: "Red Light Market",
    county: "Montserrado",
    lat: 6.3,
    lng: -10.82,
    description: "25kg rice bag being sold at 5,200 LRD — far above market average",
    upvotes: 21,
    downvotes: 5,
    verified: false,
    createdAt: new Date(Date.now() - 5 * 3600_000).toISOString(),
  },
  {
    id: "g3",
    itemName: "Taxi fare",
    reportedPrice: 250,
    fairPrice: 150,
    overchargePercent: 66.7,
    location: "Broad Street to Sinkor",
    county: "Montserrado",
    lat: 6.315,
    lng: -10.805,
    description: "Taxi drivers charging 250 LRD for a route that used to be 150 LRD",
    upvotes: 45,
    downvotes: 8,
    verified: true,
    createdAt: new Date(Date.now() - 8 * 3600_000).toISOString(),
  },
  {
    id: "g4",
    itemName: "Cooking gas (14kg)",
    reportedPrice: 7500,
    fairPrice: 5500,
    overchargePercent: 36.4,
    location: "Paynesville Junction",
    county: "Montserrado",
    lat: 6.328,
    lng: -10.75,
    description: "LPG cylinder refill at 7,500 LRD — exploiting shortage",
    upvotes: 28,
    downvotes: 1,
    verified: true,
    createdAt: new Date(Date.now() - 12 * 3600_000).toISOString(),
  },
]

/** GET /api/community/gouging-reports */
export async function GET() {
  const list = [...reports].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
  return NextResponse.json({ reports: list, total: list.length })
}

/** POST /api/community/gouging-reports */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const report: GougingReport = {
      id: `g_${Date.now()}`,
      itemName: body.itemName ?? "Unknown",
      reportedPrice: Number(body.reportedPrice) || 0,
      fairPrice: Number(body.fairPrice) || 0,
      overchargePercent: 0,
      location: body.location ?? "Unknown",
      county: body.county ?? "Montserrado",
      lat: typeof body.lat === "number" ? body.lat : undefined,
      lng: typeof body.lng === "number" ? body.lng : undefined,
      description: body.description ?? "",
      upvotes: 0,
      downvotes: 0,
      verified: false,
      createdAt: new Date().toISOString(),
    }
    if (report.fairPrice > 0) {
      report.overchargePercent = Number(
        (((report.reportedPrice - report.fairPrice) / report.fairPrice) * 100).toFixed(1),
      )
    }

    reports.push(report)
    return NextResponse.json({ success: true, report })
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit report" }, { status: 400 })
  }
}
