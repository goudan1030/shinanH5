import { Router } from 'express'
import { getHomeStats, getLatestMembers, getLatestMatches, getHomeData } from '../controllers/home'
import { createAsyncHandler } from '../types/express'

const router = Router()

// 获取首页所有数据
router.get('/', createAsyncHandler(getHomeData))

// 获取单独的数据
router.get('/stats', createAsyncHandler(getHomeStats))
router.get('/latest-members', createAsyncHandler(getLatestMembers))
router.get('/latest-matches', createAsyncHandler(getLatestMatches))

export default router 