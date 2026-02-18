/**
 * Shared forum thread type and storage for actionable forums (client-side persistence).
 */

export type ForumCategoryKey =
  | "forum.scamAlerts"
  | "forum.exchangeTips"
  | "forum.marketNews"
  | "forum.changerReviews"

export interface ForumReply {
  id: string
  author: string
  body: string
  time: string
}

export interface ForumThread {
  id: string
  title: string
  excerpt: string
  body?: string
  category: ForumCategoryKey
  author: string
  time: string
  replies: number
  replyList?: ForumReply[]
}

const USER_THREADS_KEY = "truerate-forum-user-threads"

export const CATEGORY_KEYS: ForumCategoryKey[] = [
  "forum.scamAlerts",
  "forum.exchangeTips",
  "forum.marketNews",
  "forum.changerReviews",
]

export const CATEGORY_PARAMS = ["scamAlerts", "exchangeTips", "marketNews", "changerReviews"] as const
export type CategoryParam = (typeof CATEGORY_PARAMS)[number]

export function categoryParamToKey(param: string | null): ForumCategoryKey | null {
  if (!param || !CATEGORY_PARAMS.includes(param as CategoryParam)) return null
  return `forum.${param}` as ForumCategoryKey
}

export function loadUserThreads(): ForumThread[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(USER_THREADS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as ForumThread[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveUserThreads(threads: ForumThread[]): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(USER_THREADS_KEY, JSON.stringify(threads))
  } catch {
    // ignore
  }
}

const REPLIES_STORAGE_KEY = "truerate-forum-replies"

export function loadReplies(threadId: string): ForumReply[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(REPLIES_STORAGE_KEY)
    if (!raw) return []
    const all = JSON.parse(raw) as Record<string, ForumReply[]>
    const list = all[threadId]
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

export function saveReplies(threadId: string, replies: ForumReply[]): void {
  if (typeof window === "undefined") return
  try {
    const raw = window.localStorage.getItem(REPLIES_STORAGE_KEY)
    const all: Record<string, ForumReply[]> = raw ? JSON.parse(raw) : {}
    all[threadId] = replies
    window.localStorage.setItem(REPLIES_STORAGE_KEY, JSON.stringify(all))
  } catch {
    // ignore
  }
}

/** Find thread by id from default list + user threads */
export function getThreadById(
  threadId: string,
  defaultThreads: ForumThread[],
  userThreads: ForumThread[],
): ForumThread | null {
  const fromUser = userThreads.find((t) => t.id === threadId)
  if (fromUser) return fromUser
  const fromDefault = defaultThreads.find((t) => t.id === threadId)
  return fromDefault ?? null
}
