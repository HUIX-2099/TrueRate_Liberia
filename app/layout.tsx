import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "@/components/providers"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  // Primary Meta Tags
  title: {
    default: "TrueRate Liberia - #1 USD to LRD Exchange Rate in Liberia | Live Rates Today",
    template: "%s | TrueRate Liberia",
  },
  description:
    "Check today's USD to Liberian Dollar (LRD) exchange rate. Real-time rates from 100+ money changers in Monrovia. AI predictions, currency converter, find best rates near you. Trusted by 50,000+ Liberians.",
  
  // Application Info
  applicationName: "TrueRate Liberia",
  generator: "Next.js",
  manifest: "/manifest.webmanifest",
  
  // Keywords for SEO
  keywords: [
    "USD to LRD",
    "LRD to USD",
    "Liberian Dollar exchange rate",
    "USD LRD rate today",
    "dollar rate in Liberia",
    "Liberia exchange rate",
    "money changer Monrovia",
    "currency converter Liberia",
    "best exchange rate Liberia",
    "Liberian Dollar rate today",
    "forex Liberia",
    "USD rate Monrovia",
    "exchange rate Liberia today",
    "Central Bank of Liberia rate",
    "black market rate Liberia",
    "TrueRate",
    "TrueRate Liberia",
    "truerateliberia",
  ],
  
  // Authors & Creator
  authors: [{ name: "HUIX-2099", url: "https://truerateliberia.com" }],
  creator: "HUIX-2099",
  publisher: "TrueRate Liberia",
  
  // Robots & Indexing
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  // Open Graph (Facebook, LinkedIn, etc.)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://truerateliberia.com",
    siteName: "TrueRate Liberia",
    title: "TrueRate Liberia - #1 USD/LRD Exchange Rate Platform",
    description:
      "Real-time USD to LRD exchange rates. Find the best rates in Monrovia, AI predictions, currency converter, and verified money changers. Updated every minute.",
    images: [
      {
        url: "https://truerateliberia.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "TrueRate Liberia - Live USD/LRD Exchange Rates",
        type: "image/png",
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "TrueRate Liberia - Live USD/LRD Rates Today",
    description:
      "Check today's USD to LRD rate. Real-time data from 100+ sources in Liberia. AI predictions & best rates near you.",
    images: ["https://truerateliberia.com/og-image.png"],
    creator: "@TrueRateLiberia",
    site: "@TrueRateLiberia",
  },
  
  // Verification - Add your codes from Google Search Console, Bing Webmaster, etc.
  // verification: {
  //   google: "your-google-verification-code",
  //   yandex: "yandex-verification-code",
  //   bing: "bing-verification-code",
  // },
  
  // Alternate Languages
  alternates: {
    canonical: "https://truerateliberia.com",
    languages: {
      "en-US": "https://truerateliberia.com",
      "en-LR": "https://truerateliberia.com",
    },
  },
  
  // Category
  category: "Finance",
  
  // Icons
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  
  // Other
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#16A34A" },
    { media: "(prefers-color-scheme: dark)", color: "#22c55e" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
