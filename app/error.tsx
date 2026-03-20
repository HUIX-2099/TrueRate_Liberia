"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Route error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            Something went wrong
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            We&apos;re sorry, but something unexpected happened. Please try again or go back to the home page.
          </p>
          {process.env.NODE_ENV === "development" && error.message && (
            <div className="p-3 rounded-lg bg-muted text-xs font-mono text-muted-foreground overflow-auto max-h-32">
              {error.message}
            </div>
          )}
          <div className="flex gap-2">
            <Button onClick={reset} className="gap-2">
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
              Try Again
            </Button>
            <Button variant="outline" className="gap-2" asChild>
              <Link href="/">
                <Home className="h-4 w-4 text-primary" />
                Go Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



