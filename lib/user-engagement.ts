// User Engagement Algorithm - Keeps users 100% involved with reliability scoring
export interface UserEngagementMetrics {
  points: number
  level: "Bronze" | "Silver" | "Gold" | "Platinum"
  streakDays: number
  submissions: number
  accuracy: number
  trustScore: number
  badges: string[]
  timestamp: string
}

export function calculateEngagementScore(data: Partial<UserEngagementMetrics>): UserEngagementMetrics {
  const points = (data.points || 0) + (data.submissions || 0) * 10 + (data.streakDays || 0) * 5

  let level: "Bronze" | "Silver" | "Gold" | "Platinum" = "Bronze"
  if (points >= 1000) level = "Platinum"
  else if (points >= 500) level = "Gold"
  else if (points >= 200) level = "Silver"

  const accuracy = Math.min(100, (data.accuracy || 0) * 100 || 0)
  const trustScore = (accuracy * 0.4 + ((data.submissions || 0) / 10) * 0.3 + ((data.streakDays || 0) / 30) * 0.3) * 100

  return {
    points,
    level,
    streakDays: data.streakDays || 0,
    submissions: data.submissions || 0,
    accuracy,
    trustScore: Math.min(100, trustScore),
    badges: generateBadges(points, accuracy, data.submissions || 0),
    timestamp: new Date().toISOString(),
  }
}

function generateBadges(points: number, accuracy: number, submissions: number): string[] {
  const badges = []
  if (points >= 100) badges.push("Contributor")
  if (accuracy >= 95) badges.push("Accurate Reporter")
  if (submissions >= 5) badges.push("Frequent Observer")
  if (points >= 500) badges.push("Rate Guru")
  if (accuracy === 100 && submissions >= 10) badges.push("Master Predictor")
  return badges
}

export function saveUserEngagement(userId: string, metrics: UserEngagementMetrics) {
  const engagementData = {
    userId,
    metrics,
    lastUpdated: new Date().toISOString(),
  }
  localStorage.setItem(`engagement_${userId}`, JSON.stringify(engagementData))
}

export function getUserEngagement(userId: string): UserEngagementMetrics | null {
  const data = localStorage.getItem(`engagement_${userId}`)
  return data ? JSON.parse(data).metrics : null
}
