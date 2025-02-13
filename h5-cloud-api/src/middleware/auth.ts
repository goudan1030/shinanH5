import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'

// 扩展 Request 类型以包含用户信息
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number
        phone: string
        username?: string
      }
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: '未授权访问' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: '无效的 token' })
  }
} 