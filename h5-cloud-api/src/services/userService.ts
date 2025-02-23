import { ResultSetHeader, RowDataPacket } from 'mysql2'
import Database from '../utils/db'
import type { 
  UserSettings, 
  UserRow, 
  UserService,
  MemberInfo  // 添加 MemberInfo 导入
} from '../types/user'
import bcryptjs from 'bcryptjs'

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

      // 更新用户信息，同时设置 nickname 为 username
      console.log('📝 更新用户信息')
      await connection.execute(
        `UPDATE users 
         SET username = ?, 
             nickname = ?,
             password = ?
         WHERE id = ?`,
        [username, username, hashedPassword, userId]
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
        username: updatedUsers[0].username,
        nickname: updatedUsers[0].nickname
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
  
  async updateUserInfo(
    userId: number, 
    data: { username?: string; nickname?: string; avatar?: string }
  ): Promise<UserRow> {
    console.log('\n=== 👤 更新用户信息 ===')
    console.log('用户ID:', userId)
    console.log('更新数据:', data)

    const pool = await Database.getInstance()
    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      // 构建更新字段
      const updateFields: string[] = []
      const updateValues: any[] = []

      if (data.username !== undefined) {
        updateFields.push('username = ?')
        updateValues.push(data.username)
      }

      if (data.nickname !== undefined) {
        updateFields.push('nickname = ?')
        updateValues.push(data.nickname)
      }

      if (data.avatar !== undefined) {
        updateFields.push('avatar = ?')
        updateValues.push(data.avatar)
      }

      updateFields.push('updated_at = NOW()')
      updateValues.push(userId) // 用于 WHERE 条件

      // 执行更新
      const [result] = await connection.execute(
        `UPDATE users SET 
          ${updateFields.join(', ')}
        WHERE id = ?`,
        updateValues
      )

      // 获取更新后的用户信息
      const [users] = await connection.execute<UserRow[]>(
        'SELECT * FROM users WHERE id = ?',
        [userId]
      )

      if (!users[0]) {
        throw new Error('用户不存在')
      }

      await connection.commit()
      console.log('✅ 用户信息更新成功:', {
        id: users[0].id,
        username: users[0].username,
        nickname: users[0].nickname,
        avatar: users[0].avatar
      })

      return users[0]
    } catch (error) {
      await connection.rollback()
      console.error('❌ 更新用户信息失败:', error)
      throw error
    } finally {
      connection.release()
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
          'INSERT INTO users (phone, created_at, updated_at) VALUES (?, NOW(), NOW())',
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
          phone: user.phone,
          nickname: user.nickname
        })
      } else {
        user = users[0]
        console.log('✅ 找到已存在用户:', {
          id: user.id,
          phone: user.phone,
          nickname: user.nickname
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

  // 保存会员信息到 members 表
  async saveMemberInfo(data: MemberInfo): Promise<void> {
    console.log('\n=== 💾 保存会员信息到数据库 ===')
    console.log('待保存的数据:', {
      phone: data.phone,
      name: data.name || '未填写',
      idCard: data.idCard || '未填写',
      address: data.address || '未填写'
    })

    const pool = await Database.getInstance()
    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      // 检查是否已存在
      const [existing] = await connection.execute<RowDataPacket[]>(
        'SELECT id, name, id_card, address FROM members WHERE phone = ?',
        [data.phone]
      )

      if (existing.length > 0) {
        console.log('找到已存在记录:', existing[0])
        // 更新现有记录
        const [result] = await connection.execute(
          `UPDATE members SET 
            name = ?,
            id_card = ?,
            address = ?,
            updated_at = NOW()
          WHERE phone = ?`,
          [
            data.name || null,
            data.idCard || null,
            data.address || null,
            data.phone
          ]
        )
        console.log('✅ 会员信息更新成功:', {
          phone: data.phone,
          changedFields: {
            name: data.name !== existing[0].name,
            idCard: data.idCard !== existing[0].id_card,
            address: data.address !== existing[0].address
          }
        })
      } else {
        console.log('未找到记录，创建新会员')
        // 创建新记录
        const [result] = await connection.execute(
          `INSERT INTO members (
            phone, name, id_card, address, created_at, updated_at
          ) VALUES (?, ?, ?, ?, NOW(), NOW())`,
          [
            data.phone,
            data.name || null,
            data.idCard || null,
            data.address || null
          ]
        )
        console.log('✅ 会员信息创建成功:', {
          phone: data.phone,
          insertId: (result as any).insertId
        })
      }

      await connection.commit()
      console.log('✅ 数据库事务提交成功')
    } catch (error) {
      await connection.rollback()
      console.error('❌ 保存会员信息失败:', {
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack
        } : error,
        data: {
          phone: data.phone,
          hasName: !!data.name,
          hasIdCard: !!data.idCard,
          hasAddress: !!data.address
        }
      })
      throw error
    } finally {
      connection.release()
      console.log('=== 💾 保存会员信息完成 ===\n')
    }
  },

  // 更新用户最后登录时间
  async updateLastLoginTime(userId: number): Promise<void> {
    const pool = await Database.getInstance()
    try {
      await pool.execute(
        'UPDATE users SET last_login_at = NOW() WHERE id = ?',
        [userId]
      )
    } catch (error) {
      console.error('更新最后登录时间失败:', error)
      throw error
    }
  }
}