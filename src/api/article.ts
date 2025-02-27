import request from '@/utils/request'
import type { ApiResponse, ArticleListResponse } from '@/types'

export const articleApi = {
  // 获取文章列表
  getArticles(params: {
    page: number
    pageSize: number
    isTop?: boolean
  }): Promise<ApiResponse<ArticleListResponse>> {
    return request.get('/articles', { params })
  },

  // 获取文章详情
  getArticleById(id: number): Promise<ApiResponse<Article>> {
    return request.get(`/articles/${id}`)
  }
} 