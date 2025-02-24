import { Request, Response } from 'express'
import { memberService } from '../services/memberService'
import { MemberServiceError } from '../types/member'
import type { AsyncHandler } from '../types/express'
import { userService } from '../services/userService'

export const getMembers: AsyncHandler = async (req, res) => {
  const result = await memberService.getMembers(req.query)
  res.json(result)
}

export const createMember = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: '未登录'
      })
    }

    const result = await memberService.createMember(userId, req.body)
    res.json({
      success: true,
      data: result
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || '创建会员失败'
    })
  }
}

export const updateMember = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: '未登录'
      })
    }

    const result = await memberService.updateMember(userId, req.body)
    res.json({
      success: true,
      data: result
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || '更新会员失败'
    })
  }
}

export const updateMemberStatus: AsyncHandler = async (req, res) => {
  try {
    const { id } = req.params
    const { status, reason } = req.body
    const operatorId = req.user!.id
    
    // 将 id 转换为数字
    const memberId = parseInt(id, 10)
    if (isNaN(memberId)) {
      return res.status(400).json({
        success: false,
        message: '无效的会员ID'
      })
    }

    await memberService.updateMemberStatus(memberId, status, operatorId, reason)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : '更新状态失败'
    })
  }
}

export const saveMemberInfo: AsyncHandler = async (req, res) => {
  console.log('\n=== 💾 控制器 - 保存会员信息 ===')
  console.log('请求体:', req.body)

  try {
    const data = req.body

    // 数据验证
    if (!data.phone) {
      return res.status(400).json({
        success: false,
        message: '手机号不能为空',
        code: 'INVALID_PHONE'
      })
    }

    // 调用会员服务保存数据
    await memberService.saveMemberInfo(data)

    res.json({
      success: true,
      message: '保存成功',
      data: {
        phone: data.phone
      }
    })
  } catch (error: unknown) {
    console.error('控制器 - 保存会员信息失败:', error)
    
    if (error instanceof MemberServiceError) {
      res.status(500).json({
        success: false,
        message: error.message,
        code: 'SAVE_FAILED',
        details: error.details
      })
    } else {
      const err = error as Error
      res.status(500).json({
        success: false,
        message: err.message || '系统错误，请稍后重试',
        code: 'SYSTEM_ERROR'
      })
    }
  }
}

export const getMember = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: '未登录'
      })
    }

    const member = await memberService.getMember(userId)
    res.json({
      success: true,
      data: member
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || '获取会员信息失败'
    })
  }
} 