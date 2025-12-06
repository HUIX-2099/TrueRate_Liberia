"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Gift, Copy, Check, Users, MessageCircle, Send, Star, Zap } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { useLanguage } from "@/lib/i18n/language-context"

export function ReferralProgram() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [inviteSent, setInviteSent] = useState(false)

  // Generate referral code based on user
  const referralCode = user?.id 
    ? `TR-${user.name.substring(0, 2).toUpperCase()}${user.id.substring(0, 4).toUpperCase()}`
    : 'TR-GUEST'

  const referralLink = `https://truerate-liberia.com/join?ref=${referralCode}`

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  const shareViaWhatsApp = () => {
    const text = `🎁 Join TrueRate Liberia!\n\nGet accurate USD/LRD exchange rates, AI predictions, and more.\n\nUse my code: ${referralCode}\n\nJoin here: ${referralLink}\n\nWe both get 1 month of premium alerts FREE! 🎉`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const shareViaTelegram = () => {
    const text = `🎁 Join TrueRate Liberia! Use code ${referralCode} for 1 month free premium alerts!`
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`, '_blank')
  }

  const sendSMSInvite = () => {
    if (!phoneNumber) return
    
    const text = `Join TrueRate Liberia! Use code ${referralCode} for free premium alerts. ${referralLink}`
    window.open(`sms:${phoneNumber}?body=${encodeURIComponent(text)}`, '_blank')
    setInviteSent(true)
    setTimeout(() => setInviteSent(false), 3000)
  }

  // Mock referral stats
  const referralStats = {
    totalReferrals: user ? 5 : 0,
    pendingRewards: user ? 2 : 0,
    earnedMonths: user ? 3 : 0
  }

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-secondary/10 to-accent/10">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-secondary" />
              {t('referral.title')}
            </CardTitle>
            <CardDescription className="mt-1">
              {t('referral.subtitle')}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="gap-1">
            <Star className="h-3 w-3" />
            Earn Free Months
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-6">
        {/* How It Works */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <span className="text-lg font-bold text-primary">1</span>
            </div>
            <p className="text-xs text-muted-foreground">Share your code</p>
          </div>
          <div className="space-y-2">
            <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center mx-auto">
              <span className="text-lg font-bold text-secondary">2</span>
            </div>
            <p className="text-xs text-muted-foreground">Friend signs up</p>
          </div>
          <div className="space-y-2">
            <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
              <span className="text-lg font-bold text-accent">3</span>
            </div>
            <p className="text-xs text-muted-foreground">Both get 1 month free!</p>
          </div>
        </div>

        {/* Referral Code */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <label className="text-sm font-medium mb-2 block">{t('referral.yourCode')}</label>
          <div className="flex gap-2">
            <Input
              readOnly
              value={referralCode}
              className="font-mono text-lg font-bold text-center"
            />
            <Button variant="outline" size="icon" onClick={copyCode}>
              {copied ? (
                <Check className="h-4 w-4 text-secondary" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={shareViaWhatsApp}
            className="gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white"
          >
            <MessageCircle className="h-4 w-4" />
            {t('share.whatsapp')}
          </Button>
          <Button
            onClick={shareViaTelegram}
            className="gap-2 bg-[#0088cc] hover:bg-[#006699] text-white"
          >
            <Send className="h-4 w-4" />
            {t('share.telegram')}
          </Button>
        </div>

        {/* SMS Invite */}
        <div>
          <label className="text-sm font-medium mb-2 block">{t('referral.smsInvite')}</label>
          <div className="flex gap-2">
            <Input
              type="tel"
              placeholder="+231 ..."
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Button onClick={sendSMSInvite} disabled={!phoneNumber}>
              {inviteSent ? (
                <Check className="h-4 w-4" />
              ) : (
                'Send'
              )}
            </Button>
          </div>
        </div>

        {/* Stats */}
        {user && (
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                <Users className="h-5 w-5 text-primary" />
                {referralStats.totalReferrals}
              </div>
              <div className="text-xs text-muted-foreground">Total Referrals</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-secondary">
                <Zap className="h-5 w-5" />
                {referralStats.pendingRewards}
              </div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-accent">
                <Star className="h-5 w-5" />
                {referralStats.earnedMonths}
              </div>
              <div className="text-xs text-muted-foreground">Months Earned</div>
            </div>
          </div>
        )}

        {!user && (
          <div className="text-center py-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              Sign in to track your referrals and earn rewards
            </p>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}



