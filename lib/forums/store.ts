/**
 * Forum store — Prisma-backed when DATABASE_URL is set, in-memory fallback
 * for local development without a database.
 *
 * This file is server-only (used in API routes).
 */

import { getPrismaClient } from "@/lib/db/prisma"

export type ForumCategoryKey = "scamAlerts" | "exchangeTips" | "marketNews" | "changerReviews"

export interface ForumReplyRecord {
  id: string
  threadId: string
  authorId: string
  authorName: string
  body: string
  upvotes: number
  downvotes: number
  createdAt: string
  updatedAt: string
}

export interface ForumThreadRecord {
  id: string
  title: string
  excerpt: string
  body?: string
  category: ForumCategoryKey
  authorId: string
  authorName: string
  isPinned: boolean
  isLocked: boolean
  replyCount: number
  upvotes: number
  downvotes: number
  createdAt: string
  updatedAt: string
}

// ─── In-memory fallback (development) ────────────────────────────────────────

const threadsMap = new Map<string, ForumThreadRecord>()
const repliesMap = new Map<string, ForumReplyRecord[]>()
const votesMap = new Map<string, { userId: string; value: number }>()

function seedMemory() {
  if (threadsMap.size > 0) return
  const now = new Date()
  const seeds: ForumThreadRecord[] = [
    {
      id: "1",
      title: "Fake USD notes at Red Light — be careful",
      excerpt: "Someone tried to give me counterfeit $20s at a changer near the market. Check your bills before you leave.",
      body: "Someone tried to give me counterfeit $20s at a changer near the market. Check your bills before you leave. The watermark was missing and the security thread was just printed on. Always check before you walk away.",
      category: "scamAlerts",
      authorId: "seed-1",
      authorName: "Marie K.",
      isPinned: false,
      isLocked: false,
      replyCount: 12,
      upvotes: 34,
      downvotes: 1,
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      title: "Best time to change USD this week?",
      excerpt: "Heard the rate might move. Should I change today or wait until Friday?",
      body: "Heard the rate might move. Should I change today or wait until Friday? Looking to exchange about $500.",
      category: "exchangeTips",
      authorId: "seed-2",
      authorName: "James T.",
      isPinned: false,
      isLocked: false,
      replyCount: 8,
      upvotes: 18,
      downvotes: 0,
      createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      title: "CBL rate update — Feb 18",
      excerpt: "Central Bank just published the new buying/selling rates. Selling at 186.65 LRD per USD.",
      body: "Central Bank just published the new buying/selling rates. Selling at 186.65 LRD per USD. Check the official CBL website for the latest figures.",
      category: "marketNews",
      authorId: "truerate",
      authorName: "TrueRate",
      isPinned: true,
      isLocked: false,
      replyCount: 24,
      upvotes: 56,
      downvotes: 2,
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "4",
      title: "Quick Cash Sinkor — honest and fast",
      excerpt: "I've been using them for months. Rate is fair and they don't delay. Recommended.",
      body: "I've been using them for months. Rate is fair and they don't delay. Recommended for anyone in Sinkor.",
      category: "changerReviews",
      authorId: "seed-3",
      authorName: "Abigail M.",
      isPinned: false,
      isLocked: false,
      replyCount: 5,
      upvotes: 22,
      downvotes: 0,
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "5",
      title: "Waterside changer shorted me 500 LRD",
      excerpt: "Double-count your money. I was short 500 LRD at a booth near the port. No receipt given.",
      body: "Double-count your money. I was short 500 LRD at a booth near the port. No receipt given.",
      category: "scamAlerts",
      authorId: "seed-4",
      authorName: "Anonymous",
      isPinned: false,
      isLocked: false,
      replyCount: 19,
      upvotes: 41,
      downvotes: 0,
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "6",
      title: "How to spot fake dollars — quick guide",
      excerpt: "A few things I always check: watermark, security strip, and the texture. Sharing what works for me.",
      body: "A few things I always check: watermark, security strip, and the texture. Sharing what works for me.",
      category: "exchangeTips",
      authorId: "seed-5",
      authorName: "David S.",
      isPinned: false,
      isLocked: false,
      replyCount: 31,
      upvotes: 78,
      downvotes: 1,
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]
  for (const t of seeds) {
    threadsMap.set(t.id, t)
    repliesMap.set(t.id, [])
  }
}

seedMemory()

// ─── Helpers ──────────────────────────────────────────────────────────────────

function dbToRecord(t: any): ForumThreadRecord {
  return {
    id: t.id,
    title: t.title,
    excerpt: t.excerpt,
    body: t.body ?? undefined,
    category: t.category as ForumCategoryKey,
    authorId: t.authorId,
    authorName: t.authorName,
    isPinned: t.isPinned,
    isLocked: t.isLocked,
    replyCount: t.replyCount,
    upvotes: t.upvotes,
    downvotes: t.downvotes,
    createdAt: t.createdAt instanceof Date ? t.createdAt.toISOString() : t.createdAt,
    updatedAt: t.updatedAt instanceof Date ? t.updatedAt.toISOString() : t.updatedAt,
  }
}

function dbToReply(r: any): ForumReplyRecord {
  return {
    id: r.id,
    threadId: r.threadId,
    authorId: r.authorId,
    authorName: r.authorName,
    body: r.body,
    upvotes: r.upvotes,
    downvotes: r.downvotes,
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
    updatedAt: r.updatedAt instanceof Date ? r.updatedAt.toISOString() : r.updatedAt,
  }
}

// ─── Thread operations ────────────────────────────────────────────────────────

export async function getThreads(filters?: {
  category?: string
  limit?: number
  offset?: number
}): Promise<ForumThreadRecord[]> {
  const prisma = getPrismaClient()
  const limit = filters?.limit ?? 50
  const offset = filters?.offset ?? 0

  if (prisma) {
    try {
      const where: any = {}
      if (filters?.category && filters.category !== "all") {
        where.category = filters.category
      }
      const rows = await (prisma as any).forumThread.findMany({
        where,
        orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
        take: limit,
        skip: offset,
      })
      return rows.map(dbToRecord)
    } catch (e) {
      console.error("[forums] getThreads DB error:", e)
    }
  }

  // In-memory fallback
  let list = [...threadsMap.values()]
  if (filters?.category && filters.category !== "all") {
    list = list.filter((t) => t.category === filters.category)
  }
  list.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
  return list.slice(offset, offset + limit)
}

export async function getThreadById(id: string): Promise<ForumThreadRecord | null> {
  const prisma = getPrismaClient()
  if (prisma) {
    try {
      const row = await (prisma as any).forumThread.findUnique({ where: { id } })
      return row ? dbToRecord(row) : null
    } catch (e) {
      console.error("[forums] getThreadById DB error:", e)
    }
  }
  return threadsMap.get(id) ?? null
}

export async function createThread(data: {
  title: string
  body: string
  category: ForumCategoryKey
  authorId: string
  authorName: string
}): Promise<ForumThreadRecord> {
  const prisma = getPrismaClient()
  const excerpt = data.body.slice(0, 150) + (data.body.length > 150 ? "…" : "")

  if (prisma) {
    try {
      const row = await (prisma as any).forumThread.create({
        data: {
          title: data.title,
          excerpt,
          body: data.body,
          category: data.category,
          authorId: data.authorId,
          authorName: data.authorName,
        },
      })
      return dbToRecord(row)
    } catch (e) {
      console.error("[forums] createThread DB error:", e)
    }
  }

  // In-memory fallback
  const id = crypto.randomUUID()
  const now = new Date().toISOString()
  const thread: ForumThreadRecord = {
    id,
    title: data.title,
    excerpt,
    body: data.body,
    category: data.category,
    authorId: data.authorId,
    authorName: data.authorName,
    isPinned: false,
    isLocked: false,
    replyCount: 0,
    upvotes: 0,
    downvotes: 0,
    createdAt: now,
    updatedAt: now,
  }
  threadsMap.set(id, thread)
  repliesMap.set(id, [])
  return thread
}

// ─── Reply operations ─────────────────────────────────────────────────────────

export async function getReplies(threadId: string): Promise<ForumReplyRecord[]> {
  const prisma = getPrismaClient()
  if (prisma) {
    try {
      const rows = await (prisma as any).forumReply.findMany({
        where: { threadId },
        orderBy: { createdAt: "asc" },
      })
      return rows.map(dbToReply)
    } catch (e) {
      console.error("[forums] getReplies DB error:", e)
    }
  }
  return (repliesMap.get(threadId) ?? []).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )
}

