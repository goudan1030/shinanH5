import { Router } from 'express'
import homeRoutes from './home'
import memberRoutes from './member'
import settlementRoutes from './settlement'
import configRoutes from './config'

const router = Router()

// 首页路由不需要认证
router.use('/home', homeRoutes)

// 其他路由需要认证
router.use('/members', memberRoutes)
router.use('/settlements', settlementRoutes)
router.use('/config', configRoutes)

export default router 