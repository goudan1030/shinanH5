import { ResultSetHeader, RowDataPacket } from 'mysql2'
import Database from '../utils/db'
import type { UserSettings } from '../types/user'
import bcryptjs from 'bcryptjs'
import type { UserRow } from '../types/user'
import type { UserService } from '../types/user'

// 导出 userService 对象，实现从 types/user.ts 导入的 UserService 接口
export const userService: UserService = {

  
  async setupUser(phone: string, username: string, password: string): Promise<UserRow> {
    console.log('\n=== 👤 设置用户信息 ===')
    console.log('手机号:', phone)
    console.log('用户名:', username)

    const pool = await Database.getInstance()
    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      // 查找用户
      const [users] = await connection.execute<UserRow[]>(
        'SELECT * FROM users WHERE phone = ?',
        [phone]
      )

      if (!users[0]) {
        console.log('❌ 未找到用户')
        throw new Error('用户不存在')
      }

      const userId = users[0].id
      const hashedPassword = await bcryptjs.hash(password, 10)

      // 更新用户信息
      console.log('📝 更新用户信息')
      await connection.execute(
        `UPDATE users 
         SET username = ?, password = ?
         WHERE id = ?`,
        [username, hashedPassword, userId]
      )

      // 获取更新后的用户信息
      const [updatedUsers] = await connection.execute<UserRow[]>(
        'SELECT * FROM users WHERE id = ?',
        [userId]
      )

      await connection.commit()

      console.log('✅ 用户设置完成:', {
        id: updatedUsers[0].id,
        phone: updatedUsers[0].phone,
        username: updatedUsers[0].username
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

      await pool.execute(
        'UPDATE users SET avatar = ? WHERE id = ?',
        [avatarUrl, userId]
      )

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
        'SELECT * FROM users WHERE id = ?',
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
    const pool = await Database.getInstance()
    try {
      const [users] = await pool.execute<UserRow[]>(
        'SELECT * FROM users WHERE phone = ?',
        [phone]
      )
      return users[0] || null
    } catch (error) {
      console.error('❌ 通过手机号查询用户失败:', error)
      throw error
    }
  },
  
  async verifyPassword(phone: string, password: string): Promise<UserRow | null> {
    const pool = await Database.getInstance()
    
    const [users] = await pool.execute<UserRow[]>(
      'SELECT * FROM users WHERE phone = ?',
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
          'SELECT * FROM users WHERE id = ?',
          [userId]
        )
        console.log('User check result:', users)

        if (!users[0]) {
          throw new Error('用户不存在')
        }

        console.log('Updating user info...', { userId, username })

        // 更新用户信息
        await connection.execute(
          'UPDATE users SET username = ? WHERE id = ?',
          [username, userId]
        )

        console.log('Getting updated user info...')

        // 获取更新后的用户信息
        const [updatedUsers] = await connection.execute<UserRow[]>(
          'SELECT * FROM users WHERE id = ?',
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

      // 查找用户
      const [users] = await connection.execute<UserRow[]>(
        'SELECT * FROM users WHERE phone = ?',
        [phone]
      )

      let user: UserRow

      if (users.length === 0) {
        console.log('🆕 创建新用户')
        // 创建用户
        const [result] = await connection.execute<ResultSetHeader>(
          'INSERT INTO users (phone, created_at) VALUES (?, NOW())',
          [phone]
        )

        // 获取新创建的用户
        const [newUsers] = await connection.execute<UserRow[]>(
          'SELECT * FROM users WHERE id = ?',
          [result.insertId]
        )
        user = newUsers[0]
        console.log('✅ 用户创建成功:', {
          id: user.id,
          phone: user.phone
        })
      } else {
        user = users[0]
        console.log('✅ 找到已存在用户:', {
          id: user.id,
          phone: user.phone
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

    // 开发环境下的测试验证码
    if (process.env.NODE_ENV === 'development') {
      if (code === '666666') {
        console.log('开发模式：使用通用测试验证码')
        return true
      }
    }

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
  },

  // 添加检查用户是否已登记的方法
  async checkUserRegistered(phone: string): Promise<boolean> {
    console.log('\n=== 🔍 检查用户是否已登记 ===')
    console.log('手机号:', phone)

    const pool = await Database.getInstance()
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT id FROM members WHERE phone = ?',
        [phone]
      )

      const isRegistered = rows.length > 0
      console.log('检查结果:', isRegistered ? '已登记' : '未登记')
      return isRegistered
    } catch (error) {
      console.error('❌ 检查用户登记状态失败:', error)
      throw error
    }
  },

  // 添加 createUserSettings 方法
  async createUserSettings(userId: number): Promise<void> {
    const pool = await Database.getInstance()
    try {
      await pool.execute(
        'INSERT INTO user_settings (user_id) VALUES (?)',
        [userId]
      )
      console.log('✅ 用户设置创建成功:', { userId })
    } catch (error) {
      console.error('❌ 创建用户设置失败:', error)
      throw error
    }
  },

  // 重命名现有的 findUserByPhone 为 getUserByPhone
  // 或者让 findUserByPhone 调用 getUserByPhone
  async findUserByPhone(phone: string): Promise<UserRow | null> {
    return this.getUserByPhone(phone)
  },
}