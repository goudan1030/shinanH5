import { Request, Response } from 'express'
import { AsyncHandler } from '../types/express'
import { userService } from '../services/userService'
import multer from 'multer'
import path from 'path'
import { generateToken } from '../utils/jwt'

// 配置文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/avatars')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname))
  }
})

// 导出 multer 实例
export const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 限制 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('不支持的文件类型'))
    }
  }
})

// 设置用户信息
export const setupUser: AsyncHandler = async (req, res) => {
  const { phone, username, password } = req.body
  
  try {
    const user = await userService.setupUser(phone, username, password)
    
    res.json({
      success: true,
      message: '用户信息设置成功',
      data: {
        token: generateToken({ id: user.id, phone: user.phone }),
        user: {
          id: user.id,
          phone: user.phone,
          username: user.username,
          isNewUser: false
        }
      }
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: '设置用户信息失败',
      error: {
        message: error.message
      }
    })
  }
}

// 上传头像
export const uploadAvatar: AsyncHandler = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: '未授权访问'
    })
  }

  try {
    if (!req.file) {
      throw new Error('请选择要上传的图片')
    }

    console.log('Uploading avatar for user:', req.user.id)
    console.log('File details:', {
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size
    })

    const userId = req.user.id
    const avatarUrl = `${process.env.API_URL || 'http://localhost:3000'}/uploads/avatars/${req.file.filename}`

    await userService.updateAvatar(userId, avatarUrl)
    console.log('Avatar updated successfully:', avatarUrl)

    res.json({
      success: true,
      message: '头像上传成功',
      data: {
        avatarUrl
      }
    })
  } catch (error: any) {
    console.error('Upload avatar error:', error)
    res.status(500).json({
      success: false,
      message: error.message || '头像上传失败',
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack,
        details: error.details
      } : undefined
    })
  }
} 