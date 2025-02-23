import { DbManager } from '../utils/dbManager'
import { Connection, ResultSetHeader } from 'mysql2/promise'
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

// 会员状态枚举
export enum MemberStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING'
}

// 会员类型枚举
export enum MemberType {
  NORMAL = 'NORMAL',
  VIP = 'VIP'
}

export interface Member extends MemberRecord {
  id: string
  member_no: string
  type: string
  status: string
  // ... 其他字段
}

// 会员记录接口
export interface MemberRecord extends MemberBase {
  id: number
  type: MemberType
  status: MemberStatus
  created_at: Date
  updated_at: Date
}

// 服务错误类
export class MemberServiceError extends Error {
  constructor(
    message: string, 
    public code: string = 'UNKNOWN_ERROR',
    public details?: any
  ) {
    super(message)
    this.name = 'MemberServiceError'
  }
}

export class MemberService {
  private dbManager = DbManager.getInstance()

  //#region Public Methods
  public async getMembers(params: MemberQueryParams): Promise<MemberPaginationResult> {
    return this.wrapError(async () => {
      return await this.dbManager.transaction(async (connection) => {
        return await this.queryMembers(connection, params)
      })
    })
  }

  public async getMemberByPhone(phone: string): Promise<MemberRecord | null> {
    return this.wrapError(async () => {
      return await this.dbManager.transaction(async (connection) => {
        return await this.findMemberByPhone(connection, phone)
      })
    })
  }

  public async saveMemberInfo(data: MemberBase): Promise<void> {
    return this.wrapError(async () => {
      this.validateMemberData(data)
      await this.dbManager.transaction(async (connection) => {
        const member = await this.findMemberByPhone(connection, data.phone)
        await this.saveOrUpdateMember(connection, member, data)
      })
    })
  }

  public async updateMemberStatus(
    id: number,
    status: MemberStatus,
    operatorId: number,
    reason?: string
  ): Promise<void> {
    return this.wrapError(async () => {
      await this.dbManager.transaction(async (connection) => {
        await this.processStatusUpdate(connection, { id, status, operatorId, reason })
      })
    })
  }
  //#endregion

  //#region Private Query Methods
  private async queryMembers(
    connection: Connection,
    params: MemberQueryParams
  ): Promise<MemberPaginationResult> {
    const { sql, values } = this.buildQuerySQL(params)
    const [total, list] = await Promise.all([
      this.getTotal(connection, sql, values),
      this.getList(connection, sql, values, params)
    ])

    return {
      list,
      total,
      page: params.page || 1,
      pageSize: params.pageSize || 10
    }
  }

  private async findMemberByPhone(
    connection: Connection,
    phone: string
  ): Promise<MemberRecord | null> {
    const [members] = await connection.execute<MemberRecord[]>(
      'SELECT * FROM members WHERE phone = ?',
      [phone]
    )
    return members[0] || null
  }

  private async getMemberById(
    connection: Connection,
    id: number
  ): Promise<MemberRecord | null> {
    const [members] = await connection.execute<MemberRecord[]>(
      'SELECT * FROM members WHERE id = ?',
      [id]
    )
    return members[0] || null
  }
  //#endregion

  //#region Private Update Methods
  private async saveOrUpdateMember(
    connection: Connection,
    existingMember: MemberRecord | null,
    data: MemberBase
  ): Promise<void> {
    if (existingMember) {
      await this.updateMemberInfo(connection, existingMember.id, data)
    } else {
      await this.createMemberInfo(connection, data)
    }
  }

  private async updateMemberInfo(
    connection: Connection,
    id: number,
    data: MemberBase
  ): Promise<void> {
    const [result] = await connection.execute<ResultSetHeader>(
      `UPDATE members SET 
        name = ?,
        id_card = ?,
        address = ?,
        updated_at = NOW()
      WHERE id = ?`,
      [data.name || null, data.idCard || null, data.address || null, id]
    )

    this.checkAffectedRows(result, '更新会员信息失败')
    this.logUpdateSuccess(id, result)
  }

