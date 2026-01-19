"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16 text-center">
        <div className="max-w-md">
          <h1 className="text-3xl font-bold mb-3">You’re offline</h1>
          <p className="text-muted-foreground mb-6">
            We saved the latest pages for you. Reconnect to refresh live rates and news.
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
