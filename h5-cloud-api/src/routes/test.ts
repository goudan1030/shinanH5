import { Router } from 'express'
import { testDbConnection } from '../controllers/test'
import { createAsyncHandler } from '../types/express'

const router = Router()

// 基础测试路由
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Test API is working',
    timestamp: new Date().toISOString()
  })
})

// 数据库连接测试路由
router.get('/db-connection', createAsyncHandler(testDbConnection))

export default router 