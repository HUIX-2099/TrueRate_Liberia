"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SectionContainer } from "@/components/ui/section-container"
import { TransferComparison } from "./TransferComparison"
import { Button } from "@/components/ui/button"

export function RemittancePanel() {
  return (
    <SectionContainer
      id="remittance"
      title="Remittance optimizer"
      description="Compare providers, FX spread, and timing"
      action={
        <Button size="sm" variant="outline" asChild className="gap-2 min-h-[44px] rounded-xl border-border/50 hover:border-primary/30">
          <Link href="/tools/remittance">
            Open remittance tool
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </Button>
      }
    >
      <TransferComparison />
    </SectionContainer>
  )
}
