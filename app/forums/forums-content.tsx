"use client"

import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  MessageSquare,
  PlusCircle,
  TrendingUp,
  ShieldAlert,
  Lightbulb,
  Newspaper,
  Star,
  MessageCircle,
  Clock,
  Filter,
} from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/language-context"
import {
  type ForumThread,
  type ForumCategoryKey,
  CATEGORY_KEYS,
  categoryParamToKey,
  loadUserThreads,
  saveUserThreads,
} from "@/lib/forum-data"

const CATEGORIES = [
  { key: "forum.scamAlerts" as const, icon: ShieldAlert, color: "text-amber-600", bg: "bg-amber-500/10" },
  { key: "forum.exchangeTips" as const, icon: Lightbulb, color: "text-emerald-600", bg: "bg-emerald-500/10" },
  { key: "forum.marketNews" as const, icon: Newspaper, color: "text-blue-600", bg: "bg-blue-500/10" },
  { key: "forum.changerReviews" as const, icon: Star, color: "text-violet-600", bg: "bg-violet-500/10" },
]

const MOCK_THREADS: ForumThread[] = [
  {
    id: "1",
    title: "Fake USD notes at Red Light — be careful",
    excerpt:
      "Someone tried to give me counterfeit $20s at a changer near the market. Check your bills before you leave.",
    category: "forum.scamAlerts",
    author: "Marie K.",
    time: "2 hours ago",
    replies: 12,
  },
  {
    id: "2",
    title: "Best time to change USD this week?",
    excerpt: "Heard the rate might move. Should I change today or wait until Friday?",
    category: "forum.exchangeTips",
    author: "James T.",
    time: "5 hours ago",
    replies: 8,
  },
  {
    id: "3",
    title: "CBL rate update — Feb 18",
    excerpt: "Central Bank just published the new buying/selling rates. Selling at 186.65 LRD per USD.",
    category: "forum.marketNews",
    author: "TrueRate",
    time: "1 day ago",
    replies: 24,
  },
  {
    id: "4",
    title: "Quick Cash Sinkor — honest and fast",
    excerpt: "I've been using them for months. Rate is fair and they don't delay. Recommended.",
    category: "forum.changerReviews",
    author: "Abigail M.",
    time: "1 day ago",
    replies: 5,
  },
  {
    id: "5",
    title: "Waterside changer shorted me 500 LRD",
    excerpt: "Double-count your money. I was short 500 LRD at a booth near the port. No receipt given.",
    category: "forum.scamAlerts",
    author: "Anonymous",
    time: "2 days ago",
    replies: 19,
  },
  {
    id: "6",
    title: "How to spot fake dollars — quick guide",
    excerpt: "A few things I always check: watermark, security strip, and the texture. Sharing what works for me.",
    category: "forum.exchangeTips",
    author: "David S.",
    time: "3 days ago",
    replies: 31,
  },
]

