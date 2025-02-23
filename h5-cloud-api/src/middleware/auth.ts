import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'
import { userService } from '../services/userService'

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

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  console.log('\n=== 认证中间件 ===')
  console.log('请求路径:', req.path)
  console.log('请求头:', {
    authorization: req.headers.authorization,
    'user-agent': req.headers['user-agent']
  })

  const authHeader = req.headers.authorization
  if (!authHeader) {
    console.log('❌ 未提供 token')
    return res.status(401).json({
      success: false,
      message: '未登录'
    })
  }

  try {
    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    
    // 如果是设置用户信息的请求，允许使用临时 token
    if (req.path === '/setup' && decoded.isTemp) {
      req.user = decoded
      return next()
    }

    // 其他请求需要完整的用户信息
    const user = await userService.getUserById(decoded.id)
    if (!user) {
      console.log('❌ 用户不存在')
      return res.status(401).json({
        success: false,
        message: '用户不存在'
      })
    }

    req.user = {
      id: user.id,
      phone: user.phone
    }

    next()
  } catch (error) {
    console.error('❌ Token 验证失败:', error)
    res.status(401).json({
      success: false,
      message: '未登录'
    })
  }
} 