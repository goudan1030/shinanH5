import request from '@/utils/request'
import type { ApiResponse, LoginResponse } from '@/types'

interface SetupUserResponse {
  success: boolean
  message: string
  data: {
    token: string
    user: {
      id: number
      phone: string
      username: string
      isNewUser: boolean
    }
  }
}

interface UpdateUserResponse {
  success: boolean
  message: string
  data: {
    user: {
      id: number
      phone: string
      username: string
    }
  }
}

export const authApi = {
  // 发送验证码
  sendCode: (phone: string) =>
    request.post('/auth/send-code', { phone }),  // 不需要加 /api 前缀

  // 验证码登录 - 移除重复的 /api 前缀
  loginWithPhone: (data: { phone: string; code: string }) =>
    request.post<ApiResponse<LoginResponse>>('/auth/login/phone', data),

  // 设置用户信息
  setupUser: (data: { phone: string; username: string; password: string }) =>
    request.post<ApiResponse<SetupUserResponse>>('/auth/setup', {
      phone: data.phone,
      username: data.username,
      password: data.password
    }),

  // 获取当前用户信息
  getCurrentUser: () => 
    request.get<ApiResponse<LoginResponse>>('/auth/current-user'),

  // 更新用户信息
  updateUser: (username: string) => 
    request.put<ApiResponse<UpdateUserResponse>>('/auth/user', { 
      username 
    }),

  // 密码登录
  loginWithPassword: (phone: string, password: string) => 
    request.post<ApiResponse<LoginResponse>>('/auth/login/password', { 
      phone, 
      password 
    })
} 