import { Database } from '../utils/db'
import { ResultSetHeader } from 'mysql2'
import { MemberType, MemberStatus, MemberServiceError, MemberErrorCode } from '../types/member'

interface RegisterInfo {
  name?: string
  gender?: string[]
  birthday?: string
  height?: string
  weight?: string
  orientation?: string[]
  occupation?: string
  education?: string
  maritalStatus?: string[]
  residence?: string[]
  hometown?: string[]
  assets?: string[]
  expectedLocation?: string
  childIntent?: string[]
  marriageRequirement?: string[]
  selfIntro?: string
  expectations?: string
  wechat?: string
  contactPhone?: string
}

// 定义清理后的数据接口
interface CleanedData {
  name: string | null
  occupation: string | null
  education: string | null
  expectedLocation: string | null
  selfIntro: string | null
  expectations: string | null
  wechat: string | null
  contactPhone: string | null
  height: number | null
  weight: number | null
  province: string | null
  city: string | null
  district: string | null
  gender: string | null
  hukou_province: string | null
  hukou_city: string | null
  sexual_orientation: string | null
  marriage_history: string | null
  house_car: string | null
  children_plan: string | null
  marriage_cert: string | null
  birth_year: number | null
}

class RegisterService {
  async saveRegisterInfo(userId: number, data: RegisterInfo) {
    const pool = await Database.getInstance()
    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      // 数据验证
      console.log('验证数据...')
      this.validateData(data)

      // 清理和格式化数据
      const cleanData = this.cleanData(data)

      // 生成会员编号
      const memberNo = this.generateMemberNo()

      // 保存数据
      console.log('\n=== 保存数据 ===')
      console.log('处理后的数据:', cleanData)

      const [result] = await connection.execute<ResultSetHeader>(
        `INSERT INTO members (
          member_no, type, status, nickname,
          province, city, district, gender,
          target_area, birth_year, height, weight,
          education, occupation, house_car,
          hukou_province, hukou_city,
          children_plan, marriage_cert,
          self_description, partner_requirement,
          wechat, phone, marriage_history,
          sexual_orientation, created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?,
          ?, ?,
          ?, ?,
          ?, ?,
          ?, ?, ?,
          ?, NOW(), NOW()
        )`,
        [
          this.generateMemberNo(),
          MemberType.NORMAL,
          MemberStatus.ACTIVE,
          cleanData.name,
          cleanData.province,
          cleanData.city,
          cleanData.district,
          cleanData.gender,
          cleanData.expectedLocation,
          cleanData.birth_year,
          cleanData.height,
          cleanData.weight,
          cleanData.education,
          cleanData.occupation,
          cleanData.house_car,
          cleanData.hukou_province,
          cleanData.hukou_city,
          cleanData.children_plan,
          cleanData.marriage_cert,
          cleanData.selfIntro,
          cleanData.expectations,
          cleanData.wechat,
          cleanData.contactPhone,
          cleanData.marriage_history,
          cleanData.sexual_orientation
        ]
      )

      await connection.commit()
      
      console.log('✅ 保存成功')
      return {
        success: true,
        message: '保存成功',
        data: { id: result.insertId, memberNo }
      }

    } catch (error: unknown) {  // 明确指定 error 类型
      // 发生错误时回滚事务
      console.error('\n=== ❌ 保存失败 ===')
      console.error('错误详情:', error)
      await connection.rollback()
      
      // 转换错误类型
      if (error instanceof MemberServiceError) {
        throw error
      } else if (error instanceof Error && 'code' in error && error.code === 'ER_DUP_ENTRY') {
        throw new MemberServiceError(
          '该手机号已被注册',
          MemberErrorCode.INVALID_PHONE_FORMAT,
          { field: 'contactPhone' }
        )
      } else {
        const err = error instanceof Error ? error : new Error('未知错误')
        throw new MemberServiceError(
          '保存失败，请稍后重试',
          MemberErrorCode.SAVE_FAILED,
          err
        )
      }
    } finally {
      // 释放连接
      connection.release()
      console.log('数据库连接已释放')
    }
  }

  // 数据清理方法
  private cleanData(data: RegisterInfo): CleanedData {
    // 创建基础对象，所有值默认为 null
    const cleanedData: CleanedData = {
      name: null,
      occupation: null,
      education: null,
      expectedLocation: null,
      selfIntro: null,
      expectations: null,
      wechat: null,
      contactPhone: null,
      height: null,
      weight: null,
      province: null,
      city: null,
      district: null,
      gender: null,
      hukou_province: null,
      hukou_city: null,
      sexual_orientation: null,
      marriage_history: null,
      house_car: null,
      children_plan: null,
      marriage_cert: null,
      birth_year: null
    }

    // 处理字符串字段
    if (data.name) cleanedData.name = data.name.trim()
    if (data.occupation) cleanedData.occupation = data.occupation.trim()
    if (data.education) cleanedData.education = data.education.trim()
    if (data.expectedLocation) cleanedData.expectedLocation = data.expectedLocation.trim()
    if (data.selfIntro) cleanedData.selfIntro = data.selfIntro.trim()
    if (data.expectations) cleanedData.expectations = data.expectations.trim()
    if (data.wechat) cleanedData.wechat = data.wechat.trim()
    if (data.contactPhone) cleanedData.contactPhone = data.contactPhone.trim()
    
    // 处理数值字段
    if (data.height) cleanedData.height = Math.round(Number(data.height))
    if (data.weight) cleanedData.weight = Math.round(Number(data.weight))
    if (data.birthday) cleanedData.birth_year = new Date(data.birthday).getFullYear()
    
    // 处理数组字段
    if (data.residence?.length) {
      const [province, city, district] = data.residence
      cleanedData.province = province || null
      cleanedData.city = city || null
      cleanedData.district = district || null
    }
    
    if (data.hometown?.length) {
      const [province, city] = data.hometown
      cleanedData.hukou_province = province || null
      cleanedData.hukou_city = city || null
    }

    // 处理其他字段
    if (data.gender?.length) cleanedData.gender = data.gender[0]
    if (data.orientation?.length) cleanedData.sexual_orientation = data.orientation[0]
    if (data.maritalStatus?.length) cleanedData.marriage_history = data.maritalStatus[0]
    if (data.assets?.length) cleanedData.house_car = data.assets[0]
    if (data.childIntent?.length) cleanedData.children_plan = data.childIntent[0]
    if (data.marriageRequirement?.length) cleanedData.marriage_cert = data.marriageRequirement[0]

    return cleanedData
  }

  // 数据验证方法
  private validateData(data: RegisterInfo) {
    // 验证必填字段
    if (data.contactPhone && !/^1[3-9]\d{9}$/.test(data.contactPhone)) {
      throw new MemberServiceError(
        '手机号格式不正确',
        MemberErrorCode.INVALID_PHONE_FORMAT,
        { field: 'contactPhone', value: data.contactPhone }
      )
    }

    // 验证数值范围
    if (data.height) {
      const height = Number(data.height)
      if (isNaN(height) || height < 140 || height > 220) {
        throw new MemberServiceError(
          '身高必须在140-220cm之间',
          MemberErrorCode.INVALID_DATA,
          { field: 'height', value: data.height }
        )
      }
    }

    if (data.weight) {
      const weight = Number(data.weight)
      if (isNaN(weight) || weight < 30 || weight > 150) {
        throw new MemberServiceError(
          '体重必须在30-150kg之间',
          MemberErrorCode.INVALID_DATA,
          { field: 'weight', value: data.weight }
        )
      }
    }

    // 验证文本长度
    if (data.selfIntro && data.selfIntro.length > 500) {
      throw new MemberServiceError(
        '自我介绍不能超过500字',
        MemberErrorCode.INVALID_DATA,
        { field: 'selfIntro', length: data.selfIntro.length }
      )
    }

    if (data.expectations && data.expectations.length > 500) {
      throw new MemberServiceError(
        '期望对象描述不能超过500字',
        MemberErrorCode.INVALID_DATA,
        { field: 'expectations', length: data.expectations.length }
      )
    }

    // 验证微信号格式
    if (data.wechat && !/^[a-zA-Z][\w-]{5,19}$/.test(data.wechat)) {
      throw new MemberServiceError(
        '微信号格式不正确',
        MemberErrorCode.INVALID_DATA,
        { field: 'wechat', value: data.wechat }
      )
    }
  }

  // 生成会员编号
  private generateMemberNo(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `M${timestamp}${random}`;
  }
}

export const registerService = new RegisterService() 