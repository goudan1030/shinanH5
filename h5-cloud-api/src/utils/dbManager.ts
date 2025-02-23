import { Pool, Connection, PoolConnection } from 'mysql2/promise'
import { Database } from './db'

export class DbManager {
  private static instance: DbManager
  private pool: Pool | null = null

  private constructor() {}

  static getInstance(): DbManager {
    if (!DbManager.instance) {
      DbManager.instance = new DbManager()
    }
    return DbManager.instance
  }

  async getConnection(): Promise<PoolConnection> {
    if (!this.pool) {
      this.pool = await Database.getInstance()
    }
    return this.pool.getConnection()
  }

  async transaction<T>(
    callback: (connection: Connection) => Promise<T>
  ): Promise<T> {
    const connection = await this.getConnection()
    
    try {
      await connection.beginTransaction()
      const result = await callback(connection)
      await connection.commit()
      return result
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }
} 