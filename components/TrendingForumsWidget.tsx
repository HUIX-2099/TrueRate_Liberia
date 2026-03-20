"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { MessageSquare, Flame, ArrowRight, ShieldAlert, Lightbulb, Newspaper, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface Thread {
  id: string
  title: string
  category: string
  replyCount: number
  upvotes: number
}

const CATEGORY_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  scamAlerts: { icon: ShieldAlert, color: "text-destructive", bg: "bg-muted/40 border border-border/40" },
  exchangeTips: { icon: Lightbulb, color: "text-secondary", bg: "bg-muted/40 border border-border/40" },
  marketNews: { icon: Newspaper, color: "text-primary", bg: "bg-muted/40 border border-border/40" },
  changerReviews: { icon: Star, color: "text-accent-foreground", bg: "bg-accent/20" },
}

export function TrendingForumsWidget({ className }: { className?: string }) {
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/forums/threads?limit=5")
      .then((r) => r.json())
      .then((data) => {
        const sorted = (data.threads ?? [])
          .sort((a: Thread, b: Thread) => (b.upvotes + b.replyCount) - (a.upvotes + a.replyCount))
          .slice(0, 4)
        setThreads(sorted)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <Card className={cn("rounded-2xl border-border/40 bg-card", className)}>
      <CardHeader className="pb-3 pt-5 px-5">
        <CardTitle className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-base font-bold">
            <Flame className="h-4 w-4 text-primary" />
            Trending Discussions
          </div>
          <Link href="/forums" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3 text-muted-foreground" />
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5 space-y-3">
        {loading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-8 w-8 rounded-xl shrink-0 text-primary" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-1/3 text-primary" />
                </div>
              </div>
            ))}
          </>
        ) : threads.length === 0 ? (
          <div className="py-4 text-center text-sm text-muted-foreground">
            No discussions yet. <Link href="/forums" className="text-primary hover:underline">Start one!</Link>
          </div>
        ) : (
          threads.map((thread) => {
            const config = CATEGORY_CONFIG[thread.category] ?? CATEGORY_CONFIG.exchangeTips
            const Icon = config.icon
            return (
              <Link key={thread.id} href={`/forums/thread/${thread.id}`} className="group flex items-start gap-3 hover:opacity-80 transition-opacity">
                <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-xl", config.bg)}>
                  <Icon className={cn("h-4 w-4", config.color)} aria-hidden />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">{thread.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold text-muted-foreground">
                      {thread.replyCount} replies
                    </span>
                    {thread.replyCount >= 10 && (
                      <Badge className="h-4 px-1.5 text-[9px] font-black uppercase tracking-widest bg-accent/20 text-accent-foreground border-none">
                        Hot
                      </Badge>
                    )}
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
