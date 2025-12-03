"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, MapPin, Star, AlertTriangle, Trophy } from "lucide-react"
import Link from "next/link"

export default function CommunityPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </div>
              <Badge className="mb-4">Community Hub</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
                Built by the Community, for the Community
              </h1>
              <p className="text-lg text-muted-foreground text-pretty">
                Join thousands of Liberians helping each other get fair exchange rates, spot fraud, and share knowledge.
              </p>
            </div>
          </div>
        </section>

        {/* Community Stats */}
        <section className="py-8 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-1">50,234</div>
                      <div className="text-sm text-muted-foreground">Active Members</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-1">15,892</div>
                      <div className="text-sm text-muted-foreground">Rate Reports</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-1">8,456</div>
                      <div className="text-sm text-muted-foreground">Reviews Posted</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-1">98.5%</div>
                      <div className="text-sm text-muted-foreground">Accuracy Rate</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <Tabs defaultValue="reports" className="space-y-6">
                <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 gap-2">
                  <TabsTrigger value="reports">Rate Reports</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                </TabsList>

                {/* Rate Reports Tab */}
                <TabsContent value="reports" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">Recent Rate Reports</h2>
                      <p className="text-muted-foreground">Community-submitted exchange rates from across Liberia</p>
                    </div>
                    <Link href="/community/report-rate">
                      <Button>
                        <MapPin className="h-4 w-4 mr-2" />
                        Submit Rate
                      </Button>
                    </Link>
                  </div>

                  <div className="grid gap-4">
                    {[
                      { location: "Red Light Market", rate: 184.5, user: "John K.", verified: true, time: "5 min ago" },
                      { location: "Broad Street", rate: 185.2, user: "Alice M.", verified: true, time: "12 min ago" },
                      { location: "Sinkor", rate: 183.8, user: "Bob T.", verified: false, time: "25 min ago" },
                      { location: "Paynesville", rate: 182.5, user: "Mary L.", verified: true, time: "1 hour ago" },
                    ].map((report, index) => (
                      <Card key={index}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              <Avatar>
                                <AvatarFallback>
                                  {report.user
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold">{report.user}</span>
                                  {report.verified && (
                                    <Badge variant="secondary" className="text-xs">
                                      Verified
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                                  <MapPin className="h-3 w-3" />
                                  {report.location}
                                </div>
                                <div className="text-2xl font-bold">{report.rate} LRD</div>
                                <p className="text-xs text-muted-foreground mt-1">{report.time}</p>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button size="sm" variant="outline">
                                Confirm
                              </Button>
                              <Button size="sm" variant="ghost">
                                Flag
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Reviews Tab */}
                <TabsContent value="reviews" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">Money Changer Reviews</h2>
                      <p className="text-muted-foreground">Help others by sharing your experiences</p>
                    </div>
                    <Button>
                      <Star className="h-4 w-4 mr-2" />
                      Write Review
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    {[
                      {
                        changer: "First International Bank",
                        rating: 5,
                        user: "Sarah D.",
                        review:
                          "Excellent service and fair rates. Staff was very professional and the transaction was quick.",
                        time: "2 days ago",
                      },
                      {
                        changer: "Liberty Exchange",
                        rating: 4,
                        user: "David W.",
                        review: "Good rates but can get crowded during peak hours. Overall reliable service.",
                        time: "4 days ago",
                      },
                      {
                        changer: "Quick Cash Bureau",
                        rating: 3,
                        user: "Grace N.",
                        review: "Average experience. Rates are okay but you need to negotiate sometimes.",
                        time: "1 week ago",
                      },
                    ].map((review, index) => (
                      <Card key={index}>
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar>
                              <AvatarFallback>
                                {review.user
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <div className="font-semibold">{review.user}</div>
                                  <div className="text-sm text-muted-foreground">{review.changer}</div>
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
                              <p className="text-xs text-muted-foreground">{review.time}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Leaderboard Tab */}
                <TabsContent value="leaderboard" className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Top Contributors</h2>
                    <p className="text-muted-foreground">This month's most active and accurate community members</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="border-secondary">
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

                    <Card>
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

                    <Card>
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

                  <Card>
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
                        ].map((user) => (
                          <div key={user.rank} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                            <div className="text-lg font-bold text-muted-foreground w-8">{user.rank}</div>
                            <Avatar>
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="font-semibold">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.accuracy}% accuracy</div>
                            </div>
                            <div className="text-xl font-bold">{user.points}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">How Community Features Work</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <MapPin className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Submit Rates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Report exchange rates you see at money changers. Each verified report earns you 10 points and
                      helps the community get accurate information.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Star className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Write Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Share your experience with money changers. Help others find trustworthy services and earn 5 points
                      for each verified review.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <AlertTriangle className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Report Fraud</CardTitle>
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
