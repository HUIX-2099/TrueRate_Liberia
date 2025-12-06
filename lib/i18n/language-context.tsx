"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type Language, getTranslation } from "./translations"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isMarketWomanMode: boolean
  setMarketWomanMode: (enabled: boolean) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [isMarketWomanMode, setMarketWomanModeState] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('truerate-language') as Language
        const storedMode = localStorage.getItem('truerate-market-woman-mode')
        if (stored) setLanguageState(stored)
        if (storedMode === 'true') setMarketWomanModeState(true)
      } catch (e) {
        // Ignore localStorage errors
      }
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('truerate-language', lang)
    }
  }

  const setMarketWomanMode = (enabled: boolean) => {
    setMarketWomanModeState(enabled)
    if (typeof window !== 'undefined') {
      localStorage.setItem('truerate-market-woman-mode', String(enabled))
    }
    if (enabled && language === 'en') {
      setLanguage('lr-en')
    }
  }

  const t = (key: string) => getTranslation(language, key)

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        setLanguage, 
        t, 
        isMarketWomanMode, 
        setMarketWomanMode 
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
