import { Router } from 'express'
import { sendCode, loginWithPhone, loginWithPassword, setupUser } from '../controllers/auth'
import { authMiddleware } from '../middleware/auth'
import { createAsyncHandler } from '../types/express'

const router = Router()

// 公开路由
router.post('/send-code', createAsyncHandler(sendCode))
router.post('/login/phone', createAsyncHandler(loginWithPhone))
router.post('/login/password', createAsyncHandler(loginWithPassword))

// 需要认证的路由
router.post('/setup', authMiddleware, createAsyncHandler(setupUser))

export default router 