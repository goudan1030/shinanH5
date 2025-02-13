import Database from '../utils/db'
import { RowDataPacket } from 'mysql2'

export interface MiniappConfig extends RowDataPacket {
  id: number
  appid: string
  appsecret: string
}

export interface WecomConfig extends RowDataPacket {
  id: number
  corp_id: string
  agent_id: string
  secret: string
}

export const configService = {
  // 获取小程序配置
  async getMiniappConfig() {
    const pool = await Database.getInstance()
    const [rows] = await pool.execute<MiniappConfig[]>(
      'SELECT * FROM miniapp_config LIMIT 1'
    )
    return rows[0]
  },

  // 更新小程序配置
  async updateMiniappConfig(data: Partial<MiniappConfig>) {
    const pool = await Database.getInstance()
    const [result] = await pool.execute(
      'UPDATE miniapp_config SET ? WHERE id = 1',
      [data]
    )
    return result
  },

  // 获取企业微信配置
  async getWecomConfig() {
    const pool = await Database.getInstance()
    const [rows] = await pool.execute<WecomConfig[]>(
      'SELECT * FROM wecom_config LIMIT 1'
    )
    return rows[0]
  },

  // 更新企业微信配置
  async updateWecomConfig(data: Partial<WecomConfig>) {
    const pool = await Database.getInstance()
    const [result] = await pool.execute(
      'UPDATE wecom_config SET ? WHERE id = 1',
      [data]
    )
    return result
  }
} 