import Link from "next/link"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { PageHero } from "@/components/layout/page-hero"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, FileText, Globe, Shield, Users } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0 overflow-x-hidden">
        <PageHero
          ariaLabel="Terms of Service"
          label="Terms & Conditions"
          title="Terms of Service for TrueRate-Liberia"
          description="These Terms govern your use of the website, tools, community features, and services provided by TrueRate-Liberia."
          variant="centered"
          badges={<Badge>Terms & Conditions</Badge>}
          footer="Last updated: Jan 15, 2026"
        />

        {/* Summary */}
        <section className="py-12 sm:py-14 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="border-border/40 rounded-2xl shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FileText className="h-6 w-6 text-primary" />
                    <CardTitle className="text-2xl">Key Points</CardTitle>
                  </div>
                  <CardDescription>Highlights of the most important terms.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Shield className="h-7 w-7 text-primary" />
                      <p className="font-semibold">Use responsibly</p>
                      <p className="text-sm text-muted-foreground">
                        Do not misuse data, try to disrupt services, or attempt to manipulate rate reporting.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Users className="h-7 w-7 text-primary" />
                      <p className="font-semibold">Community standards</p>
                      <p className="text-sm text-muted-foreground">
                        Be respectful and submit truthful reports to keep the platform reliable for everyone.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <AlertTriangle className="h-7 w-7 text-amber-600 dark:text-amber-400" />
                      <p className="font-semibold">No guarantees</p>
                      <p className="text-sm text-muted-foreground">
                        Rates are informational; always confirm with financial institutions before transactions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Eligibility */}
        <section className="py-12 sm:py-14 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
              <Card className="border-border/40 rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle>Eligibility & Account Responsibility</CardTitle>
                  <CardDescription>You are responsible for your account activity.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    By using TrueRate-Liberia you confirm you are at least 13 years old and able to enter into these
                    Terms. You are responsible for safeguarding your account credentials and for any activity on your
                    account.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/40 rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle>Service Availability</CardTitle>
                  <CardDescription>We aim for reliability, but outages can happen.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    We may update, suspend, or discontinue parts of the service at any time. We will make reasonable
                    efforts to notify users about major changes that impact availability.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Acceptable Use */}
        <section className="py-12 sm:py-14 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8 space-y-2">
                <Badge variant="outline">Acceptable use</Badge>
                <h2 className="text-2xl sm:text-2xl sm:text-3xl md:text-4xl font-bold text-balance">Acceptable Use</h2>
              </div>
              <Card className="border-border/40 rounded-2xl shadow-sm">
                <CardContent className="pt-6">
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      You agree to use TrueRate-Liberia only for lawful purposes and in ways that do not harm the
                      platform, community members, or data integrity.
                    </p>
                    <ul className="space-y-2">
                      <li>Do not submit false or misleading rate reports.</li>
                      <li>Do not attempt to access or disrupt systems or user data.</li>
                      <li>Do not scrape or republish data without written permission.</li>
                      <li>Do not use the platform for fraud, harassment, or unlawful activity.</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Rates Disclaimer */}
        <section className="py-12 sm:py-14 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
              <Card className="border-border/40 rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle>Rate Accuracy Disclaimer</CardTitle>
                  <CardDescription>Rates are informative, not financial advice.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    We aggregate and estimate exchange rates from multiple sources, including community submissions.
                    Rates can change rapidly and may differ at point of transaction. Always verify rates directly with
                    financial providers.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/40 rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle>Third-Party Links</CardTitle>
                  <CardDescription>External services are outside our control.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    The platform may link to third-party sites or tools. TrueRate-Liberia is not responsible for their
                    content, security, or business practices.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Intellectual Property */}
        <section className="py-12 sm:py-14 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8 space-y-2">
                <Badge variant="outline">Intellectual property</Badge>
                <h2 className="text-2xl sm:text-2xl sm:text-3xl md:text-4xl font-bold text-balance">Intellectual Property</h2>
              </div>
              <Card className="border-border/40 rounded-2xl shadow-sm">
                <CardContent className="pt-6">
                  <p className="text-muted-foreground leading-relaxed">
                    TrueRate-Liberia and its content, branding, and software are protected by intellectual property
                    laws. You may not copy, modify, or distribute our materials without written permission.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Privacy */}
        <section className="py-12 sm:py-14 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
              <Card className="border-border/40 rounded-2xl shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-primary" />
                    <CardTitle>Privacy & Data Protection</CardTitle>
                  </div>
                  <CardDescription>Your privacy is a core commitment.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Your use of TrueRate-Liberia is also governed by our Privacy Policy. Please review it to understand
                    how we collect, use, and protect your data.
                  </p>
                  <Button asChild variant="outline" className="mt-4">
                    <Link href="/privacy">Read Privacy Policy</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card className="border-border/40 rounded-2xl shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Globe className="h-6 w-6 text-primary" />
                    <CardTitle>Regional Compliance</CardTitle>
                  </div>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      We aim to comply with applicable laws in Liberia and other regions where users access our
                      services. If local regulations require additional rights, we will honor them where feasible.
                    </p>
                  </CardContent>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Termination */}
        <section className="py-12 sm:py-14 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-3">Termination</Badge>
              <h2 className="text-2xl sm:text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-balance">Account Termination</h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-10 text-pretty">
                We may suspend or terminate accounts that violate these Terms, harm community trust, or pose security
                risks. You can also close your account at any time by contacting support.
              </p>
              <Button asChild size="lg" className="rounded-xl min-h-[44px]">
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Changes */}
        <section className="py-12 sm:py-14 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="border-border/40 rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle>Changes to These Terms</CardTitle>
                  <CardDescription>We may update terms as we evolve.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    We will notify users of material changes through the platform or via email. Continued use after an
                    update means you accept the revised Terms.
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
