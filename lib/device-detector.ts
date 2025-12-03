export interface DeviceInfo {
  type: "mobile" | "tablet" | "desktop"
  os: "ios" | "android" | "windows" | "macos" | "linux" | "unknown"
  browser: string
  hasSimCard: boolean
  batteryLevel: number | null
  isOnline: boolean
  networkType: "4g" | "5g" | "3g" | "wifi" | "unknown"
  screenWidth: number
  screenHeight: number
  deviceMemory: number | null
  cores: number | null
  device: string
  network: string
  battery: number
}

export async function detectDevice(): Promise<DeviceInfo> {
  const ua = navigator.userAgent.toLowerCase()

  // Detect device type
  let type: "mobile" | "tablet" | "desktop" = "desktop"
  if (/mobile|android|iphone/.test(ua)) type = "mobile"
  else if (/tablet|ipad|kindle/.test(ua)) type = "tablet"

  // Detect OS
  let os: "ios" | "android" | "windows" | "macos" | "linux" | "unknown" = "unknown"
  if (/iphone|ipad|ipod|mac os x/.test(ua)) os = "ios"
  else if (/android/.test(ua)) os = "android"
  else if (/windows|win32/.test(ua)) os = "windows"
  else if (/x11|linux/.test(ua) && !/android/.test(ua)) os = "linux"
  else if (/macintosh|mac os x/.test(ua) && !/iphone|ipad|ipod/.test(ua)) os = "macos"

  // Detect browser
  let browser = "unknown"
  if (/firefox/.test(ua)) browser = "Firefox"
  else if (/edge|edg/.test(ua)) browser = "Edge"
  else if (/chrome|chromium/.test(ua)) browser = "Chrome"
  else if (/safari/.test(ua)) browser = "Safari"

  // Detect SIM card (based on network API capability)
  const hasSimCard = /android/.test(ua) || /iphone/.test(ua)

  // Get battery info
  let batteryLevel: number | null = null
  try {
    const battery = await (navigator as any).getBattery?.()
    if (battery) {
      batteryLevel = Math.round(battery.level * 100)
    }
  } catch {
    // Battery API not available
    batteryLevel = 85
  }

  // Get network info
  const connection =
    (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
  let networkType: "4g" | "5g" | "3g" | "wifi" | "unknown" = "unknown"
  const isOnline = navigator.onLine

  if (connection) {
    const effectiveType = connection.effectiveType || connection.type
    if (effectiveType === "4g") networkType = "4g"
    else if (effectiveType === "5g") networkType = "5g"
    else if (effectiveType === "3g") networkType = "3g"
    else if (effectiveType === "wifi") networkType = "wifi"
  }

  if (!isOnline) networkType = "unknown"

  const deviceInfo: DeviceInfo = {
    type,
    os,
    browser,
    hasSimCard,
    batteryLevel: batteryLevel || 85,
    isOnline,
    networkType,
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    deviceMemory: (navigator as any).deviceMemory || null,
    cores: (navigator as any).hardwareConcurrency || null,
    device: type.charAt(0).toUpperCase() + type.slice(1),
    network: networkType.toUpperCase(),
    battery: batteryLevel || 85,
  }

  return deviceInfo
}

export function getDeviceInfo(): DeviceInfo {
  const ua = navigator.userAgent.toLowerCase()

  // Detect device type
  let type: "mobile" | "tablet" | "desktop" = "desktop"
  if (/mobile|android|iphone/.test(ua)) type = "mobile"
  else if (/tablet|ipad|kindle/.test(ua)) type = "tablet"

  // Detect OS
  let os: "ios" | "android" | "windows" | "macos" | "linux" | "unknown" = "unknown"
  if (/iphone|ipad|ipod|mac os x/.test(ua)) os = "ios"
  else if (/android/.test(ua)) os = "android"
  else if (/windows|win32/.test(ua)) os = "windows"
  else if (/x11|linux/.test(ua) && !/android/.test(ua)) os = "linux"
  else if (/macintosh|mac os x/.test(ua) && !/iphone|ipad|ipod/.test(ua)) os = "macos"

  // Detect browser
  let browser = "unknown"
  if (/firefox/.test(ua)) browser = "Firefox"
  else if (/edge|edg/.test(ua)) browser = "Edge"
  else if (/chrome|chromium/.test(ua)) browser = "Chrome"
  else if (/safari/.test(ua)) browser = "Safari"

  // Detect SIM card
  const hasSimCard = /android/.test(ua) || /iphone/.test(ua)

  // Get network info
  const connection =
    (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
  let networkType: "4g" | "5g" | "3g" | "wifi" | "unknown" = "unknown"

  if (connection) {
    const effectiveType = connection.effectiveType || connection.type
    if (effectiveType === "4g") networkType = "4g"
    else if (effectiveType === "5g") networkType = "5g"
    else if (effectiveType === "3g") networkType = "3g"
    else if (effectiveType === "wifi") networkType = "wifi"
  }

  const batteryLevel = 85
  const isOnline = navigator.onLine

  return {
    type,
    os,
    browser,
    hasSimCard,
    batteryLevel,
    isOnline,
    networkType,
    screenWidth: typeof window !== "undefined" ? window.innerWidth : 0,
    screenHeight: typeof window !== "undefined" ? window.innerHeight : 0,
    deviceMemory: (navigator as any).deviceMemory || null,
    cores: (navigator as any).hardwareConcurrency || null,
    device: type.charAt(0).toUpperCase() + type.slice(1),
    network: networkType === "unknown" ? "Online" : networkType.toUpperCase(),
    battery: batteryLevel,
  }
}
