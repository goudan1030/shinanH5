import { Request, Response } from 'express'
import { smsService } from '../services/sms'
import { userService } from '../services/user'
import { generateToken } from '../utils/jwt'
import type { UserLoginResponse } from '../types/user'
import type { AsyncHandler } from '../types/express'

export const sendCode: AsyncHandler = async (req, res) => {
  const { phone } = req.body
  const code = smsService.generateVerificationCode()
  await smsService.sendVerificationCode(phone, code)
  await userService.saveVerificationCode(phone, code)
  res.json({ success: true })
}

export const loginWithPhone: AsyncHandler = async (req, res) => {
  const { phone, code } = req.body
  const isValid = await userService.verifyCode(phone, code)
  
  if (!isValid) {
    return res.status(400).json({ message: '验证码无效或已过期' })
  }

  const userExists = await userService.checkUserExists(phone)
  if (!userExists) {
    await userService.createUserWithPhone(phone)
  }

  const user = await userService.getUserByPhone(phone)
  const token = generateToken({ id: user.id, phone: user.phone })

  res.json({
    data: {
      token,
      user: {
        id: user.id,
        phone: user.phone,
        username: user.username,
        isNewUser: !userExists
      }
    }
  })
}

export const loginWithPassword: AsyncHandler = async (req, res) => {
  const { phone, password } = req.body
  const user = await userService.verifyPassword(phone, password)
  if (!user) {
    return res.status(401).json({ message: '手机号或密码错误' })
  }
  const token = generateToken({ id: user.id, phone: user.phone })
  res.json({ token, user })
}

export const setupUser: AsyncHandler = async (req, res) => {
  const { phone, username, password } = req.body
  await userService.setupUser(phone, username, password)
  const user = await userService.getUserByPhone(phone)
  const token = generateToken({ id: user.id, phone: user.phone })
  res.json({ token, user })
} 