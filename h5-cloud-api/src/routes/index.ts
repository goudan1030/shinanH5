import { Router } from 'express'
import homeRoutes from './home'
import memberRoutes from './member'
import authRouter from './auth'
import registerRouter from './register'
import bannerRouter from './banner'
import articleRouter from './article'

const router = Router()

// 首页路由不需要认证
router.use('/home', homeRoutes)

// 认证相关路由
router.use('/auth', authRouter)

// 需要认证的业务路由
router.use('/member', memberRoutes)  // 统一使用 member 路由

// 添加注册信息路由
router.use('/register', registerRouter)

router.use('/banners', bannerRouter)

router.use('/articles', articleRouter)

export default router 