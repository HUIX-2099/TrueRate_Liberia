import { NextResponse } from "next/server"
import { getLeaderboard } from "@/lib/gamification/store"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const limit = Math.min(Number(url.searchParams.get("limit") ?? "10"), 50)
  const entries = await getLeaderboard(limit)
  return NextResponse.json({ leaderboard: entries, total: entries.length })
}
