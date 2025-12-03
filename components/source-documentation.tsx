"use client"

export function SourceDocumentation() {
  const sources = [
    {
      name: "ExchangeRate API",
      description: "Real-time, CORS-friendly mid-market rates",
      url: "https://exchangerate-api.com",
      status: "LIVE",
      type: "PRIMARY",
    },
    {
      name: "Wise",
      description: "Official transfer rates (24-48 hours)",
      url: "https://wise.com",
      status: "REFERENCE",
      type: "OFFICIAL",
    },
    {
      name: "Central Bank of Liberia",
      description: "Official CBL buying/selling rates",
      url: "https://cbl.org.lr",
      status: "REFERENCE",
      type: "OFFICIAL",
    },
    {
      name: "XE Currency Converter",
      description: "Independent currency data",
      url: "https://xe.com",
      status: "REFERENCE",
      type: "SECONDARY",
    },
  ]

  return (
    <section id="sources" className="bg-white py-20 sm:py-32 border-b border-black/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="mb-16">
          <h2 className="text-xs font-mono font-bold text-black/60 uppercase tracking-wider mb-4">Data Sources</h2>
          <h3 className="text-5xl font-black text-black tracking-tight mb-6">100% Verified Sources</h3>
          <p className="text-lg text-black/70 max-w-3xl">
            All rates are fetched from live, verified APIs and official sources. No cached data. No approximations. Pure
            real-time market data.
          </p>
        </div>

        {/* Source Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {sources.map((source, idx) => (
            <div key={idx} className="border-l-4 border-black pl-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-xl font-black text-black mb-2">{source.name}</h4>
                  <p className="text-sm text-black/70">{source.description}</p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <span className="px-3 py-1 bg-black text-white text-xs font-mono font-bold uppercase">
                    {source.status}
                  </span>
                  <span className="px-3 py-1 bg-black/10 text-black text-xs font-mono font-bold uppercase">
                    {source.type}
                  </span>
                </div>
              </div>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono font-bold text-black hover:text-black/60 transition mt-4 border-b border-black pb-1"
              >
                Visit Source →
              </a>
            </div>
          ))}
        </div>

        {/* Why Rates Differ Section */}
        <div className="bg-black/5 border border-black/10 p-12 mb-16">
          <h3 className="text-2xl font-black text-black mb-8">Why Exchange Rates Differ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-black mb-3 text-sm uppercase tracking-wider">Mid-Market vs Street Rates</h4>
              <p className="text-sm text-black/70 leading-relaxed">
                Official APIs show mid-market rates (theoretical midpoint between buy/sell). Money changers add margins
                (±5–10 LRD per USD) to cover operational costs and profit.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-black mb-3 text-sm uppercase tracking-wider">Update Frequency</h4>
              <p className="text-sm text-black/70 leading-relaxed">
                Our primary source updates every 30 seconds. Some reference sources update hourly or daily. Real-time
                liquidity and demand shifts rates continuously.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-black mb-3 text-sm uppercase tracking-wider">Market Volatility</h4>
              <p className="text-sm text-black/70 leading-relaxed">
                USD supply/demand in Monrovia, inflation, remittance flows, and local economic conditions all affect
                street rates independently of official rates.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-black mb-3 text-sm uppercase tracking-wider">Data Lag</h4>
              <p className="text-sm text-black/70 leading-relaxed">
                Some published rates may lag actual market conditions by hours. Our live API minimizes this lag with
                real-time data feeds.
              </p>
            </div>
          </div>
        </div>

        {/* Important Note */}
        <div className="bg-red-50 border-l-4 border-red-600 p-8">
          <h4 className="font-bold text-black mb-2 text-sm uppercase tracking-wider">Data Accuracy Statement</h4>
          <p className="text-sm text-black/80">
            TrueRate Liberia is <span className="font-bold">100% non-commercial</span> and displays rates directly from
            live APIs with zero modifications. We do not inject false data, round rates artificially, or cache stale
            information. All displayed rates reflect market reality at the moment of fetch. For official transactions,
            verify rates with the Central Bank of Liberia or licensed money changers.
          </p>
        </div>
      </div>
    </section>
  )
}
