import { NextResponse } from "next/server"

/**
 * In-memory store for notification preferences (push rules + digest).
 * Key by a simple client id (e.g. from cookie or localStorage); replace with DB + userId in production.
 */
const store = new Map<
  string,
  {
    rateAbove?: number
    rateBelow?: number
    moveUpPct?: number
    moveDownPct?: number
    digest: "none" | "daily" | "weekly"
    digestEmail?: string
    updatedAt: string
  }
>()

const DEFAULT_PREFS = {
  digest: "none" as const,
  updatedAt: new Date().toISOString(),
}

function getClientId(request: Request): string {
  const header = request.headers.get("x-notification-client-id")
  if (header) return header.slice(0, 64)
  return "anonymous"
}

export async function GET(request: Request) {
  const clientId = getClientId(request)
  const prefs = store.get(clientId) ?? DEFAULT_PREFS
  return NextResponse.json({
    ...prefs,
    digest: prefs.digest ?? "none",
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const clientId = getClientId(request)

    const rateAbove =
      body?.rateAbove === null || body?.rateAbove === ""
      ? null
      : typeof body?.rateAbove === "number" && body.rateAbove > 0 && body.rateAbove < 500
        ? body.rateAbove
        : undefined
    const rateBelow =
      body?.rateBelow === null || body?.rateBelow === ""
      ? null
      : typeof body?.rateBelow === "number" && body.rateBelow > 0 && body.rateBelow < 500
        ? body.rateBelow
        : undefined
    const moveUpPct =
      body?.moveUpPct === null || body?.moveUpPct === ""
      ? null
      : typeof body?.moveUpPct === "number" && body.moveUpPct >= 0 && body.moveUpPct <= 50
        ? body.moveUpPct
        : undefined
    const moveDownPct =
      body?.moveDownPct === null || body?.moveDownPct === ""
      ? null
      : typeof body?.moveDownPct === "number" && body.moveDownPct >= 0 && body.moveDownPct <= 50
        ? body.moveDownPct
        : undefined
    const digest = ["none", "daily", "weekly"].includes(body?.digest) ? body.digest : "none"
    const digestEmail =
      typeof body?.digestEmail === "string" && body.digestEmail.includes("@")
        ? body.digestEmail.trim().slice(0, 128)
        : body?.digestEmail === "" || body?.digestEmail === null
          ? ""
          : undefined

    const prev = store.get(clientId) ?? { ...DEFAULT_PREFS }
    const next: Record<string, unknown> = {
      ...prev,
      digest,
      updatedAt: new Date().toISOString(),
    }
    if (rateAbove !== undefined) {
      if (rateAbove == null) delete next.rateAbove
      else next.rateAbove = rateAbove
    }
    if (rateBelow !== undefined) {
      if (rateBelow == null) delete next.rateBelow
      else next.rateBelow = rateBelow
    }
    if (moveUpPct !== undefined) {
      if (moveUpPct == null) delete next.moveUpPct
      else next.moveUpPct = moveUpPct
    }
    if (moveDownPct !== undefined) {
      if (moveDownPct == null) delete next.moveDownPct
      else next.moveDownPct = moveDownPct
    }
    if (digestEmail !== undefined) next.digestEmail = digestEmail || undefined
    store.set(clientId, next as typeof prev)

    return NextResponse.json({ ok: true, preferences: next })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
