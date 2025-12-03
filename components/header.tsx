"use client"

import { useEffect, useState } from "react"

export function Header() {
  const [currentTime, setCurrentTime] = useState<string>("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const time = now.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        fractionalSecondDigits: 3,
      })
      setCurrentTime(time)
    }
    updateTime()
    const interval = setInterval(updateTime, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="bg-primary text-primary-foreground border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-5xl sm:text-7xl font-black tracking-tighter mb-2">TRUERATE</h1>
            <p className="text-xl font-mono opacity-80">LIBERIA • MONROVIA • REAL RATES</p>
          </div>
          <div className="text-right font-mono text-sm opacity-70 mb-2">{currentTime && <div>{currentTime}</div>}</div>
        </div>
      </div>
    </header>
  )
}
