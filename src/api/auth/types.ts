export interface LoginRequest {
  phone: string
  code?: string
  password?: string
}

export interface LoginResponse {
  token: string
  user: {
    id: number
    phone: string
    username: string | null
    avatar: string | null
    isNewUser: boolean
    needSetup: boolean
  }
}

export interface SetupUserRequest {
  phone: string
  username: string
  password: string
} 