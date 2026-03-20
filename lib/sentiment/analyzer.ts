/**
 * Lightweight lexicon-based NLP sentiment analyzer.
 * No external dependencies — works offline.
 * Scored in range [-1, +1] and converted to a label.
 *
 * Includes a Liberia-specific financial lexicon for better accuracy
 * on USD/LRD market news and macroeconomic reporting.
 */

export type SentimentLabel = "positive" | "negative" | "neutral"

export interface SentimentResult {
  score: number        // -1 (most negative) to +1 (most positive)
  label: SentimentLabel
  magnitude: number    // 0–1 strength of signal
  tokens: number       // words analyzed
}

// ─── Lexicons ─────────────────────────────────────────────────────────────────

const POSITIVE_TERMS = new Set([
  // General positive
  "gain", "gains", "rise", "rises", "rose", "increase", "increases", "grew", "growth",
  "improve", "improved", "improvement", "recovery", "recover", "stable", "stability",
  "strong", "stronger", "strength", "surge", "surges", "surged", "boost", "boosted",
  "rally", "rallied", "advance", "advances", "advanced", "positive", "optimism",
  "optimistic", "confidence", "confident", "expand", "expanded", "expansion", "profit",
  "profitable", "invest", "investment", "attract", "attracted", "opportunity", "opportunities",
  "support", "supported", "backing", "approve", "approved", "approval", "succeed", "success",
  "successful", "progress", "progressive", "up", "upward", "higher", "record",
  // Liberia-specific / economic
  "liberia", "cbl", "cbr", "remittance", "diaspora", "reform", "reforms", "development",
  "gdp", "exports", "trade surplus", "foreign investment", "foreign exchange",
  "stabilization", "stabilize", "fixed", "peg", "dollarization reversing",
  "affordable", "affordability", "price reduction", "deflation", "low inflation",
])

const NEGATIVE_TERMS = new Set([
  // General negative
  "fall", "falls", "fell", "decline", "declines", "declined", "drop", "drops", "dropped",
  "decrease", "decreases", "decreased", "weak", "weaker", "weakness", "slump", "slumped",
  "crash", "crashed", "collapse", "collapsed", "plunge", "plunged", "loss", "losses",
  "deficit", "debt", "default", "crisis", "crises", "concern", "concerns", "risk", "risks",
  "uncertain", "uncertainty", "volatile", "volatility", "pressure", "pressures", "challenge",
  "challenges", "difficult", "difficulty", "problem", "problems", "failure", "fail", "failed",
  "negative", "pessimism", "pessimistic", "fear", "fears", "warning", "downturn",
  "recession", "contraction", "shrink", "shrinking", "deteriorate", "deteriorating",
  "depreciation", "devaluation", "devalue", "devalued", "overvalued", "undervalued",
  "scarcity", "shortage", "inflation", "hyperinflation", "rising prices", "cost increase",
  "unemployment", "poverty", "corruption", "fraud", "smuggling", "counterfeit",
  "black market", "parallel market premium", "dollarization", "dollar scarcity",
  "fuel shortage", "rice price", "food price spike",
])

const NEGATION_WORDS = new Set(["not", "no", "never", "neither", "nor", "without", "lack", "lacking", "failed to"])

const INTENSIFIERS: Record<string, number> = {
  "very": 1.3, "highly": 1.3, "extremely": 1.5, "significantly": 1.4,
  "sharply": 1.4, "dramatically": 1.5, "substantially": 1.3, "considerably": 1.2,
  "slightly": 0.7, "somewhat": 0.8, "marginally": 0.7,
}

// ─── Core scoring ─────────────────────────────────────────────────────────────

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s'-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1)
}

export function analyzeSentiment(text: string): SentimentResult {
  if (!text || text.length < 3) {
    return { score: 0, label: "neutral", magnitude: 0, tokens: 0 }
  }

  const tokens = tokenize(text)
  let score = 0
  let signalCount = 0
  let negated = false

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    const prevToken = tokens[i - 1]
    const nextToken = tokens[i + 1]

    // Detect negation window (3 words)
    if (NEGATION_WORDS.has(token)) {
      negated = true
      continue
    }
    if (negated && signalCount > 0 && !NEGATION_WORDS.has(token)) {
      negated = false
    }

    // Intensifier
    let multiplier = INTENSIFIERS[token] ?? 1

    let termScore = 0
    if (POSITIVE_TERMS.has(token)) termScore = 1
    else if (NEGATIVE_TERMS.has(token)) termScore = -1

    // Bigram check (e.g. "trade surplus", "rising prices")
    if (nextToken) {
      const bigram = `${token} ${nextToken}`
      if (POSITIVE_TERMS.has(bigram)) termScore = 1
      else if (NEGATIVE_TERMS.has(bigram)) termScore = -1
    }

    if (termScore !== 0) {
      if (negated) termScore = -termScore
      // Check intensifier from prev token
      if (prevToken && INTENSIFIERS[prevToken]) multiplier = INTENSIFIERS[prevToken]
      score += termScore * multiplier
      signalCount++
      negated = false
    }
  }

  // Normalize to [-1, +1]
  const normalized = signalCount > 0 ? Math.max(-1, Math.min(1, score / signalCount)) : 0
  const magnitude = signalCount > 0 ? Math.min(1, signalCount / 10) : 0

  const label: SentimentLabel =
    normalized > 0.1 ? "positive"
    : normalized < -0.1 ? "negative"
    : "neutral"

  return {
    score: Number(normalized.toFixed(3)),
    label,
    magnitude: Number(magnitude.toFixed(2)),
    tokens: tokens.length,
  }
}

/** Analyze a list of news articles and return each with a sentiment result. */
export function analyzeNewsFeed<T extends { title: string; content?: string; summary?: string }>(
  items: T[]
): Array<T & { sentiment: SentimentResult }> {
  return items.map((item) => ({
    ...item,
    sentiment: analyzeSentiment(`${item.title} ${item.content ?? ""} ${item.summary ?? ""}`),
  }))
}

/** Aggregate overall market sentiment from multiple articles. */
export function aggregateMarketSentiment(results: SentimentResult[]): {
  overallScore: number
  label: SentimentLabel
  bullishCount: number
  bearishCount: number
  neutralCount: number
} {
  if (results.length === 0) {
    return { overallScore: 0, label: "neutral", bullishCount: 0, bearishCount: 0, neutralCount: 0 }
  }

  const weightedScore = results.reduce((sum, r) => sum + r.score * (r.magnitude || 0.1), 0)
  const totalWeight = results.reduce((sum, r) => sum + (r.magnitude || 0.1), 0)
  const overallScore = Number((weightedScore / totalWeight).toFixed(3))

  return {
    overallScore,
    label: overallScore > 0.1 ? "positive" : overallScore < -0.1 ? "negative" : "neutral",
    bullishCount: results.filter((r) => r.label === "positive").length,
    bearishCount: results.filter((r) => r.label === "negative").length,
    neutralCount: results.filter((r) => r.label === "neutral").length,
  }
}
