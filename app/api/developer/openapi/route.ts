import { NextResponse } from "next/server"

/** Returns the TrueRate public API OpenAPI 3.1 specification. */
export async function GET() {
  const spec = {
    openapi: "3.1.0",
    info: {
      title: "TrueRate Liberia API",
      version: "1.0.0",
      description:
        "Real-time USD/LRD exchange rate data, market intelligence, and financial tools for Liberia. " +
        "Authenticate with `Authorization: Bearer <api-key>`. Obtain a key at /developer.",
      contact: { name: "TrueRate Support", url: "https://truerate.app/developer" },
      license: { name: "MIT" },
    },
    servers: [
      { url: "/api", description: "Current environment" },
    ],
    security: [{ ApiKeyAuth: [] }],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "API Key",
          description: "Your TrueRate API key, prefixed with `tr_live_`.",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
        Rate: {
          type: "object",
          properties: {
            rate: { type: "number", example: 194.5 },
            source: { type: "string", example: "CBL" },
            timestamp: { type: "string", format: "date-time" },
            change24h: { type: "number", example: 0.3 },
            changePct: { type: "number", example: 0.15 },
          },
        },
        Prediction: {
          type: "object",
          properties: {
            date: { type: "string", format: "date" },
            predicted: { type: "number" },
            bandLow: { type: "number" },
            bandHigh: { type: "number" },
            model: { type: "string" },
          },
        },
        NewsItem: {
          type: "object",
          properties: {
            title: { type: "string" },
            url: { type: "string", format: "uri" },
            publishedAt: { type: "string", format: "date-time" },
            source: { type: "string" },
            sentiment: {
              type: "object",
              properties: {
                label: { type: "string", enum: ["positive", "negative", "neutral"] },
                score: { type: "number" },
              },
            },
          },
        },
      },
    },
    paths: {
      "/rates/live": {
        get: {
          operationId: "getLiveRate",
          summary: "Live USD/LRD rate",
          description: "Returns the current USD/LRD exchange rate from CBL and street market sources.",
          tags: ["Rates"],
          security: [],
          responses: {
            "200": {
              description: "Current rate",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Rate" },
                },
              },
            },
          },
        },
      },
      "/rates/history": {
        get: {
          operationId: "getRateHistory",
          summary: "Historical USD/LRD rates",
          description: "Returns historical exchange rate data for the requested period.",
          tags: ["Rates"],
          parameters: [
            { name: "days", in: "query", schema: { type: "integer", default: 30 }, description: "Number of days of history" },
            { name: "currency", in: "query", schema: { type: "string", default: "LRD" }, description: "Target currency code" },
          ],
          responses: {
            "200": {
              description: "Array of historical rate points",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: { type: "array", items: { $ref: "#/components/schemas/Rate" } },
                    },
                  },
                },
              },
            },
            "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/rates/predictions": {
        get: {
          operationId: "getRatePredictions",
          summary: "Rate forecasts (ML ensemble)",
          description: "Returns 7-day USD/LRD rate predictions using an ensemble of SMA, EMA, linear regression, and Holt-Winters models. Requires Standard tier or above.",
          tags: ["Rates", "Intelligence"],
          parameters: [
            { name: "days", in: "query", schema: { type: "integer", default: 7 }, description: "Forecast horizon (max 30)" },
          ],
          responses: {
            "200": {
              description: "Array of prediction points",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      predictions: { type: "array", items: { $ref: "#/components/schemas/Prediction" } },
                      mape: { type: "number" },
                      methodology: { type: "string" },
                    },
                  },
                },
              },
            },
            "403": { description: "Insufficient tier", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/liberia-market-news": {
        get: {
          operationId: "getMarketNews",
          summary: "Liberia market news with sentiment",
          description: "Returns aggregated market news headlines with NLP sentiment scores.",
          tags: ["Intelligence"],
          responses: {
            "200": {
              description: "News items with sentiment analysis",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      items: { type: "array", items: { $ref: "#/components/schemas/NewsItem" } },
                      sentiment: {
                        type: "object",
                        properties: {
                          label: { type: "string", enum: ["positive", "negative", "neutral"] },
                          score: { type: "number" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/invest/opportunities": {
        get: {
          operationId: "getInvestmentOpportunities",
          summary: "Investment opportunities in Liberia",
          description: "Returns curated investment opportunities with risk scores, returns, and county-level data.",
          tags: ["Invest"],
          parameters: [
            { name: "sector", in: "query", schema: { type: "string" }, description: "Filter by sector" },
            { name: "region", in: "query", schema: { type: "string" }, description: "Filter by county/region" },
            { name: "risk", in: "query", schema: { type: "string", enum: ["low", "medium", "high"] } },
          ],
          responses: {
            "200": {
              description: "Array of investment opportunities",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      opportunities: { type: "array", items: { type: "object" } },
                      total: { type: "integer" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/forums/threads": {
        get: {
          operationId: "getForumThreads",
          summary: "Community forum threads",
          description: "Returns forum threads, optionally filtered by category.",
          tags: ["Community"],
          parameters: [
            { name: "category", in: "query", schema: { type: "string" } },
            { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
            { name: "offset", in: "query", schema: { type: "integer", default: 0 } },
          ],
          responses: {
            "200": {
              description: "Forum threads",
              content: { "application/json": { schema: { type: "object" } } },
            },
          },
        },
      },
      "/developer/keys": {
        get: {
          operationId: "listApiKeys",
          summary: "List your API keys",
          tags: ["Developer"],
          responses: {
            "200": { description: "List of API keys (key value hidden)", content: { "application/json": { schema: { type: "object" } } } },
            "401": { description: "Unauthorized" },
          },
        },
        post: {
          operationId: "createApiKey",
          summary: "Create a new API key",
          tags: ["Developer"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name"],
                  properties: {
                    name: { type: "string", example: "My app" },
                    tier: { type: "string", enum: ["free", "standard", "premium", "enterprise"], default: "free" },
                  },
                },
              },
            },
          },
          responses: {
            "201": { description: "Created key (value shown once)", content: { "application/json": { schema: { type: "object" } } } },
          },
        },
      },
      "/developer/keys/{id}": {
        delete: {
          operationId: "revokeApiKey",
          summary: "Revoke an API key",
          tags: ["Developer"],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            "200": { description: "Key revoked" },
            "404": { description: "Key not found" },
          },
        },
      },
    },
    tags: [
      { name: "Rates", description: "Exchange rate data and predictions" },
      { name: "Intelligence", description: "Market news, sentiment, analytics" },
      { name: "Invest", description: "Investment opportunities and regional insights" },
      { name: "Community", description: "Forum threads and community signals" },
      { name: "Developer", description: "API key management" },
    ],
  }

  return NextResponse.json(spec, {
    headers: { "Content-Type": "application/json" },
  })
}
