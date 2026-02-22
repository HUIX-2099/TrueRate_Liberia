import { NextResponse } from "next/server"
import {
  addPriceControlPolicy,
  updatePriceControlPolicy,
  getPriceControlPolicies,
  getPriceControlPolicyById,
  getDefaultNotifier,
} from "@/lib/regulatory"
import type { CreatePriceControlPolicyInput } from "@/lib/regulatory"

export const dynamic = "force-dynamic"
export const revalidate = 0

const notify = getDefaultNotifier()

/** GET /api/regulatory/price-control-policies — List price control policies. Query: status, type, effectiveOn, limit, id. */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") ?? undefined
    const type = searchParams.get("type") ?? undefined
    const effectiveOn = searchParams.get("effectiveOn") ?? undefined
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined
    const id = searchParams.get("id") ?? undefined

    if (id) {
      const one = getPriceControlPolicyById(id)
      if (!one) return NextResponse.json({ error: "Not found", id }, { status: 404 })
      return NextResponse.json({ priceControl: one })
    }

    const list = getPriceControlPolicies({ status, type, effectiveOn, limit })
    return NextResponse.json({ priceControlPolicies: list, count: list.length })
  } catch (error) {
    console.error("[Regulatory price-control GET]", error)
    return NextResponse.json(
      { error: "Failed to list price control policies", detail: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    )
  }
}

/** POST /api/regulatory/price-control-policies — Create or update a price control policy. */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>
    const id = typeof body.id === "string" ? body.id : null

    if (id) {
      const { id: _id, ...patch } = body
      const updated = updatePriceControlPolicy(id, patch as Parameters<typeof updatePriceControlPolicy>[1], notify)
      if (!updated) return NextResponse.json({ error: "Not found", id }, { status: 404 })
      return NextResponse.json({ priceControl: updated })
    }

    const input = body as unknown as CreatePriceControlPolicyInput
    if (!input.title || !input.effectiveFrom || !input.status || !Array.isArray(input.affectedItems)) {
      return NextResponse.json(
        { error: "Missing required fields: title, effectiveFrom, status, affectedItems" },
        { status: 400 }
      )
    }
    const created = addPriceControlPolicy(input, notify)
    return NextResponse.json({ priceControl: created }, { status: 201 })
  } catch (error) {
    console.error("[Regulatory price-control POST]", error)
    return NextResponse.json(
      { error: "Failed to save price control policy", detail: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    )
  }
}
