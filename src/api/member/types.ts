export interface MemberProfile {
  id: number
  userId: number
  level: number
  points: number
  expireDate: string
  created_at: string
  updated_at: string
}

export interface MembershipPlan {
  id: number
  name: string
  price: number
  duration: number
  features: string[]
} 