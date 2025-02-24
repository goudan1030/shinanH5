import { Router } from 'express'
import { sendCode, loginWithPhone, loginWithPassword, setupUser, getCurrentUser, updateUser, checkLoginStatus, checkUserStatus, getTempToken, checkUserRegistered, getRegistrationStatus } from '../controllers/auth'
import { authMiddleware } from '../middleware/auth'
import { createAsyncHandler } from '../types/express'
import { userService } from '../services/userService'

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

// 添加会员信息路由
router.post('/member-info', createAsyncHandler(async (req, res) => {
  console.log('收到保存会员信息请求:', req.body)
  
  try {
    await userService.saveMemberInfo(req.body)
    console.log('会员信息保存成功')
    
    res.json({
      success: true,
      message: '保存成功'
    })
  } catch (error) {
    console.error('保存会员信息失败:', error)
    res.status(500).json({
      success: false,
      message: '保存失败'
    })
  }
}))

// 添加获取注册状态路由
router.get('/registration-status', authMiddleware, getRegistrationStatus)

export default router 