import pool from '@/utils/db'
import { RowDataPacket } from 'mysql2'

interface User extends RowDataPacket {
  id: number
  phone: string
  username: string | null
  password: string | null
  created_at: Date
  updated_at: Date
}

export const userService = {
  // 添加连接重试机制
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    maxRetries = 3,
    delay = 1000
  ): Promise<T> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation()
      } catch (error: any) {
        if (i === maxRetries - 1) throw error
        if (error.code === 'ETIMEDOUT' || error.code === 'ECONNRESET') {
          await new Promise(resolve => setTimeout(resolve, delay))
          continue
        }
        throw error
      }
    }
    throw new Error('Unexpected error in retry loop')
  },

  // 使用重试机制包装数据库操作
  async checkUserExists(phone: string): Promise<boolean> {
    return this.executeWithRetry(async () => {
      const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT id FROM users WHERE phone = ?',
        [phone]
      )
      return rows.length > 0
    })
  },

  // 创建新用户（仅手机号）
  async createUserWithPhone(phone: string): Promise<number> {
    const [result] = await pool.execute(
      'INSERT INTO users (phone, created_at, updated_at) VALUES (?, NOW(), NOW())',
      [phone]
    )
    return (result as any).insertId
  },

  // 设置用户信息
  async setupUser(phone: string, username: string, password: string): Promise<void> {
    // 在实际应用中，需要对密码进行加密处理
    await pool.execute(
      'UPDATE users SET username = ?, password = ?, updated_at = NOW() WHERE phone = ?',
      [username, password, phone]
    )
  },

  // 验证用户密码
  async verifyPassword(phone: string, password: string): Promise<User | null> {
    const [rows] = await pool.execute<User[]>(
      'SELECT * FROM users WHERE phone = ? AND password = ?',
      [phone, password] // 实际应用中需要对密码进行加密比对
    )
    return rows[0] || null
  },

  // 获取用户信息
  async getUserByPhone(phone: string): Promise<User | null> {
    const [rows] = await pool.execute<User[]>(
      'SELECT * FROM users WHERE phone = ?',
      [phone]
    )
    return rows[0] || null
  }
} 