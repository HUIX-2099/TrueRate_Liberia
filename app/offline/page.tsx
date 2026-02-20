"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Wifi, WifiOff, RefreshCw, Smartphone } from "lucide-react"

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="py-10 sm:py-14 md:py-16 flex-1 flex items-center justify-center px-4 text-center pb-20 md:pb-0 overflow-x-hidden">
        <div className="max-w-lg">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-destructive/20 flex items-center justify-center">
              <WifiOff className="h-10 w-10 text-destructive" />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            <Badge variant="destructive">Offline Mode</Badge>
            <Badge className="bg-primary/10 text-primary">Cached Data</Badge>
            <Badge variant="secondary">Limited Features</Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-balance">
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              You're Offline
            </span>
          </h1>

          <p className="text-muted-foreground mb-8 text-base">
            We saved the latest pages for you. Reconnect to refresh live rates and news.
          </p>

          <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-card">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Wifi className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-green-600">Available Features</div>
                    <div className="text-sm text-muted-foreground">Works without internet</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    Saved exchange rates
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    Offline calculator
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    Market insights
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    Contact information
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => window.location.reload()} className="gap-2 shadow-sm">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Button variant="outline" className="gap-2">
              <Smartphone className="h-4 w-4" />
              Continue Offline
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
