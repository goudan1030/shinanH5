import { RowDataPacket } from 'mysql2'

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

// 会员基础信息接口
export interface MemberBase {
  phone: string
  name?: string | null
  idCard?: string | null
  address?: string | null
}

// 会员记录接口
export interface MemberRecord extends RowDataPacket, MemberBase {
  id: number
  type: MemberType
  status: MemberStatus
  created_at: Date
  updated_at: Date
}

// 会员查询参数接口
export interface MemberQueryParams {
  page?: number
  pageSize?: number
  status?: MemberStatus
  type?: MemberType
  keyword?: string
}

// 会员分页结果接口
export interface MemberPaginationResult {
  list: MemberRecord[]
  total: number
  page: number
  pageSize: number
}

// 会员服务错误码
export enum MemberErrorCode {
  INVALID_PHONE_FORMAT = 'INVALID_PHONE_FORMAT',
  INVALID_ID_CARD_FORMAT = 'INVALID_ID_CARD_FORMAT',
  CREATE_FAILED = 'CREATE_FAILED',
  UPDATE_FAILED = 'UPDATE_FAILED',
  SAVE_FAILED = 'SAVE_FAILED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

// 会员服务错误类
export class MemberServiceError extends Error {
  constructor(
    message: string,
    public code: MemberErrorCode = MemberErrorCode.UNKNOWN_ERROR,
    public details?: any
  ) {
    super(message)
    this.name = 'MemberServiceError'
  }
} 