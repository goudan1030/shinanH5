import { Router } from 'express'
import { saveMemberInfo } from '../controllers/member'
import { authMiddleware } from '../middleware/auth'
import { createAsyncHandler } from '../types/express'

const router = Router()

router.post('/info', authMiddleware, createAsyncHandler(saveMemberInfo))

export default router
