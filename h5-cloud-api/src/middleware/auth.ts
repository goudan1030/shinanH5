import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config'

// 定义 token 的 payload 类型
interface JwtPayload {
  id: number
  phone: string
  username?: string
}

// 扩展 Request 类型以包含用户信息
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log('=== 认证中间件 ===')
  console.log('请求路径:', req.path)
  console.log('请求头:', {
    authorization: req.headers.authorization,
    'user-agent': req.headers['user-agent']
  })

  const token = req.headers.authorization?.split(' ')[1]
  
  if (!token) {
    console.log('❌ 未提供 token')
    return res.status(401).json({ 
      success: false,
      message: '未登录' 
    })
  }

  try {
    console.log('🔍 验证 token')
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    console.log('✅ token 验证成功:', decoded)
    req.user = decoded
    next()
  } catch (error) {
    console.error('❌ token 验证失败:', {
      error: error instanceof Error ? error.message : error,
      token
    })
    res.status(401).json({ 
      success: false,
      message: '登录已过期，请重新登录' 
    })
  }
} 