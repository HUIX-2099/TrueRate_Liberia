"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Send, ArrowRight, Scale, DollarSign, Bell, Calendar } from "lucide-react"

export function DiasporaRemittancePreview() {
  return (
    <Card className="border-secondary/30 bg-gradient-to-br from-secondary/5 to-card shadow-[var(--shadow-institutional)] overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-secondary/50 hover:-translate-y-0.5">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-center">
            <Send className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-secondary">Remittance Planning Tool</CardTitle>
            <CardDescription>
              Compare providers, fees, and timing so more of your support reaches home
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex items-center gap-3">
            <Scale className="h-5 w-5 shrink-0 text-primary" />
            Compare transfer providers · FX spread & fee transparency
          </li>
          <li className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            Best timing alerts — &quot;Rate is favorable today&quot;
          </li>
          <li className="flex items-center gap-3">
            <Calendar className="h-5 w-5 shrink-0 text-primary" />
            Remittance planner
          </li>
          <li className="flex items-center gap-3">
            <Bell className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
            Notifications when rates improve
          </li>
        </ul>
        <Button asChild variant="outline" className="border-secondary/40 text-secondary hover:bg-secondary/10 gap-2">
          <Link href="/tools/remittance">
            Open Remittance Tool
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
