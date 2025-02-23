import { Router } from 'express'
import { sendCode, loginWithPhone, loginWithPassword, setupUser, getCurrentUser, updateUser, checkLoginStatus, checkUserStatus, getTempToken, checkUserRegistered } from '../controllers/auth'
import { authMiddleware } from '../middleware/auth'
import { createAsyncHandler } from '../types/express'

const router = Router()

// 公开路由
router.post('/send-code', createAsyncHandler(sendCode))
router.post('/login/phone', createAsyncHandler(loginWithPhone))
router.post('/login/password', createAsyncHandler(loginWithPassword))
router.post('/temp-token', createAsyncHandler(getTempToken))

// 需要认证的路由
router.post('/setup', createAsyncHandler(setupUser))
router.get('/current-user', authMiddleware, createAsyncHandler(getCurrentUser))

// 更新用户信息
router.put('/user', authMiddleware, updateUser)

// 新添加的路由
router.get('/check-login', createAsyncHandler(checkLoginStatus))
router.get('/check-status', authMiddleware, createAsyncHandler(checkUserStatus))
router.post('/check-registered', createAsyncHandler(checkUserRegistered))

export default router 