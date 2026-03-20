"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Share2, Copy, Check, MessageCircle, Send } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

interface ShareData {
  type: 'rate' | 'warning' | 'prediction' | 'changer'
  title?: string
  rate?: number
  message?: string
  location?: string
}

interface SocialSharingProps {
  data: ShareData
  trigger?: React.ReactNode
}

export function SocialSharing({ data, trigger }: SocialSharingProps) {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)
  const [canNativeShare, setCanNativeShare] = useState(false)

  useEffect(() => {
    queueMicrotask(() =>
      setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function")
    )
  }, [])

  const generateShareText = () => {
    switch (data.type) {
      case 'rate':
        return `💵 TrueRate Liberia\n\nCurrent USD Rate: ${data.rate?.toFixed(2)} LRD\n\n${data.message || ''}\n\nCheck live rates: truerate-liberia.com`
      
      case 'warning':
        return `⚠️ TrueRate Alert!\n\n${data.title}\n${data.message}\n${data.location ? `📍 ${data.location}` : ''}\n\nStay safe: truerate-liberia.com`
      
      case 'prediction':
        return `📈 TrueRate Rate Outlook\n\n${data.message}\n\nSee outlook updates: truerate-liberia.com`
      
      case 'changer':
        return `✅ Verified Changer\n\n${data.title}\n${data.location}\nRate: ${data.rate?.toFixed(2)} LRD/USD\n\nFind changers: truerate-liberia.com`
      
      default:
        return `TrueRate Liberia — trusted rates, prices, and money tools for Liberia: truerate-liberia.com`
    }
  }

  const shareText = generateShareText()
  const encodedText = encodeURIComponent(shareText)

  const shareToWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodedText}`, '_blank')
    setOpen(false)
  }

  const shareToTelegram = () => {
    window.open(`https://t.me/share/url?url=https://truerate-liberia.com&text=${encodedText}`, '_blank')
    setOpen(false)
  }

  const shareViaSMS = () => {
    window.open(`sms:?body=${encodedText}`, '_blank')
    setOpen(false)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.title || 'TrueRate Liberia',
          text: shareText,
          url: 'https://truerate-liberia.com'
        })
        setOpen(false)
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Share failed:', error)
        }
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4 text-primary" />
            {t('share.rate')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share with someone</DialogTitle>
          <DialogDescription>
            Send this update to family, friends, or your community group.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Preview */}
          <div className="p-3 bg-muted rounded-lg text-sm whitespace-pre-wrap">
            {shareText}
          </div>

          {/* Share Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={shareToWhatsApp}
              className="gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white"
            >
              <MessageCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              WhatsApp
            </Button>
            
            <Button
              onClick={shareToTelegram}
              className="gap-2 bg-[#0088cc] hover:bg-[#006699] text-white"
            >
              <Send className="h-4 w-4 text-primary" />
              Telegram
            </Button>
            
            <Button
              onClick={shareViaSMS}
              variant="outline"
              className="gap-2"
            >
              <MessageCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              SMS
            </Button>
            
            {canNativeShare && (
              <Button
                onClick={nativeShare}
                variant="outline"
                className="gap-2"
              >
                <Share2 className="h-4 w-4 text-primary" />
                More options
              </Button>
            )}
          </div>

          {/* Copy Link */}
          <div className="flex items-center space-x-2">
            <Input
              readOnly
              value="truerate-liberia.com"
              className="flex-1"
            />
            <Button
              size="icon"
              variant="outline"
              onClick={copyToClipboard}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : (
                <Copy className="h-4 w-4 text-primary" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Quick share buttons component
export function QuickShareButtons({ rate, compact = false }: { rate: number, compact?: boolean }) {
  const shareText = `💵 USD Rate: ${rate.toFixed(2)} LRD - TrueRate Liberia`
  const encoded = encodeURIComponent(shareText)

  if (compact) {
    return (
      <div className="flex gap-1">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-primary"
          onClick={() => window.open(`https://wa.me/?text=${encoded}`, '_blank')}
        >
          <MessageCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-primary"
          onClick={() => window.open(`https://t.me/share/url?url=https://truerate-liberia.com&text=${encoded}`, '_blank')}
        >
          <Send className="h-4 w-4 text-primary" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        className="gap-2"
        onClick={() => window.open(`https://wa.me/?text=${encoded}`, '_blank')}
      >
        <MessageCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        WhatsApp
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="gap-2"
        onClick={() => window.open(`https://t.me/share/url?url=https://truerate-liberia.com&text=${encoded}`, '_blank')}
      >
        <Send className="h-4 w-4 text-primary" />
        Telegram
      </Button>
    </div>
  )
}








