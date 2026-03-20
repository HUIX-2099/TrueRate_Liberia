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
  Sparkles,
  PenLine,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/language-context"
import {
  type ForumThread,
  type ForumCategoryKey,
  CATEGORY_KEYS,
  categoryParamToKey,
  loadUserThreads,
  saveUserThreads,
} from "@/lib/forum-data"

const TOPIC_BODY_MAX = 1500

const TOPIC_PROMPTS = [
  "Where & when: ",
  "What I paid / was quoted: ",
  "Red flag I noticed: ",
  "Tip for the next person: ",
] as const

const CATEGORIES = [
  { key: "forum.scamAlerts" as const, icon: ShieldAlert, color: "text-amber-600", bg: "bg-muted/40 border border-border/40" },
  { key: "forum.exchangeTips" as const, icon: Lightbulb, color: "text-emerald-600", bg: "bg-muted/40 border border-border/40" },
  { key: "forum.marketNews" as const, icon: Newspaper, color: "text-blue-600", bg: "bg-muted/40 border border-border/40" },
  { key: "forum.changerReviews" as const, icon: Star, color: "text-violet-600", bg: "bg-muted/40 border border-border/40" },
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

  const [userThreads, setUserThreads] = useState<ForumThread[]>(loadUserThreads)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newCategory, setNewCategory] = useState<ForumCategoryKey>("forum.exchangeTips")
  const [newBody, setNewBody] = useState("")
  const [titleFocusPulse, setTitleFocusPulse] = useState(false)

  const appendTopicPrompt = useCallback((snippet: string) => {
    setNewBody((prev) => {
      const next = prev.trim() ? `${prev.trim()}\n${snippet}` : snippet
      return next.length > TOPIC_BODY_MAX ? next.slice(0, TOPIC_BODY_MAX) : next
    })
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
    const body = newBody.trim().slice(0, TOPIC_BODY_MAX)
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
        <section className="relative overflow-x-hidden min-h-[min(36vh,280px)] sm:min-h-[38vh] dark:to-muted/5 border-b border-border/30 md:border-border/20 py-12 sm:py-16 md:py-20">
          <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none" aria-hidden>
            <div className="absolute inset-0 pointer-events-none md:hidden" aria-hidden />
          </div>
          <div className="absolute -top-20 -right-20 z-0 h-40 w-40 sm:h-52 sm:w-52 md:h-64 md:w-64 rounded-full bg-muted/40 border border-border/40 blur-2xl md:blur-3xl" aria-hidden />
          <div className="absolute top-1/2 -left-10 z-0 h-32 w-32 sm:h-44 sm:w-44 md:h-52 md:w-52 rounded-full bg-muted/40 border border-border/40 blur-2xl md:blur-3xl" aria-hidden />
          <div className="absolute bottom-0 right-1/4 z-0 h-20 w-20 sm:h-28 sm:w-28 rounded-full bg-accent/8 blur-xl md:blur-2xl" aria-hidden />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-muted/30 px-3 py-1.5 text-xs font-medium text-foreground mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                {t("forum.badge")}
              </div>
              <div className="flex justify-center mb-5">
                <div className="h-16 w-16 rounded-2xl bg-muted/30 flex items-center justify-center ring-2 ring-primary/10 animate-forum-float">
                  <MessageSquare className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-5 text-balance leading-tight">
                <span className="hero-headline-gradient relative inline-block pb-1.5 text-foreground">
                  {t("forum.title")}
                </span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground text-pretty max-w-2xl mx-auto mb-6 leading-[1.65] rounded-2xl border border-border/50 bg-muted/25 shadow-inner px-4 py-3.5 sm:px-5 sm:py-4 md:rounded-none md:border-0 md:bg-transparent md:shadow-none md:px-0 md:py-0">
                {t("forum.subtitle")}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground mb-8">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/80 px-3 py-1.5">
                  <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <strong className="text-foreground">{allThreads.length}</strong> discussions ·{" "}
                  <strong className="text-foreground">{totalReplies}</strong> replies
                </span>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="gap-2 rounded-xl min-h-[48px] px-6 font-semibold shadow-md hover:from-primary/95 hover:to-primary/85 hover:shadow-lg transition-all duration-200"
                  >
                    <PenLine className="h-5 w-5 text-primary" />
                    {t("forum.newTopic")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border-primary/20 shadow-xl">
                  <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-muted/40 border border-border/40 blur-3xl" aria-hidden />
                  <DialogHeader className="relative space-y-3">
                    <div className="flex items-center gap-2 text-primary">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted/40 border border-border/40">
                        <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden />
                      </span>
                      <DialogTitle className="text-xl font-bold tracking-tight">{t("forum.newTopic")}</DialogTitle>
                    </div>
                    <DialogDescription className="text-sm leading-relaxed">{t("forum.dialogBlurb")}</DialogDescription>
                  </DialogHeader>
                  <div className="relative grid gap-5 py-2">
                    <div className="grid gap-2">
                      <Label htmlFor="topic-title" className="text-sm font-medium text-foreground">
                        Title
                      </Label>
                      <Input
                        id="topic-title"
                        placeholder="e.g. Rice price jump in Paynesville · what I saw"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onFocus={() => {
                          setTitleFocusPulse(true)
                          window.setTimeout(() => setTitleFocusPulse(false), 400)
                        }}
                        className={cn(
                          "h-11 rounded-xl border-border/80 transition-all duration-300",
                          titleFocusPulse && "ring-2 ring-primary/25 border-primary/30"
                        )}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-sm font-medium text-foreground">Category</Label>
                      <Select
                        value={newCategory}
                        onValueChange={(v) => setNewCategory(v as ForumCategoryKey)}
                      >
                        <SelectTrigger className="h-11 rounded-xl border-border/80 w-full transition-shadow focus:ring-2 focus:ring-primary/20">
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
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <Label htmlFor="topic-body" className="text-sm font-medium text-foreground">
                          {t("forum.topicBodyLabel")}
                        </Label>
                        <span className="text-[11px] text-muted-foreground">{t("forum.topicBodyOptional")}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {TOPIC_PROMPTS.map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => appendTopicPrompt(p)}
                            className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-medium text-primary transition-all hover:bg-muted/40 border-border/40 hover:border-primary/35 active:scale-95"
                          >
                            + {p.trim()}
                          </button>
                        ))}
                      </div>
                      <Textarea
                        id="topic-body"
                        placeholder="Context beats hot takes—what would you tell a cousin before they go?"
                        rows={5}
                        value={newBody}
                        onChange={(e) => setNewBody(e.target.value.slice(0, TOPIC_BODY_MAX))}
                        className="min-h-[130px] rounded-xl border-border/80 resize-y transition-shadow focus-visible:ring-2 focus-visible:ring-primary/30"
                      />
                      <div className="flex justify-end text-[11px] font-medium tabular-nums text-muted-foreground">
                        {newBody.length}/{TOPIC_BODY_MAX}
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="gap-2 sm:gap-0 flex-col sm:flex-row">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                      className="rounded-xl min-h-[44px]"
                    >
                      {t("forum.cancelTopic")}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSubmitTopic}
                      disabled={!newTitle.trim()}
                      className="rounded-xl min-h-[44px] font-semibold gap-2 shadow-md transition-transform"
                    >
                      <PlusCircle className="h-4 w-4 text-primary" />
                      {t("forum.postThread")}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-2 justify-center flex-wrap sm:flex-nowrap max-w-full">
                <span className="text-xs text-muted-foreground shrink-0 hidden sm:inline">Filter:</span>
                <Link
                  href="/forums"
                  className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200 ${ !categoryFilter ? "bg-primary text-primary-foreground shadow-md" : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground" }`}
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
                      className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200 ${ isActive ? "bg-primary text-primary-foreground shadow-md" : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground" } ${count === 0 ? "opacity-60 pointer-events-none" : ""}`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0 text-primary" />
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
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/30">
                    <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </span>
                  {categoryFilter ? t(categoryFilter) : t("forum.trending")}
                </h2>
                {categoryFilter && (
                  <Button asChild variant="outline" size="sm" className="gap-1.5 rounded-lg">
                    <Link href="/forums">
                      <Filter className="h-4 w-4 text-primary" />
                      Show all
                    </Link>
                  </Button>
                )}
              </div>
              {filteredThreads.length === 0 ? (
                <Card className="border-border/40 rounded-2xl shadow-sm bg-card/50">
                  <CardContent className="py-16 text-center">
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">{t("forum.emptyCategory")}</p>
                    <Button className="gap-2 rounded-xl min-h-[44px] font-medium" onClick={() => setDialogOpen(true)}>
                      <PlusCircle className="h-4 w-4 text-primary" />
                      {t("forum.newTopic")}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredThreads.map((thread, index) => {
                    const cat = CATEGORIES.find((c) => c.key === thread.category)
                    const Icon = cat?.icon ?? MessageSquare
                    const bg = cat?.bg ?? "bg-muted/40 border border-border/40"
                    const color = cat?.color ?? "text-primary"
                    const isHot = (thread.replies ?? 0) >= 10
                    return (
                      <Link
                        key={thread.id}
                        href={`/forums/thread/${thread.id}`}
                        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
                      >
                        <Card
                          className="forum-card-in border-border/40 rounded-xl shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 group h-full"
                          style={{ animationDelay: `${index * 60}ms` }}
                        >
                          <CardContent className="p-3 sm:p-4">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-9 w-9 shrink-0 ring-2 ring-border/60 group-hover:ring-primary/25 transition-colors text-primary">
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
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <Badge variant="secondary" className={`text-[11px] font-medium rounded-md ${bg} ${color} border-0`}>
                                    <Icon className="h-3 w-3 text-primary" />
                                    {t(thread.category)}
                                  </Badge>
                                  {isHot && (
                                    <Badge className="rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400 border-0 gap-1 shrink-0 text-[11px]">
                                      <Flame className="h-3 w-3 text-primary" />
                                      Hot
                                    </Badge>
                                  )}
                                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                    {thread.time}
                                  </span>
                                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                    <MessageCircle className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                    {thread.replies} {thread.replies === 1 ? "reply" : "replies"}
                                  </span>
                                </div>
                                <h3 className="font-semibold text-sm sm:text-base mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                                  {thread.title}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-1">{thread.excerpt}</p>
                                <p className="text-xs text-muted-foreground mt-2 font-medium">{thread.author}</p>
                              </div>
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
              <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-6">{t("forum.categories")}</h2>
              <div className="flex flex-wrap gap-2 items-center">
                {CATEGORIES.map(({ key, icon: Icon, color, bg }) => {
                  const { count } = categoryCounts.find((c) => c.key === key) ?? { key, count: 0 }
                  const href = `/forums?category=${key.replace("forum.", "")}`
                  const isDisabled = count === 0
                  return (
                    <Link
                      key={key}
                      href={isDisabled ? "/forums" : href}
                      className={`shrink-0 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-3 py-1.5 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${ isDisabled ? "opacity-60 pointer-events-none" : "hover:bg-muted/40" }`}
                    >
                      <Icon className={`h-4 w-4 ${color}`} />
                      <span className="max-w-[9.5rem] truncate">{t(key)}</span>
                      <span className="ml-1 shrink-0 rounded-full bg-black/10 dark:bg-white/10 px-1.5 py-0.5 text-[11px] font-semibold text-foreground">
                        {count}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-10 sm:py-14 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mx-auto text-center min-w-0">
              <Card className="border-border/40 border-primary/25 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
                <CardHeader className="space-y-2 pb-2">
                  <CardTitle className="text-xl">{t("forum.ctaTitle")}</CardTitle>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t("forum.ctaBody")}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button asChild className="gap-2 rounded-xl min-h-[44px] font-semibold shadow-md hover:shadow-lg transition-shadow">
                    <Link href="/community">
                      <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
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
