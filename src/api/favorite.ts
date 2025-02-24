import request from '@/utils/request'

export const favoriteApi = {
  // 添加收藏
  add(targetId: string, targetType: 'member' | 'post') {
    return request.post('/favorites', {
      target_id: targetId,
      target_type: targetType
    })
  },

  // 取消收藏
  remove(targetId: string, targetType: 'member' | 'post') {
    return request.delete(`/favorites/${targetType}/${targetId}`)
  },

  // 检查是否已收藏
  check(targetId: string, targetType: 'member' | 'post') {
    return request.get(`/favorites/check/${targetType}/${targetId}`)
  }
} 