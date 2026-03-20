import { NextResponse, type NextRequest } from "next/server"
import { INVESTMENT_OPPORTUNITIES, type InvestmentOpportunity } from "@/components/invest/investment-opportunities"
import { z } from "zod"

export const dynamic = "force-dynamic"

const filterSchema = z.object({
  riskLevel: z.enum(["All", "Low", "Medium", "High"]).optional(),
  sector: z.string().optional(),
  region: z.string().optional(),
  minReturn: z.coerce.number().min(0).max(100).optional(),
  maxReturn: z.coerce.number().min(0).max(100).optional(),
})

/** GET /api/invest/opportunities — filterable investment opportunities */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const filters = filterSchema.safeParse(Object.fromEntries(searchParams))

  // When DATABASE_URL is set, fetch from DB. Otherwise use hardcoded seeded data.
  let opportunities: InvestmentOpportunity[] = []

  if (process.env.DATABASE_URL) {
    try {
      const { getPrismaClient } = await import("@/lib/db/prisma")
      const prisma = getPrismaClient()
      if (prisma) {
        const rows = await (prisma as Record<string, unknown> as { investmentOpportunity: { findMany: (opts: unknown) => Promise<unknown[]> } }).investmentOpportunity.findMany({ orderBy: { expectedReturnPct: "desc" } })
        opportunities = rows as unknown as InvestmentOpportunity[]
      }
    } catch {
      opportunities = INVESTMENT_OPPORTUNITIES
    }
  } else {
    opportunities = INVESTMENT_OPPORTUNITIES
  }

  if (filters.success) {
    const f = filters.data
    if (f.riskLevel && f.riskLevel !== "All") {
      opportunities = opportunities.filter((o) => o.riskLevel === f.riskLevel)
    }
    if (f.sector) {
      opportunities = opportunities.filter((o) => o.sector.toLowerCase().includes(f.sector!.toLowerCase()))
    }
    if (f.region) {
      opportunities = opportunities.filter((o) => o.region.toLowerCase().includes(f.region!.toLowerCase()))
    }
    if (f.minReturn != null) {
      opportunities = opportunities.filter((o) => o.expectedReturnPct >= f.minReturn!)
    }
    if (f.maxReturn != null) {
      opportunities = opportunities.filter((o) => o.expectedReturnPct <= f.maxReturn!)
    }
  }

  const summary = {
    total: opportunities.length,
    avgExpectedReturn: opportunities.length > 0
      ? Number((opportunities.reduce((s, o) => s + o.expectedReturnPct, 0) / opportunities.length).toFixed(1))
      : 0,
    avgRiskScore: opportunities.length > 0
      ? Number((opportunities.reduce((s, o) => s + o.riskScore, 0) / opportunities.length).toFixed(1))
      : 0,
    byRisk: {
      Low: opportunities.filter((o) => o.riskLevel === "Low").length,
      Medium: opportunities.filter((o) => o.riskLevel === "Medium").length,
      High: opportunities.filter((o) => o.riskLevel === "High").length,
    },
  }

  return NextResponse.json({ opportunities, summary, timestamp: new Date().toISOString() })
}

/** POST /api/invest/opportunities — admin: add opportunity (DB only) */
export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 })
  }

  try {
    const body = await request.json()
    const { getPrismaClient } = await import("@/lib/db/prisma")
    const prisma = getPrismaClient()
    if (!prisma) return NextResponse.json({ error: "DB unavailable" }, { status: 503 })

    const opp = await (prisma as Record<string, unknown> as { investmentOpportunity: { create: (opts: unknown) => Promise<unknown> } }).investmentOpportunity.create({ data: body })
    return NextResponse.json({ ok: true, opportunity: opp }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
