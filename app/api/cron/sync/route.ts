import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

/** Cron-based data sync scheduler is disabled. */

export function GET() {
  return NextResponse.json(
    { error: "Data sync scheduler is disabled", enabled: false },
    { status: 503 }
  )
}

export function POST() {
  return NextResponse.json(
    { error: "Data sync scheduler is disabled", enabled: false },
    { status: 503 }
  )
}
