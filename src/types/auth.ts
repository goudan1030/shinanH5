export interface UserInfo {
  id: number
  phone: string
  username?: string
  isNewUser: boolean
}

export interface LoginResponse {
  token: string
  user: UserInfo
}

export interface VerificationCodeRequest {
  phone: string
}

export interface LoginWithPhoneRequest {
  phone: string
  code: string
}

export interface SetupUserRequest {
  phone: string
  username: string
  password: string
}

export interface UserRegistrationStatus {
  registered: number // 1: 已登记, 0: 未登记
} 