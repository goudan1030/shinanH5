export interface User {
  id: number
  phone: string
  username?: string
  password?: string
  created_at: Date
  updated_at: Date
}

export interface UserLoginResponse {
  token: string
  user: {
    id: number
    phone: string
    username?: string
    isNewUser: boolean
  }
} 