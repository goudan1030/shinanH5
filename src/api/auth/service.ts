import request from '../request'
import type { LoginRequest, LoginResponse, SetupUserRequest } from './types'
import type { ApiResponse } from '../types'

export const sendCode = (phone: string) => 
  request.post<ApiResponse<void>>('/auth/send-code', { phone })

export const loginWithPhone = (data: Pick<LoginRequest, 'phone' | 'code'>) =>
  request.post<ApiResponse<LoginResponse>>('/auth/login/phone', data)

export const loginWithPassword = (data: Pick<LoginRequest, 'phone' | 'password'>) =>
  request.post<ApiResponse<LoginResponse>>('/auth/login/password', data)

export const setupUser = (data: SetupUserRequest) =>
  request.post<ApiResponse<LoginResponse>>('/auth/setup', data)

export const getCurrentUser = () =>
  request.get<ApiResponse<LoginResponse>>('/auth/current-user')

export const updateUser = (username: string) =>
  request.put<ApiResponse<LoginResponse>>('/auth/user', { username })

export const checkLoginStatus = () =>
  request.get<ApiResponse<void>>('/auth/check-login') 