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

// Default context value for when provider is not available
const defaultContextValue: LanguageContextType = {
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => getTranslation('en', key),
  isMarketWomanMode: false,
  setMarketWomanMode: () => {},
}

const LanguageContext = createContext<LanguageContextType>(defaultContextValue)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en'
    try {
      return (localStorage.getItem('truerate-language') as Language) || 'en'
    } catch { return 'en' }
  })
  const [isMarketWomanMode, setMarketWomanModeState] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      return localStorage.getItem('truerate-market-woman-mode') === 'true'
    } catch { return false }
  })

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('truerate-language', lang)
      } catch (e) {
        // Ignore localStorage errors
      }
    }
  }

  const setMarketWomanMode = (enabled: boolean) => {
    setMarketWomanModeState(enabled)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('truerate-market-woman-mode', String(enabled))
      } catch (e) {
        // Ignore localStorage errors
      }
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
  return useContext(LanguageContext)
}
