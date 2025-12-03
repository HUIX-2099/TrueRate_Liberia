"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Trophy, Star, TrendingUp, Bell, MapPin, Flag } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
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
      <main className="flex-1 bg-muted/30">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-b from-primary/10 to-transparent">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
                  <p className="text-muted-foreground">Member since {new Date(user.joinedDate).toLocaleDateString()}</p>
                </div>
                <Button variant="outline" onClick={signOut}>
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Overview */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Your Rank</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-secondary" />
                      <span className="text-2xl font-bold">{user.rank}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Total Points</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-accent" />
                      <span className="text-2xl font-bold">{user.points}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Reports Submitted</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Flag className="h-5 w-5 text-primary" />
                      <span className="text-2xl font-bold">8</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Accuracy Rate</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-secondary" />
                      <span className="text-2xl font-bold">94%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest contributions to the community</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-5 w-5 text-secondary" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold mb-1">Rate Report Verified</div>
                          <p className="text-sm text-muted-foreground">
                            Your report for Red Light Market was verified. +10 points earned!
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                        </div>
                        <Badge variant="secondary">+10</Badge>
                      </div>

                      <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Star className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold mb-1">Review Submitted</div>
                          <p className="text-sm text-muted-foreground">
                            You reviewed First International Bank. +5 points earned!
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                        </div>
                        <Badge variant="secondary">+5</Badge>
                      </div>

                      <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                          <Trophy className="h-5 w-5 text-accent" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold mb-1">Rank Upgraded</div>
                          <p className="text-sm text-muted-foreground">
                            Congratulations! You've been promoted to Rate Guru.
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
                        </div>
                        <Badge>Achievement</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <MapPin className="h-4 w-4 mr-2" />
                      Submit Rate Report
                    </Button>
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <Star className="h-4 w-4 mr-2" />
                      Write a Review
                    </Button>
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <Flag className="h-4 w-4 mr-2" />
                      Report Fraud
                    </Button>
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <Bell className="h-4 w-4 mr-2" />
                      Alert Settings
                    </Button>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Leaderboard</CardTitle>
                    <CardDescription>Top contributors this month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-bold text-secondary">1</div>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">JD</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="text-sm font-medium">You</div>
                          <div className="text-xs text-muted-foreground">150 pts</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-bold text-muted-foreground">2</div>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">AS</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="text-sm font-medium">Alice Smith</div>
                          <div className="text-xs text-muted-foreground">142 pts</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-bold text-muted-foreground">3</div>
                        <Avatar className="h-8 w-8">
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
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
