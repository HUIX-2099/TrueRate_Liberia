"use client"

import Link from "next/link"
import { ArrowRight, Calculator, ShieldAlert } from "lucide-react"
import { SectionContainer } from "@/components/ui/section-container"
import { ROICalculator } from "./ROICalculator"
import { SectorHeatMap } from "./SectorHeatMap"
import { Button } from "@/components/ui/button"

export function InvestmentPanel() {
  return (
    <SectionContainer
      id="investment"
      title="Investment navigator"
      description="ROI visibility and risk indicators for diaspora investors"
      action={
        <Button size="sm" className="gap-2 min-h-[44px] rounded-xl font-medium" asChild>
          <Link href="/invest">
            Open navigator
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-border/30 bg-muted/15 p-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
            <Calculator className="h-4 w-4 text-primary" aria-hidden />
            ROI calculator
          </h3>
          <ROICalculator />
        </div>
        <div className="rounded-xl border border-border/30 bg-muted/15 p-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
            <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden />
            Sector risk heat map
          </h3>
          <SectorHeatMap />
        </div>
      </div>
    </SectionContainer>
  )
}
