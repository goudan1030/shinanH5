export interface Article {
  id: number
  title: string
  cover_url: string
  content: string
  summary?: string
  views: number
  is_hidden: number
  is_top: number
  sort_order: number
  created_by?: string
  created_at: string
  updated_at: string
  link_url?: string
}

export interface ArticleListResponse {
  list: Article[]
  total: number
  page: number
  pageSize: number
} 