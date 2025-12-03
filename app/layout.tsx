import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { DevDisclaimer } from "@/components/dev-disclaimer"
import { EducationalMicroLessons } from "@/components/educational-micro-lessons"
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TrueRate-Liberia - Real-Time USD/LRD Exchange Rates & AI Predictions",
  description:
    "The most accurate USD to LRD exchange rates in Liberia. Real-time data from 100+ sources, AI-powered predictions, verified money changers, and market analysis. Built by HUIX-2099.",
  generator: "v0.app",
  manifest: "/manifest.webmanifest",
  themeColor: "#16A34A",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          <DevDisclaimer />
          <ServiceWorkerRegister />
          {children}
          <EducationalMicroLessons />
          <Toaster />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
