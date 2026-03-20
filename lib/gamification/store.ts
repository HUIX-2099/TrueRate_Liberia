/**
 * Gamification store — Prisma-backed when DATABASE_URL is set, in-memory
 * fallback for local development.
 *
 * Tracks user points, badges, rank, and leaderboard positions.
 */

import crypto from "crypto"
import { getPrismaClient } from "@/lib/db/prisma"

export type BadgeId =
  | "rate_reporter"
  | "fraud_fighter"
  | "top_contributor"
  | "early_adopter"
  | "verified_user"
  | "streak_7"
  | "streak_30"
  | "forum_veteran"
  | "market_watcher"
  | "review_guru"

export interface Badge {
  id: BadgeId
  name: string
  description: string
  icon: string
  points: number
  rarity: "common" | "rare" | "epic" | "legendary"
}

export interface UserBadge {
  badgeId: BadgeId
  earnedAt: Date
}

export interface GamificationProfile {
  userId: string
  points: number
  rank: string
  rankPosition: number
  totalRatesReported: number
  totalFraudReports: number
  totalForumPosts: number
  totalReviews: number
  streak: number
  lastActiveDate?: Date
  badges: UserBadge[]
  createdAt: Date
}

export interface LeaderboardEntry {
  userId: string
  name: string
  points: number
  rank: string
  badges: BadgeId[]
  totalRatesReported: number
}

// ── Badge definitions ──────────────────────────────────────────────────────

export const BADGES: Record<BadgeId, Badge> = {
  rate_reporter:    { id: "rate_reporter",    name: "Rate Reporter",    description: "Submit your first exchange rate report",              icon: "📊", points: 50,   rarity: "common"    },
  fraud_fighter:    { id: "fraud_fighter",    name: "Fraud Fighter",    description: "Report 3 fraudulent changers",                        icon: "🛡️", points: 150,  rarity: "rare"      },
  top_contributor:  { id: "top_contributor",  name: "Top Contributor",  description: "Reach 500 points",                                    icon: "⭐", points: 100,  rarity: "rare"      },
  early_adopter:    { id: "early_adopter",    name: "Early Adopter",    description: "Join TrueRate in its first year",                     icon: "🚀", points: 75,   rarity: "epic"      },
  verified_user:    { id: "verified_user",    name: "Verified User",    description: "Complete phone or email verification",                icon: "✅", points: 25,   rarity: "common"    },
  streak_7:         { id: "streak_7",         name: "Week Streak",      description: "Active 7 days in a row",                              icon: "🔥", points: 100,  rarity: "common"    },
  streak_30:        { id: "streak_30",        name: "Month Streak",     description: "Active 30 days in a row",                             icon: "💎", points: 500,  rarity: "epic"      },
  forum_veteran:    { id: "forum_veteran",    name: "Forum Veteran",    description: "Post 10 forum threads",                               icon: "💬", points: 200,  rarity: "rare"      },
  market_watcher:   { id: "market_watcher",   name: "Market Watcher",   description: "Check rates 30 times",                                icon: "👁️", points: 50,   rarity: "common"    },
  review_guru:      { id: "review_guru",      name: "Review Guru",      description: "Submit 5 changer reviews",                            icon: "⭐", points: 150,  rarity: "rare"      },
}

// ── Rank thresholds ────────────────────────────────────────────────────────

const RANKS = [
  { rank: "Newcomer",      min: 0    },
  { rank: "Observer",      min: 50   },
  { rank: "Contributor",   min: 200  },
  { rank: "Analyst",       min: 500  },
  { rank: "Correspondent", min: 1000 },
  { rank: "Expert",        min: 2500 },
  { rank: "Master",        min: 5000 },
]

export function getRankForPoints(points: number): string {
  return [...RANKS].reverse().find((r) => points >= r.min)?.rank ?? "Newcomer"
}

// ── In-memory fallback ────────────────────────────────────────────────────

const profilesMap = new Map<string, GamificationProfile>()

function seedDemoProfile() {
  if (profilesMap.has("demo-user")) return
  const demo: GamificationProfile = {
    userId: "demo-user",
    points: 325,
    rank: "Contributor",
    rankPosition: 1,
    totalRatesReported: 12,
    totalFraudReports: 2,
    totalForumPosts: 5,
    totalReviews: 3,
    streak: 7,
    lastActiveDate: new Date(),
    badges: [
      { badgeId: "rate_reporter",  earnedAt: new Date("2025-01-15") },
      { badgeId: "verified_user",  earnedAt: new Date("2025-01-10") },
      { badgeId: "streak_7",       earnedAt: new Date("2025-02-01") },
      { badgeId: "early_adopter",  earnedAt: new Date("2025-01-01") },
    ],
    createdAt: new Date("2025-01-01"),
  }
  profilesMap.set(demo.userId, demo)
}

seedDemoProfile()

// ── Helpers ────────────────────────────────────────────────────────────────

