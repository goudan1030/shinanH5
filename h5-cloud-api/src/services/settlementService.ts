import Database from '../utils/db'
import { RowDataPacket } from 'mysql2'

export interface Settlement extends RowDataPacket {
  id: string
  settlement_date: Date
  amount: number
  operator_id: string
  created_at: Date
}

export const settlementService = {
  // 获取结算记录
  async getSettlements(params: {
    startDate?: string
    endDate?: string
    page?: number
    pageSize?: number
  }) {
    const pool = await Database.getInstance()
    const { startDate, endDate, page = 1, pageSize = 10 } = params
    
    let sql = 'SELECT * FROM settlement_records WHERE 1=1'
    const values: any[] = []

    if (startDate) {
      sql += ' AND settlement_date >= ?'
      values.push(startDate)
    }

    if (endDate) {
      sql += ' AND settlement_date <= ?'
      values.push(endDate)
    }

    // 获取总数
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM (${sql}) as t`,
      values
    )
    const total = (countResult as any)[0].total

    // 分页
    sql += ' ORDER BY settlement_date DESC LIMIT ? OFFSET ?'
    values.push(pageSize, (page - 1) * pageSize)

    const [rows] = await pool.execute<Settlement[]>(sql, values)

    return {
      list: rows,
      total,
      page,
      pageSize
    }
  },

  // 创建结算记录
  async createSettlement(data: Partial<Settlement>) {
    const pool = await Database.getInstance()
    const [result] = await pool.execute(
      'INSERT INTO settlement_records SET ?',
      [data]
    )
    return result
  }
} 