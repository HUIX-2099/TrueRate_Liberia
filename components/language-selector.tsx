"use client"

import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import { languages } from "@/lib/i18n"

export function LanguageSelector({ onLanguageChange }: { onLanguageChange?: (lang: string) => void }) {
  const [language, setLanguage] = useState("en")
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("userLanguage") || "en"
    setLanguage(saved)
    // Dispatch custom event so other components can listen
    window.dispatchEvent(new CustomEvent("languageChange", { detail: { language: saved } }))
  }, [])

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang)
    localStorage.setItem("userLanguage", lang)
    setOpen(false)
    // Dispatch custom event that propagates to ALL components
    window.dispatchEvent(new CustomEvent("languageChange", { detail: { language: lang } }))
    if (typeof window !== "undefined") {
      // Force re-render of all listening components
      window.dispatchEvent(new Event("languageChanged"))
    }
    onLanguageChange?.(lang)
  }

  if (!mounted) return null

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 border border-black/20 hover:border-black transition text-xs font-mono"
      >
        {language.toUpperCase()}
        <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-40 bg-white border-2 border-black z-50 shadow-lg">
          {Object.entries(languages).map(([code, name]) => (
            <button
              key={code}
              onClick={() => handleLanguageChange(code)}
              className={`w-full text-left px-4 py-2 text-xs font-mono hover:bg-black/10 transition ${
                language === code ? "bg-black text-white" : ""
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
