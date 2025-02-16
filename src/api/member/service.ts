import request from '../request'
import type { MemberProfile, MembershipPlan } from './types'
import type { ApiResponse } from '../types'

export const getMemberProfile = () =>
  request.get<ApiResponse<MemberProfile>>('/member/profile')

export const getMembershipPlans = () =>
  request.get<ApiResponse<MembershipPlan[]>>('/member/plans')

export const purchaseMembership = (planId: number) =>
  request.post<ApiResponse<MemberProfile>>('/member/purchase', { planId }) 