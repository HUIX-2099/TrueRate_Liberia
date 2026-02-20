"use client"

import { useCallback, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, MessageSquare, Send } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import {
  type ForumThread,
  type ForumReply,
  loadUserThreads,
  loadReplies,
  saveReplies,
  getThreadById,
} from "@/lib/forum-data"

const MOCK_THREADS: ForumThread[] = [
  { id: "1", title: "Fake USD notes at Red Light — be careful", excerpt: "Someone tried to give me counterfeit $20s at a changer near the market.", category: "forum.scamAlerts", author: "Marie K.", time: "2 hours ago", replies: 12 },
  { id: "2", title: "Best time to change USD this week?", excerpt: "Heard the rate might move. Should I change today or wait until Friday?", category: "forum.exchangeTips", author: "James T.", time: "5 hours ago", replies: 8 },
  { id: "3", title: "CBL rate update — Feb 18", excerpt: "Central Bank just published the new buying/selling rates. Selling at 186.65 LRD per USD.", category: "forum.marketNews", author: "TrueRate", time: "1 day ago", replies: 24 },
  { id: "4", title: "Quick Cash Sinkor — honest and fast", excerpt: "I've been using them for months. Rate is fair and they don't delay. Recommended.", category: "forum.changerReviews", author: "Abigail M.", time: "1 day ago", replies: 5 },
  { id: "5", title: "Waterside changer shorted me 500 LRD", excerpt: "Double-count your money. I was short 500 LRD at a booth near the port.", category: "forum.scamAlerts", author: "Anonymous", time: "2 days ago", replies: 19 },
  { id: "6", title: "How to spot fake dollars — quick guide", excerpt: "A few things I always check: watermark, security strip, and the texture.", category: "forum.exchangeTips", author: "David S.", time: "3 days ago", replies: 31 },
]

export default function ThreadPage() {
  const { t } = useLanguage()
  const params = useParams()
  const id = typeof params?.id === "string" ? params.id : null

  const [thread, setThread] = useState<ForumThread | null>(null)
  const [replies, setRepliesState] = useState<ForumReply[]>([])
  const [replyBody, setReplyBody] = useState("")
  const [userThreads, setUserThreads] = useState<ForumThread[]>([])

  useEffect(() => {
    setUserThreads(loadUserThreads())
  }, [])

  useEffect(() => {
    if (!id) return
    const found = getThreadById(id, MOCK_THREADS, userThreads)
    setThread(found ?? null)
    setRepliesState(loadReplies(id))
  }, [id, userThreads])

  const addReply = useCallback(() => {
    if (!id || !replyBody.trim()) return
    const newReply: ForumReply = {
      id: Date.now().toString(),
      author: "You",
      body: replyBody.trim(),
      time: "Just now",
    }
    const next = [...replies, newReply]
    setRepliesState(next)
    saveReplies(id, next)
    setReplyBody("")
  }, [id, replyBody, replies])

  if (!id) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Invalid thread.</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (thread === undefined) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading…</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (thread === null) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground mb-4">Thread not found.</p>
          <Button asChild variant="outline">
            <Link href="/forums">Back to Forums</Link>
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  const displayReplies = replies
  const totalReplies = thread.replies + displayReplies.length

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1 py-6 sm:py-10 min-w-0 pb-20 md:pb-0 overflow-x-hidden">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl min-w-0">
          <Button asChild variant="ghost" size="sm" className="mb-4 sm:mb-6 gap-1 min-h-9 touch-manipulation">
            <Link href="/forums">
              <ArrowLeft className="h-4 w-4" />
              Back to Forums
            </Link>
          </Button>

          <Card className="border-border/60 shadow-sm mb-4 sm:mb-6 overflow-hidden">
            <CardHeader className="pb-2 p-4 sm:p-6">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs font-normal">
                  {t(thread.category)}
                </Badge>
                <span className="text-xs text-muted-foreground">{thread.time}</span>
              </div>
              <CardTitle className="text-lg sm:text-xl break-words">{thread.title}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {thread.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">{thread.author}</span>
              </div>
            </CardHeader>
            <CardContent className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
              <p className="text-sm text-foreground whitespace-pre-wrap break-words">
                {thread.body ?? thread.excerpt}
              </p>
            </CardContent>
          </Card>

          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Comments {totalReplies > 0 && `(${totalReplies})`}
          </h2>

          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            {displayReplies.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No comments yet. Be the first.</p>
            ) : (
              displayReplies.map((r) => (
                <Card key={r.id} className="border-border/60 overflow-hidden">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex gap-3">
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarFallback className="text-xs">
                          {r.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{r.author}</span>
                          <span className="text-xs text-muted-foreground">{r.time}</span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap break-words">{r.body}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <Card className="border-primary/20 bg-muted/20 overflow-hidden">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base">Comment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
              <Textarea
                placeholder="Write your comment..."
                rows={4}
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                className="resize-none min-h-24"
              />
              <Button onClick={addReply} disabled={!replyBody.trim()} className="gap-2 min-h-10 w-full sm:w-auto touch-manipulation">
                <Send className="h-4 w-4" />
                Post comment
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
