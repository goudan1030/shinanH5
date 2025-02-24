import request from '@/utils/request'
import type { ApiResponse, MemberInfo } from '@/types'

interface PublicMemberQuery {
  page: number
  pageSize: number
  filters: {
    gender?: string
    ageStart?: number
    ageEnd?: number
    heightStart?: number
    heightEnd?: number
    education?: string
    location?: string
  }
}

export const memberApi = {
  // 保存会员信息
  saveMemberInfo: (data: MemberInfo): Promise<ApiResponse> => {
    console.log('API层 - 发送保存会员信息请求:', data)
    return request.post<ApiResponse>('/member/info', data)
  },

  // 获取公开会员列表
  getPublicMembers: (params: PublicMemberQuery): Promise<ApiResponse> => {
    return request.get('/member/public', { params })
  },

  // 获取会员详情
  getMemberDetail: (memberId: string): Promise<ApiResponse<Member>> => {
    return request.get(`/member/${memberId}`)
  }
} 