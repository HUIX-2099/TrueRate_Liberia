"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  ShieldCheck,
  Star,
  AlertCircle,
  FileCheck,
  Lock,
  Activity,
  ArrowRight,
} from "lucide-react"

export function DiasporaTrustPreview() {
  return (
    <Card className="rounded-2xl border border-amber-500/25 dark:border-amber-500/25 bg-gradient-to-br from-amber-500/8 to-card overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md hover:border-amber-500/35">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-amber-700 dark:text-amber-400">
                Trust & Transparency
              </CardTitle>
              <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 text-[10px]">
                Secure
              </Badge>
            </div>
            <CardDescription>
              Vendor ratings, dispute resolution, and full audit trails
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 rounded-xl border border-border/30 bg-muted/15 p-3.5">
            <Star className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="font-medium text-sm">Vendor rating system</p>
              <p className="text-xs text-muted-foreground">Verified reviews & TrueRate badge</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border/30 bg-muted/15 p-3.5">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="font-medium text-sm">Fraud reporting</p>
              <p className="text-xs text-muted-foreground">Report & track issues</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border/30 bg-muted/15 p-3.5">
            <FileCheck className="h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="font-medium text-sm">Dispute resolution</p>
              <p className="text-xs text-muted-foreground">Structured workflow</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border/30 bg-muted/15 p-3.5">
            <Lock className="h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="font-medium text-sm">Secure payment badge</p>
              <p className="text-xs text-muted-foreground">Escrow-style options</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Activity className="h-4 w-4 shrink-0 text-primary" />
          Audit trail for all transactions · Activity log dashboard
        </div>
        <Button asChild variant="outline" className="rounded-xl border-amber-500/40 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10 gap-2">
          <Link href="/report-fraud">
            Report fraud or dispute across all pages
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
