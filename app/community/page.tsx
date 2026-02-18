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
import { Users, MapPin, MapPinned, Star, AlertTriangle, Trophy, Gift, Share2, MessageSquare, CheckCircle } from "lucide-react"
import Link from "next/link"
import { GamificationProfile } from "@/components/gamification"
import { ReferralProgram } from "@/components/referral-program"
import { SocialSharing, QuickShareButtons } from "@/components/social-sharing"
import { useAuth } from "@/lib/auth/auth-context"
import { useLiveRate } from "@/lib/live-rate-context"
import { useToast } from "@/hooks/use-toast"
import { useState, useCallback, useEffect } from "react"

const REVIEWS_STORAGE_KEY = "truerate-community-reviews"

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
  const [userReviews, setUserReviews] = useState<Review[]>([])
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [newChanger, setNewChanger] = useState("")
  const [newRating, setNewRating] = useState(5)
  const [newReviewText, setNewReviewText] = useState("")

  const allReviews = [...userReviews, ...MOCK_REVIEWS]

  const handleReportAction = useCallback((index: number, action: "confirm" | "flag") => {
    setReportActions((prev) => ({ ...prev, [index]: action }))
    toast({
      title: action === "confirm" ? "Thanks for confirming" : "Report flagged",
      description: action === "confirm" ? "Your confirmation helps the community." : "We'll review this report.",
    })
  }, [toast])

  const handleHelpful = useCallback((id: string, current: number) => {
    setReviewHelpful((prev) => ({ ...prev, [id]: (prev[id] ?? current) + 1 }))
  }, [])

  const handleSubmitReview = useCallback(() => {
    const changer = newChanger.trim()
    const text = newReviewText.trim()
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
    toast({ title: "Review posted", description: "Thanks for helping the community. +5 pts!" })
  }, [newChanger, newRating, newReviewText, userReviews, toast])

  useEffect(() => {
    setUserReviews(loadUserReviews())
  }, [])

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1 min-w-0">
        {/* Hero Section */}
        <section className="py-10 sm:py-14 md:py-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center min-w-0">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                <Badge className="mb-2">Community Hub</Badge>
                <Badge className="bg-primary/10 text-primary">50K+ Members</Badge>
                <Badge variant="secondary">Crowdsourced Data</Badge>
                <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400">Trusted Network</Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-balance">
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  Built by the Community, for the Community
                </span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground text-pretty max-w-3xl mx-auto">
                Join thousands of Liberians helping each other get fair exchange rates, spot fraud, and share knowledge.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mt-6">
                <QuickShareButtons rate={currentRate} />
                <SocialSharing 
                  data={{ type: 'rate', rate: currentRate, message: 'Check out the current USD rate!' }}
                  trigger={
                    <Button variant="outline" className="gap-2 w-full sm:w-auto">
                      <Share2 className="h-4 w-4" />
                      Share Rate
                    </Button>
                  }
                />
              </div>
            </div>
          </div>
        </section>

        {/* Quick links */}
        <section className="py-4 sm:py-6 bg-background border-b border-border/40">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <Link href="/forums" className="block min-w-0">
                  <Card className="h-full border-border/60 shadow-sm hover:shadow-md hover:border-primary/20 transition-all">
                    <CardContent className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                      <div className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                        <MessageSquare className="h-6 w-6 text-violet-500" />
                      </div>
                      <div>
                        <div className="font-semibold">Forums</div>
                        <div className="text-xs text-muted-foreground">Discuss rates, tips & scams</div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/community/report-rate" className="block min-w-0">
                  <Card className="h-full border-border/60 shadow-sm hover:shadow-md hover:border-primary/20 transition-all">
                    <CardContent className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">Report a rate</div>
                        <div className="text-xs text-muted-foreground">Submit exchange rate</div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/map" className="block min-w-0">
                  <Card className="h-full border-border/60 shadow-sm hover:shadow-md hover:border-primary/20 transition-all">
                    <CardContent className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                      <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <MapPinned className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <div className="font-semibold">Find changers</div>
                        <div className="text-xs text-muted-foreground">Map & locations</div>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-card shadow-sm hover:shadow-md transition-all overflow-hidden">
                  <CardContent className="pt-8 pb-6 relative">
                    <div className="absolute top-4 right-4 opacity-10">
                      <Users className="h-12 w-12 text-primary" />
                    </div>
                    <div className="text-center relative">
                      <div className="text-4xl font-bold text-primary mb-2">50,234</div>
                      <div className="text-sm text-muted-foreground">Active Members</div>
                      <div className="text-xs text-primary/70 mt-1">Growing daily</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-secondary/20 bg-gradient-to-br from-secondary/5 to-card shadow-sm hover:shadow-md transition-all overflow-hidden">
                  <CardContent className="pt-8 pb-6 relative">
                    <div className="absolute top-4 right-4 opacity-10">
                      <MapPin className="h-12 w-12 text-secondary" />
                    </div>
                    <div className="text-center relative">
                      <div className="text-4xl font-bold text-secondary mb-2">15,892</div>
                      <div className="text-sm text-muted-foreground">Rate Reports</div>
                      <div className="text-xs text-secondary/70 mt-1">Real-time updates</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-card shadow-sm hover:shadow-md transition-all overflow-hidden">
                  <CardContent className="pt-8 pb-6 relative">
                    <div className="absolute top-4 right-4 opacity-10">
                      <Star className="h-12 w-12 text-amber-600" />
                    </div>
                    <div className="text-center relative">
                      <div className="text-4xl font-bold text-amber-600 mb-2">8,456</div>
                      <div className="text-sm text-muted-foreground">Reviews Posted</div>
                      <div className="text-xs text-amber-600/70 mt-1">Community driven</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-card shadow-sm hover:shadow-md transition-all overflow-hidden">
                  <CardContent className="pt-8 pb-6 relative">
                    <div className="absolute top-4 right-4 opacity-10">
                      <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                    <div className="text-center relative">
                      <div className="text-4xl font-bold text-green-600 mb-2">98.5%</div>
                      <div className="text-sm text-muted-foreground">Accuracy Rate</div>
                      <div className="text-xs text-green-600/70 mt-1">Verified data</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8 sm:py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto min-w-0">
              <div className="text-center mb-8 space-y-3">
                <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                  <Badge variant="outline">Community Features</Badge>
                  <Badge className="bg-primary/10 text-primary">Interactive</Badge>
                  <Badge variant="secondary">Earn Rewards</Badge>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-balance">
                  <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                    Join the Conversation
                  </span>
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Participate, earn points, and help build a stronger community
                </p>
              </div>
              <Tabs defaultValue="reports" className="space-y-4 sm:space-y-6">
                <TabsList className="w-full md:w-auto flex flex-nowrap overflow-x-auto overflow-y-hidden gap-1 sm:gap-2 pb-1 -mx-1 px-1 sm:mx-0 sm:px-0 scrollbar-thin">
                  <TabsTrigger value="reports" className="whitespace-nowrap min-h-10 flex-shrink-0">Rate Reports</TabsTrigger>
                  <TabsTrigger value="reviews" className="whitespace-nowrap min-h-10 flex-shrink-0">Reviews</TabsTrigger>
                  <TabsTrigger value="leaderboard" className="whitespace-nowrap min-h-10 flex-shrink-0">Leaderboard</TabsTrigger>
                  <TabsTrigger value="profile" className="whitespace-nowrap min-h-10 flex-shrink-0">My Profile</TabsTrigger>
                  <TabsTrigger value="referral" className="whitespace-nowrap min-h-10 flex-shrink-0">Referrals</TabsTrigger>
                </TabsList>

                {/* Rate Reports Tab */}
                <TabsContent value="reports" className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">Rate Reports</Badge>
                        <Badge className="bg-primary/10 text-primary">Real-time</Badge>
                        <Badge variant="secondary">Verified</Badge>
                      </div>
                      <h2 className="text-2xl font-bold">Recent Rate Reports</h2>
                      <p className="text-muted-foreground">Community-submitted exchange rates from across Liberia</p>
                    </div>
                    <Link href="/community/report-rate">
                      <Button className="w-full sm:w-auto shadow-sm gap-2">
                        <MapPin className="h-4 w-4" />
                        Submit Rate
                      </Button>
                    </Link>
                  </div>

                  <div className="grid gap-4">
                    {[
                      { location: "Red Light Market", rate: 198.5, user: "John K.", verified: true, time: "5 min ago", points: 10 },
                      { location: "Broad Street", rate: 199.2, user: "Alice M.", verified: true, time: "12 min ago", points: 10 },
                      { location: "Sinkor", rate: 197.8, user: "Bob T.", verified: false, time: "25 min ago", points: 5 },
                      { location: "Paynesville", rate: 198.5, user: "Mary L.", verified: true, time: "1 hour ago", points: 10 },
                      { location: "Duala Market", rate: 199.0, user: "James D.", verified: true, time: "2 hours ago", points: 10 },
                    ].map((report, index) => {
                      const action = reportActions[index]
                      return (
                        <Card key={index} className="border-border/60 shadow-sm overflow-hidden">
                          <CardContent className="p-4 sm:p-6">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                              <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                                <Avatar className="h-9 w-9 sm:h-10 sm:w-10 shrink-0">
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
                                    <MapPin className="h-3 w-3" />
                                    {report.location}
                                  </div>
                                  <div className="text-xl sm:text-2xl font-bold break-words">{report.rate} LRD</div>
                                  <p className="text-xs text-muted-foreground mt-1">{report.time}</p>
                                </div>
                              </div>
                              <div className="flex flex-wrap md:flex-col gap-2 md:items-end shrink-0">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full sm:w-auto md:w-full min-h-9 touch-manipulation"
                                  disabled={!!action}
                                  onClick={() => handleReportAction(index, "confirm")}
                                >
                                  {action === "confirm" ? "Confirmed" : "Confirm"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="w-full sm:w-auto md:w-full"
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
                                    <Button size="sm" variant="ghost" className="w-full sm:w-auto md:w-full">
                                      <Share2 className="h-4 w-4" />
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
                <TabsContent value="reviews" className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">Reviews</Badge>
                        <Badge className="bg-secondary/10 text-secondary">Community Driven</Badge>
                        <Badge variant="secondary">Helpful</Badge>
                      </div>
                      <h2 className="text-2xl font-bold">Money Changer Reviews</h2>
                      <p className="text-muted-foreground">Help others by sharing your experiences</p>
                    </div>
                    <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full sm:w-auto shadow-sm gap-2">
                          <Star className="h-4 w-4" />
                          Write Review
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-lg sm:text-xl">Write a review</DialogTitle>
                          <DialogDescription>Share your experience at a money changer. Helps others find fair rates.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="review-changer">Changer name / location</Label>
                            <Input
                              id="review-changer"
                              placeholder="e.g. Quick Cash Sinkor"
                              value={newChanger}
                              onChange={(e) => setNewChanger(e.target.value)}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>Rating</Label>
                            <div className="flex gap-1 sm:gap-2">
                              {[1, 2, 3, 4, 5].map((n) => (
                                <button
                                  key={n}
                                  type="button"
                                  onClick={() => setNewRating(n)}
                                  className="p-2 sm:p-1 rounded hover:bg-muted min-w-[2.75rem] min-h-[2.75rem] sm:min-w-0 sm:min-h-0 flex items-center justify-center touch-manipulation"
                                  aria-label={`${n} stars`}
                                >
                                  <Star
                                    className={`h-7 w-7 sm:h-8 sm:w-8 ${n <= newRating ? "fill-secondary text-secondary" : "text-muted"}`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="review-text">Your review</Label>
                            <Textarea
                              id="review-text"
                              placeholder="How was the rate? Service? Any tips?"
                              rows={4}
                              value={newReviewText}
                              onChange={(e) => setNewReviewText(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setReviewDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            onClick={handleSubmitReview}
                            disabled={!newChanger.trim() || !newReviewText.trim()}
                          >
                            Post review
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="grid gap-4">
                    {allReviews.map((review) => {
                      const helpfulCount = reviewHelpful[review.id] ?? review.helpful
                      return (
                        <Card key={review.id} className="border-border/60 shadow-sm overflow-hidden">
                          <CardContent className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                              <Avatar className="h-9 w-9 sm:h-10 sm:w-10 shrink-0">
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
                                        className={`h-4 w-4 ${
                                          i < review.rating ? "fill-secondary text-secondary" : "text-muted"
                                        }`}
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
                                    className="text-xs"
                                    onClick={() => handleHelpful(review.id, review.helpful)}
                                  >
                                    👍 Helpful ({helpfulCount})
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
                    <h2 className="text-2xl font-bold mb-2">Top Contributors</h2>
                    <p className="text-muted-foreground">This month's most active and accurate community members</p>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className="border-secondary/60 shadow-sm">
                      <CardContent className="pt-6 text-center">
                        <div className="flex justify-center mb-4">
                          <div className="h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center">
                            <Trophy className="h-8 w-8 text-secondary" />
                          </div>
                        </div>
                        <Badge variant="secondary" className="mb-2">
                          1st Place
                        </Badge>
                        <Avatar className="h-16 w-16 mx-auto mb-3">
                          <AvatarFallback className="text-xl bg-secondary text-secondary-foreground">JD</AvatarFallback>
                        </Avatar>
                        <div className="font-bold text-lg mb-1">John Doe</div>
                        <div className="text-2xl font-bold text-secondary mb-1">342 pts</div>
                        <div className="text-sm text-muted-foreground">98% accuracy</div>
                      </CardContent>
                    </Card>

                    <Card className="border-border/60 shadow-sm">
                      <CardContent className="pt-6 text-center">
                        <div className="flex justify-center mb-4">
                          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                            <Trophy className="h-8 w-8 text-muted-foreground" />
                          </div>
                        </div>
                        <Badge variant="outline" className="mb-2">
                          2nd Place
                        </Badge>
                        <Avatar className="h-16 w-16 mx-auto mb-3">
                          <AvatarFallback className="text-xl">AS</AvatarFallback>
                        </Avatar>
                        <div className="font-bold text-lg mb-1">Alice Smith</div>
                        <div className="text-2xl font-bold mb-1">298 pts</div>
                        <div className="text-sm text-muted-foreground">96% accuracy</div>
                      </CardContent>
                    </Card>

                    <Card className="border-border/60 shadow-sm">
                      <CardContent className="pt-6 text-center">
                        <div className="flex justify-center mb-4">
                          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                            <Trophy className="h-8 w-8 text-muted-foreground" />
                          </div>
                        </div>
                        <Badge variant="outline" className="mb-2">
                          3rd Place
                        </Badge>
                        <Avatar className="h-16 w-16 mx-auto mb-3">
                          <AvatarFallback className="text-xl">BJ</AvatarFallback>
                        </Avatar>
                        <div className="font-bold text-lg mb-1">Bob Johnson</div>
                        <div className="text-2xl font-bold mb-1">276 pts</div>
                        <div className="text-sm text-muted-foreground">95% accuracy</div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="border-border/60 shadow-sm">
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
                    
                    <Card className="border-border/60 shadow-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Gift className="h-5 w-5 text-secondary" />
                          Referral Rewards
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-4 bg-secondary/10 rounded-lg">
                          <h4 className="font-semibold mb-2">How It Works</h4>
                          <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                            <li>Share your unique referral code with friends</li>
                            <li>They sign up using your code</li>
                            <li>Both you and your friend get 1 month of premium SMS alerts FREE!</li>
                            <li>No limit on referrals - keep sharing, keep earning!</li>
                          </ol>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-semibold">Premium Features You'll Get:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>✅ Daily rate alerts at 8 AM and 4 PM</li>
                            <li>✅ Instant fraud warnings near you</li>
                            <li>✅ Rate threshold notifications</li>
                            <li>✅ Weekly AI prediction summaries</li>
                          </ul>
                        </div>

                        <div className="p-4 bg-accent/10 rounded-lg">
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
                <h2 className="text-3xl font-bold">How Community Features Work</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                <Card className="border-border/60 shadow-sm">
                  <CardHeader className="p-4 sm:p-6">
                    <MapPin className="h-7 w-7 sm:h-8 sm:w-8 text-primary mb-2" />
                    <CardTitle className="text-base sm:text-lg">Submit Rates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Report exchange rates you see at money changers. Each verified report earns you 10 points and
                      helps the community get accurate information.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/60 shadow-sm">
                  <CardHeader className="p-4 sm:p-6">
                    <Star className="h-7 w-7 sm:h-8 sm:w-8 text-primary mb-2" />
                    <CardTitle className="text-base sm:text-lg">Write Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Share your experience with money changers. Help others find trustworthy services and earn 5 points
                      for each verified review.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/60 shadow-sm">
                  <CardHeader className="p-4 sm:p-6">
                    <AlertTriangle className="h-7 w-7 sm:h-8 sm:w-8 text-primary mb-2" />
                    <CardTitle className="text-base sm:text-lg">Report Fraud</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Alert the community about suspicious activity, unfair rates, or counterfeit currency. Protecting
                      others earns you 20 points and special recognition.
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
