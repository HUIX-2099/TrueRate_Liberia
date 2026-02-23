import { NextResponse } from "next/server"
import { addSubscriber } from "@/lib/digest/subscribers"

export const dynamic = "force-dynamic"
export const revalidate = 0

/**
 * POST /api/digest/subscribe
 * Body: { email: string, frequency: "daily" | "weekly" }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email =
      typeof body?.email === "string" && body.email.includes("@")
        ? body.email.trim().slice(0, 128)
        : null
    const frequency = body?.frequency === "daily" || body?.frequency === "weekly" ? body.frequency : "weekly"

    if (!email) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 }
      )
    }

    const sub = addSubscriber(email, frequency)
    return NextResponse.json({
      ok: true,
      message: "Subscribed to digest",
      email: sub.email,
      frequency: sub.frequency,
    })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
