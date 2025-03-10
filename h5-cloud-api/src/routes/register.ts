import { Router } from 'express'
import { authMiddleware } from '../middleware/auth'
import { registerService } from '../services/registerService'

const router = Router()

router.post('/info', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: '未登录'
      })
    }

    console.log('\n=== 保存注册信息 ===')
    console.log('用户ID:', userId)
    console.log('注册信息:', req.body)

    const result = await registerService.saveRegisterInfo(userId, req.body)
    
    console.log('保存结果:', result)
    res.json({
      success: true,
      message: '保存成功',
      data: result
    })
  } catch (error: any) {
    console.error('保存失败:', error)
    res.status(500).json({
      success: false,
      message: error.message || '保存失败'
    })
  }
})

export default router 