import Database from '../utils/db'
import bcrypt from 'bcryptjs'
import type { User } from '../types/user'

export const userService = {
  // 保存验证码
  async saveVerificationCode(phone: string, code: string): Promise<void> {
    const pool = await Database.getInstance()
    const [existingCode] = await pool.execute(
      'SELECT id FROM verification_codes WHERE phone = ? AND used = 0',
      [phone]
    )

    if (Array.isArray(existingCode) && existingCode.length > 0) {
      await pool.execute(
        'UPDATE verification_codes SET code = ?, expired_at = DATE_ADD(NOW(), INTERVAL 5 MINUTE) WHERE phone = ? AND used = 0',
        [code, phone]
      )
    } else {
      await pool.execute(
        'INSERT INTO verification_codes (phone, code, type, expired_at) VALUES (?, ?, 1, DATE_ADD(NOW(), INTERVAL 5 MINUTE))',
        [phone, code]
      )
    }
  },

  // 验证验证码
  async verifyCode(phone: string, code: string): Promise<boolean> {
    const pool = await Database.getInstance()
    const [rows] = await pool.execute(
      'SELECT id FROM verification_codes WHERE phone = ? AND code = ? AND used = 0 AND expired_at > NOW()',
      [phone, code]
    )

    if (Array.isArray(rows) && rows.length > 0) {
      // 标记验证码已使用
      await pool.execute(
        'UPDATE verification_codes SET used = 1 WHERE phone = ? AND code = ?',
        [phone, code]
      )
      return true
    }

    return false
  },

  // 检查用户是否存在
  async checkUserExists(phone: string): Promise<boolean> {
    const pool = await Database.getInstance()
    const [rows] = await pool.execute(
      'SELECT id FROM users WHERE phone = ?',
      [phone]
    )
    return Array.isArray(rows) && rows.length > 0
  },

  // 创建新用户
  async createUserWithPhone(phone: string): Promise<void> {
    const pool = await Database.getInstance()
    await pool.execute(
      'INSERT INTO users (phone, created_at) VALUES (?, NOW())',
      [phone]
    )
  },

  // 根据手机号获取用户
  async getUserByPhone(phone: string): Promise<User> {
    const pool = await Database.getInstance()
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE phone = ?',
      [phone]
    )

    if (!Array.isArray(rows) || rows.length === 0) {
      throw new Error('User not found')
    }

    return rows[0] as User
  },

  // 验证密码
  async verifyPassword(phone: string, password: string): Promise<User | null> {
    const pool = await Database.getInstance()
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE phone = ?',
      [phone]
    )

    if (!Array.isArray(rows) || rows.length === 0) {
      return null
    }

    const user = rows[0] as User
    if (!user.password) {
      return null
    }

    const isValid = await bcrypt.compare(password, user.password)
    return isValid ? user : null
  },

  // 设置用户信息
  async setupUser(phone: string, username: string, password: string): Promise<void> {
    const pool = await Database.getInstance()
    const hashedPassword = await bcrypt.hash(password, 10)
    await pool.execute(
      'UPDATE users SET username = ?, password = ?, updated_at = NOW() WHERE phone = ?',
      [username, hashedPassword, phone]
    )
  }
} 