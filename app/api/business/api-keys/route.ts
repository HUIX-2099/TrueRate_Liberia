import { NextResponse } from "next/server"
import { registerApiKey } from "@/lib/api/business-auth"

function generateKey(): string {
  const prefix = "tr_"
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
  let s = prefix
  for (let i = 0; i < 24; i++) s += chars[Math.floor(Math.random() * chars.length)]
  return s
}

/**
 * POST: Create an API key. Body: { name?: string, email?: string }
 * In production, validate email and store in DB; for now we just issue a key.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const name = typeof body?.name === "string" ? body.name.trim().slice(0, 100) : ""
    const email = typeof body?.email === "string" ? body.email.trim().slice(0, 128) : ""

    const key = generateKey()
    registerApiKey(key)

    return NextResponse.json({
      api_key: key,
      message: "Use this key in the Authorization header (Bearer) or as the api_key query parameter. Keep it secret.",
    })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
