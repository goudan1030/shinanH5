import Database from '../utils/db'
import { RowDataPacket } from 'mysql2'

export interface Member extends RowDataPacket {
  id: string
  member_no: string
  type: string
  status: string
  // ... 其他字段
}

export const memberService = {
  // 获取会员列表
  async getMembers(params: {
    page?: number
    pageSize?: number
    status?: string
    type?: string
    keyword?: string
  }) {
    const pool = await Database.getInstance()
    const { page = 1, pageSize = 10, status, type, keyword } = params
    
    let sql = 'SELECT * FROM members WHERE 1=1'
    const values: any[] = []

    if (status) {
      sql += ' AND status = ?'
      values.push(status)
    }

    if (type) {
      sql += ' AND type = ?'
      values.push(type)
    }

    if (keyword) {
      sql += ' AND (member_no LIKE ? OR phone LIKE ? OR wechat LIKE ?)'
      values.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`)
    }

    // 获取总数
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM (${sql}) as t`,
      values
    )
    const total = (countResult as any)[0].total

    // 分页
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    values.push(pageSize, (page - 1) * pageSize)

    const [rows] = await pool.execute<Member[]>(sql, values)

    return {
      list: rows,
      total,
      page,
      pageSize
    }
  },

  // 创建会员
  async createMember(data: Partial<Member>) {
    const pool = await Database.getInstance()
    const [result] = await pool.execute(
      'INSERT INTO members SET ?',
      [data]
    )
    return result
  },

  // 更新会员
  async updateMember(id: string, data: Partial<Member>) {
    const pool = await Database.getInstance()
    const [result] = await pool.execute(
      'UPDATE members SET ? WHERE id = ?',
      [data, id]
    )
    return result
  },

  // 更新会员状态
  async updateMemberStatus(id: string, status: string, operatorId: string, reason?: string) {
    const pool = await Database.getInstance()
    const conn = await pool.getConnection()
    
    try {
      await conn.beginTransaction()

      // 获取当前状态
      const [rows] = await conn.execute<Member[]>(
        'SELECT status FROM members WHERE id = ?',
        [id]
      )
      const oldStatus = rows[0]?.status

      // 更新状态
      await conn.execute(
        'UPDATE members SET status = ? WHERE id = ?',
        [status, id]
      )

      // 记录状态变更
      await conn.execute(
        'INSERT INTO member_status_logs (id, member_id, old_status, new_status, reason, operator_id) VALUES (UUID(), ?, ?, ?, ?, ?)',
        [id, oldStatus, status, reason, operatorId]
      )

      await conn.commit()
    } catch (error) {
      await conn.rollback()
      throw error
    } finally {
      conn.release()
    }
  }
} 