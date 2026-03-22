export function WebsiteJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "TrueRate Liberia",
          alternateName: ["TrueRate", "TRFN"],
          url: "https://truerateliberia.com",
          description:
            "Know today. Plan tomorrow. Trusted rates, prices, and practical money tools for everyday decisions in Liberia.",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://truerateliberia.com/converter?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }),
      }}
    />
  )
}

export function FinancialServiceJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FinancialService",
          name: "TrueRate Liberia",
          alternateName: ["TrueRate", "TRFN"],
          url: "https://truerateliberia.com",
          logo: "https://truerateliberia.com/icons/logo-512.png",
          description:
            "Live USD/LRD exchange rates, buy/sell spreads, price index, remittance calculator, budget planner, inflation tracker, and community tools for Liberia.",
          areaServed: {
            "@type": "Country",
            name: "Liberia",
          },
          currenciesAccepted: "LRD, USD",
          serviceType: [
            "Currency Exchange Information",
            "Live USD/LRD Rate",
            "Liberia Price Index",
            "Remittance Calculator",
            "Budget Planner",
            "Inflation Tracker",
            "Market Intelligence",
            "Fraud Reporting",
          ],
          address: {
            "@type": "PostalAddress",
            addressCountry: "LR",
            addressLocality: "Monrovia",
          },
          contactPoint: {
            "@type": "ContactPoint",
            email: "info@truerateliberia.com",
            contactType: "customer support",
          },
          sameAs: ["https://twitter.com/TrueRateLiberia"],
        }),
      }}
    />
  )
}

export function ExchangeRateJsonLd({ rate }: { rate?: number }) {
  if (!rate) return null
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ExchangeRateSpecification",
          currency: "USD",
          currentExchangeRate: {
            "@type": "UnitPriceSpecification",
            price: rate,
            priceCurrency: "LRD",
          },
        }),
      }}
    />
  )
}
