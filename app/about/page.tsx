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
        <section className="py-16 md:py-24 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-4">About TrueRate-Liberia</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
                Empowering Liberians with Transparent Exchange Rate Information
              </h1>
              <p className="text-xl text-muted-foreground text-pretty">
                We're on a mission to bring clarity and fairness to currency exchange in Liberia through technology,
                data, and community trust.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card>
                <CardHeader>
                  <Target className="h-10 w-10 text-primary mb-4" />
                  <CardTitle className="text-2xl">Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    To democratize access to accurate, real-time exchange rate information for every Liberian,
                    regardless of location, literacy level, or technological capability. We believe financial
                    transparency is a fundamental right that empowers individuals and strengthens our economy.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Award className="h-10 w-10 text-secondary mb-4" />
                  <CardTitle className="text-2xl">Our Vision</CardTitle>
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
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-balance">
                Why TrueRate-Liberia Exists
              </h2>
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
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-balance">Our Core Values</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card>
                <CardHeader>
                  <Shield className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Trust & Integrity</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">
                    We verify every source, fact-check every rate, and maintain the highest standards of data accuracy.
                    Our users' trust is our most valuable asset.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Users className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Community First</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">
                    We're built by Liberians, for Liberians. Every feature is designed with input from our community,
                    ensuring we serve real needs.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Globe className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Accessibility</CardTitle>
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
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-balance">Our Impact</h2>
            <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">50K+</div>
                <div className="text-primary-foreground/80">Monthly Users</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">15+</div>
                <div className="text-primary-foreground/80">Verified Changers</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">98%</div>
                <div className="text-primary-foreground/80">Rate Accuracy</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">$2M+</div>
                <div className="text-primary-foreground/80">Saved from Fraud</div>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">Our Team</h2>
              <p className="text-lg text-muted-foreground text-pretty">
                TrueRate-Liberia is powered by a diverse team of technologists, economists, data scientists, and
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
