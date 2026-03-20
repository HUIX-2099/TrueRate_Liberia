"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export type RiskLevel = "All" | "Low" | "Medium" | "High"

export interface InvestmentOpportunity {
  id: string
  sector: string
  riskLevel: RiskLevel
  /** Institutional risk score 1–10 (1=lowest risk, 10=highest). */
  riskScore: number
  expectedReturnPct: number
  region: string
  analysisHref: string
  description?: string
}

const riskVariant: Record<RiskLevel, "default" | "secondary" | "destructive" | "outline"> = {
  All: "outline",
  Low: "secondary",
  Medium: "outline",
  High: "default",
}

const riskClass: Record<RiskLevel, string> = {
  All: "bg-muted text-muted-foreground border-border",
  Low: "bg-muted/40 border border-border/40 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  Medium: "bg-muted/40 border border-border/40 text-amber-700 dark:text-amber-400 border-amber-500/20",
  High: "bg-muted/40 border border-border/40 text-primary border-primary/20",
}

export const INVESTMENT_OPPORTUNITIES: InvestmentOpportunity[] = [
  { id: "agriculture", sector: "Agriculture", riskLevel: "Medium", riskScore: 5, expectedReturnPct: 12, region: "Bong, Nimba, Lofa", analysisHref: "/business", description: "Rubber, oil palm, rice, cocoa; agro-processing." },
  { id: "mining", sector: "Mining & Extractive", riskLevel: "High", riskScore: 8, expectedReturnPct: 18, region: "Nimba, Grand Bassa, Bomi", analysisHref: "/market-intelligence", description: "Iron ore, gold, diamonds; value-added processing." },
  { id: "energy", sector: "Energy & Infrastructure", riskLevel: "Medium", riskScore: 6, expectedReturnPct: 14, region: "Montserrado, Grand Bassa", analysisHref: "/market-intelligence", description: "Power generation, grid, roads, renewables." },
  { id: "agribusiness", sector: "Agribusiness & Manufacturing", riskLevel: "Low", riskScore: 3, expectedReturnPct: 10, region: "Montserrado, Margibi", analysisHref: "/business", description: "Food production, agro-processing, light manufacturing." },
  { id: "forestry", sector: "Forestry & Fisheries", riskLevel: "Medium", riskScore: 5, expectedReturnPct: 11, region: "Sinoe, Grand Gedeh, Maryland", analysisHref: "/market-intelligence", description: "Sustainable timber, aquaculture, cold chain." },
  { id: "ict-fintech", sector: "ICT & Fintech", riskLevel: "Low", riskScore: 4, expectedReturnPct: 15, region: "Montserrado", analysisHref: "/market", description: "Mobile money, payments, digital services." },
  { id: "trade", sector: "Trade & Logistics", riskLevel: "Low", riskScore: 2, expectedReturnPct: 9, region: "Montserrado, Grand Bassa", analysisHref: "/market", description: "Port, distribution, import-export." },
  { id: "real-estate", sector: "Real Estate", riskLevel: "High", riskScore: 7, expectedReturnPct: 16, region: "Montserrado, Margibi", analysisHref: "/market-intelligence", description: "Commercial and residential development." },
  { id: "tourism", sector: "Tourism", riskLevel: "Medium", riskScore: 6, expectedReturnPct: 13, region: "Montserrado, Grand Bassa, Maryland", analysisHref: "/market", description: "Ecotourism, coastal, hospitality." },
]

function OpportunityCard({ opportunity }: { opportunity: InvestmentOpportunity }) {
  return (
    <Card className="h-full flex flex-col rounded-2xl border-border/60 bg-card shadow-[var(--shadow-institutional)] hover:shadow-[var(--shadow-institutional-hover)] transition-all duration-200 hover:-translate-y-0.5">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            {opportunity.sector}
          </h3>
          <Badge
            variant={riskVariant[opportunity.riskLevel]}
            className={cn("shrink-0 text-xs font-medium border", riskClass[opportunity.riskLevel])}
          >
            {opportunity.riskLevel}
          </Badge>
        </div>
        {opportunity.description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{opportunity.description}</p>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3 pt-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          <span className="tabular-nums font-mono font-semibold text-foreground">
            {opportunity.expectedReturnPct}% return
          </span>
          <span className="text-muted-foreground">·</span>
          <span className="tabular-nums font-mono text-muted-foreground" title="Risk score 1–10">
            Risk {opportunity.riskScore}/10
          </span>
          <span className="text-muted-foreground">·</span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden />
            {opportunity.region}
          </span>
        </div>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="w-fit mt-auto rounded-xl font-medium min-h-[44px] border-border/80 hover:bg-primary/10 hover:border-primary/30"
        >
          <Link href={opportunity.analysisHref} className="inline-flex items-center gap-2">
            View Analysis
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export function InvestmentOpportunities({ opportunities = INVESTMENT_OPPORTUNITIES }: { opportunities?: InvestmentOpportunity[] }) {
  return (
    <ul className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0">
      {opportunities.map((opp) => (
        <li key={opp.id}>
          <OpportunityCard opportunity={opp} />
        </li>
      ))}
    </ul>
  )
}
