import Database from '../utils/db'

export class ArticleService {
  // 获取文章列表
  async getArticles(params: {
    page: number
    pageSize: number
    isTop?: boolean
  }) {
    const { page, pageSize, isTop } = params
    const offset = (page - 1) * pageSize
    const pool = await Database.getInstance()

    // 构建查询条件
    const conditions = ['is_hidden = 0']
    if (isTop) {
      conditions.push('is_top = 1')
    }
    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

    // 获取总数
    const [countRows] = await pool.execute(
      `SELECT COUNT(*) as total FROM articles ${whereClause}`
    )
    const total = (countRows as any)[0].total

    // 获取列表
    const [rows] = await pool.execute(
      `SELECT * FROM articles 
      ${whereClause}
      ORDER BY is_top DESC, sort_order DESC, created_at DESC 
      LIMIT ? OFFSET ?`,
      [pageSize, offset]
    )

    return {
      list: rows,
      total,
      page,
      pageSize
    }
  }

  // 获取文章详情
  async getArticleById(id: number) {
    const pool = await Database.getInstance()
    const [rows] = await pool.execute(
      'SELECT * FROM articles WHERE id = ? AND is_hidden = 0',
      [id]
    )
    return (rows as any[])[0]
  }
}

export const articleService = new ArticleService() 