import request from '@/utils/request'
import type { ApiResponse } from '@/types'

export interface RegisterInfoData {
  gender?: string[]
  birthday?: string
  height?: string
  weight?: string
  orientation?: string[]
  occupation?: string
  education?: string
  maritalStatus?: string[]
  residence?: string[]
  hometown?: string[]
  assets?: string[]
  expectedLocation?: string
  childIntent?: string[]
  marriageRequirement?: string[]
  selfIntro?: string
  expectations?: string
  wechat?: string
  contactPhone?: string
}

export const registerApi = {
  saveRegisterInfo: (data: RegisterInfoData): Promise<ApiResponse> => {
    console.log('API层 - 发送注册信息:', data)
    return request.post('/register/info', data)
  }
} 