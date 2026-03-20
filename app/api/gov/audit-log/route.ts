import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getAuditLog, logAuditEvent } from "@/lib/gov/audit-log"
import type { AuditAction } from "@/lib/gov/audit-log"

const ADMIN_ROLES = ["gov", "admin", "superadmin"]

export async function GET(req: Request) {
  const session = await auth()
  const role = (session?.user as any)?.role as string | undefined

  if (!session || !role || !ADMIN_ROLES.includes(role)) {
    return NextResponse.json({ error: "Insufficient permissions." }, { status: 403 })
  }

  const url = new URL(req.url)
  const limit = Math.min(Number(url.searchParams.get("limit") ?? "50"), 200)
  const offset = Number(url.searchParams.get("offset") ?? "0")
  const action = url.searchParams.get("action") as AuditAction | null
  const severity = url.searchParams.get("severity") as "info" | "warn" | "critical" | null

  const result = getAuditLog({ limit, offset, action: action ?? undefined, severity: severity ?? undefined })

  return NextResponse.json(result)
}

export async function POST(req: Request) {
  const session = await auth()
  const role = (session?.user as any)?.role as string | undefined
  const userId = (session?.user as any)?.id as string | undefined

  if (!session || !role || !ADMIN_ROLES.includes(role)) {
    return NextResponse.json({ error: "Insufficient permissions." }, { status: 403 })
  }

  const body = await req.json().catch(() => ({}))
  if (!body.action) {
    return NextResponse.json({ error: "action is required." }, { status: 400 })
  }

  const entry = logAuditEvent(body.action, {
    userId,
    details: body.details,
    severity: body.severity,
    ipAddress: req.headers.get("x-forwarded-for") ?? undefined,
    userAgent: req.headers.get("user-agent") ?? undefined,
  })

  return NextResponse.json({ entry }, { status: 201 })
}
