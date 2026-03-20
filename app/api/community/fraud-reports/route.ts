import { NextResponse } from "next/server"

/**
 * In-memory store for fraud reports. Replace with a database for production.
 */
const reports: Array<{
  id: string
  reportType: string
  changerName: string
  location: string
  amount: string
  description: string
  reporterName: string
  reporterPhone: string
  createdAt: string
}> = []

function nextId(): string {
  return "FR-" + Date.now().toString().slice(-8) + "-" + Math.random().toString(36).slice(2, 6).toUpperCase()
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const reportType = typeof body?.reportType === "string" ? body.reportType.trim().slice(0, 64) : ""
    const location = typeof body?.location === "string" ? body.location.trim().slice(0, 200) : ""
    const description = typeof body?.description === "string" ? body.description.trim().slice(0, 2000) : ""

    if (!reportType || !location || !description) {
      return NextResponse.json(
        { error: "Report type, location, and description are required" },
        { status: 400 },
      )
    }

    const id = nextId()
    const entry = {
      id,
      reportType,
      changerName: typeof body?.changerName === "string" ? body.changerName.trim().slice(0, 128) : "",
      location,
      amount: typeof body?.amount === "string" ? body.amount.trim().slice(0, 32) : "",
      description,
      reporterName: typeof body?.reporterName === "string" ? body.reporterName.trim().slice(0, 128) : "",
      reporterPhone: typeof body?.reporterPhone === "string" ? body.reporterPhone.trim().slice(0, 32) : "",
      createdAt: new Date().toISOString(),
    }
    reports.push(entry)

    return NextResponse.json({
      ok: true,
      id,
      reference: id,
      message: "Report received. Our team will review within 24-48 hours.",
    })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
