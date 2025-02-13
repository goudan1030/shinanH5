import { Request, Response } from 'express'
import { homeService } from '../services/homeService'
import type { AsyncHandler } from '../types/express'

export const getHomeStats: AsyncHandler = async (req, res) => {
  const stats = await homeService.getHomeStats()
  res.json(stats)
}

export const getLatestMembers: AsyncHandler = async (req, res) => {
  const limit = Number(req.query.limit) || 5
  const members = await homeService.getLatestMembers(limit)
  res.json(members)
}

export const getLatestMatches: AsyncHandler = async (req, res) => {
  const limit = Number(req.query.limit) || 5
  const matches = await homeService.getLatestMatches(limit)
  res.json(matches)
}

export const getHomeData: AsyncHandler = async (req, res) => {
  // 获取所有首页数据
  const [stats, latestMembers, latestMatches] = await Promise.all([
    homeService.getHomeStats(),
    homeService.getLatestMembers(5),
    homeService.getLatestMatches(5)
  ])

  res.json({
    stats,
    latestMembers,
    latestMatches
  })
} 