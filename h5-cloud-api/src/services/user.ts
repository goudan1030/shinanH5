import { ResultSetHeader, RowDataPacket } from 'mysql2'
import Database from '../utils/db'
import bcrypt from 'bcryptjs'
import type { User, UserService } from '../types/user'

// 扩展 User 接口以满足 RowDataPacket 要求
interface UserRow extends RowDataPacket {
  id: number
  phone: string
  username?: string
  password?: string
  avatar?: string
  created_at: Date
  updated_at: Date
}

// 内部辅助函数，不导出
async function checkUserExists(phone: string): Promise<boolean> {
  const pool = await Database.getInstance()
  const [rows] = await pool.execute(
    'SELECT id FROM users WHERE phone = ?',
    [phone]
  )
  return Array.isArray(rows) && rows.length > 0
}

// 内部辅助函数，不导出
async function createUserWithPhone(phone: string): Promise<UserRow> {
  const pool = await Database.getInstance()
  const [result] = await pool.execute<ResultSetHeader>(
    'INSERT INTO users (phone, created_at) VALUES (?, NOW())',
    [phone]
  )
  
  const [user] = await pool.execute<UserRow[]>(
    'SELECT * FROM users WHERE id = ?',
    [result.insertId]
  )
  return user[0]
}

export const userService: UserService = {
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

  // 根据手机号获取用户
  async findUserByPhone(phone: string): Promise<UserRow | null> {
    const pool = await Database.getInstance()
    const [rows] = await pool.execute<UserRow[]>(
      `SELECT u.*, us.avatar 
       FROM users u 
       LEFT JOIN user_settings us ON u.id = us.user_id 
       WHERE u.phone = ?`,
      [phone]
    )
    return rows[0] || null
  },

  // 验证密码
  async verifyPassword(phone: string, password: string): Promise<UserRow | null> {
    const pool = await Database.getInstance()
    const [rows] = await pool.execute<UserRow[]>(
      `SELECT u.*, us.avatar 
       FROM users u 
       LEFT JOIN user_settings us ON u.id = us.user_id 
       WHERE u.phone = ?`,
      [phone]
    )

    if (!Array.isArray(rows) || rows.length === 0) {
      return null
    }

    const user = rows[0] as UserRow
    if (!user.password) {
      return null
    }

    const isValid = await bcrypt.compare(password, user.password)
    return isValid ? user : null
  },

  // 设置用户信息
  async setupUser(phone: string, username: string, password: string): Promise<UserRow> {
    const pool = await Database.getInstance()
    const hashedPassword = await bcrypt.hash(password, 10)
    await pool.execute(
      'UPDATE users SET username = ?, password = ?, updated_at = NOW() WHERE phone = ?',
      [username, hashedPassword, phone]
    )

    const [users] = await pool.execute<UserRow[]>(
      `SELECT u.*, us.avatar 
       FROM users u 
       LEFT JOIN user_settings us ON u.id = us.user_id 
       WHERE u.phone = ?`,
      [phone]
    )

    return users[0]
  },

  // 根据ID获取用户
  async getUserById(id: number): Promise<UserRow | null> {
    const pool = await Database.getInstance()
    const [rows] = await pool.execute<UserRow[]>(
      `SELECT u.*, us.avatar 
       FROM users u 
       LEFT JOIN user_settings us ON u.id = us.user_id 
       WHERE u.id = ?`,
      [id]
    )
    return rows[0] || null
  },

  // 更新最后登录时间
  async updateLastLoginTime(userId: number): Promise<void> {
    const pool = await Database.getInstance()
    await pool.execute(
      'UPDATE users SET last_login_at = NOW() WHERE id = ?',
      [userId]
    )
  },

  async getUserByPhoneOrCreate(phone: string): Promise<UserRow> {
    const pool = await Database.getInstance()
    
    try {
      const [rows] = await pool.execute<UserRow[]>(
        `SELECT u.*, us.avatar 
         FROM users u 
         LEFT JOIN user_settings us ON u.id = us.user_id 
         WHERE u.phone = ?`,
        [phone]
      )

      if (rows.length > 0) {
        return rows[0]
      }

      return await createUserWithPhone(phone)
    } catch (error) {
      console.error('Error in getUserByPhoneOrCreate:', error)
      throw error
    }
  },

  async updateUserInfo(userId: number, username: string): Promise<UserRow> {
    const pool = await Database.getInstance()
    
    await pool.execute(
      'UPDATE users SET username = ? WHERE id = ?',
      [username, userId]
    )

    const [users] = await pool.execute<UserRow[]>(
      `SELECT u.*, us.avatar 
       FROM users u 
       LEFT JOIN user_settings us ON u.id = us.user_id 
       WHERE u.id = ?`,
      [userId]
    )

    return users[0]
  },

  async updateAvatar(userId: number, avatarUrl: string): Promise<void> {
    const pool = await Database.getInstance()
    
    // 检查是否已有用户设置
    const [settings] = await pool.execute<RowDataPacket[]>(
      'SELECT id FROM user_settings WHERE user_id = ?',
      [userId]
    )

    if (settings.length > 0) {
      // 更新现有设置
      await pool.execute(
        'UPDATE user_settings SET avatar = ? WHERE user_id = ?',
        [avatarUrl, userId]
      )
    } else {
      // 创建新的用户设置
      await pool.execute(
        'INSERT INTO user_settings (user_id, avatar) VALUES (?, ?)',
        [userId, avatarUrl]
      )
    }
  }
}