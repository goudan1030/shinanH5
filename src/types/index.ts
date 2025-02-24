export * from './api'
export * from './auth'

export interface Member {
  member_no: string
  nickname?: string
  gender: 'male' | 'female'
  avatar?: string
  birth_year: number
  height?: number
  education?: string
  occupation?: string
  province?: string
  city?: string
  district?: string
  target_area?: string
  children_plan?: string
  marriage_cert?: string
  self_description?: string
  partner_requirement?: string
  hukou_province?: string
  hukou_city?: string
  created_at: string
  updated_at: string
}

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data: T
} 