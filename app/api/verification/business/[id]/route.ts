import { NextResponse } from "next/server"
import { getVerificationStatus } from "@/lib/verification"

/**
 * GET /api/verification/business/[id]
 * Returns verification status for a single business/changer.
 */
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: "Missing business id" }, { status: 400 })
    }
    const status = getVerificationStatus(id)
    return NextResponse.json(status)
  } catch (error) {
    console.error("Verification business error:", error)
    return NextResponse.json(
      { error: "Unable to fetch verification status" },
      { status: 500 },
    )
  }
}
