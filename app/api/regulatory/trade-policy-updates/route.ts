import { NextResponse } from "next/server"
import {
  addTradePolicyUpdate,
  updateTradePolicyUpdate,
  getTradePolicyUpdates,
  getTradePolicyUpdateById,
  getDefaultNotifier,
} from "@/lib/regulatory"
import type { CreateTradePolicyUpdateInput } from "@/lib/regulatory"

export const dynamic = "force-dynamic"
export const revalidate = 0

const notify = getDefaultNotifier()

/** GET /api/regulatory/trade-policy-updates — List trade policy updates. Query: status, type, effectiveFrom, limit. */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") ?? undefined
    const type = searchParams.get("type") ?? undefined
    const effectiveFrom = searchParams.get("effectiveFrom") ?? undefined
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined
    const id = searchParams.get("id") ?? undefined

    if (id) {
      const one = getTradePolicyUpdateById(id)
      if (!one) return NextResponse.json({ error: "Not found", id }, { status: 404 })
      return NextResponse.json({ tradePolicy: one })
    }

    const list = getTradePolicyUpdates({ status, type, effectiveFrom, limit })
    return NextResponse.json({ tradePolicies: list, count: list.length })
  } catch (error) {
    console.error("[Regulatory trade-policy GET]", error)
    return NextResponse.json(
      { error: "Failed to list trade policy updates", detail: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    )
  }
}

/** POST /api/regulatory/trade-policy-updates — Create or update a trade policy. Body: CreateTradePolicyUpdateInput or { id, ...patch }. */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>
    const id = typeof body.id === "string" ? body.id : null

    if (id) {
      const { id: _id, ...patch } = body
      const updated = updateTradePolicyUpdate(id, patch as Parameters<typeof updateTradePolicyUpdate>[1], notify)
      if (!updated) return NextResponse.json({ error: "Not found", id }, { status: 404 })
      return NextResponse.json({ tradePolicy: updated })
    }

    const input = body as unknown as CreateTradePolicyUpdateInput
    if (!input.title || !input.effectiveDate || !input.status) {
      return NextResponse.json(
        { error: "Missing required fields: title, effectiveDate, status" },
        { status: 400 }
      )
    }
    const created = addTradePolicyUpdate(input, notify)
    return NextResponse.json({ tradePolicy: created }, { status: 201 })
  } catch (error) {
    console.error("[Regulatory trade-policy POST]", error)
    return NextResponse.json(
      { error: "Failed to save trade policy", detail: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    )
  }
}
