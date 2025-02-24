import request from '@/utils/request'
import type { ApiResponse, LoginResponse, MemberInfo, UserRegistrationStatus } from '@/types'
import type { AxiosResponse } from 'axios'

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

export interface UserInfo {
  id: number
  phone: string
  avatar?: string
  nickname?: string
  isNewUser?: boolean
}

export interface UpdateUserInfoParams {
  avatar?: string
  nickname?: string
}

export const authApi = {
  // 发送验证码
  sendCode: (phone: string) =>
    request.post('/auth/send-code', { phone }),  // 不需要加 /api 前缀

  // 验证码登录 - 移除重复的 /api 前缀
  loginWithPhone: (data: { phone: string; code: string }) =>
    request.post<ApiResponse<LoginResponse>>('/auth/login/phone', data),

  // 设置用户信息
  async setupUser(params: { 
    phone: string
    username: string
    password: string 
  }, token?: string): Promise<ApiResponse<void>> {
    return request.post('/auth/setup', params, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    })
  },

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
    }),

  // 添加获取临时 token 的方法
  async getTempToken(phone: string): Promise<ApiResponse<void>> {
    return request.post('/auth/temp-token', { phone })
  },

  // 检查用户是否已登记
  checkUserRegistered: (phone: string) => 
    request.post('/auth/check-registered', { phone }),

  // 保存会员信息
  saveMemberInfo: (data: any): Promise<ApiResponse<void>> => {
    console.log('API层 - 发送保存会员信息请求:', data)
    return request.post('/auth/member-info', data)
  },

  // 修改方法名以匹配使用处
  updateProfile: (data: UpdateUserInfoParams): Promise<AxiosResponse> => {
    return request({
      url: '/api/user/profile',
      method: 'put',
      data
    })
  },

  // 获取用户注册状态
  async getRegistrationStatus(): Promise<ApiResponse<UserRegistrationStatus>> {
    return request.get('/auth/registration-status')
  }
}

export default authApi 