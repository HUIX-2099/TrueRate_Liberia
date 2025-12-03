"use client"

export function MarketAnalysis() {
  const factors = [
    {
      title: "USD Supply in Monrovia",
      impact: "HIGH",
      description: "Limited USD cash availability increases LRD/USD rate on streets",
    },
    {
      title: "Remittances & Diaspora Transfers",
      impact: "MEDIUM",
      description: "Incoming diaspora USD transfers increase USD availability, lower LRD rates",
    },
    {
      title: "Inflation & Price Pressure",
      impact: "HIGH",
      description: "Local inflation weakens LRD purchasing power, pushes conversion rate higher",
    },
    {
      title: "Global Commodity Prices",
      impact: "MEDIUM",
      description: "Liberia exports natural resources; global prices affect currency strength",
    },
    {
      title: "Central Bank Interventions",
      impact: "HIGH",
      description: "CBL policy decisions and forex reserves directly control official rates",
    },
    {
      title: "Money Changer Margins",
      impact: "LOW",
      description: "Individual operator spreads cause variation in street rates (±5-10 LRD)",
    },
  ]

  return (
    <section id="analysis" className="bg-white py-20 sm:py-32 border-b border-black/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="mb-16">
          <h2 className="text-xs font-mono font-bold text-black/60 uppercase tracking-wider mb-4">Economics</h2>
          <h3 className="text-5xl font-black text-black tracking-tight mb-6">Why Rates Move</h3>
          <p className="text-lg text-black/70 max-w-3xl">
            Exchange rates are not static. They respond to real economic forces. Understand what drives USD/LRD
            movement.
          </p>
        </div>

        {/* Factor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {factors.map((item, idx) => (
            <div key={idx} className="border border-black/10 p-6 hover:border-black/30 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <h4 className="font-bold text-black text-sm leading-tight flex-1">{item.title}</h4>
                <span
                  className={`ml-3 px-2 py-1 text-xs font-mono font-bold uppercase whitespace-nowrap ${
                    item.impact === "HIGH"
                      ? "bg-red-100 text-red-900"
                      : item.impact === "MEDIUM"
                        ? "bg-yellow-100 text-yellow-900"
                        : "bg-blue-100 text-blue-900"
                  }`}
                >
                  {item.impact}
                </span>
              </div>
              <p className="text-sm text-black/70 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="bg-black text-white p-12">
          <h3 className="text-2xl font-black mb-4">Disclaimer & Data Integrity</h3>
          <p className="text-sm leading-relaxed opacity-90 mb-4">
            <span className="font-bold">TrueRate Liberia is 100% non-commercial.</span> We display exchange rates
            directly from live APIs with zero modifications, artificial rounding, or false data injection. Every rate
            you see reflects actual market data at the moment of fetch.
          </p>
          <p className="text-sm leading-relaxed opacity-90">
            <span className="font-bold">For official transactions:</span> Always verify rates with the Central Bank of
            Liberia (CBL) or licensed money changers in Monrovia. Street rates may vary due to local supply/demand. This
            tool is for education and market awareness.
          </p>
          <p className="text-sm leading-relaxed opacity-90 mt-4 border-t border-white/20 pt-4">
            <span className="font-bold">Our commitment:</span> No lies. Real data. Real time. Updated every 30 seconds
            from live market sources.
          </p>
        </div>
      </div>
    </section>
  )
}
