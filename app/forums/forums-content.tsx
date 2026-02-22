"use client"

import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
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
  Flame,
  Users,
} from "lucide-react"
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
  const totalReplies = allThreads.reduce((sum, t) => sum + (t.replies ?? 0), 0)
  const categoryCounts = CATEGORIES.map(({ key }) => ({
    key,
    count: allThreads.filter((t) => t.category === key).length,
  }))

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
      <main className="flex-1 min-w-0 pb-20 md:pb-0 overflow-x-hidden relative">
        {/* Hero */}
        <section className="relative py-12 sm:py-16 md:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,var(--primary)/0.06),linear-gradient(to_bottom,var(--muted)/0.3,transparent_55%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)/0.04_1px,transparent_1px),linear-gradient(to_bottom,var(--border)/0.04_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          <div className="container mx-auto px-4 sm:px-6 relative z-0">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-foreground mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                Live community
              </div>
              <div className="flex justify-center mb-5">
                <div className="h-16 w-16 rounded-2xl bg-primary/15 flex items-center justify-center ring-2 ring-primary/10 animate-forum-float">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-5 text-balance leading-tight">
                <span className="bg-gradient-to-r from-foreground via-foreground/95 to-foreground/90 bg-clip-text text-transparent">
                  {t("forum.title")}
                </span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground text-pretty max-w-2xl mx-auto mb-6">
                Discuss rates, share tips, report scams, and read changer reviews. Built for the Liberia exchange
                community.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground mb-8">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/80 px-3 py-1.5">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <strong className="text-foreground">{allThreads.length}</strong> discussions
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/80 px-3 py-1.5">
                  <Users className="h-4 w-4 text-primary" />
                  <strong className="text-foreground">{totalReplies}</strong> replies
                </span>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="gap-2 rounded-xl h-12 px-6 font-semibold shadow-md hover:shadow-lg hover:scale-105 active:scale-100 transition-all duration-200">
                    <PlusCircle className="h-5 w-5" />
                    {t("forum.newTopic")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border-border/80 shadow-xl">
                  <DialogHeader className="space-y-2">
                    <DialogTitle className="text-xl">{t("forum.newTopic")}</DialogTitle>
                    <DialogDescription>Add a title, pick a category, and write your post.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-5 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="topic-title" className="text-sm font-medium">Title</Label>
                      <Input
                        id="topic-title"
                        placeholder="e.g. Fake bills at Red Light market"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="h-11 rounded-lg border-border/80"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-sm font-medium">Category</Label>
                      <Select
                        value={newCategory}
                        onValueChange={(v) => setNewCategory(v as ForumCategoryKey)}
                      >
                        <SelectTrigger className="h-11 rounded-lg border-border/80 w-full">
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
                      <Label htmlFor="topic-body" className="text-sm font-medium">Message (optional)</Label>
                      <Textarea
                        id="topic-body"
                        placeholder="Share details..."
                        rows={4}
                        value={newBody}
                        onChange={(e) => setNewBody(e.target.value)}
                        className="rounded-lg border-border/80 resize-none"
                      />
                    </div>
                  </div>
                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="rounded-lg">
                      Cancel
                    </Button>
                    <Button type="button" onClick={handleSubmitTopic} disabled={!newTitle.trim()} className="rounded-lg font-medium">
                      Post topic
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-2 justify-center flex-wrap sm:flex-nowrap max-w-full">
                <span className="text-xs text-muted-foreground shrink-0 hidden sm:inline">Filter:</span>
                <Link
                  href="/forums"
                  className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                    !categoryFilter
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  All
                  <span className="ml-0.5 rounded-full bg-black/10 dark:bg-white/10 px-1.5 py-0.5 text-xs font-semibold">
                    {allThreads.length}
                  </span>
                </Link>
                {categoryCounts.map(({ key, count }) => {
                  const cat = CATEGORIES.find((c) => c.key === key)
                  const Icon = cat?.icon ?? MessageSquare
                  const isActive = categoryFilter === key
                  return (
                    <Link
                      key={key}
                      href={count > 0 ? `/forums?category=${key.replace("forum.", "")}` : "/forums"}
                      className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                        isActive ? "bg-primary text-primary-foreground shadow-md" : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground"
                      } ${count === 0 ? "opacity-60 pointer-events-none" : ""}`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      <span className="max-w-[7rem] truncate sm:max-w-none">{t(key)}</span>
                      <span className="ml-0.5 shrink-0 rounded-full bg-black/10 dark:bg-white/10 px-1.5 py-0.5 text-xs font-semibold">
                        {count}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Trending discussions */}
        <section className="py-10 sm:py-14 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </span>
                  {categoryFilter ? t(categoryFilter) : t("forum.trending")}
                </h2>
                {categoryFilter && (
                  <Button asChild variant="outline" size="sm" className="gap-1.5 rounded-lg">
                    <Link href="/forums">
                      <Filter className="h-4 w-4" />
                      Show all
                    </Link>
                  </Button>
                )}
              </div>
              {filteredThreads.length === 0 ? (
                <Card className="border-border/80 rounded-2xl shadow-sm bg-card/50">
                  <CardContent className="py-16 text-center">
                    <p className="text-muted-foreground mb-6">No discussions in this category yet. Start one above.</p>
                    <Button className="gap-2 rounded-xl font-medium" onClick={() => setDialogOpen(true)}>
                      <PlusCircle className="h-4 w-4" />
                      {t("forum.newTopic")}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredThreads.map((thread, index) => {
                    const cat = CATEGORIES.find((c) => c.key === thread.category)
                    const Icon = cat?.icon ?? MessageSquare
                    const bg = cat?.bg ?? "bg-primary/10"
                    const color = cat?.color ?? "text-primary"
                    const isHot = (thread.replies ?? 0) >= 10
                    return (
                      <Link key={thread.id} href={`/forums/thread/${thread.id}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl">
                        <Card
                          className="forum-card-in border-border/80 rounded-2xl shadow-sm hover:shadow-lg hover:border-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 overflow-hidden group h-full"
                          style={{ animationDelay: `${index * 60}ms` }}
                        >
                          <CardContent className="p-4 sm:p-5">
                            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                              <Avatar className="h-10 w-10 shrink-0 ring-2 ring-border/60 group-hover:ring-primary/30 transition-colors">
                                <AvatarFallback className="text-sm font-medium bg-muted">
                                  {thread.author
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <Badge variant="secondary" className={`text-xs font-medium rounded-md ${bg} ${color} border-0`}>
                                    <Icon className="h-3 w-3 mr-1" />
                                    {t(thread.category)}
                                  </Badge>
                                  {isHot && (
                                    <Badge className="rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400 border-0 gap-1">
                                      <Flame className="h-3 w-3" />
                                      Hot
                                    </Badge>
                                  )}
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    {thread.time}
                                  </span>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <MessageCircle className="h-3.5 w-3.5" />
                                    {thread.replies} {thread.replies === 1 ? "reply" : "replies"}
                                  </span>
                                </div>
                                <h3 className="font-semibold text-base sm:text-lg mb-1.5 line-clamp-1 group-hover:text-primary transition-colors">
                                  {thread.title}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">{thread.excerpt}</p>
                                <p className="text-xs text-muted-foreground mt-2 font-medium">{thread.author}</p>
                              </div>
                              <span
                                className="shrink-0 w-full sm:w-auto min-h-10 rounded-lg font-medium border border-primary/30 bg-primary/5 text-center inline-flex items-center justify-center px-4 text-sm group-hover:border-primary group-hover:bg-primary/10 group-hover:text-primary transition-colors"
                                aria-hidden
                              >
                                View
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-10 sm:py-14 bg-muted/30" id="categories">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto min-w-0">
              <h2 className="text-lg sm:text-xl font-semibold mb-6">{t("forum.categories")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CATEGORIES.map(({ key, icon: Icon, color, bg }) => (
                  <Link key={key} href={`/forums?category=${key.replace("forum.", "")}`} className="min-w-0 group block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl">
                    <Card className="h-full border-border/80 rounded-2xl shadow-sm bg-card/80 backdrop-blur-sm hover:shadow-lg hover:border-primary/25 hover:scale-[1.02] active:scale-[0.99] transition-transform duration-200 overflow-hidden">
                      <CardContent className="p-5 sm:p-6 flex items-center gap-4">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${bg} group-hover:scale-105 transition-transform`}>
                          <Icon className={`h-6 w-6 ${color}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-base sm:text-lg truncate group-hover:text-primary transition-colors">{t(key)}</CardTitle>
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
        <section className="py-10 sm:py-14 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mx-auto text-center min-w-0">
              <Card className="border-primary/25 rounded-2xl shadow-lg bg-gradient-to-br from-primary/5 via-card to-primary/5 overflow-hidden hover:shadow-xl hover:scale-[1.02] active:scale-[0.99] transition-all duration-200">
                <CardHeader className="space-y-2 pb-2">
                  <CardTitle className="text-xl">Have something to share?</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Post a scam alert, exchange tip, or review to help others get fair rates.
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button asChild className="gap-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition-shadow h-11">
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
