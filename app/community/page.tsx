"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Users,
  MapPin,
  MapPinned,
  Star,
  AlertTriangle,
  Trophy,
  Gift,
  Share2,
  MessageSquare,
  CheckCircle,
  Sparkles,
  ThumbsUp,
  PenLine,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { GamificationProfile } from "@/components/gamification"
import { ReferralProgram } from "@/components/referral-program"
import { SocialSharing, QuickShareButtons } from "@/components/social-sharing"
import { PageHero } from "@/components/layout/page-hero"
import { useAuth } from "@/lib/auth/auth-context"
import { useLiveRate } from "@/lib/live-rate-context"
import { useToast } from "@/hooks/use-toast"
import { useState, useCallback, useEffect } from "react"

const REVIEWS_STORAGE_KEY = "truerate-community-reviews"
const REVIEW_MAX_LEN = 600

interface Review {
  id: string
  changer: string
  rating: number
  user: string
  review: string
  time: string
  helpful: number
}

const MOCK_REVIEWS: Review[] = [
  { id: "r1", changer: "Duala Money Exchange", rating: 5, user: "Sarah D.", review: "Excellent service and fair rates. Staff was very professional and the transaction was quick. Best rate I found all day!", time: "2 days ago", helpful: 24 },
  { id: "r2", changer: "Liberty Exchange", rating: 4, user: "David W.", review: "Good rates but can get crowded during peak hours. Overall reliable service. They always have cash available.", time: "4 days ago", helpful: 18 },
  { id: "r3", changer: "Red Light Quick Cash", rating: 3, user: "Grace N.", review: "Average experience. Rates are okay but you need to negotiate sometimes. Be careful and count your money.", time: "1 week ago", helpful: 12 },
]

function loadUserReviews(): Review[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(REVIEWS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Review[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveUserReviews(reviews: Review[]): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews))
  } catch {
    // ignore
  }
}

