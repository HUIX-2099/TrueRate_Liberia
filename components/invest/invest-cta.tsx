"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileDown, Calendar } from "lucide-react"

export function InvestCTA() {
  return (
    <section
      className="py-12 sm:py-16 md:py-20 bg-muted/30 rounded-2xl"
      aria-labelledby="invest-cta-heading"
    >
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
        <h2 id="invest-cta-heading" className="sr-only">
          Next steps for investors
        </h2>
        <Button
          asChild
          size="lg"
          className="min-h-[48px] px-6 rounded-xl font-semibold shadow-[var(--shadow-institutional)] hover:shadow-[var(--shadow-institutional-hover)] w-full sm:w-auto"
        >
          <Link href="/price-index" className="inline-flex items-center gap-2">
            <FileDown className="h-4 w-4 text-primary" aria-hidden />
            Download Market Report
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="min-h-[48px] px-6 rounded-xl font-medium w-full sm:w-auto border-border/80 hover:bg-primary/10 hover:border-primary/30"
        >
          <Link href="/contact" className="inline-flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" aria-hidden />
            Request Investor Briefing
          </Link>
        </Button>
      </div>
    </section>
  )
}
