import { Router } from 'express'
import { saveMemberInfo } from '../controllers/member'
import { authMiddleware } from '../middleware/auth'
import { createAsyncHandler } from '../types/express'
import { memberService } from '../services/memberService'

const router = Router()

router.post('/info', authMiddleware, createAsyncHandler(saveMemberInfo))

// 获取公开会员列表（测试接口）
router.get('/public', createAsyncHandler(async (req, res) => {
  const {
    page = 1,
    pageSize = 20,
    gender,
    ageStart,
    ageEnd,
    heightStart,
    heightEnd,
    education,
    location
  } = req.query

  const result = await memberService.getPublicMembers({
    page: Number(page),
    pageSize: Number(pageSize),
    filters: {
      gender: gender as string,
      ageStart: ageStart ? Number(ageStart) : undefined,
      ageEnd: ageEnd ? Number(ageEnd) : undefined,
      heightStart: heightStart ? Number(heightStart) : undefined,
      heightEnd: heightEnd ? Number(heightEnd) : undefined,
      education: education as string,
      location: location as string
    }
  })

  res.json({
    success: true,
    data: result
  })
}))

// 添加获取会员详情接口
router.get('/:id', async (req, res) => {
  try {
    const memberId = req.params.id
    const member = await memberService.getMemberById(memberId)
    
    if (!member) {
      return res.status(404).json({
        success: false,
        message: '会员不存在'
      })
    }

    // 过滤敏感信息
    const publicMember = {
      ...member,
      phone: undefined,
      wechat: undefined,
      contact_phone: undefined,
      id_card: undefined,
      exact_location: undefined
    }

    res.json({
      success: true,
      data: publicMember
    })
  } catch (error) {
    console.error('获取会员详情失败:', error)
    res.status(500).json({
      success: false,
      message: '获取会员详情失败'
    })
  }
})

export default router
