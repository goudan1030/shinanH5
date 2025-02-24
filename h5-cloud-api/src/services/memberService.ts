import { Database } from '../utils/db'
import { ResultSetHeader, PoolConnection } from 'mysql2/promise'
import {
  MemberBase,
  MemberRecord,
  MemberQueryParams,
  MemberPaginationResult,
  MemberStatus,
  MemberType,
  MemberErrorCode,
  MemberServiceError
} from '../types/member'

interface PublicMemberFilters {
  gender?: string;
  ageStart?: number;
  ageEnd?: number;
  heightStart?: number;
  heightEnd?: number;
  education?: string;
  location?: string;
}

interface PublicMemberQuery {
  page: number;
  pageSize: number;
  filters: PublicMemberFilters;
}

export class MemberService {
  // 创建会员
  async createMember(userId: number, data: MemberBase) {
    const pool = await Database.getInstance()
    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      const [result] = await connection.execute<ResultSetHeader>(
        `INSERT INTO members (
          user_id, name, id_card, address, wechat, contact_phone,
          type, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          userId,
          data.name || null,
          data.idCard || null,
          data.address || null,
          data.wechat || null,
          data.contactPhone || null,
          MemberType.NORMAL,
          MemberStatus.ACTIVE
        ]
      )

      await connection.commit()
      return result
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }

  // 更新会员
  async updateMember(userId: number, data: MemberBase) {
    const pool = await Database.getInstance()
    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      const [result] = await connection.execute<ResultSetHeader>(
        `UPDATE members SET
          name = ?,
          id_card = ?,
          address = ?,
          wechat = ?,
          contact_phone = ?,
          updated_at = NOW()
        WHERE user_id = ?`,
        [
          data.name || null,
          data.idCard || null,
          data.address || null,
          data.wechat || null,
          data.contactPhone || null,
          userId
        ]
      )

      await connection.commit()
      return result
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }

  // 获取会员信息
  async getMember(userId: number) {
    const pool = await Database.getInstance()
    const [rows] = await pool.execute(
      'SELECT * FROM members WHERE user_id = ?',
      [userId]
    )
    return Array.isArray(rows) && rows.length > 0 ? rows[0] : null
  }

  // 更新会员状态
  async updateMemberStatus(
    id: number,
    status: MemberStatus,
    operatorId: number,
    reason?: string
  ) {
    const pool = await Database.getInstance()
    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      const [result] = await connection.execute<ResultSetHeader>(
        `UPDATE members SET
          status = ?,
          updated_at = NOW(),
          updated_by = ?,
          status_reason = ?
        WHERE id = ?`,
        [status, operatorId, reason || null, id]
      )

      if (result.affectedRows === 0) {
        throw new MemberServiceError(
          '会员不存在',
          MemberErrorCode.MEMBER_NOT_FOUND
        )
      }

      await connection.commit()
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }

  // 获取会员列表
  async getMembers(params: MemberQueryParams): Promise<MemberPaginationResult> {
    const pool = await Database.getInstance()
    const connection = await pool.getConnection()

    try {
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const offset = (page - 1) * pageSize

      // 构建查询条件
      const conditions: string[] = []
      const values: any[] = []

      if (params.status) {
        conditions.push('status = ?')
        values.push(params.status)
      }

      if (params.type) {
        conditions.push('type = ?')
        values.push(params.type)
      }

      if (params.keyword) {
        conditions.push('(name LIKE ? OR phone LIKE ?)')
        values.push(`%${params.keyword}%`, `%${params.keyword}%`)
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

      // 获取总数
      const [countResult] = await connection.execute(
        `SELECT COUNT(*) as total FROM members ${whereClause}`,
        values
      )
      const total = Array.isArray(countResult) ? (countResult[0] as any).total : 0

      // 获取列表数据
      const [rows] = await connection.execute(
        `SELECT * FROM members ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [...values, pageSize, offset]
      )

      return {
        list: Array.isArray(rows) ? rows as MemberRecord[] : [],
        total,
        page,
        pageSize
      }
    } finally {
      connection.release()
    }
  }

  // 保存会员信息
  async saveMemberInfo(data: MemberBase): Promise<void> {
    const pool = await Database.getInstance()
    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      // 验证手机号格式
      if (!this.isValidPhone(data.phone)) {
        throw new MemberServiceError(
          '手机号格式不正确',
          MemberErrorCode.INVALID_PHONE_FORMAT
        )
      }

      // 如果提供了身份证号，验证格式
      if (data.idCard && !this.isValidIdCard(data.idCard)) {
        throw new MemberServiceError(
          '身份证号格式不正确',
          MemberErrorCode.INVALID_ID_CARD_FORMAT
        )
      }

      // 检查会员是否已存在
      const [existingRows] = await connection.execute(
        'SELECT id FROM members WHERE phone = ?',
        [data.phone]
      )

      if (Array.isArray(existingRows) && existingRows.length > 0) {
        // 更新现有会员
        await connection.execute(
          `UPDATE members SET
            name = ?,
            id_card = ?,
            address = ?,
            wechat = ?,
            contact_phone = ?,
            updated_at = NOW()
          WHERE phone = ?`,
          [
            data.name || null,
            data.idCard || null,
            data.address || null,
            data.wechat || null,
            data.contactPhone || null,
            data.phone
          ]
        )
      } else {
        // 创建新会员
        await connection.execute(
          `INSERT INTO members (
            phone, name, id_card, address, wechat, contact_phone,
            type, status, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            data.phone,
            data.name || null,
            data.idCard || null,
            data.address || null,
            data.wechat || null,
            data.contactPhone || null,
            MemberType.NORMAL,
            MemberStatus.ACTIVE
          ]
        )
      }

      await connection.commit()
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }

  // 验证方法
  private isValidPhone(phone: string): boolean {
    return /^1[3-9]\d{9}$/.test(phone)
  }

  private isValidIdCard(idCard: string): boolean {
    return /^\d{17}[\dXx]$/.test(idCard)
  }

  async getPublicMembers(query: PublicMemberQuery) {
    const { page, pageSize, filters } = query
    const offset = (page - 1) * pageSize

    // 构建基础查询，添加更多字段
    let sql = `
      SELECT 
        member_no,
        nickname,
        gender,
        province,
        city,
        birth_year,
        education,
        occupation,
        self_description,
        children_plan,
        marriage_cert,
        updated_at
      FROM members
      WHERE deleted = 0
      AND status = 'ACTIVE'  -- 只返回激活状态的会员
    `

    // 添加筛选条件
    const params: any[] = []
    if (filters.gender) {
      sql += ' AND gender = ?'
      params.push(filters.gender)
    }
    if (filters.ageStart) {
      sql += ' AND birth_year <= ?'
      params.push(new Date().getFullYear() - filters.ageStart)
    }
    if (filters.ageEnd) {
      sql += ' AND birth_year >= ?'
      params.push(new Date().getFullYear() - filters.ageEnd)
    }
    if (filters.heightStart) {
      sql += ' AND height >= ?'
      params.push(filters.heightStart)
    }
    if (filters.heightEnd) {
      sql += ' AND height <= ?'
      params.push(filters.heightEnd)
    }
    if (filters.education) {
      sql += ' AND education = ?'
      params.push(filters.education)
    }
    if (filters.location) {
      sql += ' AND (province = ? OR city = ?)'
      params.push(filters.location, filters.location)
    }

    // 添加排序
    sql += ' ORDER BY updated_at DESC'

    // 添加分页
    sql += ' LIMIT ? OFFSET ?'
    params.push(pageSize, offset)

    const pool = await Database.getInstance()
    const [rows] = await pool.execute(sql, params)

    // 获取总数
    const [countResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM members WHERE deleted = 0 AND status = "ACTIVE"',
      []
    )
    const total = (countResult as any)[0].total

    // 处理返回数据，计算年龄
    const currentYear = new Date().getFullYear()
    const list = (rows as any[]).map(row => ({
      ...row,
      age: row.birth_year ? currentYear - row.birth_year : null,
      nickname: row.nickname || `会员${row.member_no}`, // 添加昵称处理
      // 删除敏感信息
      phone: undefined,
      wechat: undefined,
      contact_phone: undefined,
      id_card: undefined,
      exact_location: undefined
    }))

    return {
      total,
      page,
      pageSize,
      list
    }
  }

  // 添加获取会员详情方法
  async getMemberById(memberId: string) {
    const pool = await Database.getInstance()
    try {
      const [rows] = await pool.execute(
        `SELECT * FROM members 
         WHERE member_no = ? 
         AND deleted = 0 
         AND status = 'ACTIVE'`,
        [memberId]
      )
      return rows[0] || null
    } catch (error) {
      console.error('获取会员详情失败:', error)
      throw new Error('获取会员详情失败')
    }
  }
}

export const memberService = new MemberService() 