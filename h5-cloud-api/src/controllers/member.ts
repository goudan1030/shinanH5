import { Request, Response } from 'express'
import { memberService } from '../services/memberService'
import type { AsyncHandler } from '../types/express'

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