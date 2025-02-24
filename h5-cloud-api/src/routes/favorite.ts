import { Router } from 'express'
import { authMiddleware } from '../middleware/auth'
import { favoriteService } from '../services/favoriteService'
import { createAsyncHandler } from '../types/express'

const router = Router()

// 添加收藏
router.post('/', authMiddleware, createAsyncHandler(async (req, res) => {
  const { target_id, target_type } = req.body
  const userId = req.user!.id
  
  await favoriteService.add(userId, target_id, target_type)
  res.json({ success: true })
}))

// 取消收藏
router.delete('/:type/:id', authMiddleware, createAsyncHandler(async (req, res) => {
  const { type, id } = req.params
  const userId = req.user!.id

  await favoriteService.remove(userId, id, type)
  res.json({ success: true })
}))

// 检查收藏状态
router.get('/check/:type/:id', authMiddleware, createAsyncHandler(async (req, res) => {
  const { type, id } = req.params
  const userId = req.user!.id

  const exists = await favoriteService.check(userId, id, type)
  res.json({ success: true, data: exists })
}))

export default router 