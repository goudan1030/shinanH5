import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

class Database {
  private static instance: mysql.Pool | null = null

  private static async createPool(retries = 3, delay = 2000): Promise<mysql.Pool> {
    for (let i = 0; i < retries; i++) {
      try {
        console.log(`Attempting to connect to database (attempt ${i + 1}/${retries})...`)
        console.log(`Database host: ${process.env.DB_HOST}`)
        
        const pool = mysql.createPool({
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
          connectTimeout: 10000,
          // 增加更多连接选项
          enableKeepAlive: true,
          keepAliveInitialDelay: 0,
          multipleStatements: true,
          timezone: '+08:00'
        })

        // 测试连接
        const connection = await pool.getConnection()
        await connection.ping()
        connection.release()
        
        console.log('Database connected successfully!')
        return pool
      } catch (error) {
        console.error(`Database connection attempt ${i + 1} failed:`, error)
        console.error('Error details:', {
          code: (error as any).code,
          errno: (error as any).errno,
          sqlState: (error as any).sqlState,
          sqlMessage: (error as any).sqlMessage
        })
        
        if (i === retries - 1) throw error
        console.log(`Retrying in ${delay/1000} seconds...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
    throw new Error('Failed to connect to database after multiple attempts')
  }

  public static async getInstance(): Promise<mysql.Pool> {
    if (!Database.instance) {
      Database.instance = await Database.createPool()
    }
    return Database.instance
  }
}

export default Database 