function dbToProfile(row: any, badges: any[], rankPosition: number): GamificationProfile {
  return {
    userId: row.userId,
    points: row.points,
    rank: getRankForPoints(row.points),
    rankPosition,
    totalRatesReported: row.totalRatesReported,
    totalFraudReports: row.totalFraudReports,
    totalForumPosts: row.totalForumPosts,
    totalReviews: row.totalReviews,
    streak: row.streak,
    lastActiveDate: row.lastActiveDate ? new Date(row.lastActiveDate) : undefined,
    badges: badges.map((b: any) => ({ badgeId: b.badgeId as BadgeId, earnedAt: new Date(b.earnedAt) })),
    createdAt: new Date(row.createdAt),
  }
}

// ── CRUD ────────────────────────────────────────────────────────────────────

export async function getProfile(userId: string): Promise<GamificationProfile> {
  const prisma = getPrismaClient()
  if (prisma) {
    try {
      let row = await (prisma as any).gamificationProfile.findUnique({
        where: { userId },
        include: { badges: true },
      })
      if (!row) {
        row = await (prisma as any).gamificationProfile.create({
          data: { userId },
          include: { badges: true },
        })
      }
      const rankPosition = await (prisma as any).gamificationProfile.count({
        where: { points: { gt: row.points } },
      }) + 1
      return dbToProfile(row, row.badges, rankPosition)
    } catch (e) {
      console.error("[gamification] getProfile DB error:", e)
    }
  }

  // In-memory fallback
  if (!profilesMap.has(userId)) {
    profilesMap.set(userId, {
      userId,
      points: 0,
      rank: "Newcomer",
      rankPosition: 999,
      totalRatesReported: 0,
      totalFraudReports: 0,
      totalForumPosts: 0,
      totalReviews: 0,
      streak: 0,
      badges: [],
      createdAt: new Date(),
    })
  }
  return profilesMap.get(userId)!
}

export type PointEvent =
  | "rate_reported"
  | "fraud_reported"
  | "forum_post"
  | "forum_reply"
  | "review_submitted"
  | "daily_checkin"
  | "referral_converted"

const EVENT_POINTS: Record<PointEvent, number> = {
  rate_reported:       10,
  fraud_reported:      30,
  forum_post:          15,
  forum_reply:         5,
  review_submitted:    20,
  daily_checkin:       5,
  referral_converted:  100,
}

export async function awardPoints(userId: string, event: PointEvent): Promise<GamificationProfile> {
  const earned = EVENT_POINTS[event] ?? 0
  const prisma = getPrismaClient()

  if (prisma) {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const yesterday = new Date(today.getTime() - 86400000)

      const current = await (prisma as any).gamificationProfile.findUnique({
        where: { userId },
        include: { badges: true },
      })

      let streak = current?.streak ?? 0
      const lastActive = current?.lastActiveDate ? new Date(current.lastActiveDate) : null
      const lastActiveDay = lastActive ? new Date(lastActive.setHours(0, 0, 0, 0)) : null

      if (!lastActiveDay || lastActiveDay.getTime() < yesterday.getTime()) {
        streak = 1
      } else if (lastActiveDay.getTime() === yesterday.getTime()) {
        streak = streak + 1
      }

      const counterUpdate: any = {}
      if (event === "rate_reported")    counterUpdate.totalRatesReported = { increment: 1 }
      if (event === "fraud_reported")   counterUpdate.totalFraudReports  = { increment: 1 }
      if (event === "forum_post")       counterUpdate.totalForumPosts    = { increment: 1 }
      if (event === "review_submitted") counterUpdate.totalReviews       = { increment: 1 }

      const updated = await (prisma as any).gamificationProfile.upsert({
        where: { userId },
        create: { userId, points: earned, streak, lastActiveDate: new Date(), ...counterUpdate },
        update: { points: { increment: earned }, streak, lastActiveDate: new Date(), ...counterUpdate },
        include: { badges: true },
      })

      // Badge eligibility checks
      const badgeIds = updated.badges.map((b: any) => b.badgeId)
      const checks: Array<{ id: BadgeId; condition: boolean }> = [
        { id: "rate_reporter",   condition: updated.totalRatesReported >= 1  },
        { id: "fraud_fighter",   condition: updated.totalFraudReports >= 3   },
        { id: "top_contributor", condition: updated.points >= 500             },
        { id: "streak_7",        condition: updated.streak >= 7              },
        { id: "streak_30",       condition: updated.streak >= 30             },
        { id: "forum_veteran",   condition: updated.totalForumPosts >= 10    },
        { id: "review_guru",     condition: updated.totalReviews >= 5        },
      ]

      let bonusPoints = 0
      for (const { id, condition } of checks) {
        if (condition && !badgeIds.includes(id)) {
          await (prisma as any).userBadge.create({ data: { profileId: updated.id, badgeId: id } })
          bonusPoints += BADGES[id].points
        }
      }

      if (bonusPoints > 0) {
        await (prisma as any).gamificationProfile.update({
          where: { userId },
          data: { points: { increment: bonusPoints } },
        })
      }

      const rankPosition = await (prisma as any).gamificationProfile.count({
        where: { points: { gt: updated.points + bonusPoints } },
      }) + 1

      const final = await (prisma as any).gamificationProfile.findUnique({
        where: { userId },
        include: { badges: true },
      })
      return dbToProfile(final, final.badges, rankPosition)
    } catch (e) {
      console.error("[gamification] awardPoints DB error:", e)
    }
  }

  // In-memory fallback
  const profile = await getProfile(userId)
  profile.points += earned
  if (event === "rate_reported")    profile.totalRatesReported++
  if (event === "fraud_reported")   profile.totalFraudReports++
  if (event === "forum_post")       profile.totalForumPosts++
  if (event === "review_submitted") profile.totalReviews++
  profile.rank = getRankForPoints(profile.points)

  const today = new Date().toDateString()
  const lastActive = profile.lastActiveDate ? new Date(profile.lastActiveDate).toDateString() : null
  const yesterday = new Date(Date.now() - 86400000).toDateString()
  if (lastActive !== today) {
    profile.streak = lastActive === yesterday ? profile.streak + 1 : 1
    profile.lastActiveDate = new Date()
  }

  checkAndAwardBadgesInMemory(profile)
  const allProfiles = Array.from(profilesMap.values()).sort((a, b) => b.points - a.points)
  profile.rankPosition = allProfiles.findIndex((p) => p.userId === userId) + 1
  profilesMap.set(userId, profile)
  return profile
}

