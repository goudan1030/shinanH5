import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import { errorHandler } from './middleware/error'
import Database from './utils/db'

// 加载环境变量
dotenv.config()
console.log('Starting server with config:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DB_HOST: process.env.DB_HOST
})

const app = express()

// CORS 配置
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}))

app.use(express.json())

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

// 错误处理
app.use(errorHandler)

const PORT = process.env.PORT || 3000

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