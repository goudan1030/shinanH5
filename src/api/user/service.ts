import request from '../request'
import type { UserProfile, UpdateProfileRequest } from './types'

export const getProfile = () =>
  request.get<UserProfile>('/user/profile')

export const updateProfile = (data: UpdateProfileRequest) =>
  request.put<UserProfile>('/user/profile', data)

export const uploadAvatar = (formData: FormData) =>
  request.post<{ avatarUrl: string }>('/user/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }) 