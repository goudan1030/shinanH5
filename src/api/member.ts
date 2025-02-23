import request from '@/utils/request'
import type { ApiResponse, MemberInfo } from '@/types'

export const memberApi = {
  // 保存会员信息
  saveMemberInfo: (data: MemberInfo): Promise<ApiResponse> => {
    console.log('API层 - 发送保存会员信息请求:', data)
    return request.post<ApiResponse>('/member/info', data)
  }
} 