import request from '@/utils/request'
import type { ApiResponse, LoginResponse, VerificationCodeRequest, LoginWithPhoneRequest, SetupUserRequest } from '@/types'

export const authApi = {
  // 发送验证码
  sendVerificationCode: (phone: string) => {
    console.log('API call: sendVerificationCode', { phone }) // 添加日志
    return request.post<ApiResponse<void>>('/auth/send-code', { phone } as VerificationCodeRequest)
  },

  // 验证码登录
  loginWithPhone: (phone: string, code: string) => 
    request.post<ApiResponse<LoginResponse>>('/auth/login/phone', { phone, code } as LoginWithPhoneRequest),

  // 设置用户信息
  setupUser: (phone: string, username: string, password: string) => 
    request.post<ApiResponse<LoginResponse>>('/auth/setup', { 
      phone, username, password 
    } as SetupUserRequest)
} 