export async function createReply(data: {
  threadId: string
  authorId: string
  authorName: string
  body: string
}): Promise<ForumReplyRecord | null> {
  const prisma = getPrismaClient()

  if (prisma) {
    try {
      const thread = await (prisma as any).forumThread.findUnique({ where: { id: data.threadId } })
      if (!thread || thread.isLocked) return null
      const row = await (prisma as any).forumReply.create({
        data: {
          threadId: data.threadId,
          authorId: data.authorId,
          authorName: data.authorName,
          body: data.body,
        },
      })
      await (prisma as any).forumThread.update({
        where: { id: data.threadId },
        data: { replyCount: { increment: 1 } },
      })
      return dbToReply(row)
    } catch (e) {
      console.error("[forums] createReply DB error:", e)
    }
  }

  // In-memory fallback
  const thread = threadsMap.get(data.threadId)
  if (!thread || thread.isLocked) return null
  const id = crypto.randomUUID()
  const now = new Date().toISOString()
  const reply: ForumReplyRecord = {
    id,
    threadId: data.threadId,
    authorId: data.authorId,
    authorName: data.authorName,
    body: data.body,
    upvotes: 0,
    downvotes: 0,
    createdAt: now,
    updatedAt: now,
  }
  const existing = repliesMap.get(data.threadId) ?? []
  repliesMap.set(data.threadId, [...existing, reply])
  threadsMap.set(data.threadId, { ...thread, replyCount: thread.replyCount + 1, updatedAt: now })
  return reply
}

