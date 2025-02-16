import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined in environment variables')
}

interface TokenPayload {
  id: number
  phone: string
}

export const generateToken = (payload: TokenPayload): string => {
  if (!payload.id || !payload.phone) {
    throw new Error('Invalid token payload')
  }

  const options: jwt.SignOptions = {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    algorithm: 'HS256'
  } as jwt.SignOptions

  return jwt.sign(payload, JWT_SECRET, options)
}

export const verifyToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload
    
    if (!decoded.id || !decoded.phone) {
      throw new Error('Invalid token structure')
    }
    
    return decoded
  } catch (error) {
    throw new Error('Invalid token')
  }
} 