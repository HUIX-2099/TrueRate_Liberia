import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, Globe, Award, Target } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 sm:py-14 md:py-24 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                <Badge className="mb-2">About TrueRate Liberia</Badge>
                <Badge className="bg-primary/10 text-primary">Founded 2024</Badge>
                <Badge variant="secondary">Liberian-Owned</Badge>
                <Badge className="bg-secondary/10 text-secondary">Community-Driven</Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-balance">
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  Empowering Liberians with Transparent Exchange Rate Information
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
                We're on a mission to bring clarity and fairness to currency exchange in Liberia through technology,
                data, and community trust.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-12 sm:py-14 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-card shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-4">
                  <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Target className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-2xl text-primary">Our Mission</CardTitle>
                    <Badge className="bg-primary/10 text-primary">Purpose</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    To democratize access to accurate, real-time exchange rate information for every Liberian,
                    regardless of location, literacy level, or technological capability. We believe financial
                    transparency is a fundamental right that empowers individuals and strengthens our economy.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-secondary/20 bg-gradient-to-br from-secondary/5 to-card shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-4">
                  <div className="h-14 w-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                    <Award className="h-7 w-7 text-secondary" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-2xl text-secondary">Our Vision</CardTitle>
                    <Badge className="bg-secondary/10 text-secondary">Future</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    To become Liberia's most trusted platform for currency information, setting the standard for
                    financial transparency across West Africa. We envision a future where every Liberian can make
                    informed financial decisions with confidence.
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
                <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                  <Badge variant="outline">Why We Exist</Badge>
                  <Badge className="bg-primary/10 text-primary">The Problem</Badge>
                  <Badge variant="secondary">Our Story</Badge>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-balance">
                  <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                    Why TrueRate Liberia Exists
                  </span>
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Understanding the challenges that inspired our mission
                </p>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  For too long, Liberians have struggled with opaque and inconsistent exchange rates. Street changers
                  offer different rates, banks provide limited transparency, and rural communities have little access to
                  reliable information. This information asymmetry costs Liberians millions of dollars annually through
                  unfair exchanges and fraud.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  TrueRate-Liberia was founded in 2024 by a team of Liberian technologists, economists, and community
                  leaders who experienced these challenges firsthand. We saw families sending remittances lose
                  significant value, small businesses struggle with currency planning, and individuals fall victim to
                  fraudulent changers.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  By aggregating rates from verified sources, leveraging machine learning for predictions, and building
                  a community-driven reporting system, we're creating the transparency that our financial system
                  desperately needs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-12 sm:py-14 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 space-y-3">
              <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                <Badge variant="outline">Core Values</Badge>
                <Badge className="bg-primary/10 text-primary">Principles</Badge>
                <Badge variant="secondary">What Drives Us</Badge>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-balance">
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  Our Core Values
                </span>
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                The principles that guide everything we do
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-card shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-primary">Trust & Integrity</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">
                    We verify every source, fact-check every rate, and maintain the highest standards of data accuracy.
                    Our users' trust is our most valuable asset.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-secondary/20 bg-gradient-to-br from-secondary/5 to-card shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-4">
                  <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-3">
                    <Users className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle className="text-secondary">Community First</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">
                    We're built by Liberians, for Liberians. Every feature is designed with input from our community,
                    ensuring we serve real needs.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-card shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-4">
                  <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3">
                    <Globe className="h-6 w-6 text-amber-600" />
                  </div>
                  <CardTitle className="text-amber-600">Accessibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">
                    From smartphones to feature phones, from urban Monrovia to rural counties, we ensure everyone can
                    access critical rate information.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="py-12 sm:py-14 md:py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 space-y-3">
              <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                <Badge variant="secondary">Our Impact</Badge>
                <Badge className="bg-primary-foreground/10 text-primary-foreground">Measurable Results</Badge>
                <Badge variant="secondary">Growing Strong</Badge>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-balance">
                <span className="bg-gradient-to-r from-primary-foreground via-secondary to-primary-foreground bg-clip-text text-transparent">
                  Our Impact So Far
                </span>
              </h2>
              <p className="text-sm sm:text-base text-primary-foreground/80">
                Real numbers showing how we're making a difference
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
              <div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">50K+</div>
                <div className="text-primary-foreground/80">Monthly Users</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">15+</div>
                <div className="text-primary-foreground/80">Verified Changers</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">98%</div>
                <div className="text-primary-foreground/80">Rate Accuracy</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">$2M+</div>
                <div className="text-primary-foreground/80">Saved from Fraud</div>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-12 sm:py-14 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                <Badge variant="outline">Our Team</Badge>
                <Badge className="bg-primary/10 text-primary">Diverse Experts</Badge>
                <Badge variant="secondary">Liberian Pride</Badge>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-balance">
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  Meet Our Team
                </span>
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground text-pretty max-w-3xl mx-auto">
                TrueRate Liberia is powered by a diverse team of technologists, economists, data scientists, and
                community advocates. We're united by our commitment to financial transparency and our love for Liberia.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
