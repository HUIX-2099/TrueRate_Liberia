import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHero } from "@/components/layout/page-hero"
import { Shield, Users, Globe, Award, Target, Info } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0 overflow-x-hidden">
        <PageHero
          ariaLabel="About TrueRate"
          label="About TrueRate"
          title="Built to help Liberians make safer money decisions"
          description="We exist to make daily money choices clearer, with live rates, market prices, and practical tools people can trust."
          variant="centered"
          badges={
            <>
              <Badge>About TrueRate</Badge>
              <Badge variant="secondary">Liberian-Owned</Badge>
            </>
          }
          contentMaxWidth="max-w-4xl"
        />

        {/* Mission & Vision */}
        <section className="py-12 sm:py-14 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card className="rounded-2xl border-primary/20 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-4">
                  <div className="h-14 w-14 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-center mb-4">
                    <Target className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-2xl text-primary">Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    To give every Liberian clear, trustworthy money information: live rates, fair-price context,
                    and simple planning tools that work across locations and device types.
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-secondary/20 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-4">
                  <div className="h-14 w-14 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-center mb-4">
                    <Award className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-2xl text-secondary">Our Vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    To become Liberia&apos;s most trusted source for everyday money decisions, where people can
                    check rates, understand prices, and plan without guesswork.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* The Problem We Solve */}
        <section className="py-12 sm:py-14 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8 space-y-3">
                <div className="h-10 w-10 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-center mx-auto mb-3">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Why We Exist</p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-balance">
                  <span className="text-foreground">
                    Why TrueRate Liberia Exists
                  </span>
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Understanding the challenges that inspired our mission
                </p>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  For too long, Liberians have had to guess: Is this price fair? Is this rate real? Can I afford
                  this? Street changers offer different rates, banks give limited transparency, and rural communities
                  have little access to reliable financial information. That information gap costs families and
                  businesses every day.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  TrueRate was founded in 2024 by Liberian technologists, economists, and community leaders who lived
                  these challenges. We saw remittances lose value to bad rates, small businesses struggle to plan, and
                  people fall victim to fraud. We decided to build more than a rate checker: a practical platform
                  for daily money decisions in Liberia.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Today we combine live rates, real prices, budgets, predictions, and community reporting so every
                  Liberian can make every dollar count—whether exchanging, shopping, saving, or planning ahead.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-12 sm:py-14 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 space-y-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Core Values</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-balance">
                <span className="text-foreground">
                  Our Core Values
                </span>
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                The principles that guide everything we do
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card className="rounded-2xl border-primary/20 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-4">
                  <div className="h-12 w-12 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-center mb-3">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-primary">Trust & Integrity</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">
                    We verify every source, fact-check every rate, and maintain the highest standards of data accuracy.
                    Our users&apos; trust is our most valuable asset.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-secondary/20 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-4">
                  <div className="h-12 w-12 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-center mb-3">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-secondary">Community First</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">
                    We&apos;re built by Liberians, for Liberians. Every feature is designed with input from our community,
                    ensuring we serve real needs.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-amber-500/20 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-4">
                  <div className="h-12 w-12 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-center mb-3">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-amber-600">Accessibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">
                    From smartphones to feature phones, from urban Monrovia to rural counties, we ensure everyone can
                    access the financial information and tools they need.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Platform Facts */}
        <section className="py-12 sm:py-14 md:py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-balance">
                <span className="text-foreground">
                  What the Platform Tracks
                </span>
              </h2>
              <p className="text-sm sm:text-base text-primary-foreground/80">
                Core signals we focus on every day
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-5xl mx-auto text-center">
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2">100+</div>
                <div className="text-primary-foreground/80 text-sm sm:text-base">Rate & price sources</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2">15</div>
                <div className="text-primary-foreground/80 text-sm sm:text-base">Counties covered</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2">60s</div>
                <div className="text-primary-foreground/80 text-sm sm:text-base">Update cadence</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2">2</div>
                <div className="text-primary-foreground/80 text-sm sm:text-base">Market views (CBL + street)</div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
