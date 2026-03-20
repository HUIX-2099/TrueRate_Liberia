import { NextResponse } from "next/server"
import { computeCascadeImpact } from "@/lib/crisis/cascade-model"

export const dynamic = "force-dynamic"

/** GET /api/crisis/cascade?fuelChange=20&rate=190 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const fuelChange = Number.parseFloat(searchParams.get("fuelChange") ?? "20")
    const rate = Number.parseFloat(searchParams.get("rate") ?? "190")

    if (Number.isNaN(fuelChange) || Number.isNaN(rate)) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 })
    }

    const result = computeCascadeImpact(fuelChange, rate)
    return NextResponse.json(result)
  } catch (error) {
    console.error("[Crisis cascade]", error)
    return NextResponse.json(
      { error: "Cascade computation failed", detail: error instanceof Error ? error.message : "Unknown" },
      { status: 500 },
    )
  }
}
