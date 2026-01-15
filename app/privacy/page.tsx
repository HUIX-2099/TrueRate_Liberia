import Link from "next/link"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Eye, FileText, Lock, Mail, Shield, Users } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-4">Privacy & Data Protection</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Your Privacy Matters at TrueRate-Liberia</h1>
              <p className="text-xl text-muted-foreground text-pretty">
                This Privacy Policy explains what we collect, why we collect it, and the choices you have when using
                our services.
              </p>
              <p className="text-sm text-muted-foreground mt-4">Last updated: Jan 15, 2026</p>
            </div>
          </div>
        </section>

        {/* Overview */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-primary" />
                    <CardTitle className="text-2xl">Privacy at a Glance</CardTitle>
                  </div>
                  <CardDescription>Key highlights of how we handle data across the platform.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Eye className="h-7 w-7 text-primary" />
                      <p className="font-semibold">Transparent collection</p>
                      <p className="text-sm text-muted-foreground">
                        We only collect what is needed to provide accurate exchange information and secure experiences.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Lock className="h-7 w-7 text-primary" />
                      <p className="font-semibold">Secure by design</p>
                      <p className="text-sm text-muted-foreground">
                        We apply encryption and access controls to keep your data protected end-to-end.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Users className="h-7 w-7 text-primary" />
                      <p className="font-semibold">You stay in control</p>
                      <p className="text-sm text-muted-foreground">
                        You can review, update, or request deletion of your personal data at any time.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Data Collection */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-balance">Information We Collect</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Database className="h-6 w-6 text-primary" />
                      <CardTitle>Account & Profile</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      Name, email, phone number, location preference, and other details you choose to share when you
                      create an account or report rates in the community.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <FileText className="h-6 w-6 text-primary" />
                      <CardTitle>Usage & Analytics</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      Device details, page interactions, and performance metrics that help us improve rate accuracy,
                      stability, and accessibility for all users.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Mail className="h-6 w-6 text-primary" />
                      <CardTitle>Messages & Support</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      Contact form submissions, feedback, and customer support conversations so we can respond and
                      resolve issues.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Shield className="h-6 w-6 text-primary" />
                      <CardTitle>Verification Signals</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      Security logs and verification signals to detect fraud, protect community reports, and keep
                      exchange data trustworthy.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Use of Data */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-balance">How We Use Your Data</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Provide core services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      Deliver real-time rates, personalized alerts, and tools such as converters, forecasts, and
                      business dashboards.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Improve accuracy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      Validate data sources, remove anomalies, and strengthen prediction quality through secure
                      analytics.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Keep the community safe</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      Detect suspicious activity, prevent fraud, and ensure trustworthy rate reporting across regions.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Communicate with you</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      Send important service updates, security alerts, and responses to your support requests.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Sharing & Retention */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>When We Share Information</CardTitle>
                  <CardDescription>We only share data in limited situations.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-muted-foreground">
                    <li>With trusted service providers who help run TrueRate-Liberia.</li>
                    <li>With community consent when publishing verified, anonymized insights.</li>
                    <li>When required to comply with legal or regulatory obligations.</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Data Retention</CardTitle>
                  <CardDescription>We keep data only as long as needed.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Account information is retained while your account is active. Support messages are kept for
                    reference and compliance. You can request deletion at any time and we will honor it where legally
                    possible.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Your Rights */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">Your Rights & Choices</h2>
              <p className="text-lg text-muted-foreground mb-10 text-pretty">
                You can request access, correction, portability, or deletion of your personal data. You can also
                opt-out of marketing communications at any time.
              </p>
              <Button asChild size="lg">
                <Link href="/contact">Contact the Privacy Team</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Additional Notices */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cookies & Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    We use cookies and local storage to keep you signed in, remember preferences, and understand
                    platform performance.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Children's Privacy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    TrueRate-Liberia is not intended for children under 13. If you believe a child has shared data with
                    us, contact our team for immediate removal.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Policy Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    We may update this policy to reflect new services or legal requirements. We will notify you of
                    material changes.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
