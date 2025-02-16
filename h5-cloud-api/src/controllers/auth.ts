import { Request, Response } from 'express'
import { smsService } from '../services/sms'
import { userService } from '../services/userService'
import { generateToken } from '../utils/jwt'
import type { UserRow } from '../types/user'
import type { AsyncHandler } from '../types/express'
import Database from '../utils/db'
import { RowDataPacket } from 'mysql2'

// 发送验证码
export const sendCode: AsyncHandler = async (req, res) => {
  const { phone } = req.body
  
  try {
    console.log('\n=== 📱 发送验证码 ===')
    console.log('手机号:', phone)

    // 验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      throw new Error('手机号格式错误')
    }

    // 生成验证码
    const code = smsService.generateVerificationCode()
    console.log('生成验证码:', code)

    // 先保存验证码到数据库
    await userService.saveVerificationCode(phone, code)
    
    // 发送短信验证码
    await smsService.sendVerificationCode(phone, code)
    
    console.log('✅ 验证码发送成功')
    res.json({ 
      success: true,
      message: '验证码发送成功'
    })
  } catch (error: any) {
    // 如果是阿里云短信发送失败，但验证码已保存
    if (error.code && error.code.startsWith('isv.')) {
      console.warn('短信发送失败，但验证码已保存:', error.message)
      return res.json({
        success: true,
        message: '验证码已发送'
      })
    }

    console.error('❌ 发送验证码失败:', {
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error
    })

    res.status(500).json({
      success: false,
      message: error.message || '发送验证码失败，请稍后重试'
    })
  }
}

// 手机号登录
export const loginWithPhone: AsyncHandler = async (req, res) => {
  let connection;
  try {
    console.log('\n=== 📱 手机号登录 ===')
    console.log('请求体:', req.body)

    const { phone, code } = req.body
    console.log('解析后的数据:', { phone, code })

    if (!phone || !code) {
      console.log('❌ 参数验证失败:', { phone, code })
      return res.status(400).json({
        success: false,
        message: '手机号和验证码不能为空'
      })
    }

    // 验证验证码
    const isValid = await userService.verifyCode(phone, code)
    if (!isValid) {
      console.log('❌ 验证码验证失败')
      return res.status(400).json({
        success: false,
        message: '验证码无效或已过期'
      })
    }

    // 查找或创建用户
    const user = await userService.findOrCreateUserByPhone(phone)

    // 检查用户状态
    if (user.status === 'temporary') {
      console.log('⚠️ 临时用户需要完成注册')
      return res.json({
        success: true,
        message: '需要完成注册',
        data: {
          needSetup: true,
          user: {
            id: user.id,
            phone: user.phone,
            isNewUser: true,
            needSetup: true
          }
        }
      })
    }

    // 获取用户完整信息
    const pool = await Database.getInstance()
    connection = await pool.getConnection()

    const [userSettings] = await connection.execute(
      'SELECT username, avatar FROM user_settings WHERE user_id = ?',
      [user.id]
    )

    // 生成 token
    const token = generateToken({ 
      id: user.id, 
      phone: user.phone 
    })

    console.log('✅ 登录成功:', {
      userId: user.id,
      phone: user.phone,
      hasUsername: !!userSettings?.[0]?.username
    })

    res.json({
      success: true,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          phone: user.phone,
          username: userSettings?.[0]?.username || null,
          avatar: userSettings?.[0]?.avatar || null,
          isNewUser: false,
          needSetup: false
        }
      }
    })
  } catch (error: any) {
    console.error('❌ 手机号登录失败:', error)
    res.status(500).json({
      success: false,
      message: error.message || '登录失败'
    })
  } finally {
    if (connection) {
      connection.release()
    }
  }
}

// 密码登录
export const loginWithPassword: AsyncHandler = async (req, res) => {
  const { phone, password } = req.body
  const user = await userService.verifyPassword(phone, password) as UserRow
  if (!user) {
    return res.status(401).json({ message: '手机号或密码错误' })
  }
  const token = generateToken({ id: user.id, phone: user.phone })
  res.json({ 
    token, 
    user: {
      id: user.id,
      phone: user.phone,
      username: user.username,
      avatar: user.avatar
    }
  })
}

// 设置用户信息
export const setupUser: AsyncHandler = async (req, res) => {
  const { phone, username, password } = req.body
  
  try {
    // 检查必要参数
    if (!phone || !username || !password) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数'
      })
    }

    const user = await userService.setupUser(phone, username, password) as UserRow
    
    // 确保 user 存在且有必要的字段
    if (!user || !user.id) {
      throw new Error('用户创建失败')
    }

    // 生成 token 时确保传入必要的参数
    const token = generateToken({ 
      id: user.id,
      phone: user.phone
    })
    
    res.json({
      success: true,
      message: '用户信息设置成功',
      data: {
        token,
        user: {
          id: user.id,
          phone: user.phone,
          username: user.username,
          isNewUser: false
        }
      }
    })
  } catch (error: any) {
    console.error('Setup user error:', error)
    res.status(500).json({
      success: false,
      message: error.message || '设置用户信息失败'
    })
  }
}

