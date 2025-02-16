export interface SystemConfig {
  siteName: string
  siteDescription: string
  logo: string
  contactEmail: string
  contactPhone: string
  icp: string
}

export interface AppConfig {
  version: string
  forceUpdate: boolean
  minVersion: string
  downloadUrl: string
  features: {
    enableMember: boolean
    enableChat: boolean
    enableShare: boolean
  }
} 