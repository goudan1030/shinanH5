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

// 错误码枚举
export enum MemberErrorCode {
  INVALID_PHONE_FORMAT = 'INVALID_PHONE_FORMAT',
  INVALID_ID_CARD_FORMAT = 'INVALID_ID_CARD_FORMAT',
  MEMBER_NOT_FOUND = 'MEMBER_NOT_FOUND',
  SAVE_FAILED = 'SAVE_FAILED',
  UPDATE_FAILED = 'UPDATE_FAILED',
  INVALID_DATA = 'INVALID_DATA'
}

// 服务错误类
export class MemberServiceError extends Error {
  constructor(
    message: string, 
    public code: MemberErrorCode = MemberErrorCode.SAVE_FAILED,
    public details?: any
  ) {
    super(message)
    this.name = 'MemberServiceError'
  }
}

// 基础会员信息接口
export interface MemberBase {
  phone: string
  name?: string
  idCard?: string
  address?: string
  wechat?: string
  contactPhone?: string
}

// 会员记录接口
export interface MemberRecord extends MemberBase {
  id: number
  type: MemberType
  status: MemberStatus
  created_at: Date
  updated_at: Date
}

// 查询参数接口
export interface MemberQueryParams {
  page?: number
  pageSize?: number
  status?: MemberStatus
  type?: MemberType
  keyword?: string
}

// 分页结果接口
export interface MemberPaginationResult {
  list: MemberRecord[]
  total: number
  page: number
  pageSize: number
} 