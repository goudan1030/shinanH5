export interface UserProfile {
  id: number
  phone: string
  username: string | null
  avatar: string | null
  created_at: string
  updated_at: string
}

export interface UpdateProfileRequest {
  username?: string
  avatar?: string
} 