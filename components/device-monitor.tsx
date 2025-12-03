"use client"

import { useEffect, useState } from "react"
import { Battery, Wifi, Smartphone, Zap, Activity } from "lucide-react"
import { motion } from "framer-motion"
import { detectDevice, type DeviceInfo } from "@/lib/device-detector"

export function DeviceMonitor() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const initializeDeviceDetection = async () => {
      const info = await detectDevice()
      setDeviceInfo(info)

      if ((navigator as any).connection) {
        const connection = (navigator as any).connection
        connection.addEventListener("change", async () => {
          const updated = await detectDevice()
          setDeviceInfo(updated)
        })
      }

      window.addEventListener("online", async () => {
        const updated = await detectDevice()
        setDeviceInfo(updated)
      })

      window.addEventListener("offline", async () => {
        const updated = await detectDevice()
        setDeviceInfo(updated)
      })
    }

    initializeDeviceDetection()
  }, [])

  if (!mounted || !deviceInfo) return null

  const getNetworkColor = (type: string) => {
    switch (type) {
      case "5g":
        return "text-purple-600 dark:text-purple-400"
      case "4g":
        return "text-blue-600 dark:text-blue-400"
      case "3g":
        return "text-yellow-600 dark:text-yellow-400"
      case "wifi":
        return "text-green-600 dark:text-green-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  const getBatteryColor = (level: number | null) => {
    if (!level) return "text-gray-600 dark:text-gray-400"
    if (level > 50) return "text-green-600 dark:text-green-400"
    if (level > 20) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 bg-card dark:bg-card border border-foreground/10 dark:border-foreground/10 rounded-lg p-4 shadow-lg dark:shadow-2xl max-w-xs"
    >
      <div className="text-xs font-mono font-bold text-foreground/80 dark:text-foreground/80 uppercase tracking-widest mb-3 flex items-center gap-2">
        <Activity className="w-3 h-3" />
        Device Monitor
      </div>

      <div className="space-y-2 text-xs">
        {/* Device Type */}
        <div className="flex items-center justify-between">
          <span className="text-foreground/60 dark:text-foreground/60 flex items-center gap-2">
            <Smartphone className="w-3 h-3" />
            Device
          </span>
          <span className="font-mono font-bold text-foreground dark:text-foreground">
            {deviceInfo.type.toUpperCase()}
          </span>
        </div>

        {/* Network Type */}
        <div className="flex items-center justify-between">
          <span className="text-foreground/60 dark:text-foreground/60 flex items-center gap-2">
            <Wifi className="w-3 h-3" />
            Network
          </span>
          <span className={`font-mono font-bold ${getNetworkColor(deviceInfo.networkType)}`}>
            {deviceInfo.networkType.toUpperCase()}
          </span>
        </div>

        {/* Online Status */}
        <div className="flex items-center justify-between">
          <span className="text-foreground/60 dark:text-foreground/60 flex items-center gap-2">
            <Zap className="w-3 h-3" />
            Status
          </span>
          <span
            className={`font-mono font-bold ${deviceInfo.isOnline ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
          >
            {deviceInfo.isOnline ? "ONLINE" : "OFFLINE"}
          </span>
        </div>

        {/* Battery */}
        {deviceInfo.batteryLevel !== null && (
          <div className="flex items-center justify-between">
            <span className="text-foreground/60 dark:text-foreground/60 flex items-center gap-2">
              <Battery className="w-3 h-3" />
              Battery
            </span>
            <span className={`font-mono font-bold ${getBatteryColor(deviceInfo.batteryLevel)}`}>
              {deviceInfo.batteryLevel}%
            </span>
          </div>
        )}

        {/* Cores */}
        {deviceInfo.cores && (
          <div className="flex items-center justify-between">
            <span className="text-foreground/60 dark:text-foreground/60">Cores</span>
            <span className="font-mono font-bold text-foreground dark:text-foreground">{deviceInfo.cores}</span>
          </div>
        )}

        {/* OS */}
        <div className="flex items-center justify-between">
          <span className="text-foreground/60 dark:text-foreground/60">OS</span>
          <span className="font-mono font-bold text-foreground dark:text-foreground capitalize">{deviceInfo.os}</span>
        </div>
      </div>
    </motion.div>
  )
}
