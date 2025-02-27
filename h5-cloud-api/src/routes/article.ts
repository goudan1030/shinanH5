import { Router } from 'express'
import { articleService } from '../services/articleService'
import { createAsyncHandler } from '../types/express'

const router = Router()

// 获取文章列表
router.get('/', createAsyncHandler(async (req, res) => {
  const { page = 1, pageSize = 10, isTop } = req.query
  const articles = await articleService.getArticles({
    page: Number(page),
    pageSize: Number(pageSize),
    isTop: isTop === 'true'
  })
  res.json({
    success: true,
    data: articles
  })
}))

// 获取文章详情
router.get('/:id', createAsyncHandler(async (req, res) => {
  const { id } = req.params
  const article = await articleService.getArticleById(Number(id))
  res.json({
    success: true,
    data: article
  })
}))

export default router 