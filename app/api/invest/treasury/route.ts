import { NextResponse, type NextRequest } from "next/server"
import { z } from "zod"
import {
  TREASURY_SECURITIES,
  YIELD_CURVE,
  AUCTION_CALENDAR,
  getTreasurySummary,
  type TreasurySecurity,
} from "@/lib/treasury/data"

export const dynamic = "force-dynamic"

const filterSchema = z.object({
  type: z.enum(["All", "T-Bill", "Bond"]).optional(),
  status: z.enum(["All", "Open", "Upcoming", "Closed", "Matured"]).optional(),
  minYield: z.coerce.number().min(0).max(100).optional(),
  maxYield: z.coerce.number().min(0).max(100).optional(),
  maxTenorDays: z.coerce.number().min(1).optional(),
})

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const filters = filterSchema.safeParse(Object.fromEntries(searchParams))

  let securities: TreasurySecurity[] = [...TREASURY_SECURITIES]

  if (filters.success) {
    const f = filters.data
    if (f.type && f.type !== "All") {
      securities = securities.filter((s) => s.type === f.type)
    }
    if (f.status && f.status !== "All") {
      securities = securities.filter((s) => s.status === f.status)
    }
    if (f.minYield != null) {
      securities = securities.filter((s) => s.yield >= f.minYield!)
    }
    if (f.maxYield != null) {
      securities = securities.filter((s) => s.yield <= f.maxYield!)
    }
    if (f.maxTenorDays != null) {
      securities = securities.filter((s) => s.tenorDays <= f.maxTenorDays!)
    }
  }

  return NextResponse.json({
    securities,
    yieldCurve: YIELD_CURVE,
    auctionCalendar: AUCTION_CALENDAR,
    summary: getTreasurySummary(securities),
    timestamp: new Date().toISOString(),
  })
}
