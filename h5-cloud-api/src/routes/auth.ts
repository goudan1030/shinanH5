import { Router } from 'express'
import { sendCode, loginWithPhone, loginWithPassword, setupUser, getCurrentUser, updateUser, checkLoginStatus, checkUserStatus } from '../controllers/auth'
import { authMiddleware } from '../middleware/auth'
import { createAsyncHandler } from '../types/express'

const router = Router()

// 公开路由
router.post('/send-code', createAsyncHandler(sendCode))
router.post('/login/phone', createAsyncHandler(loginWithPhone))
router.post('/login/password', createAsyncHandler(loginWithPassword))

// 需要认证的路由
router.post('/setup', authMiddleware, createAsyncHandler(setupUser))
router.get('/current-user', authMiddleware, createAsyncHandler(getCurrentUser))

// 更新用户信息
router.put('/user', authMiddleware, updateUser)

// 新添加的路由
router.get('/check-login', createAsyncHandler(checkLoginStatus))
router.get('/check-status', authMiddleware, createAsyncHandler(checkUserStatus))

export default router 