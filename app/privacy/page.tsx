import Link from "next/link"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { PageHero } from "@/components/layout/page-hero"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Eye, FileText, Lock, Mail, Shield, Users } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0 overflow-x-hidden">
        <PageHero
          ariaLabel="Privacy and data protection"
          label="Privacy & Data Protection"
          title="Your Privacy Matters at TrueRate Liberia"
          description="This Privacy Policy explains what we collect, why we collect it, and the choices you have when using our services."
          variant="centered"
          badges={
            <>
              <Badge>Privacy & Data Protection</Badge>
              <Badge className="bg-muted/40 border border-border/40 text-primary">GDPR Compliant</Badge>
              <Badge variant="secondary">Transparent</Badge>
              <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400">Secure by Design</Badge>
            </>
          }
          contentMaxWidth="max-w-4xl"
          footer={
            <div className="flex flex-wrap items-center justify-center gap-4">
              <span className="text-sm text-muted-foreground">Last updated: Jan 15, 2026</span>
              <Badge variant="secondary" className="gap-1">
                <Shield className="h-3 w-3 text-primary" />
                Regularly Reviewed
              </Badge>
            </div>
          }
        />

        {/* Overview */}
        <section className="py-12 sm:py-14 md:py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <Card className="border-primary/20 shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-primary" />
                    <CardTitle className="text-xl sm:text-2xl text-primary">Privacy at a Glance</CardTitle>
                  </div>
                  <CardDescription>Key highlights of how we handle data across the platform.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="space-y-3 p-4 rounded-lg bg-muted/40 border border-border/40">
                      <div className="h-12 w-12 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-center">
                        <Eye className="h-6 w-6 text-primary" />
                      </div>
                      <p className="font-semibold text-primary">Transparent collection</p>
                      <p className="text-sm text-muted-foreground">
                        We only collect what is needed to provide accurate exchange information and secure experiences.
                      </p>
                    </div>
                    <div className="space-y-3 p-4 rounded-lg bg-muted/40 border border-border/40">
                      <div className="h-12 w-12 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-center">
                        <Lock className="h-6 w-6 text-primary" />
                      </div>
                      <p className="font-semibold text-secondary">Secure by design</p>
                      <p className="text-sm text-muted-foreground">
                        We apply encryption and access controls to keep your data protected end-to-end.
                      </p>
                    </div>
                    <div className="space-y-3 p-4 rounded-lg bg-muted/40 border border-border/40">
                      <div className="h-12 w-12 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <p className="font-semibold text-amber-600">You stay in control</p>
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
        <section className="py-12 sm:py-14 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-10 space-y-3">
                <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                  <Badge variant="outline">Data Collection</Badge>
                  <Badge className="bg-muted/40 border border-border/40 text-primary">Minimal & Purposeful</Badge>
                  <Badge variant="secondary">Transparent</Badge>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-balance">
                  <span className="text-foreground">
                    Information We Collect
                  </span>
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  We collect only what&apos;s necessary to provide you with accurate rates, prices, and a secure experience
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-primary/20 shadow-sm hover:shadow-md transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-center">
                        <Database className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-primary">Account & Profile</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      Name, email, phone number, location preference, and other details you choose to share when you
                      create an account or report rates in the community.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-secondary/20 shadow-sm hover:shadow-md transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-secondary">Usage & Analytics</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      Device details, page interactions, and performance metrics that help us improve rate accuracy,
                      stability, and accessibility for all users.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-amber-500/20 shadow-sm hover:shadow-md transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-amber-600">Messages & Support</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      Contact form submissions, feedback, and customer support conversations so we can respond and
                      resolve issues.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-green-500/20 shadow-sm hover:shadow-md transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-green-600">Verification Signals</CardTitle>
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
        <section className="py-12 sm:py-14 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8 space-y-3">
                <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                  <Badge variant="outline">Data Usage</Badge>
                  <Badge className="bg-muted/40 border border-border/40 text-primary">Purpose-Driven</Badge>
                  <Badge variant="secondary">Transparent</Badge>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-balance">
                  <span className="text-foreground">
                    How We Use Your Data
                  </span>
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Your data is used only for specific, beneficial purposes that improve our services
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-border/60 shadow-sm">
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
                <Card className="border-border/60 shadow-sm">
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
                <Card className="border-border/60 shadow-sm">
                  <CardHeader>
                    <CardTitle>Keep the community safe</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      Detect suspicious activity, prevent fraud, and ensure trustworthy rate reporting across regions.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-border/60 shadow-sm">
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
        <section className="py-12 sm:py-14 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
              <Card className="border-border/60 shadow-sm">
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
              <Card className="border-border/60 shadow-sm">
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
        <section className="py-12 sm:py-14 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                <Badge variant="outline">Your Rights</Badge>
                <Badge className="bg-muted/40 border border-border/40 text-primary">You Control Your Data</Badge>
                <Badge variant="secondary">GDPR Compliant</Badge>
                <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400">Easy to Exercise</Badge>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-balance">
                <span className="text-foreground">
                  Your Rights & Choices
                </span>
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-10 text-pretty max-w-3xl mx-auto">
                You can request access, correction, portability, or deletion of your personal data. You can also
                opt-out of marketing communications at any time.
              </p>
              <Button asChild size="lg" className="shadow-sm">
                <Link href="/contact">Contact the Privacy Team</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Additional Notices */}
        <section className="py-12 sm:py-14 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <Card className="border-primary/20 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-4">
                  <CardTitle className="text-primary flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-center">
                      <Database className="h-4 w-4 text-primary" />
                    </div>
                    Cookies & Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    We use cookies and local storage to keep you signed in, remember preferences, and understand
                    platform performance.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-secondary/20 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-4">
                  <CardTitle className="text-secondary flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    Children&apos;s Privacy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    TrueRate Liberia is not intended for children under 13. If you believe a child has shared data with
                    us, contact our team for immediate removal.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-amber-500/20 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-4">
                  <CardTitle className="text-amber-600 flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    Policy Updates
                  </CardTitle>
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
