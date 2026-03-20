"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataCard } from "@/components/ui/data-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Trophy, Star, TrendingUp, Bell, MapPin, Flag, Zap } from "lucide-react"
import { DigestSubscribe } from "@/components/digest-subscribe"
import { PageSection } from "@/components/layout/page-section"
import { PageContainer } from "@/components/layout/page-container"
import { useAuth } from "@/lib/auth/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin")
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-muted/30 pb-20 md:pb-0 overflow-x-hidden" aria-busy="true">
          <PageSection tight className="bg-gradient-to-b from-primary/15 via-primary/5 to-transparent">
            <PageContainer>
              <div className="flex items-center gap-6">
                <Skeleton className="h-20 w-20 rounded-full text-primary" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-8 w-56 rounded text-primary" />
                  <Skeleton className="h-4 w-32 rounded text-primary" />
                </div>
              </div>
            </PageContainer>
          </PageSection>
          <PageSection tight>
            <PageContainer>
              <div className="grid md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-28 rounded-2xl" />
                ))}
              </div>
            </PageContainer>
          </PageSection>
        </main>
        <Footer />
      </div>
    )
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="flex-1 bg-muted/30 pb-20 md:pb-0 overflow-x-hidden" role="main">
        {/* Welcome strip */}
        <PageSection tight className="bg-gradient-to-b from-primary/15 via-primary/5 to-transparent" aria-labelledby="dashboard-welcome">
          <PageContainer>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 text-primary">
                <AvatarFallback className="text-xl sm:text-2xl bg-primary text-primary-foreground font-semibold">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h1 id="dashboard-welcome" className="text-2xl sm:text-3xl font-bold tracking-tight font-display text-balance mb-1">
                  <span className="text-foreground">
                    Welcome back, {user.name}
                  </span>
                </h1>
                <p className="text-sm text-muted-foreground">Member since {new Date(user.joinedDate).toLocaleDateString()}</p>
              </div>
              <Button variant="outline" onClick={signOut} className="shrink-0 rounded-xl min-h-[44px]">
                Sign Out
              </Button>
            </div>
          </PageContainer>
        </PageSection>

        {/* KPI row: DataCards */}
        <PageSection tight aria-labelledby="dashboard-stats">
          <PageContainer>
            <h2 id="dashboard-stats" className="sr-only">Your stats</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <DataCard
                label="Your Rank"
                value={user.rank}
                icon={<Trophy className="h-4 w-4 text-amber-600 dark:text-amber-400" />}
                elevation="default"
              />
              <DataCard
                label="Total Points"
                value={user.points}
                icon={<Star className="h-4 w-4 text-amber-600 dark:text-amber-400" />}
                elevation="default"
              />
              <DataCard
                label="Reports Submitted"
                value="8"
                icon={<Flag className="h-4 w-4 text-primary" />}
                elevation="default"
              />
              <DataCard
                label="Accuracy Rate"
                value="94%"
                icon={<TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />}
                elevation="default"
              />
            </div>
          </PageContainer>
        </PageSection>

        {/* Main Content */}
        <PageSection tight>
          <PageContainer>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Recent Activity */}
              <div className="md:col-span-2">
                <Card className="shadow-institutional transition-institutional hover:shadow-institutional-hover rounded-2xl border-border/40">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold tracking-tight flex items-center gap-2">
                      <span className="h-8 w-8 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </span>
                      Recent Activity
                    </CardTitle>
                    <CardDescription>Your latest contributions to the community</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-4 bg-muted/40 rounded-xl border border-border/40 transition-institutional hover:border-border/60 min-w-0">
                        <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold mb-1">Rate Report Verified</div>
                          <p className="text-sm text-muted-foreground">
                            Your report for Red Light Market was verified. +10 points earned!
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                        </div>
                        <Badge variant="secondary" className="shrink-0">+10</Badge>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-4 bg-muted/40 rounded-xl border border-border/40 transition-institutional hover:border-border/60 min-w-0">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Star className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold mb-1">Review Submitted</div>
                          <p className="text-sm text-muted-foreground">
                            You reviewed First International Bank. +5 points earned!
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                        </div>
                        <Badge variant="secondary" className="shrink-0">+5</Badge>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-4 bg-muted/40 rounded-xl border border-border/40 transition-institutional hover:border-border/60 min-w-0">
                        <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                          <Trophy className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold mb-1">Rank Upgraded</div>
                          <p className="text-sm text-muted-foreground">
                            Congratulations! You&apos;ve been promoted to Rate Guru.
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
                        </div>
                        <Badge className="shrink-0">Achievement</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions & sidebar */}
              <div className="space-y-6">
                <Card className="shadow-institutional rounded-2xl border-border/40">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold tracking-tight flex items-center gap-2">
                      <span className="h-7 w-7 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-center">
                        <Zap className="h-4 w-4 text-primary" />
                      </span>
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full justify-start rounded-xl min-h-[44px]" variant="outline">
                      <MapPin className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                      Submit Rate Report
                    </Button>
                    <Button className="w-full justify-start rounded-xl min-h-[44px]" variant="outline">
                      <Star className="h-4 w-4 mr-2 text-amber-600 dark:text-amber-400" />
                      Write a Review
                    </Button>
                    <Button className="w-full justify-start rounded-xl min-h-[44px]" variant="outline">
                      <Flag className="h-4 w-4 mr-2 text-primary" />
                      Report Fraud
                    </Button>
                    <Button className="w-full justify-start rounded-xl min-h-[44px]" variant="outline">
                      <Bell className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                      Alert Settings
                    </Button>
                  </CardContent>
                </Card>

                <Card className="shadow-institutional rounded-2xl border-border/40">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold tracking-tight flex items-center gap-2">
                      <span className="h-7 w-7 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-center">
                        <Trophy className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      </span>
                      Leaderboard
                    </CardTitle>
                    <CardDescription>Top contributors this month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-bold tabular-nums text-secondary">1</div>
                        <Avatar className="h-8 w-8 text-primary">
                          <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">JD</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="text-sm font-medium">You</div>
                          <div className="text-xs text-muted-foreground">150 pts</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-bold tabular-nums text-muted-foreground">2</div>
                        <Avatar className="h-8 w-8 text-primary">
                          <AvatarFallback className="text-xs">AS</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="text-sm font-medium">Alice Smith</div>
                          <div className="text-xs text-muted-foreground">142 pts</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-bold tabular-nums text-muted-foreground">3</div>
                        <Avatar className="h-8 w-8 text-primary">
                          <AvatarFallback className="text-xs">BJ</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="text-sm font-medium">Bob Johnson</div>
                          <div className="text-xs text-muted-foreground">138 pts</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-6">
                  <DigestSubscribe />
                </div>
              </div>
            </div>
          </PageContainer>
        </PageSection>
      </main>
      <Footer />
    </div>
  )
}
