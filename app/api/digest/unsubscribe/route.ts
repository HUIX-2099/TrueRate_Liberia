import { NextResponse } from "next/server"
import { removeSubscriber } from "@/lib/digest/subscribers"

export const dynamic = "force-dynamic"
export const revalidate = 0

/**
 * POST /api/digest/unsubscribe
 * Body: { email: string }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email =
      typeof body?.email === "string" && body.email.includes("@")
        ? body.email.trim().toLowerCase().slice(0, 128)
        : null

    if (!email) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 }
      )
    }

    const removed = removeSubscriber(email)
    return NextResponse.json({
      ok: true,
      message: removed ? "Unsubscribed" : "Email was not subscribed",
    })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
