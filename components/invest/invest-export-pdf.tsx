"use client"

import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"

interface InvestExportPdfProps {
  className?: string
}

/** Triggers browser print (user can Save as PDF). Print CSS hides header/footer when .invest-dashboard-page is present. */
export function InvestExportPdf({ className }: InvestExportPdfProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={className}
      onClick={() => window.print()}
      aria-label="Export dashboard to PDF"
    >
      <FileDown className="h-3.5 w-3.5 mr-1.5 text-primary" aria-hidden />
      Export PDF
    </Button>
  )
}
