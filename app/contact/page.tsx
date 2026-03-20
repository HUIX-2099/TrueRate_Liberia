"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { PageHero } from "@/components/layout/page-hero"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Message Sent",
      description: "We'll get back to you within 24 hours.",
    })

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0 overflow-x-hidden">
        <PageHero
          ariaLabel="Contact us"
          label="Support"
          title="Get in Touch"
          description="Have questions, feedback, or need support? We're here to help. Reach out to our team and we'll respond as quickly as possible."
          variant="centered"
          badges={
            <>
              <Badge variant="outline" className="rounded-full border-border/60 px-3 py-1 text-xs text-muted-foreground">
                Support
              </Badge>
              <Badge variant="outline" className="rounded-full border-primary/30 bg-primary/5 px-3 py-1 text-xs text-primary">
                24h Response
              </Badge>
              <Badge variant="outline" className="rounded-full border-secondary/30 bg-secondary/5 px-3 py-1 text-xs text-secondary">
                Free Help
              </Badge>
            </>
          }
          contentMaxWidth="max-w-4xl"
        />

        {/* Contact Methods */}
        <section className="py-12 sm:py-14 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
              <Card className="rounded-2xl border-primary/20 bg-gradient-to-br from-primary/5 to-card shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-3">
                  <div className="h-12 w-12 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-center mb-3">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-primary">Phone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">Call or WhatsApp us</p>
                  <a href="tel:+231777123456" className="text-primary font-medium hover:underline block">
                    +231 777 123 456
                  </a>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full border border-primary/30 bg-primary/5 px-2 py-0.5 text-primary">
                      Mon-Fri
                    </span>
                    <span>8am - 6pm</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-secondary/20 bg-gradient-to-br from-secondary/5 to-card shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-3">
                  <div className="h-12 w-12 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-center mb-3">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-secondary">Email</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">Send us an email</p>
                  <a href="mailto:support@truerate-liberia.com" className="text-secondary font-medium hover:underline block">
                    support@truerate-liberia.com
                  </a>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full border border-secondary/30 bg-secondary/5 px-2 py-0.5 text-secondary">
                      24h Response
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-muted-foreground/20 bg-gradient-to-br from-muted/10 to-card shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-3">
                  <div className="h-12 w-12 rounded-xl bg-muted/20 flex items-center justify-center mb-3">
                    <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle>Office</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">Office location</p>
                  <p className="text-sm text-muted-foreground">We&apos;re online‑only for now.</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full border border-muted-foreground/30 bg-muted/20 px-2 py-0.5">
                      Digital First
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-12 sm:py-14 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card className="rounded-2xl border-border/40 shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                  </div>
                  <CardDescription>Fill out the form below and our team will get back to you shortly.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+231 XXX XXX XXX"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Select
                        value={formData.subject}
                        onValueChange={(value) => setFormData({ ...formData, subject: value })}
                      >
                        <SelectTrigger id="subject">
                          <SelectValue placeholder="What is this about?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                          <SelectItem value="press">Press Inquiry</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us how we can help..."
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full rounded-xl min-h-[48px] font-semibold" size="lg">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 sm:py-14 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8 space-y-3">
                <p className="text-sm text-muted-foreground max-w-2xl mx-auto mb-2">
                  Find quick answers to common questions about TrueRate Liberia
                </p>
                <h2 className="text-3xl font-bold text-balance">
                  <span className="text-foreground">
                    Frequently Asked Questions
                  </span>
                </h2>
              </div>
              <div className="space-y-4">
                <Card className="rounded-2xl border-primary/20 bg-gradient-to-br from-primary/5 to-card shadow-sm hover:shadow-md transition-all">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="h-6 w-6 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">?</span>
                      </div>
                      How often are rates updated?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Our rates are updated every 5 minutes from verified sources, ensuring you always have the most
                      current information.
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-secondary/20 bg-gradient-to-br from-secondary/5 to-card shadow-sm hover:shadow-md transition-all">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="h-6 w-6 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-center">
                        <span className="text-xs font-bold text-secondary">✓</span>
                      </div>
                      Is TrueRate-Liberia free to use?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Yes! TrueRate-Liberia is completely free for individual users. We also offer premium features for
                      businesses and institutions.
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-card shadow-sm hover:shadow-md transition-all">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="h-6 w-6 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-center">
                        <span className="text-xs font-bold text-amber-600">!</span>
                      </div>
                      How do I report incorrect rates?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      You can report incorrect rates directly through our community reporting feature on each rate
                      listing, or contact us through this page.
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-green-500/20 bg-gradient-to-br from-green-500/5 to-card shadow-sm hover:shadow-md transition-all">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="h-6 w-6 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-center">
                        <span className="text-xs font-bold text-green-600">📱</span>
                      </div>
                      Can I use TrueRate-Liberia without internet?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Yes! You can subscribe to our SMS service to receive daily rate updates via text message, no
                      internet required.
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
