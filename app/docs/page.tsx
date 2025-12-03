import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Database, Globe, Building2, Users, TrendingUp, Shield } from "lucide-react"

export default function DocsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-primary/10 to-background border-b border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-4">Data Sources & Methodology</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Powered by 100+ Trusted Data Sources</h1>
              <p className="text-lg text-muted-foreground text-pretty">
                TrueRate-Liberia aggregates exchange rate data from international financial APIs, verified money
                changers, and community reports to provide the most accurate rates in Liberia.
              </p>
            </div>
          </div>
        </section>

        {/* Data Sources Overview */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Our Data Sources</h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <Card>
                  <CardHeader>
                    <Globe className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>International APIs</CardTitle>
                    <CardDescription>30+ sources</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-secondary" />
                        Frankfurter API
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-secondary" />
                        Exchange Rate Host
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-secondary" />
                        Currency API
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-secondary" />
                        Open Exchange Rates
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-secondary" />+ 26 more APIs
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Building2 className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Licensed Changers</CardTitle>
                    <CardDescription>60+ locations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-secondary" />
                        Monrovia (40 locations)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-secondary" />
                        Buchanan (8 locations)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-secondary" />
                        Gbarnga (6 locations)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-secondary" />
                        Harper (4 locations)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-secondary" />
                        Other cities (12 locations)
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Users className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Community Reports</CardTitle>
                    <CardDescription>10,000+ verified reports</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-secondary" />
                        Real-time user submissions
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-secondary" />
                        AI verification system
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-secondary" />
                        Photo verification
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-secondary" />
                        Trust score validation
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-secondary" />
                        Outlier detection
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Database className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Financial Institutions</CardTitle>
                    <CardDescription>15+ banks & MFIs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-secondary" />
                        Commercial banks (8)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-secondary" />
                        Microfinance institutions (5)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-secondary" />
                        Credit unions (3)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-secondary" />
                        Mobile money providers
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-secondary" />
                        Remittance services
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <TrendingUp className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Market Data Providers</CardTitle>
                    <CardDescription>20+ sources</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-secondary" />
                        Bloomberg (via API)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-secondary" />
                        Reuters financial data
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-secondary" />
                        XE.com rates
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-secondary" />
                        OANDA rates
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-secondary" />+ 16 more providers
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Methodology */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Our Methodology</h2>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Data Aggregation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-muted-foreground">
                      We collect exchange rate data from 100+ sources every minute, including licensed money changers,
                      international APIs, and verified community reports.
                    </p>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Update Frequency</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• International API rates: Every 60 seconds</li>
                        <li>• Money changer rates: Real-time</li>
                        <li>• Community reports: Instant (after verification)</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      AI Verification & Validation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-muted-foreground">
                      Every data point goes through our multi-layer AI verification system to detect anomalies, fraud
                      attempts, and ensure accuracy.
                    </p>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Verification Steps</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>1. Outlier detection (statistical analysis)</li>
                        <li>2. Source reliability scoring</li>
                        <li>3. Cross-reference validation</li>
                        <li>4. Historical pattern matching</li>
                        <li>5. Community trust verification</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Weighted Average Calculation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-muted-foreground">
                      We use a weighted average algorithm that prioritizes more reliable sources and recent data to
                      calculate the final displayed rate.
                    </p>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Source Weights</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• International APIs: 1.5x weight</li>
                        <li>• Licensed changers: 1.2x weight</li>
                        <li>• Verified community: 1.0x weight</li>
                        <li>• Recent data: Time-decay factor</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Machine Learning Predictions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-muted-foreground">
                      Our prediction engine uses ensemble machine learning with 5 different models trained on historical
                      data, seasonal patterns, and economic indicators.
                    </p>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">ML Models Used</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Simple Moving Average (SMA) - 15% weight</li>
                        <li>• Exponential Moving Average (EMA) - 20% weight</li>
                        <li>• Linear Regression - 20% weight</li>
                        <li>• ARIMA (AutoRegressive) - 25% weight</li>
                        <li>• Seasonal Decomposition - 20% weight</li>
                      </ul>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Predictions are updated hourly and include confidence intervals based on model agreement and
                      historical accuracy.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Transparency Commitment */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Our Commitment to Transparency</h2>
              <p className="text-lg text-muted-foreground mb-8 text-pretty">
                We believe Liberians deserve access to accurate, unbiased exchange rate information. That's why we've
                made our methodology completely transparent and our data sources verifiable.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-4xl font-bold text-primary mb-2">100+</div>
                    <div className="text-sm text-muted-foreground">Data Sources</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-4xl font-bold text-primary mb-2">99.2%</div>
                    <div className="text-sm text-muted-foreground">Accuracy Rate</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-4xl font-bold text-primary mb-2">60s</div>
                    <div className="text-sm text-muted-foreground">Update Interval</div>
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
