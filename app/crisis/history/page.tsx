"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageHero } from "@/components/layout/page-hero"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, TrendingUp, ArrowRight, Lightbulb, Calendar, Shield, ChevronDown, ChevronUp } from "lucide-react"
import { CRISIS_HISTORY, getAverageRecoveryDays, type CrisisEvent } from "@/lib/crisis/historical-events"
import { useState } from "react"
import Link from "next/link"

const SEVERITY_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  minor: { bg: "bg-muted/40 border border-border/40", text: "text-blue-600", label: "Minor" },
  moderate: { bg: "bg-muted/40 border border-border/40", text: "text-yellow-600", label: "Moderate" },
  major: { bg: "bg-muted/40 border border-border/40", text: "text-orange-600", label: "Major" },
  severe: { bg: "bg-muted/40 border border-border/40", text: "text-red-600", label: "Severe" },
}

const CATEGORY_LABELS: Record<string, string> = {
  fuel: "Fuel Crisis",
  currency: "Currency Crisis",
  food: "Food Crisis",
  policy: "Policy Shock",
  global: "Global Shock",
  conflict: "Conflict/Health",
}

function CrisisEventCard({ event }: { event: CrisisEvent }) {
  const [expanded, setExpanded] = useState(false)
  const sev = SEVERITY_STYLES[event.severity] ?? SEVERITY_STYLES.moderate

  return (
    <Card className="border-border/40 rounded-2xl">
      <div className="flex">
        <div className={`w-1.5 shrink-0 ${ event.severity === "severe" ? "bg-red-500" : event.severity === "major" ? "bg-orange-500" : event.severity === "moderate" ? "bg-yellow-500" : "bg-blue-500" }`} />
        <div className="flex-1">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-bold text-lg">{event.title}</h3>
                  <Badge variant="outline" className={`text-xs ${sev.text}`}>{sev.label}</Badge>
                  <Badge variant="outline" className="text-xs">{CATEGORY_LABELS[event.category]}</Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 text-primary" />
                  {new Date(event.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  {event.endDate && (
                    <>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      {new Date(event.endDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </>
                  )}
                  {event.recoveryDays && (
                    <>
                      <span className="mx-1">|</span>
                      <Clock className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                      Recovery: {event.recoveryDays} days
                    </>
                  )}
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">{event.summary}</p>

            {/* Price impacts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {event.priceImpacts.slice(0, 4).map((impact) => (
                <div key={impact.item} className="p-2.5 rounded-lg bg-muted/50">
                  <div className="text-xs text-muted-foreground truncate">{impact.item}</div>
                  <div className="text-sm font-bold text-destructive">+{impact.changePercent.toFixed(0)}%</div>
                  <div className="text-[10px] text-muted-foreground">
                    {impact.beforePrice.toLocaleString()} → {impact.peakPrice.toLocaleString()} {impact.currency}
                  </div>
                </div>
              ))}
            </div>

            {/* What-if callout */}
            <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 mb-3">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                <p className="text-xs">{event.whatIf}</p>
              </div>
            </div>

            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              {expanded ? <ChevronUp className="h-3 w-3 text-muted-foreground" /> : <ChevronDown className="h-3 w-3 text-muted-foreground" />}
              {expanded ? "Show less" : "Show details, lessons & government response"}
            </button>

            {expanded && (
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">{event.details}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Government Response</h4>
                  <div className="space-y-1.5">
                    {event.governmentResponse.map((response, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Shield className="h-3 w-3 shrink-0 mt-0.5 /60 text-primary" />
                        {response}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Lessons Learned</h4>
                  <div className="space-y-1.5">
                    {event.lessonsLearned.map((lesson, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <Lightbulb className="h-3 w-3 shrink-0 mt-0.5 text-primary" />
                        {lesson}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </div>
      </div>
    </Card>
  )
}

export default function CrisisHistoryPage() {
  const avgRecovery = getAverageRecoveryDays()
  const sortedEvents = [...CRISIS_HISTORY].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0 overflow-x-hidden">
        <PageHero
          ariaLabel="Crisis history timeline"
          label="History"
          title="Crisis History Timeline"
          description="Learn from past economic shocks in Liberia. Understand how prices moved, how long recovery took, and what you can do differently next time."
          variant="centered"
          contentMaxWidth="max-w-3xl"
        />

        {/* Stats */}
        <section className="py-4 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto grid grid-cols-3 gap-3">
              <Card className="border-border/40 rounded-xl">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{CRISIS_HISTORY.length}</div>
                  <div className="text-xs text-muted-foreground">Recorded Events</div>
                </CardContent>
              </Card>
              <Card className="border-border/40 rounded-xl">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{avgRecovery}</div>
                  <div className="text-xs text-muted-foreground">Avg. Recovery (days)</div>
                </CardContent>
              </Card>
              <Card className="border-border/40 rounded-xl">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{CRISIS_HISTORY.filter((e) => e.severity === "severe").length}</div>
                  <div className="text-xs text-muted-foreground">Severe Events</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-6 sm:py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-4">
              {sortedEvents.map((event) => (
                <CrisisEventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-8 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-xl font-bold mb-3">Be Prepared for the Next Crisis</h2>
              <p className="text-sm text-muted-foreground mb-4">
                History shows that economic shocks are recurring in Liberia. Use TrueRate&apos;s tools to build resilience.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/crisis">
                  <button className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                    Crisis Monitor
                  </button>
                </Link>
                <Link href="/tools/impact">
                  <button className="px-4 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors">
                    Impact Calculator
                  </button>
                </Link>
                <Link href="/tools/budget">
                  <button className="px-4 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors">
                    Budget Planner
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
