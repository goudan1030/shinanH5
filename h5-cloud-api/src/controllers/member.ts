import { Request, Response } from 'express'
import { memberService, MemberServiceError } from '../services/memberService'
import type { AsyncHandler } from '../types/express'
import { userService } from '../services/userService'

export const getMembers: AsyncHandler = async (req, res) => {
  const result = await memberService.getMembers(req.query)
  res.json(result)
}

export const createMember: AsyncHandler = async (req, res) => {
  const result = await memberService.createMember(req.body)
  res.json(result)
}

export const updateMember: AsyncHandler = async (req, res) => {
  const { id } = req.params
  const result = await memberService.updateMember(id, req.body)
  res.json(result)
}

export const updateMemberStatus: AsyncHandler = async (req, res) => {
  const { id } = req.params
  const { status, reason } = req.body
  const operatorId = req.user!.id
  await memberService.updateMemberStatus(id, status, operatorId, reason)
  res.json({ success: true })
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
  } catch (error: any) {
    console.error('控制器 - 保存会员信息失败:', error)
    
    if (error instanceof MemberServiceError) {
      res.status(500).json({
        success: false,
        message: error.message,
        code: 'SAVE_FAILED',
        details: error.details
      })
    } else {
      res.status(500).json({
        success: false,
        message: '系统错误，请稍后重试',
        code: 'SYSTEM_ERROR'
      })
    }
  }
} 