// 获取当前用户信息
export const getCurrentUser: AsyncHandler = async (req, res) => {
  const userId = req.user?.id
  if (!userId) {
    return res.status(401).json({ 
      success: false,
      message: '未登录' 
    })
  }

  const user = await userService.getUserById(userId)
  if (!user) {
    return res.status(404).json({ 
      success: false,
      message: '用户不存在' 
    })
  }

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        phone: user.phone,
        username: user.username || null,
        avatar: user.avatar || null,
        isNewUser: !user.username,
        needSetup: !user.username
      }
    }
  })
}

// 更新用户信息
export const updateUser: AsyncHandler = async (req, res) => {
  try {
    const userId = req.user?.id
    const { username } = req.body

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: '未登录'
      })
    }

    if (!username) {
      return res.status(400).json({
        success: false,
        message: '用户名不能为空'
      })
    }

    console.log('Updating user:', { userId, username })

    // 先检查用户设置是否存在
    const pool = await Database.getInstance()
    const connection = await pool.getConnection()

    try {
      // 检查用户设置是否存在
      const [settings] = await connection.execute(
        'SELECT * FROM user_settings WHERE user_id = ?',
        [userId]
      )

      // 如果不存在，先创建
      if (!settings[0]) {
        await connection.execute(
          'INSERT INTO user_settings (user_id) VALUES (?)',
          [userId]
        )
      }

      connection.release()
    } catch (error) {
      connection.release()
      throw error
    }

    const user = await userService.updateUserInfo(userId, username)

    console.log('Update result:', user)

    res.json({
      success: true,
      message: '更新成功',
      data: {
        user: {
          id: user.id,
          phone: user.phone,
          username: user.username,
          avatar: user.avatar
        }
      }
    })
  } catch (error: any) {
    console.error('Update user error:', error)
    res.status(500).json({
      success: false,
      message: error.message || '更新失败'
    })
  }
}

// 检查登录状态
export const checkLoginStatus: AsyncHandler = async (req, res) => {
  console.log('=== 检查登录状态 ===')
  console.log('请求头:', {
    authorization: req.headers.authorization,
    'user-agent': req.headers['user-agent']
  })
  console.log('用户信息:', req.user)
  
  try {
    const userId = req.user?.id
    
    if (!userId) {
      console.log('❌ 未登录状态')
      return res.json({
        success: true,
        data: {
          isLoggedIn: false
        }
      })
    }

    console.log('🔍 查询用户信息:', { userId })
    const user = await userService.getUserById(userId)
    
    if (!user) {
      console.log('❌ 用户不存在:', { userId })
      return res.json({
        success: true,
        data: {
          isLoggedIn: false
        }
      })
    }

    console.log('✅ 已登录用户:', {
      id: user.id,
      phone: user.phone,
      username: user.username,
      isNewUser: !user.username,
      needSetup: !user.username
    })

    res.json({
      success: true,
      data: {
        isLoggedIn: true,
        user: {
          id: user.id,
          phone: user.phone,
          username: user.username || null,
          avatar: user.avatar || null,
          isNewUser: !user.username,
          needSetup: !user.username
        }
      }
    })
  } catch (error: any) {
    console.error('❌ 检查登录状态失败:', {
      error: error.message,
      stack: error.stack
    })
    res.status(500).json({
      success: false,
      message: error.message || '检查登录状态失败'
    })
  }
}

// 检查用户状态
export const checkUserStatus: AsyncHandler = async (req, res) => {
  console.log('=== 检查用户状态 ===')
  console.log('当前用户:', req.user)
  
  try {
    const userId = req.user?.id
    
    if (!userId) {
      console.log('❌ 未登录')
      return res.status(401).json({
        success: false,
        message: '未登录'
      })
    }

    console.log('🔍 查询用户信息:', { userId })
    const user = await userService.getUserById(userId)
    
    if (!user) {
      console.log('❌ 用户不存在:', { userId })
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      })
    }

    console.log('✅ 用户状态:', {
      id: user.id,
      phone: user.phone,
      username: user.username,
      isNewUser: !user.username,
      needSetup: !user.username
    })

    res.json({
      success: true,
      data: {
        isNewUser: !user.username,
        needSetup: !user.username,
        user: {
          id: user.id,
          phone: user.phone,
          username: user.username || null,
          avatar: user.avatar || null
        }
      }
    })
  } catch (error: any) {
    console.error('❌ 检查用户状态失败:', {
      error: error.message,
      stack: error.stack
    })
    res.status(500).json({
      success: false,
      message: error.message || '检查用户状态失败'
    })
  }
} 