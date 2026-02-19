"use client"

import { MessageSquare } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/i18n/language-context"

export function ForumsFallback() {
  const { t } = useLanguage()
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1 min-w-0">
        <section className="py-10 sm:py-14 md:py-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="h-16 w-16 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-violet-500" />
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold mb-4 text-balance">
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  {t("forum.title")}
                </span>
              </h1>
              <p className="text-muted-foreground animate-pulse">Loading…</p>
            </div>
          </div>
        </section>
        <section className="py-8 sm:py-12 bg-background">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <div className="h-48 rounded-lg bg-muted/50 animate-pulse" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
