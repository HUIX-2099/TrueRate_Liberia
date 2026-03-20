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
        <section className="relative overflow-x-hidden min-h-[min(36vh,280px)] sm:min-h-[38vh] dark:to-muted/5 border-b border-border/30 md:border-border/20 py-12 sm:py-16 md:py-20">
          <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none" aria-hidden>
            <div className="absolute inset-0 pointer-events-none md:hidden" aria-hidden />
          </div>
          <div className="absolute -top-20 -right-20 z-0 h-40 w-40 sm:h-52 sm:w-52 md:h-64 md:w-64 rounded-full bg-muted/40 border border-border/40 blur-2xl md:blur-3xl" aria-hidden />
          <div className="absolute top-1/2 -left-10 z-0 h-32 w-32 sm:h-44 sm:w-44 md:h-52 md:w-52 rounded-full bg-muted/40 border border-border/40 blur-2xl md:blur-3xl" aria-hidden />
          <div className="absolute bottom-0 right-1/4 z-0 h-20 w-20 sm:h-28 sm:w-28 rounded-full bg-accent/8 blur-xl md:blur-2xl" aria-hidden />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="h-16 w-16 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-5 ring-2 ring-primary/10">
                <MessageSquare className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">
                <span className="hero-headline-gradient relative inline-block pb-1.5 text-foreground">
                  {t("forum.title")}
                </span>
              </h1>
              <p className="text-muted-foreground animate-pulse max-w-2xl mx-auto mb-6 leading-[1.65] rounded-2xl border border-border/50 bg-muted/25 shadow-inner px-4 py-3.5 sm:px-5 sm:py-4 md:rounded-none md:border-0 md:bg-transparent md:shadow-none md:px-0 md:py-0">
                Loading…
              </p>
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
