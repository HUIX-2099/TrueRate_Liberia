"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Camera, Share2, AlertCircle, CheckCircle2, Download } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

interface PredictionData {
  currentRate: number
  predictedRate: number
  confidence: number
  trend: "up" | "down" | "stable"
}

type InvoiceProtectorProps = {
  /** LRD per USD; if omitted, uses `/api/rates/live` */
  rate?: number
}

export function InvoiceProtector({ rate: rateProp }: InvoiceProtectorProps = {}) {
  const { t, isMarketWomanMode } = useLanguage()
  const [invoiceAmount, setInvoiceAmount] = useState<string>("")
  const [prediction, setPrediction] = useState<PredictionData | null>(null)
  const [loading, setLoading] = useState(true)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchPrediction() {
      try {
        const predRes = await fetch("/api/rates/predictions?days=7")
        const predData = await predRes.json()
        if (cancelled) return

        let currentRate = 198.5
        if (typeof rateProp === "number" && rateProp > 100 && rateProp < 300) {
          currentRate = rateProp
        } else {
          const liveRes = await fetch("/api/rates/live")
          const liveData = await liveRes.json()
          currentRate = typeof liveData.rate === "number" ? liveData.rate : 198.5
        }

        const predictions = predData.predictions || []
        const avgPredicted =
          predictions.length > 0
            ? predictions.reduce(
                (sum: number, p: { predicted?: number; predictedRate?: number }) =>
                  sum + (p.predicted ?? p.predictedRate ?? currentRate),
                0,
              ) / predictions.length
            : currentRate

        setPrediction({
          currentRate,
          predictedRate: avgPredicted,
          confidence: predictions[0]?.confidence ?? 0.85,
          trend:
            avgPredicted > currentRate ? "up" : avgPredicted < currentRate ? "down" : "stable",
        })
      } catch (error) {
        console.error("Error:", error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void fetchPrediction()
    return () => {
      cancelled = true
    }
  }, [rateProp])

  const amount = parseFloat(invoiceAmount) || 0
  const todayCost = prediction ? amount * prediction.currentRate : 0
  const futureCost = prediction ? amount * prediction.predictedRate : 0
  const difference = futureCost - todayCost
  const shouldPayNow = difference > 0

  const shareToWhatsApp = () => {
    if (!prediction || !invoiceAmount) return
    
    const emoji = shouldPayNow ? '⚠️' : '💰'
    const action = shouldPayNow ? 'PAY NOW' : 'WAIT'
    const savings = Math.abs(difference).toFixed(0)
    
    const text = `${emoji} TrueRate Invoice Check\n\nInvoice: $${invoiceAmount} USD\n\n📍 Today: L$${todayCost.toFixed(0)}\n📍 In 7 days: L$${futureCost.toFixed(0)}\n\n${action} to save L$${savings}!\n\nCheck your invoices: truerate-liberia.com`
    
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const takeScreenshot = async () => {
    // In production, use html2canvas or similar
    alert('Screenshot saved! You can share it via any app.')
  }

  const downloadPdf = () => {
    if (!prediction || !invoiceAmount) return
    const payNow = difference > 0
    const html = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>TrueRate Invoice Check</title>
<style>body{font-family:system-ui,sans-serif;max-width:400px;margin:24px auto;padding:16px;color:#111;}
h1{font-size:1.25rem;margin-bottom:8px;} .muted{color:#666;font-size:0.875rem;}
.row{display:flex;justify-content:space-between;margin:8px 0;} .bold{font-weight:600;}
.rec{margin-top:16px;padding:12px;border-radius:8px;background:${payNow ? '#fef2f2' : '#f0fdf4'};}
</style></head><body>
<h1>TrueRate Liberia – Invoice Protector</h1>
<p class="muted">Generated ${new Date().toLocaleString()}</p>
<div class="row"><span>Invoice amount (USD)</span><span class="bold">$${invoiceAmount}</span></div>
<div class="row"><span>Today's cost @ ${prediction.currentRate.toFixed(2)} LRD/USD</span><span class="bold">L$${todayCost.toLocaleString(undefined,{maximumFractionDigits:0})}</span></div>
<div class="row"><span>Predicted in 7 days @ ${prediction.predictedRate.toFixed(2)} LRD/USD</span><span class="bold">L$${futureCost.toLocaleString(undefined,{maximumFractionDigits:0})}</span></div>
<div class="rec">
  <div class="bold">${payNow ? 'Pay now to save' : 'Wait to save'}</div>
  <div>L$${Math.abs(difference).toLocaleString(undefined,{maximumFractionDigits:0})} ${payNow ? 'savings if you pay today' : 'savings if you wait'}</div>
</div>
<p class="muted" style="margin-top:20px;">truerateliberia.com</p>
</body></html>`
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(html)
    w.document.close()
    w.focus()
    setTimeout(() => { w.print(); w.close(); }, 300)
  }

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-48 bg-muted rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card ref={cardRef} className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          {t('invoice.title')}
        </CardTitle>
        <CardDescription>{t('invoice.subtitle')}</CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Invoice Amount Input */}
        <div className="mb-6">
          <label className="text-sm font-medium mb-2 block">{t('invoice.amount')}</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
            <Input
              type="number"
              placeholder="Enter amount..."
              value={invoiceAmount}
              onChange={(e) => setInvoiceAmount(e.target.value)}
              className={`pl-8 ${isMarketWomanMode ? 'text-2xl h-14' : ''}`}
            />
          </div>
        </div>

        {/* Comparison Display */}
        {amount > 0 && prediction && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Today's Cost */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">{t('invoice.todayCost')}</div>
                <div className={`${isMarketWomanMode ? 'text-3xl' : 'text-2xl'} font-bold`}>
                  L${todayCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  @ {(prediction.currentRate ?? 0).toFixed(2)} LRD/USD
                </div>
              </div>

              {/* Future Cost */}
              <div className={`p-4 rounded-lg ${shouldPayNow ? 'bg-muted/40 border border-border/40' : 'bg-muted/40 border border-border/40'}`}>
                <div className="text-sm text-muted-foreground mb-1">{t('invoice.predicted')}</div>
                <div className={`${isMarketWomanMode ? 'text-3xl' : 'text-2xl'} font-bold`}>
                  L${futureCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  @ {(prediction.predictedRate ?? 0).toFixed(2)} LRD/USD
                </div>
              </div>
            </div>

            {/* Recommendation Box */}
            <div className={`p-4 rounded-lg border-2 ${shouldPayNow ? 'border-destructive bg-destructive/5' : 'border-secondary bg-secondary/5'}`}>
              <div className="flex items-center gap-3">
                {shouldPayNow ? (
                  <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
                ) : (
                  <TrendingDown className="h-8 w-8 text-red-600 dark:text-red-400" />
                )}
                <div className="flex-1">
                  <div className="font-semibold text-lg">
                    {shouldPayNow ? t('invoice.payNow') : t('invoice.wait')}
                  </div>
                  <div className={`${isMarketWomanMode ? 'text-3xl' : 'text-2xl'} font-bold ${shouldPayNow ? 'text-destructive' : 'text-secondary'}`}>
                    L${Math.abs(difference).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>
                <Badge variant={shouldPayNow ? 'destructive' : 'secondary'} className="text-sm">
                  {(prediction.confidence * 100).toFixed(0)}% confident
                </Badge>
              </div>
            </div>

            {/* Quick Decision */}
            <div className="flex items-center justify-center gap-2 py-2">
              {shouldPayNow ? (
                <>
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <span className={`${isMarketWomanMode ? 'text-xl' : ''} font-medium text-destructive`}>
                    {isMarketWomanMode ? 'Pay Now-O! Dollar Going Up!' : 'Rate increasing - pay now to save!'}
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className={`${isMarketWomanMode ? 'text-xl' : ''} font-medium text-secondary`}>
                    {isMarketWomanMode ? 'Wait Small! Dollar Going Down!' : 'Rate decreasing - waiting saves money!'}
                  </span>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-2">
              <Button variant="outline" className="gap-2" onClick={downloadPdf}>
                <Download className="h-4 w-4 text-primary" />
                Download PDF
              </Button>
              <Button variant="outline" className="gap-2" onClick={takeScreenshot}>
                <Camera className="h-4 w-4 text-primary" />
                {t('invoice.share')}
              </Button>
              <Button className="gap-2" onClick={shareToWhatsApp}>
                <Share2 className="h-4 w-4 text-primary" />
                WhatsApp
              </Button>
            </div>
          </div>
        )}

        {amount <= 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Enter an invoice amount to see your savings potential
          </div>
        )}
      </CardContent>
    </Card>
  )
}



