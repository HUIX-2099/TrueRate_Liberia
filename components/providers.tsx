"use client"

import { type ReactNode } from "react"
import { ThemeProvider } from "next-themes"
import { AuthProvider } from "@/lib/auth/auth-context"
import { LanguageProvider } from "@/lib/i18n/language-context"
import { Toaster } from "@/components/ui/toaster"
import { DevDisclaimer } from "@/components/dev-disclaimer"
import { EducationalMicroLessons } from "@/components/educational-micro-lessons"
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register"
import { ErrorBoundary } from "@/components/error-boundary"
import { StructuredData } from "@/components/structured-data"
import { LiveRateProvider } from "@/lib/live-rate-context"
import { RateThresholdAlertListener } from "@/components/rate-threshold-alerts"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        storageKey="truerate-theme"
      >
        <AuthProvider>
          <LanguageProvider>
            <LiveRateProvider>
            <RateThresholdAlertListener />
            <StructuredData />
            <DevDisclaimer />
            <ServiceWorkerRegister />
            {children}
            <EducationalMicroLessons />
            </LiveRateProvider>
            <Toaster />
          </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
