import OpenApi, { Config } from '@alicloud/openapi-client'
import Dysmsapi20170525, * as $Dysmsapi20170525 from '@alicloud/dysmsapi20170525'
import * as $tea from '@alicloud/tea-util'

class SmsService {
  private client: Dysmsapi20170525
  private config: {
    accessKeyId: string
    signName: string
    templateCode: string
  }

  constructor(config: { accessKeyId: string; signName: string; templateCode: string }) {
    console.log('\n=== 📱 初始化短信服务 ===')
    console.log('配置信息:', {
      accessKeyId: config.accessKeyId?.substring(0, 8) + '****',
      signName: config.signName,
      templateCode: config.templateCode,
      hasSecretKey: !!process.env.ALI_SMS_ACCESS_KEY_SECRET
    })

    // 验证配置
    if (!config.accessKeyId || !config.signName || !config.templateCode || !process.env.ALI_SMS_ACCESS_KEY_SECRET) {
      const missing: string[] = []
      if (!config.accessKeyId) missing.push('accessKeyId')
      if (!config.signName) missing.push('signName')
      if (!config.templateCode) missing.push('templateCode')
      if (!process.env.ALI_SMS_ACCESS_KEY_SECRET) missing.push('ALI_SMS_ACCESS_KEY_SECRET')
      
      throw new Error(`短信服务配置不完整，缺少: ${missing.join(', ')}`)
    }

    this.config = config
    
    try {
      const clientConfig = new Config({
        accessKeyId: config.accessKeyId,
        accessKeySecret: process.env.ALI_SMS_ACCESS_KEY_SECRET,
        endpoint: 'dysmsapi.aliyuncs.com',
        readTimeout: 10000,
        connectTimeout: 10000
      })

      this.client = new Dysmsapi20170525(clientConfig)
      console.log('✅ 短信服务初始化成功')
    } catch (error) {
      console.error('❌ 初始化短信客户端失败:', error)
      throw new Error('短信服务初始化失败')
    }
  }

  // 生成6位随机验证码
  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  // 发送验证码
  async sendVerificationCode(phone: string, code: string): Promise<void> {
    console.log('\n=== 📱 发送验证码 ===')
    console.log('手机号:', phone)
    console.log('验证码:', code)
    
    try {
      const sendSmsRequest = new $Dysmsapi20170525.SendSmsRequest({
        phoneNumbers: phone,
        signName: this.config.signName,
        templateCode: this.config.templateCode,
        templateParam: JSON.stringify({ code })
      })

      const runtime = new $tea.RuntimeOptions({
        readTimeout: 10000,
        connectTimeout: 10000,
        maxAttempts: 3
      })

      const result = await this.client.sendSmsWithOptions(sendSmsRequest, runtime)
      
      if (!result?.body?.code || result.body.code !== 'OK') {
        console.error('发送短信失败:', {
          code: result?.body?.code,
          message: result?.body?.message,
          requestId: result?.body?.requestId
        })
        throw new Error(`发送短信失败: ${result?.body?.message || '未知错误'}`)
      }

      console.log('✅ 短信发送成功:', {
        requestId: result.body.requestId,
        bizId: result.body.bizId
      })
    } catch (error) {
      console.error('短信服务错误:', error)
      
      if (error instanceof Error) {
        if (error.message.includes('InvalidAccessKeyId')) {
          throw new Error('短信服务配置错误，请联系管理员')
        } else if (error.message.includes('isv.MOBILE_NUMBER_ILLEGAL')) {
          throw new Error('手机号格式错误')
        } else if (error.message.includes('isv.BUSINESS_LIMIT_CONTROL')) {
          throw new Error('发送太频繁，请稍后再试')
        }
      }
      
      throw new Error('发送短信失败，请稍后重试')
    }
  }
}

// 创建单例实例的工厂函数
function createSmsService() {
  const config = {
    accessKeyId: process.env.ALI_SMS_ACCESS_KEY_ID || '',
    signName: process.env.ALI_SMS_SIGN_NAME || '',
    templateCode: process.env.ALI_SMS_TEMPLATE_LOGIN || ''
  }

  // 验证所有必需的环境变量
  const missing: string[] = []
  if (!config.accessKeyId) missing.push('ALI_SMS_ACCESS_KEY_ID')
  if (!config.signName) missing.push('ALI_SMS_SIGN_NAME')
  if (!config.templateCode) missing.push('ALI_SMS_TEMPLATE_LOGIN')
  if (!process.env.ALI_SMS_ACCESS_KEY_SECRET) missing.push('ALI_SMS_ACCESS_KEY_SECRET')

  if (missing.length > 0) {
    throw new Error(`环境变量缺失: ${missing.join(', ')}。请检查 .env 文件。`)
  }

  // 这里使用类型断言，因为我们已经验证了所有值都存在
  return new SmsService(config as {
    accessKeyId: string
    signName: string
    templateCode: string
  })
}

// 创建单例实例
let smsServiceInstance: SmsService | null = null

export const smsService = {
  generateVerificationCode(): string {
    if (!smsServiceInstance) {
      smsServiceInstance = createSmsService()
    }
    return smsServiceInstance.generateVerificationCode()
  },

  async sendVerificationCode(phone: string, code: string): Promise<void> {
    if (!smsServiceInstance) {
      smsServiceInstance = createSmsService()
    }
    return smsServiceInstance.sendVerificationCode(phone, code)
  }
} 