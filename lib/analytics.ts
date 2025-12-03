export interface UserEvent {
  timestamp: string
  type: string
  device: string
  page: string
  suspicious?: boolean
  reason?: string
}

export interface FraudPattern {
  unusualAccessPattern: boolean
  multipleDevicesShortTime: boolean
  impossibleLocationTravel: boolean
  unknownGeolocation: boolean
  abnormalActivityTime: boolean
}

export function analyzeUserBehavior(events: UserEvent[]): FraudPattern {
  if (events.length < 2) {
    return {
      unusualAccessPattern: false,
      multipleDevicesShortTime: false,
      impossibleLocationTravel: false,
      unknownGeolocation: false,
      abnormalActivityTime: false,
    }
  }

  // Check for multiple devices in short time
  const last10Events = events.slice(-10)
  const uniqueDevices = new Set(last10Events.map((e) => e.device))
  const multipleDevices = uniqueDevices.size > 2

  // Check for unusual times (outside 6 AM - 10 PM)
  const now = new Date()
  const hour = now.getHours()
  const abnormalTime = hour < 6 || hour > 22

  // Check for rapid location changes
  const locations = last10Events
    .map((e) => e.page)
    .filter((page) => page !== last10Events[last10Events.length - 1]?.page)

  return {
    unusualAccessPattern: last10Events.length > 15,
    multipleDevicesShortTime: multipleDevices,
    impossibleLocationTravel: locations.length > 5,
    unknownGeolocation: false,
    abnormalActivityTime: abnormalTime,
  }
}

export function checkFraudRisk(patterns: FraudPattern): boolean {
  const riskFactors = Object.values(patterns).filter(Boolean).length
  return riskFactors >= 2
}
