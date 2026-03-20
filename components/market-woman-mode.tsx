"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useLiveRate } from "@/lib/live-rate-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Minus, RefreshCw, Send, Calculator } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

export function MarketWomanMode() {
  const { t, language, setLanguage } = useLanguage()
  const { rate, loading, refresh } = useLiveRate()
  const [previousRate, setPreviousRate] = useState<number | null>(null)
  const prevRateRef = useRef<number | null>(null)

  useEffect(() => {
    if (typeof rate === "number" && rate > 0) {
      if (prevRateRef.current !== null) {
        setPreviousRate(prevRateRef.current)
      }
      prevRateRef.current = rate
    }
  }, [rate])

  const trend =
    previousRate && rate
      ? rate > previousRate
        ? "up"
        : rate < previousRate
          ? "down"
          : "stable"
      : "stable"

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-16 w-16 text-green-600 dark:text-green-400" />
      case "down":
        return <TrendingDown className="h-16 w-16 text-red-600 dark:text-red-400" />
      default:
        return <Minus className="h-16 w-16 text-muted-foreground" />
    }
  }

  const getTrendText = () => {
    switch (trend) {
      case "up":
        return t("simple.goingUp")
      case "down":
        return t("simple.goingDown")
      default:
        return t("simple.stayingSame")
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-destructive"
      case "down":
        return "text-secondary"
      default:
        return "text-muted-foreground"
    }
  }

  if (loading) {
    return (
      <Card className="animate-pulse bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardContent className="p-12">
          <div className="h-64 flex items-center justify-center">
            <RefreshCw className="h-12 w-12 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-primary/20">
      <CardContent className="p-0">
        {/* Diaspora tagline */}
        <div className="px-4 pt-4 pb-2 text-center">
          <p className="text-sm text-muted-foreground">{t("simple.diasporaTagline")}</p>
        </div>

        {/* Language toggle */}
        <div className="flex justify-center gap-2 px-4 pb-4 bg-muted/50">
          <Button
            variant={language === "en" ? "default" : "outline"}
            size="sm"
            onClick={() => setLanguage("en")}
          >
            English
          </Button>
          <Button
            variant={language === "lr-en" ? "default" : "outline"}
            size="sm"
            onClick={() => setLanguage("lr-en")}
          >
            Liberian
          </Button>
        </div>

        {/* Main rate display — diaspora style, no voice */}
        <div className="p-8 md:p-12 text-center">
          <div className="text-lg text-muted-foreground mb-4">{t("simple.currentRate")}</div>

          <div className="text-8xl md:text-9xl font-bold text-foreground mb-4 tracking-tight">
            {rate?.toFixed(0)}
          </div>

          <div className="text-3xl text-muted-foreground mb-8">LD / $1</div>

          {/* Trend */}
          <div className="flex flex-col items-center gap-4 mb-8">
            {getTrendIcon()}
            <span className={`text-2xl font-bold ${getTrendColor()}`}>{getTrendText()}</span>
          </div>
        </div>

        {/* Quick actions — diaspora */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 bg-muted/30">
          <Button variant="ghost" className="h-20 flex-col gap-2" asChild>
            <Link href="/tools/remittance">
              <Send className="h-6 w-6 text-primary" />
              <span className="text-xs">{t("simple.remittance")}</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="h-20 flex-col gap-2"
            onClick={() => {
              const text = `Dollar rate now: ${rate?.toFixed(0)} LD. Check TrueRate: truerate-liberia.com`
              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank")
            }}
          >
            <span className="text-2xl">📱</span>
            <span className="text-xs">{t("simple.sendToFamily")}</span>
          </Button>
          <Button variant="ghost" className="h-20 flex-col gap-2" asChild>
            <Link href="/converter">
              <Calculator className="h-6 w-6 text-primary" />
              <span className="text-xs">{t("simple.converter")}</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="h-20 flex-col gap-2"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: "TrueRate — Liberia rate for diaspora",
                  text: `USD/LRD now: ${rate?.toFixed(0)}. Navigate the Liberian economy from abroad: truerate-liberia.com`,
                  url: "https://truerate-liberia.com",
                })
              } else {
                window.open(
                  `https://wa.me/?text=${encodeURIComponent(`Dollar rate: ${rate?.toFixed(0)} LD. TrueRate: truerate-liberia.com`)}`,
                  "_blank"
                )
              }
            }}
          >
            <span className="text-2xl">📤</span>
            <span className="text-xs">Share</span>
          </Button>
        </div>
        <div className="flex justify-center pb-4">
          <Button variant="ghost" size="sm" onClick={() => refresh()} className="gap-2">
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
            Refresh rate
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