function checkAndAwardBadgesInMemory(profile: GamificationProfile) {
  const existing = new Set(profile.badges.map((b) => b.badgeId))
  const checks: Array<{ id: BadgeId; condition: boolean }> = [
    { id: "rate_reporter",   condition: profile.totalRatesReported >= 1  },
    { id: "fraud_fighter",   condition: profile.totalFraudReports >= 3   },
    { id: "top_contributor", condition: profile.points >= 500             },
    { id: "streak_7",        condition: profile.streak >= 7              },
    { id: "streak_30",       condition: profile.streak >= 30             },
    { id: "forum_veteran",   condition: profile.totalForumPosts >= 10    },
    { id: "review_guru",     condition: profile.totalReviews >= 5        },
  ]
  for (const { id, condition } of checks) {
    if (condition && !existing.has(id)) {
      profile.badges.push({ badgeId: id, earnedAt: new Date() })
      profile.points += BADGES[id].points
    }
  }
}

export async function grantBadge(userId: string, badgeId: BadgeId): Promise<GamificationProfile> {
  const prisma = getPrismaClient()
  if (prisma) {
    try {
      const row = await (prisma as any).gamificationProfile.upsert({
        where: { userId },
        create: { userId },
        update: {},
        select: { id: true, badges: true, points: true },
      })
      const already = row.badges.some((b: any) => b.badgeId === badgeId)
      if (!already) {
        await (prisma as any).userBadge.create({ data: { profileId: row.id, badgeId } })
        await (prisma as any).gamificationProfile.update({
          where: { userId },
          data: { points: { increment: BADGES[badgeId].points } },
        })
      }
      return getProfile(userId)
    } catch (e) {
      console.error("[gamification] grantBadge DB error:", e)
    }
  }

  const profile = await getProfile(userId)
  const already = profile.badges.some((b) => b.badgeId === badgeId)
  if (!already) {
    profile.badges.push({ badgeId, earnedAt: new Date() })
    profile.points += BADGES[badgeId].points
    profile.rank = getRankForPoints(profile.points)
    profilesMap.set(userId, profile)
  }
  return profile
}

export async function getLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
  const prisma = getPrismaClient()
  if (prisma) {
    try {
      const rows = await (prisma as any).gamificationProfile.findMany({
        orderBy: { points: "desc" },
        take: limit,
        include: { badges: true },
      })
      return rows.map((row: any) => ({
        userId: row.userId,
        name: `User ${row.userId.slice(0, 6)}`,
        points: row.points,
        rank: getRankForPoints(row.points),
        badges: row.badges.map((b: any) => b.badgeId as BadgeId),
        totalRatesReported: row.totalRatesReported,
      }))
    } catch (e) {
      console.error("[gamification] getLeaderboard DB error:", e)
    }
  }

  return Array.from(profilesMap.values())
    .sort((a, b) => b.points - a.points)
    .slice(0, limit)
    .map((p) => ({
      userId: p.userId,
      name: p.userId === "demo-user" ? "Demo User" : `User ${p.userId.slice(0, 6)}`,
      points: p.points,
      rank: p.rank,
      badges: p.badges.map((b) => b.badgeId),
      totalRatesReported: p.totalRatesReported,
    }))
}