export function ForumsContent() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")
  const categoryFilter = categoryParamToKey(categoryParam)

  const [userThreads, setUserThreads] = useState<ForumThread[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newCategory, setNewCategory] = useState<ForumCategoryKey>("forum.exchangeTips")
  const [newBody, setNewBody] = useState("")

  useEffect(() => {
    setUserThreads(loadUserThreads())
  }, [])

  const allThreads = [...MOCK_THREADS, ...userThreads]
  const filteredThreads = categoryFilter
    ? allThreads.filter((thread) => thread.category === categoryFilter)
    : allThreads

  const handleSubmitTopic = useCallback(() => {
    const title = newTitle.trim()
    const body = newBody.trim()
    if (!title) return
    const excerpt = body ? (body.slice(0, 120) + (body.length > 120 ? "…" : "")) : title
    const thread: ForumThread = {
      id: Date.now().toString(),
      title,
      excerpt,
      body: body || undefined,
      category: newCategory,
      author: "You",
      time: "Just now",
      replies: 0,
      replyList: [],
    }
    const next = [...userThreads, thread]
    setUserThreads(next)
    saveUserThreads(next)
    setNewTitle("")
    setNewBody("")
    setNewCategory("forum.exchangeTips")
    setDialogOpen(false)
  }, [newTitle, newBody, newCategory, userThreads])

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1 min-w-0 pb-20 md:pb-0 overflow-x-hidden">
        {/* Hero */}
        <section className="py-10 sm:py-14 md:py-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-violet-500/20 flex items-center justify-center">
                  <MessageSquare className="h-8 w-8 text-violet-500" />
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                <Badge variant="secondary">{t("forum.categories")}</Badge>
                <Badge className="bg-primary/10 text-primary">Community</Badge>
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-balance">
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  {t("forum.title")}
                </span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground text-pretty max-w-2xl mx-auto mb-6">
                Discuss rates, share tips, report scams, and read changer reviews. Built for the Liberia exchange
                community.
              </p>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="gap-2">
                    <PlusCircle className="h-5 w-5" />
                    {t("forum.newTopic")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl">{t("forum.newTopic")}</DialogTitle>
                    <DialogDescription>Add a title, pick a category, and write your post.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="topic-title">Title</Label>
                      <Input
                        id="topic-title"
                        placeholder="e.g. Fake bills at Red Light market"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Category</Label>
                      <Select
                        value={newCategory}
                        onValueChange={(v) => setNewCategory(v as ForumCategoryKey)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORY_KEYS.map((key) => (
                            <SelectItem key={key} value={key}>
                              {t(key)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="topic-body">Message (optional)</Label>
                      <Textarea
                        id="topic-body"
                        placeholder="Share details..."
                        rows={4}
                        value={newBody}
                        onChange={(e) => setNewBody(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="button" onClick={handleSubmitTopic} disabled={!newTitle.trim()}>
                      Post topic
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>

        {/* Trending discussions */}
        <section className="py-8 sm:py-12 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  {categoryFilter ? t(categoryFilter) : t("forum.trending")}
                </h2>
                {categoryFilter && (
                  <Button asChild variant="outline" size="sm" className="gap-1">
                    <Link href="/forums">
                      <Filter className="h-4 w-4" />
                      Show all
                    </Link>
                  </Button>
                )}
              </div>
              {filteredThreads.length === 0 ? (
                <Card className="border-border/60">
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No discussions in this category yet. Start one above.</p>
                    <Button className="mt-4 gap-2" onClick={() => setDialogOpen(true)}>
                      <PlusCircle className="h-4 w-4" />
                      {t("forum.newTopic")}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredThreads.map((thread) => (
                    <Card
                      key={thread.id}
                      className="border-border/60 shadow-sm hover:shadow-md transition-all hover:border-primary/20 overflow-hidden"
                    >
                      <CardContent className="p-3 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                          <Avatar className="h-9 w-9 sm:h-10 sm:w-10 shrink-0">
                            <AvatarFallback>
                              {thread.author
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs font-normal">
                                {t(thread.category)}
                              </Badge>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {thread.time}
                              </span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <MessageCircle className="h-3 w-3" />
                                {thread.replies} comments
                              </span>
                            </div>
                            <h3 className="font-semibold text-base mb-1 line-clamp-1">{thread.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{thread.excerpt}</p>
                            <p className="text-xs text-muted-foreground mt-2">{thread.author}</p>
                          </div>
                          <Button asChild size="sm" variant="outline" className="shrink-0 w-full sm:w-auto min-h-9 touch-manipulation">
                            <Link href={`/forums/thread/${thread.id}`}>View</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 sm:py-12 bg-muted/30" id="categories">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto min-w-0">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">{t("forum.categories")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {CATEGORIES.map(({ key, icon: Icon, color, bg }) => (
                  <Link key={key} href={`/forums?category=${key.replace("forum.", "")}`} className="min-w-0">
                    <Card className="h-full border-border/60 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                      <CardContent className="p-4 sm:p-6 flex items-center gap-3 sm:gap-4">
                        <div className={`flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                          <Icon className={`h-6 w-6 ${color}`} />
                        </div>
                        <div className="min-w-0">
                          <CardTitle className="text-sm sm:text-base truncate">{t(key)}</CardTitle>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">View and join discussions</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-8 sm:py-12 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mx-auto text-center min-w-0">
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-card">
                <CardHeader>
                  <CardTitle className="text-lg">Have something to share?</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Post a scam alert, exchange tip, or review to help others get fair rates.
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button asChild className="gap-2">
                    <Link href="/community">
                      <MessageSquare className="h-4 w-4" />
                      Go to Community Hub
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
