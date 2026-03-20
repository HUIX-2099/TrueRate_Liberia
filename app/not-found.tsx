"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16" role="main">
        <div className="text-center max-w-md">
          <p className="text-6xl sm:text-7xl font-bold tabular-nums text-primary/20">404</p>
          <h1 className="mt-4 text-xl sm:text-2xl font-semibold text-foreground">
            Page not found
          </h1>
          <p className="mt-2 text-muted-foreground">
            The page you’re looking for doesn’t exist or has been moved.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="gap-2">
              <Link href="/">
                <Home className="h-4 w-4 text-primary" />
                Home
              </Link>
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 text-muted-foreground" />
              Go back
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