// ─── Vote operations ──────────────────────────────────────────────────────────

export async function voteThread(
  threadId: string,
  userId: string,
  value: 1 | -1
): Promise<{ upvotes: number; downvotes: number } | null> {
  const prisma = getPrismaClient()

  if (prisma) {
    try {
      const thread = await (prisma as any).forumThread.findUnique({ where: { id: threadId } })
      if (!thread) return null

      const existing = await (prisma as any).forumVote.findUnique({
        where: { targetType_targetId_userId: { targetType: "thread", targetId: threadId, userId } },
      })

      let upvotes: number = thread.upvotes
      let downvotes: number = thread.downvotes

      if (existing) {
        if (existing.value === value) {
          // Undo vote
          await (prisma as any).forumVote.delete({ where: { id: existing.id } })
          if (value === 1) upvotes = Math.max(0, upvotes - 1)
          else downvotes = Math.max(0, downvotes - 1)
        } else {
          // Switch vote
          await (prisma as any).forumVote.update({ where: { id: existing.id }, data: { value } })
          if (value === 1) { upvotes++; downvotes = Math.max(0, downvotes - 1) }
          else { downvotes++; upvotes = Math.max(0, upvotes - 1) }
        }
      } else {
        await (prisma as any).forumVote.create({
          data: { targetType: "thread", targetId: threadId, userId, value },
        })
        if (value === 1) upvotes++
        else downvotes++
      }

      await (prisma as any).forumThread.update({ where: { id: threadId }, data: { upvotes, downvotes } })
      return { upvotes, downvotes }
    } catch (e) {
      console.error("[forums] voteThread DB error:", e)
    }
  }

  // In-memory fallback
  const thread = threadsMap.get(threadId)
  if (!thread) return null
  const voteKey = `thread-${threadId}-${userId}`
  const existing = votesMap.get(voteKey)
  let { upvotes, downvotes } = thread
  if (existing) {
    if (existing.value === value) {
      if (value === 1) upvotes = Math.max(0, upvotes - 1)
      else downvotes = Math.max(0, downvotes - 1)
      votesMap.delete(voteKey)
    } else {
      if (value === 1) { upvotes++; downvotes = Math.max(0, downvotes - 1) }
      else { downvotes++; upvotes = Math.max(0, upvotes - 1) }
      votesMap.set(voteKey, { userId, value })
    }
  } else {
    if (value === 1) upvotes++
    else downvotes++
    votesMap.set(voteKey, { userId, value })
  }
  threadsMap.set(threadId, { ...thread, upvotes, downvotes, updatedAt: new Date().toISOString() })
  return { upvotes, downvotes }
}

export async function getThreadCount(category?: string): Promise<number> {
  const prisma = getPrismaClient()
  if (prisma) {
    try {
      const where: any = {}
      if (category && category !== "all") where.category = category
      return await (prisma as any).forumThread.count({ where })
    } catch (e) {
      console.error("[forums] getThreadCount DB error:", e)
    }
  }
  if (!category || category === "all") return threadsMap.size
  let count = 0
  for (const t of threadsMap.values()) {
    if (t.category === category) count++
  }
  return count
}
