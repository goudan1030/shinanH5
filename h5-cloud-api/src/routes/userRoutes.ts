import { Router } from 'express'
import { uploadAvatar, upload } from '../controllers/userController'
import { authMiddleware } from '../middleware/auth'

const router = Router()

router.post('/avatar', authMiddleware, upload.single('avatar'), uploadAvatar)

export default router 