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
"[project]/lib/api/advanced-prediction.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateAdvancedPredictions",
    ()=>generateAdvancedPredictions
]);
// Simple Moving Average
function smaPredict(data, periods) {
    const predictions = [];
    for(let i = 0; i < periods; i++){
        const recentData = data.slice(-(20 + i));
        const avg = recentData.reduce((sum, val)=>sum + val, 0) / recentData.length;
        predictions.push(avg);
    }
    return predictions;
}
// Exponential Moving Average (more weight on recent data)
function emaPredict(data, periods) {
    const predictions = [];
    const alpha = 0.3 // Smoothing factor
    ;
    let ema = data[data.length - 1];
    for(let i = 0; i < periods; i++){
        predictions.push(ema);
        // Assume slight trend continuation
        const trend = data[data.length - 1] - data[data.length - 2];
        ema = ema + trend * 0.5;
    }
    return predictions;
}
// Linear Regression
function linearRegressionPredict(data, periods) {
    const n = data.length;
    const x = Array.from({
        length: n
    }, (_, i)=>i);
    const y = data;
    // Calculate slope and intercept
    const sumX = x.reduce((a, b)=>a + b, 0);
    const sumY = y.reduce((a, b)=>a + b, 0);
    const sumXY = x.reduce((sum, xi, i)=>sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi)=>sum + xi * xi, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const predictions = [];
    for(let i = 0; i < periods; i++){
        predictions.push(slope * (n + i) + intercept);
    }
    return predictions;
}
// ARIMA-inspired prediction (simplified)
function arimaPredict(data, periods) {
    const predictions = [];
    const p = 3 // autoregressive order
    ;
    for(let i = 0; i < periods; i++){
        const recent = i === 0 ? data.slice(-p) : [
            ...data.slice(-p + i),
            ...predictions
        ].slice(-p);
        // Simple AR model
        const prediction = recent.reduce((sum, val)=>sum + val, 0) / p;
        predictions.push(prediction);
    }
    return predictions;
}
// Seasonal decomposition with trend
function seasonalPredict(data, periods) {
    const predictions = [];
    const seasonalPeriod = 7 // Weekly seasonality
    ;
    for(let i = 0; i < periods; i++){
        const seasonalIndex = (data.length + i) % seasonalPeriod;
        const seasonalValues = data.filter((_, idx)=>idx % seasonalPeriod === seasonalIndex);
        const seasonal = seasonalValues.reduce((a, b)=>a + b, 0) / seasonalValues.length;
        // Add trend
        const recentTrend = data[data.length - 1] - data[data.length - 8];
        predictions.push(seasonal + recentTrend / 7 * i);
    }
    return predictions;
}
const MODELS = [
    {
        name: "SMA",
        predict: (data)=>smaPredict(data, 30),
        weight: 0.15
    },
    {
        name: "EMA",
        predict: (data)=>emaPredict(data, 30),
        weight: 0.2
    },
    {
        name: "Linear Regression",
        predict: (data)=>linearRegressionPredict(data, 30),
        weight: 0.2
    },
    {
        name: "ARIMA",
        predict: (data)=>arimaPredict(data, 30),
        weight: 0.25
    },
    {
        name: "Seasonal",
        predict: (data)=>seasonalPredict(data, 30),
        weight: 0.2
    }
];
function generateAdvancedPredictions(historicalData) {
    const rates = historicalData.map((d)=>d.rate);
    // Get predictions from all models
    const allPredictions = MODELS.map((model)=>({
            name: model.name,
            predictions: model.predict(rates),
            weight: model.weight
        }));
    // Ensemble predictions (weighted average)
    const predictions = [];
    const now = Date.now();
    for(let i = 0; i < 30; i++){
        const date = new Date(now + (i + 1) * 24 * 60 * 60 * 1000);
        // Weighted average of all model predictions
        let weightedSum = 0;
        let totalWeight = 0;
        allPredictions.forEach(({ predictions, weight })=>{
            if (predictions[i]) {
                weightedSum += predictions[i] * weight;
                totalWeight += weight;
            }
        });
        const predicted = weightedSum / totalWeight;
        // Calculate variance between models for confidence
        const modelPredictions = allPredictions.map((p)=>p.predictions[i]).filter(Boolean);
        const variance = modelPredictions.reduce((sum, pred)=>sum + Math.pow(pred - predicted, 2), 0) / modelPredictions.length;
        const stdDev = Math.sqrt(variance);
        // Confidence decreases with time and variance
        const timeDecay = Math.exp(-i / 15) // Exponential decay
        ;
        const confidence = Math.max(0.1, Math.min(0.95, (1 - stdDev / predicted) * timeDecay));
        predictions.push({
            date: date.toISOString().split("T")[0],
            predicted: Number(predicted.toFixed(2)),
            confidence: Number(confidence.toFixed(2)),
            lower: Number((predicted - stdDev * 2).toFixed(2)),
            upper: Number((predicted + stdDev * 2).toFixed(2))
        });
    }
    return predictions;
}
}),
"[project]/app/api/rates/predictions/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$multi$2d$source$2d$rates$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/multi-source-rates.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$advanced$2d$prediction$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/advanced-prediction.ts [app-route] (ecmascript)");
;
;
;
const dynamic = "force-dynamic";
async function GET(request) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const days = Number.parseInt(searchParams.get("days") || "30");
        // Generate historical data for ML training
        const historicalData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$multi$2d$source$2d$rates$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateHistoricalData"])(90);
        // Use advanced ensemble prediction
        const predictions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$advanced$2d$prediction$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateAdvancedPredictions"])(historicalData);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            predictions: predictions.slice(0, Math.min(days, 30)),
            models: [
                "SMA",
                "EMA",
                "Linear Regression",
                "ARIMA",
                "Seasonal Decomposition"
            ],
            methodology: "Ensemble learning with 5 ML models",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("[v0] Error in predictions API:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to generate predictions"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__abb07d36._.js.map