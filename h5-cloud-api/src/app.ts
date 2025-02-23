import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import testRoutes from './routes/test'
import userRoutes from './routes/userRoutes'
import { errorHandler } from './middleware/error'
import Database from './utils/db'
import path from 'path'

// 确保在最开始就加载环境变量
const envPath = path.resolve(__dirname, '../.env')
console.log('\n=== 🔍 环境变量文件 ===')
console.log('当前目录:', __dirname)
console.log('环境变量文件路径:', envPath)

// 加载环境变量（只加载一次）
const result = dotenv.config({ path: envPath })
if (result.error) {
  console.error('❌ 加载环境变量失败:', result.error)
  process.exit(1)
}

// 验证必要的环境变量
const requiredEnvVars = {
  'ALI_SMS_ACCESS_KEY_ID': process.env.ALI_SMS_ACCESS_KEY_ID,
  'ALI_SMS_ACCESS_KEY_SECRET': process.env.ALI_SMS_ACCESS_KEY_SECRET,
  'ALI_SMS_SIGN_NAME': process.env.ALI_SMS_SIGN_NAME,
  'ALI_SMS_TEMPLATE_LOGIN': process.env.ALI_SMS_TEMPLATE_LOGIN
}

console.log('\n=== 🔧 环境变量验证 ===')
for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    console.error(`❌ 缺少环境变量: ${key}`)
    process.exit(1)
  }
  console.log(`✅ ${key}: ${key.includes('SECRET') ? '******' : value}`)
}

// 打印环境变量（隐藏敏感信息）
console.log('\n=== 🔧 环境变量配置 ===')
console.log('阿里云配置:', {
  accessKeyId: process.env.ALI_SMS_ACCESS_KEY_ID?.substring(0, 8) + '****',
  signName: process.env.ALI_SMS_SIGN_NAME,
  templateCode: process.env.ALI_SMS_TEMPLATE_LOGIN,
  hasSecretKey: !!process.env.ALI_SMS_ACCESS_KEY_SECRET
})

// 加载环境变量
console.log('Starting server with config:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DB_HOST: process.env.DB_HOST
})

const app = express()

// CORS 配置
app.use(cors({
  origin: process.env.NODE_ENV === 'development' 
    ? ['http://localhost:5173', 'http://127.0.0.1:5173']  // 开发环境允许的域名
    : process.env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600 // 缓存预检请求结果 10 分钟
}))

// 添加 OPTIONS 请求处理
app.options('*', cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 添加静态文件服务
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')))

// 测试路由
app.get('/api/test', (req: Request, res: Response) => {
  console.log('Test API called')
  res.json({ 
    message: 'API is working',
    timestamp: new Date().toISOString()
  })
})

// 路由
app.use('/api/auth', authRoutes)
app.use('/api/test', testRoutes)
app.use('/api/user', userRoutes)

// 错误处理
app.use(errorHandler)

// 错误处理中间件
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', err)
  res.status(500).json({
    success: false,
    message: err.message || '服务器内部错误'
  })
})

const PORT = process.env.PORT || 3001

// 启动服务器
const startServer = async () => {
  try {
    // 初始化数据库连接
    const pool = await Database.getInstance()
    
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`)
      console.log('Available routes:')
      console.log('- GET  /api/test')
      console.log('- POST /api/auth/send-code')
      console.log('- POST /api/auth/login/phone')
      console.log('- POST /api/auth/setup')
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

// 错误处理
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error)
})

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error)
  process.exit(1)
})

startServer() 