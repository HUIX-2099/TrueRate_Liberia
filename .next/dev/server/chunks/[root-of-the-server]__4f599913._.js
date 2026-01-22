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
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/timers [external] (timers, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("timers", () => require("timers"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[project]/app/api/news/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "revalidate",
    ()=>revalidate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$rss$2d$parser$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/rss-parser/index.js [app-route] (ecmascript)");
;
const revalidate = 86400;
const SOURCES = [
    {
        name: "FrontPageAfrica Economy",
        url: "https://frontpageafricaonline.com/category/business/economy/feed/"
    },
    {
        name: "allAfrica Business",
        url: "https://allafrica.com/tools/headlines/rdf/liberia/business/headlines.rdf"
    },
    {
        name: "allAfrica",
        url: "https://allafrica.com/tools/headlines/rdf/liberia/headlines.rdf"
    },
    {
        name: "FrontPageAfrica",
        url: "https://frontpageafricaonline.com/feed/"
    },
    {
        name: "New Dawn Liberia",
        url: "https://thenewdawnliberia.com/feed/"
    }
];
const isRelevant = (title)=>{
    const value = title.toLowerCase();
    return value.includes("economy") || value.includes("market") || value.includes("rate") || value.includes("liberia") || value.includes("business") || value.includes("inflation");
};
const stripHtml = (text)=>text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const truncate = (text, max = 180)=>text.length > max ? `${text.slice(0, max - 1)}…` : text;
async function GET() {
    const parser = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$rss$2d$parser$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]();
    const results = await Promise.all(SOURCES.map(async (source)=>{
        try {
            const res = await fetch(source.url, {
                next: {
                    revalidate
                }
            });
            if (!res.ok) return [];
            const xml = await res.text();
            const feed = await parser.parseString(xml);
            return (feed.items || []).map((item)=>({
                    title: item.title || "Untitled",
                    source: source.name,
                    time: item.pubDate || item.isoDate || "Recently",
                    summary: truncate(stripHtml(item.contentSnippet || item.content || item.summary || "")),
                    url: item.link || item.guid || ""
                }));
        } catch  {
            return [];
        }
    }));
    const items = results.flat().filter((item)=>item.url && isRelevant(item.title)).slice(0, 8);
    return Response.json({
        items
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4f599913._.js.map