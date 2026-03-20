"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react"

interface HistoricalPoint {
  date: string
  rate: number
  volume?: number
}

async function fetchHistorical(): Promise<HistoricalPoint[]> {
  const res = await fetch("/api/rates/historical")
  const data = await res.json()
  return Array.isArray(data?.historical) ? data.historical : []
}

function downloadCsv(rows: HistoricalPoint[]) {
  const header = "Date,Rate (LRD/USD),Volume\n"
  const body = rows
    .map((r) => `${r.date},${r.rate},${r.volume ?? ""}`)
    .join("\n")
  const blob = new Blob([header + body], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `truerate-history-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

async function downloadExcel(rows: HistoricalPoint[]) {
  const XLSX = await import("xlsx")
  const ws = XLSX.utils.json_to_sheet(
    rows.map((r) => ({ Date: r.date, "Rate (LRD/USD)": r.rate, Volume: r.volume ?? "" })),
  )
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Rate History")
  XLSX.writeFile(wb, `truerate-history-${new Date().toISOString().slice(0, 10)}.xlsx`)
}

export function RateHistoryExport() {
  const [loading, setLoading] = useState(false)

  const handleExport = async (format: "csv" | "excel") => {
    setLoading(true)
    try {
      const rows = await fetchHistorical()
      if (rows.length === 0) {
        return
      }
      if (format === "csv") {
        downloadCsv(rows)
      } else {
        await downloadExcel(rows)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Download className="h-4 w-4 text-primary" />}
          Export history
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("csv")} className="gap-2">
          <FileText className="h-4 w-4 text-primary" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("excel")} className="gap-2">
          <FileSpreadsheet className="h-4 w-4 text-primary" />
          Export as Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
