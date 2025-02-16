import request from '../utils/request'
import type { ApiResponse } from '@/types'

interface DbConnectionResponse {
  success: boolean
  message: string
  data?: {
    dbHost: string
    dbName: string
    timestamp: string
  }
}

export const testApi = {
  // 基础连接测试
  testConnection: () => 
    request.get('/test'),  // 实际请求: http://localhost:3000/api/test

  // 数据库连接测试
  testDbConnection: () => 
    request.get('/test/db-connection')  // 实际请求: http://localhost:3000/api/test/db-connection')
} 