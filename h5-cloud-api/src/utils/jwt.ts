import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined in environment variables')
}

export const generateToken = (payload: any): string => {
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: '7d',  // Token 有效期7天
    algorithm: 'HS256' // 使用 HMAC SHA256 算法
  })
}

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    throw new Error('Invalid token')
  }
} 