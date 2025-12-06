"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Trophy, Star, Shield, Target, Award, Flame, 
  TrendingUp, Users, Eye, Clock, Zap, Crown 
} from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { useLanguage } from "@/lib/i18n/language-context"

interface UserBadge {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  earned: boolean
  earnedDate?: string
  progress?: number
  requirement?: number
}

interface UserStats {
  points: number
  rank: string
  rankPosition: number
  totalContributions: number
  accuracy: number
  streak: number
  badges: UserBadge[]
}

export function GamificationProfile() {
  const { user } = useAuth()
  const { t } = useLanguage()

  // Mock user stats
  const stats: UserStats = {
    points: user?.points || 150,
    rank: user?.rank || "Rate Reporter",
    rankPosition: 127,
    totalContributions: 45,
    accuracy: 94.5,
    streak: 7,
    badges: [
      {
        id: 'reporter',
        name: t('badge.rateReporter'),
        description: 'Submit 10 verified rate reports',
        icon: <Target className="h-5 w-5 text-primary" />,
        earned: true,
        earnedDate: '2024-02-15',
        progress: 10,
        requirement: 10
      },
      {
        id: 'fraud-fighter',
        name: t('badge.fraudFighter'),
        description: 'Report 5 verified fraud cases',
        icon: <Shield className="h-5 w-5 text-destructive" />,
        earned: true,
        earnedDate: '2024-03-01',
        progress: 5,
        requirement: 5
      },
      {
        id: 'top-contributor',
        name: t('badge.topContributor'),
        description: 'Reach top 100 on leaderboard',
        icon: <Crown className="h-5 w-5 text-secondary" />,
        earned: false,
        progress: 127,
        requirement: 100
      },
      {
        id: 'early-adopter',
        name: t('badge.earlyAdopter'),
        description: 'Join TrueRate in the first 3 months',
        icon: <Star className="h-5 w-5 text-accent" />,
        earned: true,
        earnedDate: '2024-01-01'
      },
      {
        id: 'verified',
        name: t('badge.verified'),
        description: 'Verify your phone number',
        icon: <Award className="h-5 w-5 text-secondary" />,
        earned: true,
        earnedDate: '2024-01-15'
      },
      {
        id: 'streak-master',
        name: 'Streak Master',
        description: 'Maintain a 30-day activity streak',
        icon: <Flame className="h-5 w-5 text-orange-500" />,
        earned: false,
        progress: 7,
        requirement: 30
      }
    ]
  }

  const ranks = [
    { name: 'Newcomer', minPoints: 0, icon: <Users className="h-4 w-4" /> },
    { name: 'Rate Reporter', minPoints: 50, icon: <Eye className="h-4 w-4" /> },
    { name: 'Rate Guru', minPoints: 200, icon: <TrendingUp className="h-4 w-4" /> },
    { name: 'Market Expert', minPoints: 500, icon: <Zap className="h-4 w-4" /> },
    { name: 'TrueRate Champion', minPoints: 1000, icon: <Crown className="h-4 w-4" /> },
  ]

  const currentRankIndex = ranks.findIndex(r => r.name === stats.rank)
  const nextRank = ranks[currentRankIndex + 1]
  const currentRankMin = ranks[currentRankIndex]?.minPoints || 0
  const nextRankMin = nextRank?.minPoints || currentRankMin + 100
  const progressToNextRank = ((stats.points - currentRankMin) / (nextRankMin - currentRankMin)) * 100

  const earnedBadges = stats.badges.filter(b => b.earned)
  const inProgressBadges = stats.badges.filter(b => !b.earned)

  return (
    <div className="space-y-6">
      {/* Profile Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'G'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{user?.name || 'Guest'}</h2>
                <Badge variant="secondary" className="gap-1">
                  {ranks[currentRankIndex]?.icon}
                  {stats.rank}
                </Badge>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-2xl font-bold text-primary">{stats.points}</div>
                  <div className="text-xs text-muted-foreground">{t('points.title')}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">#{stats.rankPosition}</div>
                  <div className="text-xs text-muted-foreground">Rank</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">{stats.accuracy}%</div>
                  <div className="text-xs text-muted-foreground">Accuracy</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-500 flex items-center gap-1">
                    <Flame className="h-5 w-5" />
                    {stats.streak}
                  </div>
                  <div className="text-xs text-muted-foreground">Day Streak</div>
                </div>
              </div>

              {/* Progress to Next Rank */}
              {nextRank && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Progress to {nextRank.name}</span>
                    <span className="font-medium">{stats.points}/{nextRankMin} pts</span>
                  </div>
                  <Progress value={progressToNextRank} className="h-2" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Earned Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-secondary" />
            Earned Badges ({earnedBadges.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {earnedBadges.map(badge => (
              <div 
                key={badge.id}
                className="p-4 border rounded-lg bg-secondary/5 border-secondary/20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    {badge.icon}
                  </div>
                  <div>
                    <div className="font-semibold">{badge.name}</div>
                    <div className="text-xs text-muted-foreground">{badge.earnedDate}</div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{badge.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Badges in Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            In Progress
          </CardTitle>
          <CardDescription>Complete these challenges to earn more badges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inProgressBadges.map(badge => (
              <div 
                key={badge.id}
                className="p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center opacity-50">
                    {badge.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{badge.name}</div>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                  </div>
                  <Badge variant="outline">
                    {badge.progress}/{badge.requirement}
                  </Badge>
                </div>
                {badge.requirement && (
                  <Progress 
                    value={(badge.progress || 0) / badge.requirement * 100} 
                    className="h-2"
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Points Earning Guide */}
      <Card>
        <CardHeader>
          <CardTitle>How to Earn Points</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { action: 'Submit verified rate report', points: 10 },
              { action: 'Write changer review', points: 5 },
              { action: 'Report fraud (verified)', points: 20 },
              { action: 'Daily login streak', points: 2 },
              { action: 'Refer a friend', points: 50 },
              { action: 'Confirm another user\'s rate', points: 3 },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <span className="text-sm">{item.action}</span>
                <Badge variant="secondary">+{item.points} pts</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Compact version for sidebar/header
export function GamificationBadge() {
  const { user } = useAuth()
  
  return (
    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
      <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center">
        <Trophy className="h-4 w-4 text-secondary" />
      </div>
      <div>
        <div className="text-sm font-semibold">{user?.points || 0} pts</div>
        <div className="text-xs text-muted-foreground">{user?.rank || 'Newcomer'}</div>
      </div>
    </div>
  )
}


