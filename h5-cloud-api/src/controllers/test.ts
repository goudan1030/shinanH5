import { AsyncHandler } from '../types/express'
import Database from '../utils/db'

// 基础测试路由处理函数
export const testConnection: AsyncHandler = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'API 连接成功',
      data: {
        message: 'Hello from API server',
        timestamp: new Date().toISOString()
      }
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || '服务器错误'
    })
  }
}

// 数据库连接测试
export const testDbConnection: AsyncHandler = async (req, res) => {
  try {
    const pool = await Database.getInstance()
    // 测试执行一个简单的查询
    await pool.execute('SELECT 1')
    
    res.json({
      success: true,
      message: '数据库连接成功',
      data: {
        dbHost: process.env.DB_HOST,
        dbName: process.env.DB_NAME,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: '数据库连接失败',
      error: {
        message: error.message,
        code: error.code,
        errno: error.errno,
        sqlState: error.sqlState,
        sqlMessage: error.sqlMessage
      }
    })
  }
} 