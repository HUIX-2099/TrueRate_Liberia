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
      <main className="flex-1 min-w-0 pb-20 md:pb-0 overflow-x-hidden relative">
        <section className="relative py-12 sm:py-16 md:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,var(--primary)/0.06),linear-gradient(to_bottom,var(--muted)/0.3,transparent_55%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)/0.04_1px,transparent_1px),linear-gradient(to_bottom,var(--border)/0.04_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          <div className="container mx-auto px-4 sm:px-6 relative z-0">
            <div className="max-w-4xl mx-auto text-center">
              <div className="h-16 w-16 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-5 ring-2 ring-primary/10">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">
                <span className="bg-gradient-to-r from-foreground to-foreground/90 bg-clip-text text-transparent">
                  {t("forum.title")}
                </span>
              </h1>
              <p className="text-muted-foreground animate-pulse">Loading…</p>
            </div>
          </div>
        </section>
        <section className="py-10 sm:py-14 bg-background">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <div className="h-56 rounded-2xl bg-muted/50 animate-pulse" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
