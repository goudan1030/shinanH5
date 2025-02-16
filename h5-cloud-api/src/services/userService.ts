import { ResultSetHeader, RowDataPacket } from 'mysql2'
import Database from '../utils/db'
import type { UserSettings } from '../types/user'
import bcryptjs from 'bcryptjs'
import type { UserRow } from '../types/user'

// 导出 userService 对象，实现从 types/user.ts 导入的 UserService 接口
export const userService = {
  async createUserSettings(userId: number): Promise<void> {
    const db = await Database.getInstance()
    
    await db.execute(
      'INSERT INTO user_settings (user_id) VALUES (?)',
      [userId]
    )
  },
  
  async setupUser(phone: string, username: string, password: string): Promise<UserRow> {
    console.log('\n=== 👤 设置用户信息 ===')
    console.log('手机号:', phone)
    console.log('用户名:', username)

    const pool = await Database.getInstance()
    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      // 查找临时用户
      const [users] = await connection.execute<UserRow[]>(
        'SELECT * FROM users WHERE phone = ? AND status = "temporary"',
        [phone]
      )

      if (!users[0]) {
        console.log('❌ 未找到临时用户')
        throw new Error('用户不存在或已完成设置')
      }

      const userId = users[0].id
      const hashedPassword = await bcryptjs.hash(password, 10)

      // 检查是否已存在用户设置
      const [existingSettings] = await connection.execute<RowDataPacket[]>(
        'SELECT id FROM user_settings WHERE user_id = ?',
        [userId]
      )

      if (existingSettings.length > 0) {
        // 更新现有设置
        console.log('📝 更新用户设置')
        await connection.execute(
          `UPDATE user_settings 
           SET username = ?, password = ?
           WHERE user_id = ?`,
          [username, hashedPassword, userId]
        )
      } else {
        // 创建新设置
        console.log('📝 创建用户设置')
        await connection.execute(
          `INSERT INTO user_settings (user_id, username, password) 
           VALUES (?, ?, ?)`,
          [userId, username, hashedPassword]
        )
      }

      // 激活用户
      console.log('✨ 激活用户')
      await connection.execute(
        'UPDATE users SET status = "active" WHERE id = ?',
        [userId]
      )

      // 获取完整的用户信息
      const [updatedUsers] = await connection.execute<UserRow[]>(
        `SELECT u.*, us.username, us.avatar
         FROM users u
         LEFT JOIN user_settings us ON u.id = us.user_id
         WHERE u.id = ?`,
        [userId]
      )

      await connection.commit()

      console.log('✅ 用户设置完成:', {
        id: updatedUsers[0].id,
        phone: updatedUsers[0].phone,
        username: updatedUsers[0].username,
        status: updatedUsers[0].status
      })

      return updatedUsers[0]
    } catch (error) {
      console.error('❌ 设置用户信息失败:', error)
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  },
  
  async updateAvatar(userId: number, avatarUrl: string): Promise<void> {
    const pool = await Database.getInstance()
    
    try {
      console.log('开始更新头像:', {
        userId,
        avatarUrl
      })

      // 检查是否已有用户设置
      const [settings] = await pool.execute<RowDataPacket[]>(
        'SELECT id FROM user_settings WHERE user_id = ?',
        [userId]
      )

      console.log('查询用户设置结果:', settings)

      if (settings.length > 0) {
        // 更新现有设置
        console.log('更新现有设置')
        await pool.execute(
          'UPDATE user_settings SET avatar = ? WHERE user_id = ?',
          [avatarUrl, userId]
        )
      } else {
        // 创建新的用户设置
        console.log('创建新的用户设置')
        await pool.execute(
          'INSERT INTO user_settings (user_id, avatar) VALUES (?, ?)',
          [userId, avatarUrl]
        )
      }

      console.log('头像更新完成')
    } catch (error) {
      console.error('头像更新失败:', error)
      throw error
    }
  },
  
  async getUserById(userId: number): Promise<UserRow | null> {
    console.log('\n=== 🔍 获取用户信息 ===')
    console.log('查询用户 ID:', userId)

    const pool = await Database.getInstance()
    try {
      const [users] = await pool.execute<UserRow[]>(
        `SELECT u.*, us.username, us.avatar
         FROM users u
         LEFT JOIN user_settings us ON u.id = us.user_id
         WHERE u.id = ?`,
        [userId]
      )

      if (users.length === 0) {
        console.log('❌ 未找到用户')
        return null
      }

      console.log('✅ 找到用户:', {
        id: users[0].id,
        phone: users[0].phone,
        username: users[0].username || '未设置',
        hasAvatar: !!users[0].avatar
      })

      return users[0]
    } catch (error) {
      console.error('❌ 查询用户失败:', error)
      throw error
    }
  },
  
  async getUserByPhone(phone: string): Promise<UserRow | null> {
    const db = await Database.getInstance()
    
    const [users] = await db.execute<UserRow[]>(
      'SELECT * FROM users WHERE phone = ?',
      [phone]
    )
    
    return users[0] || null
  },
  
  async verifyPassword(phone: string, password: string): Promise<UserRow | null> {
    const pool = await Database.getInstance()
    
    const [users] = await pool.execute<UserRow[]>(
      `SELECT u.id, u.phone, us.username, us.password, us.avatar
       FROM users u
       LEFT JOIN user_settings us ON u.id = us.user_id
       WHERE u.phone = ?`,
      [phone]
    )

    if (!users[0] || !users[0].password) {
      return null
    }

    const isValid = await bcryptjs.compare(password, users[0].password)
    return isValid ? users[0] : null
  },
  
  async updateUserInfo(userId: number, username: string): Promise<UserRow> {
    const pool = await Database.getInstance()
    
    try {
      const connection = await pool.getConnection()
      await connection.beginTransaction()

      try {
        // 检查用户是否存在
        console.log('Checking user existence...')
        const [users] = await connection.execute<UserRow[]>(
          'SELECT id FROM users WHERE id = ?',
          [userId]
        )
        console.log('User check result:', users)

        if (!users[0]) {
          throw new Error('用户不存在')
        }

        // 检查用户设置是否存在
        console.log('Checking user settings...')
        const [settings] = await connection.execute(
          'SELECT * FROM user_settings WHERE user_id = ?',
          [userId]
        )
        console.log('Current user settings:', settings)

        if (!settings[0]) {
          // 如果不存在，先创建
          await connection.execute(
            'INSERT INTO user_settings (user_id) VALUES (?)',
            [userId]
          )
        }

        console.log('Updating user settings...', { userId, username })

        // 更新用户设置
        await connection.execute(
          'UPDATE user_settings SET username = ? WHERE user_id = ?',
          [username, userId]
        )

        console.log('Getting updated user info...')

        // 获取更新后的用户信息
        const [updatedUsers] = await connection.execute<UserRow[]>(
          `SELECT u.id, u.phone, us.username, us.avatar
           FROM users u
           LEFT JOIN user_settings us ON u.id = us.user_id
           WHERE u.id = ?`,
          [userId]
        )

        await connection.commit()
        connection.release()

        if (!updatedUsers[0]) {
          throw new Error('获取更新后的用户信息失败')
        }

        console.log('Update successful:', updatedUsers[0])
        return updatedUsers[0]
      } catch (error) {
        await connection.rollback()
        connection.release()
        console.error('Transaction failed:', error)
        throw error
      }
    } catch (error) {
      console.error('Update user info error:', error)
      throw error
    }
  },
  
  async getUserByPhoneOrCreate(phone: string): Promise<UserRow> {
    console.log('\n=== 👤 获取或创建临时用户 ===')
    console.log('手机号:', phone)

    const pool = await Database.getInstance()
    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      // 查找用户
      const [users] = await connection.execute<UserRow[]>(
        'SELECT * FROM users WHERE phone = ?',
        [phone]
      )

      let user: UserRow

      if (users.length === 0) {
        console.log('🆕 创建临时用户')
        const [result] = await connection.execute<ResultSetHeader>(
          'INSERT INTO users (phone, status) VALUES (?, "temporary")',
          [phone]
        )

        const [newUsers] = await connection.execute<UserRow[]>(
          'SELECT * FROM users WHERE id = ?',
          [result.insertId]
        )
        user = newUsers[0]
        console.log('✅ 临时用户创建成功:', {
          id: user.id,
          phone: user.phone,
          status: user.status
        })
      } else {
        user = users[0]
        console.log('✅ 找到用户:', {
          id: user.id,
          phone: user.phone,
          status: user.status
        })
      }

      await connection.commit()
      return user
    } catch (error) {
      console.error('❌ 获取/创建用户失败:', error)
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  },
  
  // 保存验证码
  async saveVerificationCode(phone: string, code: string): Promise<void> {
    console.log('\n=== 💾 保存验证码 ===')
    console.log('手机号:', phone)
    console.log('验证码:', code)

    const pool = await Database.getInstance()
    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      // 清除旧的验证码
      await connection.execute(
        'UPDATE verification_codes SET used = 1 WHERE phone = ? AND used = 0',
        [phone]
      )

      // 插入新验证码，添加 type 字段
      await connection.execute(
        `INSERT INTO verification_codes (phone, code, type, expired_at) 
         VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 5 MINUTE))`,
        [phone, code, 'LOGIN']  // 添加 type 值
      )

      await connection.commit()
      console.log('✅ 验证码保存成功')
    } catch (error) {
      console.error('❌ 保存验证码失败:', error)
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  },
  
  // 实现 findOrCreateUserByPhone 函数
  async findOrCreateUserByPhone(phone: string): Promise<UserRow> {
    console.log('\n=== 👤 查找或创建用户 ===')
    console.log('手机号:', phone)
    
    const pool = await Database.getInstance()
    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      // 先查找是否有已激活的用户
      const [activeUsers] = await connection.execute<UserRow[]>(
        `SELECT u.*, us.username, us.avatar
         FROM users u 
         LEFT JOIN user_settings us ON u.id = us.user_id 
         WHERE u.phone = ? AND u.status = 'active'`,
        [phone]
      )

      if (activeUsers.length > 0) {
        console.log('✅ 找到已激活用户:', {
          id: activeUsers[0].id,
          phone: activeUsers[0].phone,
          status: activeUsers[0].status,
          hasUsername: !!activeUsers[0].username
        })
        await connection.commit()
        return activeUsers[0]
      }

      // 查找临时用户
      const [tempUsers] = await connection.execute<UserRow[]>(
        `SELECT u.*, us.username, us.avatar
         FROM users u 
         LEFT JOIN user_settings us ON u.id = us.user_id 
         WHERE u.phone = ? AND u.status = 'temporary'`,
        [phone]
      )

      let user: UserRow

      if (tempUsers.length === 0) {
        console.log('🆕 创建临时用户')
        // 创建临时用户
        const [result] = await connection.execute<ResultSetHeader>(
          'INSERT INTO users (phone, status, created_at) VALUES (?, "temporary", NOW())',
          [phone]
        )

        // 获取新创建的用户
        const [newUsers] = await connection.execute<UserRow[]>(
          `SELECT u.*, us.username, us.avatar
           FROM users u 
           LEFT JOIN user_settings us ON u.id = us.user_id 
           WHERE u.id = ?`,
          [result.insertId]
        )
        user = newUsers[0]
        console.log('✅ 临时用户创建成功:', {
          id: user.id,
          phone: user.phone,
          status: user.status
        })
      } else {
        user = tempUsers[0]
        console.log('✅ 找到临时用户:', {
          id: user.id,
          phone: user.phone,
          status: user.status
        })
      }

      await connection.commit()
      return user
    } catch (error) {
      console.error('❌ 查找/创建用户失败:', error)
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  },
  
  // 验证验证码
  async verifyCode(phone: string, code: string): Promise<boolean> {
    console.log('\n=== 🔍 验证验证码 ===')
    console.log('手机号:', phone)
    console.log('验证码:', code)

    const pool = await Database.getInstance()
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT id FROM verification_codes 
       WHERE phone = ? AND code = ? AND used = 0 AND expired_at > NOW()`,
      [phone, code]
    )

    if (rows.length > 0) {
      // 标记验证码已使用
      await pool.execute(
        'UPDATE verification_codes SET used = 1 WHERE id = ?',
        [rows[0].id]
      )
      console.log('✅ 验证码验证成功')
      return true
    }

    console.log('❌ 验证码验证失败')
    return false
  }
} 