import dotenv from 'dotenv'

dotenv.config()

// 使用 require 导入
const SMSClient = require('@alicloud/sms-sdk')

class SmsService {
  private client: any

  constructor() {
    // 添加调试日志
    console.log('Initializing SMS service with config:', {
      accessKeyId: process.env.ALI_SMS_ACCESS_KEY_ID?.slice(0, 8) + '****',
      signName: process.env.ALI_SMS_SIGN_NAME,
      templateCode: process.env.ALI_SMS_TEMPLATE_LOGIN
    })

    if (!process.env.ALI_SMS_ACCESS_KEY_ID || !process.env.ALI_SMS_ACCESS_KEY_SECRET) {
      throw new Error('SMS credentials not configured')
    }

    this.client = new SMSClient({
      accessKeyId: process.env.ALI_SMS_ACCESS_KEY_ID,
      secretAccessKey: process.env.ALI_SMS_ACCESS_KEY_SECRET,
      endpoint: 'dysmsapi.aliyuncs.com',
      apiVersion: '2017-05-25'
    })
  }

  // 生成6位随机验证码
  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  // 发送验证码
  async sendVerificationCode(phone: string, code: string) {
    try {
      console.log(`Sending verification code to ${phone}`)
      
      if (!process.env.ALI_SMS_SIGN_NAME || !process.env.ALI_SMS_TEMPLATE_LOGIN) {
        throw new Error('SMS template configuration missing')
      }

      const params = {
        PhoneNumbers: phone,
        SignName: process.env.ALI_SMS_SIGN_NAME,
        TemplateCode: process.env.ALI_SMS_TEMPLATE_LOGIN,
        TemplateParam: JSON.stringify({ code })
      }

      console.log('SMS request params:', {
        ...params,
        PhoneNumbers: params.PhoneNumbers.slice(0, 3) + '****' + params.PhoneNumbers.slice(-4)
      })

      const result = await this.client.sendSMS(params)
      console.log('SMS send result:', result)

      if (result.Code !== 'OK') {
        throw new Error(`SMS send failed: ${result.Message}`)
      }

      return true
    } catch (error) {
      console.error('Send SMS error:', error)
      throw error
    }
  }
}

export const smsService = new SmsService() 