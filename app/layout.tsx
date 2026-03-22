import type React from "react"
import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "@/components/providers"
import { ScrollToTop } from "@/components/scroll-to-top"
import { SkipLinks } from "@/components/layout/skip-links"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://truerateliberia.com"),
  title: {
    default: "TrueRate Liberia — Trusted Rates and Money Tools",
    template: "%s | TrueRate Liberia",
  },
  description:
    "Know today. Plan tomorrow. TrueRate Liberia delivers live USD/LRD exchange rates, buy/sell spreads, Liberia price index, remittance tools, and practical money tools built for everyday decisions in Liberia.",

  applicationName: "TrueRate Liberia",
  generator: "Next.js",
  manifest: "/manifest.webmanifest",

  keywords: [
    // ── Brand
    "TrueRate Liberia",
    "TrueRate",
    "TRFN",
    "trusted rates Liberia",
    "trusted money tools Liberia",

    // ── Core tagline phrases (from homepage)
    "know today plan tomorrow",
    "smarter money decisions Liberia",
    "trusted market facts Liberia",
    "clear market facts Liberia",
    "everyday money decisions Liberia",

    // ── USD/LRD exchange (highest volume)
    "USD to LRD",
    "USD to LRD today",
    "LRD to USD",
    "USD LRD rate today",
    "dollar rate in Liberia today",
    "dollar rate Liberia",
    "1 USD to LRD",
    "how much is 1 dollar in Liberia",
    "LRD per USD",
    "live exchange rate Liberia",
    "live USD LRD rate",

    // ── Buy/sell spread (from live rate widget)
    "USD buy rate Liberia",
    "USD sell rate Liberia",
    "buy sell spread Liberia",
    "market rate vs CBL rate Liberia",

    // ── CBL & official rates
    "CBL exchange rate today",
    "CBL rate Liberia",
    "Central Bank of Liberia exchange rate",
    "official exchange rate Liberia",
    "parallel market rate Liberia",

    // ── Location-specific
    "exchange rate Monrovia",
    "money changer Monrovia",
    "best exchange rate Monrovia",
    "currency exchange Monrovia",
    "dollar rate Monrovia today",

    // ── Currency converter (from nav + tools)
    "currency converter Liberia",
    "convert USD to LRD",
    "convert LRD to USD",
    "USD LRD calculator",
    "Liberian Dollar converter",

    // ── Price index (from homepage section)
    "Liberia price index",
    "essential goods prices Liberia",
    "food prices Liberia today",
    "rice price Liberia today",
    "fuel price Liberia today",
    "fair price Liberia",
    "check price Liberia",
    "LISGIS price index Liberia",
    "essential commodities Liberia",

    // ── Inflation (from homepage section)
    "Liberia inflation rate",
    "Liberia CPI",
    "cost of living Liberia",
    "inflation tracker Liberia",
    "LRD stability",
    "Liberia daily market brief",
    "My Liberia Daily",

    // ── Remittance & diaspora (from Diaspora Mode + Remittance Tools)
    "send money to Liberia",
    "remittance to Liberia",
    "remittance calculator Liberia",
    "best way to send money to Liberia",
    "diaspora Liberia remittance",
    "compare remittance fees Liberia",
    "money transfer Liberia",
    "Liberia diaspora tools",
    "Liberia diaspora mode",

    // ── Business (from Business nav item)
    "Liberia business exchange rate",
    "forex Liberia",
    "importers exporters Liberia tools",
    "Liberia foreign exchange",
    "USD demand Liberia",
    "market intelligence Liberia",

    // ── Money tools (from Money Tools nav + features)
    "money tools Liberia",
    "budget planner Liberia",
    "student budget tool Liberia",
    "personal impact calculator Liberia",
    "financial planning tools Liberia",
    "Liberia financial tools",

    // ── Market & news (from Market nav + market news section)
    "Liberia market news",
    "Liberia economic outlook",
    "TRFN economic outlook",
    "live market Liberia",
    "Liberia market data",
    "Liberia FX market",
    "FX rate Liberia",

    // ── Community & safety (from Community + Report Fraud nav)
    "report fraud Liberia",
    "report bad exchange rate Liberia",
    "community price updates Liberia",
    "Liberia rate community",

    // ── PWA & SMS (from footer)
    "TrueRate Liberia app",
    "SMS rate alerts Liberia",
    "offline exchange rate Liberia",
    "TrueRate PWA",
  ],

  authors: [
    { name: "Moses J. Sackey", url: "https://huix-2099.vercel.app" },
    { name: "Victor E. Coleman", url: "https://huix-2099.vercel.app" },
  ],
  creator: "HUIX-2099 — A Liberian Future-Tech Startup",
  publisher: "TrueRate Liberia",

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

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://truerateliberia.com",
    siteName: "TrueRate Liberia",
    title: "TrueRate Liberia — Trusted Rates and Money Tools",
    description:
      "Know today. Plan tomorrow. Live USD/LRD rates, buy/sell spreads, price index, remittance tools, and practical money tools for everyday decisions in Liberia.",
    images: [
      {
        url: "https://truerateliberia.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "TrueRate Liberia — Trusted Rates and Money Tools",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "TrueRate Liberia — Live USD/LRD Rates & Money Tools",
    description:
      "Know today. Plan tomorrow. Live exchange rates, price index, remittance tools and financial planning for Liberia.",
    images: ["https://truerateliberia.com/opengraph-image"],
    creator: "@TrueRateLiberia",
    site: "@TrueRateLiberia",
  },

  alternates: {
    canonical: "https://truerateliberia.com",
    languages: {
      "en-US": "https://truerateliberia.com",
      "en-LR": "https://truerateliberia.com",
    },
  },

  category: "Finance",

  icons: {
    icon: [
      // Dark mode favicons
      { url: "/icons/logo-48.png", type: "image/png", sizes: "48x48", media: "(prefers-color-scheme: dark)" },
      { url: "/icons/logo-192.png", type: "image/png", sizes: "192x192", media: "(prefers-color-scheme: dark)" },
      { url: "/icons/logo-512.png", type: "image/png", sizes: "512x512", media: "(prefers-color-scheme: dark)" },
      // Light mode favicons
      { url: "/icons/logo-48-light.png", type: "image/png", sizes: "48x48", media: "(prefers-color-scheme: light)" },
      { url: "/icons/logo-192-light.png", type: "image/png", sizes: "192x192", media: "(prefers-color-scheme: light)" },
      // Fallback (no media query) for browsers that ignore media
      { url: "/icons/logo-48.png", type: "image/png", sizes: "48x48" },
    ],
    apple: [
      { url: "/icons/logo-180.png", sizes: "180x180", type: "image/png" },
      { url: "/icons/logo-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/icons/logo-512.png",
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
  maximumScale: 5,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Set .dark on <html> from system preference or saved theme before first paint */}
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html: `(function(){var key='truerate-theme';var s;try{s=localStorage.getItem(key);}catch(e){s=null;}var theme=s||'system';var isDark=theme==='dark'||(theme==='system'&&typeof window!=='undefined'&&window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',isDark);})();`,
          }}
        />
        {/* Theme-aware favicon: same logic as theme (system preference or saved theme) */}
        <link rel="icon" id="theme-favicon" href="/icons/logo-48.png" type="image/png" sizes="48x48" />
        <script
          id="favicon-theme"
          dangerouslySetInnerHTML={{
            __html: `(function(){var key='truerate-theme';var dark='/icons/logo-48.png';var light='/icons/logo-48-light.png';function apply(){var s;try{s=localStorage.getItem(key);}catch(e){s=null;}var theme=s||'system';var isDark=theme==='dark'||(theme==='system'&&window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches);var el=document.getElementById('theme-favicon');if(el)el.href=isDark?dark:light;}function run(){apply();if(window.matchMedia){window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',apply);}window.addEventListener('storage',function(e){if(e.key===key)apply();});window.addEventListener('truerate-theme-change',apply);}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();})();`,
          }}
        />
        {/* Preload critical resources — avoid app CSS path (Turbopack/dev differs from build) */}
        <link rel="preload" href="/icons/logo-192.png" as="image" />
        <link rel="preload" href="/images/tribes-map.png" as="image" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        {/* Preconnect to external APIs */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Google Fonts: DM Sans (hero display), Inter (sans), JetBrains Mono (mono) */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000&family=Inter:wght@100..900&family=JetBrains+Mono:wght@100..800&display=swap"
        />
      </head>
      <body className="font-sans antialiased min-h-screen min-w-0 w-full overflow-x-hidden box-border pb-[calc(env(safe-area-inset-bottom)+4rem)] md:pb-0 pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
        <SkipLinks />
        <Providers>{children}</Providers>
        <ScrollToTop />
        <Analytics />
      </body>
    </html>
  )
}
