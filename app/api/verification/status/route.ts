import { NextResponse } from "next/server"
import { getVerificationMap, getVerifiedBusinessIds } from "@/lib/verification"

/**
 * GET /api/verification/status
 * Query: ids=1,2,3 (optional) — comma-separated business/changer IDs.
 * Returns: { verifiedIds: string[] } when no ids param, or { status: { "1": true, "2": false } } when ids provided.
 */
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const idsParam = url.searchParams.get("ids")

    if (!idsParam || idsParam.trim() === "") {
      const verifiedIds = getVerifiedBusinessIds()
      return NextResponse.json({ verifiedIds })
    }

    const ids = idsParam.split(",").map((s) => s.trim()).filter(Boolean)
    const status = getVerificationMap(ids)
    return NextResponse.json({ status })
  } catch (error) {
    console.error("Verification status error:", error)
    return NextResponse.json(
      { error: "Unable to fetch verification status" },
      { status: 500 },
    )
  }
}
