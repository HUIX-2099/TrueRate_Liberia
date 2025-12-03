"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Smartphone, Wifi, Battery, Zap } from "lucide-react"
import { getDeviceInfo, type DeviceInfo } from "@/lib/device-detector"

export function HeroDeviceMonitor() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const info = getDeviceInfo()
    setDeviceInfo(info)
  }, [])

  if (!mounted || !deviceInfo) return null

  const getNetworkIcon = () => {
    if (deviceInfo.network === "5G") return "5G"
    if (deviceInfo.network === "4G") return "4G"
    if (deviceInfo.network === "WIFI") return "Wi-Fi"
    return "Online"
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative group w-full"
    >
      {/* Floating gradient backdrop */}
      <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-accent/10 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-60" />

      {/* Main card */}
      <div className="relative bg-gradient-to-br from-card via-card to-background border-2 border-accent/30 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {/* Device Type */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-accent/10 border border-accent/20 hover:border-accent/40 transition-all"
          >
            <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-accent mb-2" />
            <p className="text-xs font-mono text-foreground/60 dark:text-foreground/60">Device</p>
            <p className="text-xs sm:text-sm font-bold text-accent capitalize text-center">{deviceInfo.device}</p>
          </motion.div>

          {/* Network */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-accent/10 border border-accent/20 hover:border-accent/40 transition-all"
          >
            <Wifi className="w-5 h-5 sm:w-6 sm:h-6 text-accent mb-2" />
            <p className="text-xs font-mono text-foreground/60 dark:text-foreground/60">Network</p>
            <p className="text-xs sm:text-sm font-bold text-accent">{getNetworkIcon()}</p>
          </motion.div>

          {/* Battery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-accent/10 border border-accent/20 hover:border-accent/40 transition-all"
          >
            <Battery className="w-5 h-5 sm:w-6 sm:h-6 text-accent mb-2" />
            <p className="text-xs font-mono text-foreground/60 dark:text-foreground/60">Battery</p>
            <p className="text-xs sm:text-sm font-bold text-accent">{deviceInfo.battery}%</p>
          </motion.div>

          {/* OS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-accent/10 border border-accent/20 hover:border-accent/40 transition-all"
          >
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-accent mb-2" />
            <p className="text-xs font-mono text-foreground/60 dark:text-foreground/60">System</p>
            <p className="text-xs sm:text-sm font-bold text-accent capitalize text-center">{deviceInfo.os}</p>
          </motion.div>
        </div>

        {/* Live status indicator */}
        <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <p className="text-xs font-mono text-foreground/60 dark:text-foreground/60">Live Device Status</p>
        </div>
      </div>
    </motion.div>
  )
}