  private async createMemberInfo(
    connection: Connection,
    data: MemberBase
  ): Promise<void> {
    const [result] = await connection.execute<ResultSetHeader>(
      `INSERT INTO members (
        phone, name, id_card, address, type, status,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        data.phone,
        data.name || null,
        data.idCard || null,
        data.address || null,
        MemberType.NORMAL,
        MemberStatus.ACTIVE
      ]
    )

    this.checkAffectedRows(result, '创建会员信息失败')
    this.logCreateSuccess(result)
  }
  //#endregion

  //#region Validation Methods
  private validateMemberData(data: MemberBase): void {
    if (!this.isValidPhone(data.phone)) {
      throw new MemberServiceError(
        '无效的手机号格式',
        MemberErrorCode.INVALID_PHONE_FORMAT
      )
    }

    if (data.idCard && !this.isValidIdCard(data.idCard)) {
      throw new MemberServiceError(
        '无效的身份证号格式',
        MemberErrorCode.INVALID_ID_CARD_FORMAT
      )
    }

    this.logValidationSuccess(data)
  }

  private isValidPhone(phone: string): boolean {
    return /^1[3-9]\d{9}$/.test(phone)
  }

  private isValidIdCard(idCard: string): boolean {
    return /^\d{17}[\dXx]$/.test(idCard)
  }
  //#endregion

  //#region Utility Methods
  private async wrapError<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation()
    } catch (error) {
      this.handleError(error)
    }
  }

  private checkAffectedRows(result: ResultSetHeader, errorMessage: string): void {
    if (result.affectedRows === 0) {
      throw new MemberServiceError(errorMessage, MemberErrorCode.UPDATE_FAILED)
    }
  }

  private maskIdCard(idCard?: string): string {
    if (!idCard) return '未填写'
    return idCard.replace(/^(.{6})(.{8})(.{4})$/, '$1********$3')
  }
  //#endregion

  //#region Logging Methods
  private logValidationSuccess(data: MemberBase): void {
    console.log('✅ 数据验证通过:', {
      phone: data.phone,
      name: data.name || '未填写',
      idCard: this.maskIdCard(data.idCard),
      address: data.address || '未填写',
      timestamp: new Date().toISOString()
    })
  }

  private logUpdateSuccess(id: number, result: ResultSetHeader): void {
    console.log('✅ 会员信息更新成功:', {
      id,
      affectedRows: result.affectedRows,
      changedRows: result.changedRows,
      timestamp: new Date().toISOString()
    })
  }

  private logCreateSuccess(result: ResultSetHeader): void {
    console.log('✅ 会员信息创建成功:', {
      insertId: result.insertId,
      affectedRows: result.affectedRows,
      timestamp: new Date().toISOString()
    })
  }
  //#endregion

  //#region Helper Methods
  private async getTotal(
    connection: Connection,
    sql: string,
    values: any[]
  ): Promise<number> {
    const countSql = `SELECT COUNT(*) as total FROM (${sql}) as t`
    const [rows] = await connection.execute(countSql, values)
    return (rows as any)[0].total
  }

  private async getList(
    connection: Connection,
    sql: string,
    values: any[],
    params: MemberQueryParams
  ): Promise<MemberRecord[]> {
    const page = params.page || 1
    const pageSize = params.pageSize || 10
    const offset = (page - 1) * pageSize

    const listSql = `${sql} ORDER BY created_at DESC LIMIT ? OFFSET ?`
    const listValues = [...values, pageSize, offset]

    const [rows] = await connection.execute<MemberRecord[]>(listSql, listValues)
    return rows
  }

  private buildQuerySQL(params: MemberQueryParams): { sql: string; values: any[] } {
    const conditions: string[] = ['1=1']
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
      const searchFields = ['member_no', 'phone', 'name']
      const searchConditions = searchFields.map(field => `${field} LIKE ?`)
      conditions.push(`(${searchConditions.join(' OR ')})`)
      const keyword = `%${params.keyword}%`
      values.push(...searchFields.map(() => keyword))
    }

    const sql = `
      SELECT 
        id, phone, name, id_card, address, 
        type, status, created_at, updated_at
      FROM members 
      WHERE ${conditions.join(' AND ')}
    `

    return { sql, values }
  }

  private async processStatusUpdate(
    connection: Connection,
    params: {
      id: number
      status: MemberStatus
      operatorId: number
      reason?: string
    }
  ): Promise<void> {
    const member = await this.getMemberById(connection, params.id)
    if (!member) {
      throw new MemberServiceError(
        '会员不存在',
        MemberErrorCode.MEMBER_NOT_FOUND
      )
    }

    await this.updateStatus(connection, params.id, params.status)
    await this.logStatusChange(connection, {
      memberId: params.id,
      oldStatus: member.status,
      newStatus: params.status,
      operatorId: params.operatorId,
      reason: params.reason
    })

    this.logStatusUpdateSuccess(params.id, member.status, params.status, params.operatorId)
  }

  private async updateStatus(
    connection: Connection,
    id: number,
    status: MemberStatus
  ): Promise<void> {
    const [result] = await connection.execute<ResultSetHeader>(
      'UPDATE members SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, id]
    )

    if (result.affectedRows === 0) {
      throw new MemberServiceError(
        '更新会员状态失败',
        MemberErrorCode.UPDATE_FAILED
      )
    }
  },

  private async logStatusChange(
    connection: Connection,
    data: {
      memberId: number
      oldStatus: MemberStatus
      newStatus: MemberStatus
      operatorId: number
      reason?: string
    }
  ): Promise<void> {
    await connection.execute(
      `INSERT INTO member_status_logs (
        member_id, old_status, new_status, 
        operator_id, reason, created_at
      ) VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        data.memberId,
        data.oldStatus,
        data.newStatus,
        data.operatorId,
        data.reason || null
      ]
    )
  },

  private logStatusUpdateSuccess(
    id: number,
    oldStatus: MemberStatus,
    newStatus: MemberStatus,
    operatorId: number
  ): void {
    console.log('✅ 会员状态更新成功:', {
      id,
      oldStatus,
      newStatus,
      operator: operatorId,
      timestamp: new Date().toISOString()
    })
  },

  private handleError(error: any): never {
    console.error('❌ 服务层 - 保存会员信息失败:', error)
    
    if (error instanceof MemberServiceError) {
      throw error
    }
    
    throw new MemberServiceError(
      '保存会员信息失败',
      'SAVE_FAILED',
      error instanceof Error ? error.message : error
    )
  },
  //#endregion
}

// 导出单例实例
export const memberService = new MemberService() 