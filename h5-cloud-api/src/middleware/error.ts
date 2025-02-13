import { Request, Response, NextFunction, ErrorRequestHandler } from 'express'

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error details:', {
    name: err.name,
    message: err.message,
    code: (err as any).code,
    stack: err.stack
  })

  // 阿里云短信服务错误
  if ((err as any).code === 'InvalidAccessKeyId') {
    return res.status(500).json({ message: '短信服务配置错误' })
  }

  if ((err as any).code === 'isv.MOBILE_NUMBER_ILLEGAL') {
    return res.status(400).json({ message: '手机号格式错误' })
  }

  if ((err as any).code === 'isv.BUSINESS_LIMIT_CONTROL') {
    return res.status(429).json({ message: '发送太频繁，请稍后再试' })
  }

  // 其他错误
  return res.status(500).json({ 
    message: process.env.NODE_ENV === 'development' 
      ? err.message 
      : '服务器错误，请稍后重试'
  })
} 