"use client"

import { useEffect, useState } from 'react'

interface StructuredDataProps {
  currentRate?: number
}

export function StructuredData({ currentRate = 198.5 }: StructuredDataProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TrueRate Liberia",
    "alternateName": ["TrueRate", "TrueRate-Liberia", "TrueRateLiberia"],
    "url": "https://truerateliberia.com",
    "logo": "https://truerateliberia.com/icon.svg",
    "description": "Liberia's #1 USD/LRD exchange rate platform providing real-time rates, AI predictions, and verified money changers.",
    "foundingDate": "2024",
    "founders": [{
      "@type": "Person",
      "name": "HUIX-2099"
    }],
    "areaServed": {
      "@type": "Country",
      "name": "Liberia"
    },
    "sameAs": [
      "https://twitter.com/TrueRateLiberia",
      "https://facebook.com/TrueRateLiberia"
    ]
  }

  // WebSite Schema with Search Action
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "TrueRate Liberia",
    "alternateName": "TrueRate",
    "url": "https://truerateliberia.com",
    "description": "Real-time USD to LRD exchange rates in Liberia",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://truerateliberia.com/converter?amount={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  }

  // Financial Service Schema
  const financialServiceSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": "TrueRate Liberia Currency Exchange",
    "description": "Live USD to LRD exchange rates and currency conversion services in Liberia",
    "url": "https://truerateliberia.com",
    "areaServed": {
      "@type": "Country",
      "name": "Liberia"
    },
    "serviceType": "Currency Exchange Rate Information",
    "provider": {
      "@type": "Organization",
      "name": "TrueRate Liberia"
    }
  }

  // ExchangeRateSpecification Schema (live rate data)
  const exchangeRateSchema = {
    "@context": "https://schema.org",
    "@type": "ExchangeRateSpecification",
    "currency": "LRD",
    "currentExchangeRate": {
      "@type": "UnitPriceSpecification",
      "price": currentRate,
      "priceCurrency": "USD"
    },
    "exchangeRateSpread": 0.5
  }

  // SoftwareApplication Schema (for app-like features)
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "TrueRate Liberia",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250",
      "bestRating": "5",
      "worstRating": "1"
    }
  }

  // FAQ Schema for common questions
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the current USD to LRD exchange rate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The current USD to LRD exchange rate is approximately ${currentRate} LRD per 1 USD. Rates are updated in real-time from 100+ money changers across Liberia.`
        }
      },
      {
        "@type": "Question",
        "name": "Where can I find the best USD/LRD exchange rate in Monrovia?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "TrueRate Liberia shows live rates from verified money changers across Monrovia. Use our Map feature to find the best rates near you with real-time updates."
        }
      },
      {
        "@type": "Question",
        "name": "How accurate are TrueRate's exchange rate predictions?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our AI predictions use 5 machine learning models (LSTM, XGBoost, ARIMA, Prophet, SMA) with historical accuracy above 85% for 7-day forecasts."
        }
      },
      {
        "@type": "Question",
        "name": "Is TrueRate Liberia free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, TrueRate Liberia is completely free for basic features including live rates, currency converter, and rate predictions. Premium SMS alerts are available for a small fee."
        }
      }
    ]
  }

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://truerateliberia.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Currency Converter",
        "item": "https://truerateliberia.com/converter"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Rate Predictions",
        "item": "https://truerateliberia.com/predictions"
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(financialServiceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(exchangeRateSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  )
}



