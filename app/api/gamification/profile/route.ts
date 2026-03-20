import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getProfile, awardPoints, BADGES, getRankForPoints } from "@/lib/gamification/store"
import type { PointEvent } from "@/lib/gamification/store"
import { z } from "zod"

const AwardSchema = z.object({
  event: z.enum(["rate_reported", "fraud_reported", "forum_post", "forum_reply", "review_submitted", "daily_checkin", "referral_converted"]),
})

export async function GET() {
  const session = await auth()
  const userId = (session?.user as any)?.id ?? "demo-user"

  const profile = await getProfile(userId)
  const badgeDetails = profile.badges.map((b) => ({
    ...b,
    badge: BADGES[b.badgeId],
  }))

  return NextResponse.json({
    userId: profile.userId,
    points: profile.points,
    rank: profile.rank,
    rankPosition: profile.rankPosition,
    streak: profile.streak,
    totalRatesReported: profile.totalRatesReported,
    totalFraudReports: profile.totalFraudReports,
    totalForumPosts: profile.totalForumPosts,
    totalReviews: profile.totalReviews,
    badges: badgeDetails,
    nextRankPoints: getNextRankThreshold(profile.points),
  })
}

export async function POST(req: Request) {
  const session = await auth()
  const userId = (session?.user as any)?.id ?? "demo-user"

  const body = await req.json().catch(() => ({}))
  const parsed = AwardSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid event type." }, { status: 400 })
  }

  const updated = await awardPoints(userId, parsed.data.event as PointEvent)
  return NextResponse.json({ points: updated.points, rank: updated.rank, streak: updated.streak })
}

function getNextRankThreshold(points: number): number {
  const thresholds = [50, 200, 500, 1000, 2500, 5000]
  return thresholds.find((t) => t > points) ?? 5000
}