export default function CommunityPage() {
  const { user } = useAuth()
  const { effectiveRate: currentRate } = useLiveRate()
  const { toast } = useToast()
  const [reportActions, setReportActions] = useState<Record<string, "confirm" | "flag" | null>>({})
  const [reviewHelpful, setReviewHelpful] = useState<Record<string, number>>({})
  const [userReviews, setUserReviews] = useState<Review[]>(loadUserReviews)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [newChanger, setNewChanger] = useState("")
  const [newRating, setNewRating] = useState(5)
  const [newReviewText, setNewReviewText] = useState("")
  const [starBump, setStarBump] = useState<number | null>(null)

  const REVIEW_PROMPTS = [
    "Fair rate vs others nearby",
    "Short wait / long queue",
    "Counted money with me",
    "Clear fees—no surprises",
    "Would send family here",
    "Watch for … (your tip)",
  ] as const

  const appendReviewPrompt = useCallback((snippet: string) => {
    setNewReviewText((prev) => {
      const next = prev.trim() ? `${prev.trim()} ${snippet}` : snippet
      return next.length > REVIEW_MAX_LEN ? next.slice(0, REVIEW_MAX_LEN) : next
    })
  }, [])

  const allReviews = [...userReviews, ...MOCK_REVIEWS]

  const handleReportAction = useCallback((index: number, action: "confirm" | "flag") => {
    setReportActions((prev) => ({ ...prev, [index]: action }))
    toast({
      title: action === "confirm" ? "Thanks for confirming this" : "Thanks for flagging this",
      description: action === "confirm" ? "Your check helps others trust what they see." : "Our team will review this report shortly.",
    })
  }, [toast])

  const handleHelpful = useCallback((id: string, current: number) => {
    setReviewHelpful((prev) => ({ ...prev, [id]: (prev[id] ?? current) + 1 }))
  }, [])

  const handleSubmitReview = useCallback(() => {
    const changer = newChanger.trim()
    const text = newReviewText.trim().slice(0, REVIEW_MAX_LEN)
    if (!changer || !text) return
    const review: Review = {
      id: `r-${Date.now()}`,
      changer,
      rating: newRating,
      user: "You",
      review: text,
      time: "Just now",
      helpful: 0,
    }
    const next = [review, ...userReviews]
    setUserReviews(next)
    saveUserReviews(next)
    setNewChanger("")
    setNewRating(5)
    setNewReviewText("")
    setReviewDialogOpen(false)
    toast({
      title: "Thanks for sharing your experience",
      description: "Your note helps others make safer choices. +5 pts added to your profile.",
    })
  }, [newChanger, newRating, newReviewText, userReviews, toast])


  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1 min-w-0 pb-20 md:pb-0 overflow-x-hidden">
        <PageHero
          ariaLabel="Community hub"
          label="Community Hub"
          title="Built by the community, for every Liberian dollar"
          description="Live FX, street prices, and practical tools shaped by people sharing what they see, who they trust, and what others should avoid."
          variant="centered"
          badges={
            <>
              <Badge>Community Hub</Badge>
              <Badge className="bg-muted/40 border border-border/40 text-primary">Crowd-powered clarity</Badge>
            </>
          }
          contentMaxWidth="max-w-4xl"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mt-6">
            <QuickShareButtons rate={currentRate} />
            <SocialSharing
              data={{
                type: "rate",
                rate: currentRate,
                message:
                  "Rates, prices, budgets & safety tools for Liberia—see what’s fair before you spend or send.",
              }}
              trigger={
                <Button
                  variant="outline"
                  className="gap-2 w-full sm:w-auto rounded-xl border-border/50 hover:border-border/70 transition-colors"
                >
                  <Share2 className="h-4 w-4 text-primary" />
                  Share TrueRate
                </Button>
              }
            />
          </div>
        </PageHero>

        {/* Quick links */}
        <section className="py-4 sm:py-6 bg-background border-b border-border/40">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <Link href="/forums" className="block min-w-0">
                  <Card className="h-full rounded-2xl border-border/40 shadow-sm hover:border-border/60 transition-colors">
                    <CardContent className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                      <div className="h-10 w-10 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-center shrink-0">
                        <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-semibold">Forums</div>
                        <div className="text-xs text-muted-foreground">Money life: budgets, business, diaspora & scams</div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/community/report-rate" className="block min-w-0">
                  <Card className="h-full rounded-2xl border-border/40 shadow-sm hover:border-border/60 transition-colors">
                    <CardContent className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                      <div className="h-10 w-10 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-center shrink-0">
                        <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-semibold">Report street reality</div>
                        <div className="text-xs text-muted-foreground">FX, fees, or what you paid today</div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/market" className="block min-w-0">
                  <Card className="h-full rounded-2xl border-border/40 shadow-sm hover:border-border/60 transition-colors">
                    <CardContent className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                      <div className="h-10 w-10 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-center shrink-0">
                        <MapPinned className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-semibold">Today&apos;s market</div>
                        <div className="text-xs text-muted-foreground">Prices, changers & context</div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Community Stats */}
        <section className="py-6 sm:py-8 md:py-10 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <div className="flex items-center gap-2 rounded-full border border-border/40 bg-card/70 px-3 py-2">
                  <Users className="h-4 w-4 text-primary" />
                  <div className="leading-tight">
                    <div className="text-base sm:text-lg font-bold text-primary">50,234</div>
                    <div className="text-[11px] text-muted-foreground">Active Members</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-border/40 bg-card/70 px-3 py-2">
                  <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <div className="leading-tight">
                    <div className="text-base sm:text-lg font-bold text-secondary">15,892</div>
                    <div className="text-[11px] text-muted-foreground">Street updates</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-border/40 bg-card/70 px-3 py-2">
                  <Star className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <div className="leading-tight">
                    <div className="text-base sm:text-lg font-bold text-amber-600">8,456</div>
                    <div className="text-[11px] text-muted-foreground">Notes & reviews</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-border/40 bg-card/70 px-3 py-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <div className="leading-tight">
                    <div className="text-base sm:text-lg font-bold text-green-600">98.5%</div>
                    <div className="text-[11px] text-muted-foreground">Signals cross-checked</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8 sm:py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto min-w-0">
              <div className="text-center mb-8 space-y-3">
                <p className="text-sm text-muted-foreground mb-2">Community features</p>
                <h2 className="text-xl sm:text-2xl font-bold text-balance text-foreground">
                  Your voice on the money map
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
                  Chip in with what you saw, who treated you fairly, and what others should watch for—so Liberians spend,
                  send, and plan with confidence (not guesswork).
                </p>
              </div>
              <Tabs defaultValue="reports" className="space-y-4 sm:space-y-6">
                <TabsList className="w-full md:w-auto flex flex-nowrap overflow-x-auto overflow-y-hidden gap-1 sm:gap-2 pb-1 -mx-1 px-1 sm:mx-0 sm:px-0 scrollbar-thin">
                  <TabsTrigger value="reports" className="whitespace-nowrap min-h-10 flex-shrink-0 data-[state=active]:shadow-sm">
                    Street updates
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="whitespace-nowrap min-h-10 flex-shrink-0 data-[state=active]:shadow-sm">
                    Reviews & notes
                  </TabsTrigger>
                  <TabsTrigger value="leaderboard" className="whitespace-nowrap min-h-10 flex-shrink-0">Leaderboard</TabsTrigger>
                  <TabsTrigger value="profile" className="whitespace-nowrap min-h-10 flex-shrink-0">My Profile</TabsTrigger>
                  <TabsTrigger value="referral" className="whitespace-nowrap min-h-10 flex-shrink-0">Referrals</TabsTrigger>
                </TabsList>

                {/* Rate Reports Tab */}
                <TabsContent value="reports" className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Live from the street</p>
                      <h2 className="text-xl sm:text-2xl font-bold">What people are seeing</h2>
                      <p className="text-muted-foreground">
                        Crowd snapshots of FX and money spots—one piece of the puzzle next to prices, tools, and official
                        sources on TrueRate.
                      </p>
                    </div>
                    <Link href="/community/report-rate">
                      <Button className="w-full sm:w-auto rounded-xl min-h-[44px] shadow-sm gap-2">
                        <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        Add an update
                      </Button>
                    </Link>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    {[
                      { location: "Red Light Market", rate: 198.5, user: "John K.", verified: true, time: "5 min ago", points: 10 },
                      { location: "Broad Street", rate: 199.2, user: "Alice M.", verified: true, time: "12 min ago", points: 10 },
                      { location: "Sinkor", rate: 197.8, user: "Bob T.", verified: false, time: "25 min ago", points: 5 },
                      { location: "Paynesville", rate: 198.5, user: "Mary L.", verified: true, time: "1 hour ago", points: 10 },
                      { location: "Duala Market", rate: 199.0, user: "James D.", verified: true, time: "2 hours ago", points: 10 },
                    ].map((report, index) => {
                      const action = reportActions[index]
                      return (
                        <Card
                          key={index}
                          className="rounded-xl border-border/40 shadow-none transition-colors duration-200 bg-card/70 hover:bg-muted/30 hover:border-primary/15"
                        >
                          <CardContent className="p-3 sm:p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                <Avatar className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 text-primary">
                                  <AvatarFallback className="text-xs">
                                    {report.user
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className="font-semibold">{report.user}</span>
                                    {report.verified && (
                                      <Badge variant="secondary" className="text-xs">
                                        Verified
                                      </Badge>
                                    )}
                                    <Badge variant="outline" className="text-xs">
                                      +{report.points} pts
                                    </Badge>
                                    {action && (
                                      <Badge variant={action === "confirm" ? "default" : "secondary"} className="text-xs">
                                        {action === "confirm" ? "Confirmed" : "Flagged"}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                                    <MapPin className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                    {report.location}
                                  </div>
                                  <div className="text-lg sm:text-xl font-bold break-words">{report.rate} LRD</div>
                                  <p className="text-xs text-muted-foreground mt-1">{report.time}</p>
                                </div>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 shrink-0 sm:justify-end">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="min-h-9 touch-manipulation px-3"
                                  disabled={!!action}
                                  onClick={() => handleReportAction(index, "confirm")}
                                >
                                  {action === "confirm" ? "Confirmed" : "Confirm"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="min-h-9 touch-manipulation px-3"
                                  disabled={!!action}
                                  onClick={() => handleReportAction(index, "flag")}
                                >
                                  {action === "flag" ? "Flagged" : "Flag"}
                                </Button>
                                <SocialSharing 
                                  data={{ 
                                    type: 'rate', 
                                    rate: report.rate, 
                                    message: `Rate at ${report.location}` 
                                  }}
                                  trigger={
                                    <Button size="sm" variant="ghost" className="min-h-9 touch-manipulation px-2">
                                      <Share2 className="h-4 w-4 text-primary" />
                                    </Button>
                                  }
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </TabsContent>

                {/* Reviews Tab */}
                <TabsContent value="reviews" className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Community voice</p>
                      <h2 className="text-xl sm:text-2xl font-bold">Reviews & quick notes</h2>
                      <p className="text-muted-foreground">
                        Shout out honest changers and agents—or warn others about queues, fees, and sketchy behavior.
                        This sits alongside TrueRate&apos;s prices, budgets, and safety tools, not instead of them.
                      </p>
                    </div>
                    <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full sm:w-auto rounded-xl min-h-[44px] shadow-sm gap-2">
                          <PenLine className="h-4 w-4 text-primary" />
                          Drop a note
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto border-border/40 bg-card shadow-lg">
                        <DialogHeader className="relative space-y-3">
                          <div className="flex items-center gap-2 text-foreground">
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/40 border border-border/40">
                              <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden />
                            </span>
                            <DialogTitle className="text-lg sm:text-xl font-bold tracking-tight">
                              Make it a good comment
                            </DialogTitle>
                          </div>
                          <DialogDescription className="text-sm leading-relaxed">
                            Tell us who you visited, how it felt, and one thing the next person should know—about{" "}
                            <span className="font-medium text-foreground/90">service</span>,{" "}
                            <span className="font-medium text-foreground/90">wait time</span>, or{" "}
                            <span className="font-medium text-foreground/90">trust</span>—not just the number on the
                            board.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="relative grid gap-5 py-2">
                          <div className="grid gap-2">
                            <Label htmlFor="review-changer" className="text-foreground">
                              Who / where?
                            </Label>
                            <Input
                              id="review-changer"
                              placeholder="e.g. Quick Cash · Sinkor"
                              value={newChanger}
                              onChange={(e) => setNewChanger(e.target.value)}
                              className="rounded-xl border-border/60 transition-shadow focus-visible:ring-2 focus-visible:ring-primary/30"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label className="text-foreground">Mood check</Label>
                            <p className="text-xs text-muted-foreground -mt-1">Tap stars—watch them light up.</p>
                            <div className="flex flex-wrap gap-2 sm:gap-3 rounded-xl border border-border/50 bg-muted/20 p-3">
                              {[1, 2, 3, 4, 5].map((n) => (
                                <button
                                  key={n}
                                  type="button"
                                  onClick={() => {
                                    setNewRating(n)
                                    setStarBump(n)
                                    window.setTimeout(() => setStarBump(null), 220)
                                  }}
                                  className={cn(
                                    "rounded-xl p-2 min-w-[2.75rem] min-h-[2.75rem] flex items-center justify-center touch-manipulation transition-all duration-200",
                                    "hover:bg-background/80 hover:shadow-sm",
                                    n <= newRating ? "bg-secondary/15 scale-105" : "bg-transparent"
                                  )}
                                  aria-label={`${n} stars`}
                                >
                                  <Star
                                    className={cn(
                                      "h-8 w-8 transition-transform duration-200",
                                      starBump === n && "scale-125",
                                      n <= newRating ? "fill-secondary text-secondary drop-shadow-sm" : "text-muted-foreground/50"
                                    )}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="review-text" className="text-foreground">
                              Your comment
                            </Label>
                            <div className="flex flex-wrap gap-2">
                              {REVIEW_PROMPTS.map((p) => (
                                <button
                                  key={p}
                                  type="button"
                                  onClick={() => appendReviewPrompt(p)}
                                  className="rounded-full border border-border/40 bg-muted/20 px-3 py-1 text-[11px] font-medium text-foreground transition-colors hover:bg-muted/40"
                                >
                                  + {p}
                                </button>
                              ))}
                            </div>
                            <Textarea
                              id="review-text"
                              placeholder="Example: Friendly staff, counted the cash with me, took 15 min on a Friday…"
                              rows={5}
                              value={newReviewText}
                              onChange={(e) =>
                                setNewReviewText(e.target.value.slice(0, REVIEW_MAX_LEN))
                              }
                              className="min-h-[120px] rounded-xl border-border/60 resize-y transition-shadow focus-visible:ring-2 focus-visible:ring-primary/30"
                            />
                            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                              <span>
                                {newReviewText.length >= REVIEW_MAX_LEN * 0.85 && newReviewText.length < REVIEW_MAX_LEN
                                  ? "Almost there—say it in a sentence or two."
                                  : "Short & real beats long & vague."}
                              </span>
                              <span className="tabular-nums font-medium text-foreground/70">
                                {newReviewText.length}/{REVIEW_MAX_LEN}
                              </span>
                            </div>
                          </div>
                        </div>
                        <DialogFooter className="gap-2 sm:gap-0 flex-col sm:flex-row">
                          <Button type="button" variant="outline" className="rounded-xl min-h-[44px]" onClick={() => setReviewDialogOpen(false)}>
                            Maybe later
                          </Button>
                          <Button
                            type="button"
                            className="rounded-xl min-h-[44px] gap-2 shadow-sm"
                            onClick={handleSubmitReview}
                            disabled={!newChanger.trim() || !newReviewText.trim()}
                          >
                            <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            Share note (+5 pts)
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    {allReviews.map((review) => {
                      const helpfulCount = reviewHelpful[review.id] ?? review.helpful
                      return (
                        <Card
                          key={review.id}
                          className="rounded-xl border-border/40 shadow-none transition-colors duration-200 bg-card/70 hover:bg-muted/30 hover:border-primary/15"
                        >
                          <CardContent className="p-3 sm:p-4">
                            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                              <Avatar className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 text-primary">
                                <AvatarFallback>
                                  {review.user
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                  <div className="min-w-0">
                                    <div className="font-semibold truncate">{review.user}</div>
                                    <div className="text-sm text-muted-foreground truncate">{review.changer}</div>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${ i < review.rating ? "fill-secondary text-secondary" : "text-muted" }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed mb-2">{review.review}</p>
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                  <p className="text-xs text-muted-foreground">{review.time}</p>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs gap-1.5 rounded-full hover:bg-muted/40 border border-border/40 hover:text-primary transition-all active:scale-95"
                                    onClick={() => handleHelpful(review.id, review.helpful)}
                                  >
                                    <ThumbsUp className="h-3.5 w-3.5 text-primary" />
                                    Helpful ({helpfulCount})
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </TabsContent>

                {/* Leaderboard Tab */}
                <TabsContent value="leaderboard" className="space-y-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold mb-2">Top contributors</h2>
                    <p className="text-muted-foreground">
                      People who report, review, and verify what&apos;s happening on the ground—so rates and stories
                      stay honest.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className="rounded-2xl border-secondary/20 shadow-sm">
                      <CardContent className="pt-6 text-center">
                        <div className="flex justify-center mb-4">
                          <div className="h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center">
                            <Trophy className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                          </div>
                        </div>
                        <Badge variant="secondary" className="mb-2">
                          1st Place
                        </Badge>
                        <Avatar className="h-16 w-16 mx-auto mb-3 text-primary">
                          <AvatarFallback className="text-xl bg-secondary text-secondary-foreground">JD</AvatarFallback>
                        </Avatar>
                        <div className="font-bold text-lg mb-1">John Doe</div>
                        <div className="text-xl sm:text-2xl font-bold text-secondary mb-1">342 pts</div>
                        <div className="text-sm text-muted-foreground">98% accuracy</div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-border/40 shadow-sm">
                      <CardContent className="pt-6 text-center">
                        <div className="flex justify-center mb-4">
                          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                            <Trophy className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                          </div>
                        </div>
                        <Badge variant="outline" className="mb-2">
                          2nd Place
                        </Badge>
                        <Avatar className="h-16 w-16 mx-auto mb-3 text-primary">
                          <AvatarFallback className="text-xl">AS</AvatarFallback>
                        </Avatar>
                        <div className="font-bold text-lg mb-1">Alice Smith</div>
                        <div className="text-xl sm:text-2xl font-bold mb-1">298 pts</div>
                        <div className="text-sm text-muted-foreground">96% accuracy</div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-border/40 shadow-sm">
                      <CardContent className="pt-6 text-center">
                        <div className="flex justify-center mb-4">
                          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                            <Trophy className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                          </div>
                        </div>
                        <Badge variant="outline" className="mb-2">
                          3rd Place
                        </Badge>
                        <Avatar className="h-16 w-16 mx-auto mb-3 text-primary">
                          <AvatarFallback className="text-xl">BJ</AvatarFallback>
                        </Avatar>
                        <div className="font-bold text-lg mb-1">Bob Johnson</div>
                        <div className="text-xl sm:text-2xl font-bold mb-1">276 pts</div>
                        <div className="text-sm text-muted-foreground">95% accuracy</div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="rounded-2xl border-border/40 shadow-sm">
                    <CardHeader>
                      <CardTitle>Full Leaderboard</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { rank: 4, name: "Mary Lee", points: 245, accuracy: 97 },
                          { rank: 5, name: "David Wilson", points: 231, accuracy: 94 },
                          { rank: 6, name: "Sarah Brown", points: 218, accuracy: 96 },
                          { rank: 7, name: "James Taylor", points: 205, accuracy: 93 },
                          { rank: 8, name: "Emma Davis", points: 192, accuracy: 95 },
                          { rank: 9, name: "Michael Johnson", points: 178, accuracy: 92 },
                          { rank: 10, name: "Grace Williams", points: 165, accuracy: 94 },
                        ].map((u) => (
                          <div
                            key={u.rank}
                            className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-muted/50 rounded-lg"
                          >
                            <div className="text-lg font-bold text-muted-foreground w-8">{u.rank}</div>
                            <Avatar>
                              <AvatarFallback>
                                {u.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="font-semibold">{u.name}</div>
                              <div className="text-sm text-muted-foreground">{u.accuracy}% accuracy</div>
                            </div>
                            <div className="text-xl font-bold">{u.points}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Profile Tab - Gamification */}
                <TabsContent value="profile">
                  <GamificationProfile />
                </TabsContent>

                {/* Referral Tab */}
                <TabsContent value="referral" className="space-y-6">
                  <div className="grid lg:grid-cols-2 gap-6">
                    <ReferralProgram />
                    
                    <Card className="rounded-2xl border-border/40 shadow-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Gift className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                          Referral Rewards
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-4 bg-muted/40 border border-border/40 rounded-lg">
                          <h4 className="font-semibold mb-2">How It Works</h4>
                          <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                            <li>Share your unique referral code with friends</li>
                            <li>They sign up using your code</li>
                            <li>Both you and your friend get 1 month of premium SMS alerts FREE!</li>
                            <li>No limit on referrals - keep sharing, keep earning!</li>
                          </ol>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-semibold">Premium Features You&apos;ll Get:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>✅ Daily rate alerts at 8 AM and 4 PM</li>
                            <li>✅ Heads-up on prices &amp; essentials when data moves</li>
                            <li>✅ Instant fraud warnings near you</li>
                            <li>✅ Rate threshold notifications</li>
                            <li>✅ Weekly rate outlook summaries</li>
                          </ul>
                        </div>

                        <div className="p-4 bg-muted/40 border border-border/40 rounded-lg">
                          <h4 className="font-semibold mb-2">Top Referrers This Month</h4>
                          <div className="space-y-2">
                            {[
                              { name: "Moses K.", referrals: 23 },
                              { name: "Fatuma D.", referrals: 18 },
                              { name: "Emmanuel T.", referrals: 15 },
                            ].map((r, i) => (
                              <div key={i} className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2">
                                  <Badge variant="outline">{i + 1}</Badge>
                                  {r.name}
                                </span>
                                <span className="font-semibold">{r.referrals} referrals</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-8 sm:py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto min-w-0">
              <div className="text-center mb-8 space-y-2">
                <Badge variant="outline">How it works</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold">How your input powers TrueRate</h2>
                <p className="text-sm text-muted-foreground max-w-2xl mx-auto mt-2">
                  Community isn&apos;t only FX—it&apos;s the human layer on top of prices, budgets, and tools.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                <Card className="rounded-2xl border-border/40 shadow-sm transition-all hover:shadow-md hover:border-primary/15">
                  <CardHeader className="p-4 sm:p-6">
                    <MapPin className="h-7 w-7 sm:h-8 sm:w-8 mb-2 text-blue-600 dark:text-blue-400" />
                    <CardTitle className="text-base sm:text-lg">Share street updates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Post what you paid, where, and how long it took. Crowd checks keep our live picture closer to
                      reality—alongside official sources and market data on the rest of the app.
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-border/40 shadow-sm transition-all hover:shadow-md hover:border-primary/15">
                  <CardHeader className="p-4 sm:p-6">
                    <Star className="h-7 w-7 sm:h-8 sm:w-8 mb-2 text-amber-600 dark:text-amber-400" />
                    <CardTitle className="text-base sm:text-lg">Leave honest notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Reviews help people pick trustworthy changers and agents. Earn points when others confirm your
                      experience—quality over hype.
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-border/40 shadow-sm transition-all hover:shadow-md hover:border-primary/15">
                  <CardHeader className="p-4 sm:p-6">
                    <AlertTriangle className="h-7 w-7 sm:h-8 sm:w-8 mb-2 text-amber-600 dark:text-amber-400" />
                    <CardTitle className="text-base sm:text-lg">Flag what&apos;s wrong</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Report fraud, gouging, or scams through{" "}
                      <Link href="/report-fraud" className="font-medium text-primary hover:underline">
                        Report fraud
                      </Link>{" "}
                      and community flows. Protecting neighbors earns recognition and keeps the marketplace honest.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
