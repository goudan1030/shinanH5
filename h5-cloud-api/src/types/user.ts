import { RowDataPacket } from 'mysql2'

export interface User {
  id: number
  phone: string
  username?: string
  password?: string
  avatar?: string
  created_at: Date
  updated_at: Date
}

// 用户数据行接口
export interface UserRow extends RowDataPacket {
  id: number
  phone: string
  username?: string
  password?: string
  avatar?: string
  created_at: Date
  updated_at: Date
}

// 用户服务接口
export interface UserService {
  createUserSettings(userId: number): Promise<void>
  setupUser(phone: string, username: string, password: string): Promise<UserRow>
  updateAvatar(userId: number, avatarUrl: string): Promise<void>
  getUserById(userId: number): Promise<UserRow | null>
  getUserByPhone(phone: string): Promise<UserRow | null>
  verifyPassword(phone: string, password: string): Promise<UserRow | null>
  updateUserInfo(userId: number, username: string): Promise<UserRow>
  getUserByPhoneOrCreate(phone: string): Promise<UserRow>
  saveVerificationCode(phone: string, code: string): Promise<void>
  verifyCode(phone: string, code: string): Promise<boolean>
  findOrCreateUserByPhone(phone: string): Promise<UserRow>
}

export interface UserLoginResponse {
  token: string
  user: {
    id: number
    phone: string
    username?: string
    avatar?: string
    isNewUser: boolean
    needSetup: boolean
  }
}

export interface UserSettings {
  id: number
  user_id: number
  username?: string
  password?: string
  avatar?: string
  created_at: Date
  updated_at: Date
}

export interface UserWithSettings extends User {
  username?: string
  password?: string
  avatar?: string
} 