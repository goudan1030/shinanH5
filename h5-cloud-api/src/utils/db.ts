import mysql, { Pool, PoolConnection } from 'mysql2/promise'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config()

export class Database {
  private static instance: Pool
  private static isInitialized = false

  public static async getInstance(): Promise<Pool> {
    if (!Database.instance) {
      console.log('\n=== 🔌 初始化数据库连接 ===')
      
      Database.instance = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        multipleStatements: true  // 允许执行多条SQL语句
      })

      // 只在第一次初始化时创建表
      if (!Database.isInitialized) {
        await Database.initTables()
        Database.isInitialized = true
      }
    }
    return Database.instance
  }

  private static async initTables(): Promise<void> {
    console.log('\n=== 📦 初始化数据表 ===')
    const connection = await Database.instance.getConnection()

    try {
      // 创建用户资料表
      await connection.query(`
        CREATE TABLE IF NOT EXISTS user_profiles (
          id INT PRIMARY KEY AUTO_INCREMENT,
          user_id INT NOT NULL UNIQUE,
          gender VARCHAR(10),
          birthday VARCHAR(10),
          height VARCHAR(10),
          weight VARCHAR(10),
          orientation VARCHAR(20),
          occupation VARCHAR(50),
          education VARCHAR(50),
          marital_status VARCHAR(20),
          residence VARCHAR(100),
          hometown VARCHAR(100),
          assets VARCHAR(20),
          expected_location VARCHAR(100),
          child_intent VARCHAR(20),
          marriage_requirement VARCHAR(20),
          self_intro TEXT,
          expectations TEXT,
          wechat VARCHAR(50),
          contact_phone VARCHAR(20),
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `)

      console.log('✅ 表初始化完成')
    } catch (error) {
      console.error('❌ 表初始化失败:', error)
      throw error
    } finally {
      connection.release()
    }
  }
}

export default Database 