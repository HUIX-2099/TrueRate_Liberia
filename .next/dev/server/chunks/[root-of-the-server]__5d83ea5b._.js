module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/api/multi-source-rates.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RATE_SOURCES",
    ()=>RATE_SOURCES,
    "generateHistoricalData",
    ()=>generateHistoricalData,
    "getAggregatedRate",
    ()=>getAggregatedRate
]);
// Prefer authenticated ExchangeRate-API v6 USD/LRD pair endpoint when key is provided
const EXCHANGE_RATE_API_KEY = ("TURBOPACK compile-time value", "demo") || "demo";
const RATE_SOURCES = [
    // Fawaz Ahmed Currency API - Free, supports LRD
    {
        name: "Currency API (Fawaz Ahmed)",
        url: "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
        parser: (data)=>data?.usd?.lrd || null,
        weight: 1.0
    },
    // Open Exchange Rates - Free tier
    {
        name: "Open Exchange Rates",
        url: "https://open.er-api.com/v6/latest/USD",
        parser: (data)=>data?.rates?.LRD || null,
        weight: 1.0
    },
    // Exchange Rate API - Free
    {
        name: "ExchangeRate API",
        url: "https://api.exchangerate-api.com/v4/latest/USD",
        parser: (data)=>data?.rates?.LRD || null,
        weight: 0.9
    }
];
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
async function fetchFromSource(source) {
    try {
        const response = await fetch(source.url, {
            next: {
                revalidate: 300
            },
            headers: {
                "User-Agent": "TrueRate-Liberia/1.0"
            }
        });
        if (!response.ok) {
            console.log(`[v0] ${source.name} returned status ${response.status}`);
            return null;
        }
        const data = await response.json();
        const rate = source.parser(data);
        if (rate && rate > 0 && rate > 150 && rate < 220) {
            console.log(`[v0] ${source.name}: ${rate} LRD per USD`);
            return {
                rate,
                source: source.name
            };
        }
        return null;
    } catch (error) {
        console.error(`[v0] Error fetching from ${source.name}:`, error);
        return null;
    }
}
async function getAggregatedRate() {
    let sources = RATE_SOURCES;
    // If a real API key is present, try the authenticated source once before fallback aggregation.
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const results = await Promise.allSettled(sources.map((source)=>fetchFromSource(source)));
    const validResults = results.filter((result)=>result.status === "fulfilled" && result.value !== null).map((result)=>result.value);
    if (validResults.length === 0) {
        console.log("[v0] All APIs failed, using CBL fallback rate");
        return {
            rate: 179.0,
            confidence: 0.7,
            sources: [
                "Central Bank of Liberia (Fallback)"
            ],
            timestamp: new Date().toISOString()
        };
    }
    const rates = validResults.map((r)=>r.rate);
    const avgRate = rates.reduce((sum, rate)=>sum + rate, 0) / rates.length;
    const variance = rates.reduce((sum, rate)=>sum + Math.pow(rate - avgRate, 2), 0) / rates.length;
    const stdDev = Math.sqrt(variance);
    const confidence = Math.max(0.6, Math.min(1.0, 1 - stdDev / avgRate));
    console.log(`[v0] Aggregated rate: ${avgRate.toFixed(2)} from ${validResults.length} sources`);
    return {
        rate: Number(avgRate.toFixed(4)),
        confidence: Number(confidence.toFixed(2)),
        sources: validResults.map((r)=>r.source),
        timestamp: new Date().toISOString()
    };
}
function generateHistoricalData(days) {
    const data = [];
    const now = Date.now();
    const baseRate = 179.0 // Current real rate
    ;
    for(let i = days - 1; i >= 0; i--){
        const date = new Date(now - i * 24 * 60 * 60 * 1000);
        const weekCycle = Math.sin((days - i) / 7 * Math.PI) * 1.5;
        const trend = (days - i) * 0.015;
        const noise = (Math.random() - 0.5) * 2;
        const rate = baseRate + weekCycle + trend + noise;
        const volume = 40000 + Math.random() * 30000;
        data.push({
            date: date.toISOString().split("T")[0],
            rate: Number(rate.toFixed(4)),
            volume: Math.round(volume)
        });
    }
    return data;
}
}),
"[project]/app/api/rates/live/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "revalidate",
    ()=>revalidate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$multi$2d$source$2d$rates$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/multi-source-rates.ts [app-route] (ecmascript)");
;
;
async function GET() {
    try {
        const aggregatedData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$multi$2d$source$2d$rates$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAggregatedRate"])();
        // Simulate money changer rates with slight variations
        const baseRate = aggregatedData.rate;
        const changers = [
            {
                id: "1",
                location: "Broad Street, Monrovia",
                buyRate: baseRate - 2,
                sellRate: baseRate + 2,
                rating: 4.8,
                verified: true
            },
            {
                id: "2",
                name: "Quick Cash",
                location: "Sinkor, Monrovia",
                buyRate: baseRate - 1.5,
                sellRate: baseRate + 2.5,
                rating: 4.6,
                verified: true
            },
            {
                id: "3",
                name: "Global Money Transfer",
                location: "Red Light, Monrovia",
                buyRate: baseRate - 3,
                sellRate: baseRate + 1,
                rating: 4.9,
                verified: true
            }
        ];
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            // Backward compatibility for clients expecting `data.rate`
            rate: aggregatedData.rate,
            official: {
                rate: aggregatedData.rate,
                confidence: aggregatedData.confidence,
                sources: aggregatedData.sources,
                timestamp: aggregatedData.timestamp
            },
            changers,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Best rate API error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Unable to fetch best rate"
        }, {
            status: 500
        });
    }
}
const revalidate = 60 // Revalidate every minute
;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__5d83ea5b._.js.map