import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { TrustSignals } from "@/components/trust-signals"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, MapPin, Calculator, BookOpen, Shield } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />

        {/* Quick Access Cards */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Quick Access Tools</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Everything you need to stay informed about USD/LRD exchange rates
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              <Link href="/converter">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Calculator className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">Currency Converter</h3>
                        <p className="text-sm text-muted-foreground">Calculate exchange amounts with real-time rates</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/analytics">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <TrendingUp className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">Rate Analytics</h3>
                        <p className="text-sm text-muted-foreground">View trends, charts, and historical data</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/predictions">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <TrendingUp className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">AI Predictions</h3>
                        <p className="text-sm text-muted-foreground">Machine learning-powered rate forecasts</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/map">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">Interactive Map</h3>
                        <p className="text-sm text-muted-foreground">Find money changers near you</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/community">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">Community</h3>
                        <p className="text-sm text-muted-foreground">Report rates and read reviews</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/report-fraud">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Shield className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">Report Fraud</h3>
                        <p className="text-sm text-muted-foreground">Help keep the community safe</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        <Features />
        <TrustSignals />

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Ready to Get Started?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90 text-pretty">
              Join thousands of Liberians who trust TrueRate for accurate exchange rate information
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/converter">
                  Try Converter <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
                asChild
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
