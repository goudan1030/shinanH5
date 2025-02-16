import request from '@/utils/request'

export const userApi = {
  uploadAvatar: (formData: FormData, config = {}) =>
    request.post('/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      ...config
    }),
} 