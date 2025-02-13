import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi } from '@/api/auth'
import { Toast } from 'antd-mobile'
import { isTestPhone, verifyTestCode, getTestUser } from '@/utils/testData'
import type { UserInfo } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const phone = ref('')
  const verificationCode = ref('')
  const isLoading = ref(false)
  const errorMessage = ref('')
  const userInfo = ref<UserInfo | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  // 发送验证码
  const sendVerificationCode = async (phoneNumber: string) => {
    try {
      isLoading.value = true
      console.log('Sending verification code to:', phoneNumber)

      // 如果是测试手机号，直接返回成功
      if (isTestPhone(phoneNumber)) {
        phone.value = phoneNumber
        errorMessage.value = ''
        Toast.show({
          content: '测试验证码已发送: 123456',
          icon: 'success'
        })
        return
      }

      // 真实手机号，调用 API
      await authApi.sendVerificationCode(phoneNumber)
      phone.value = phoneNumber
      errorMessage.value = ''
    } catch (error: any) {
      console.error('Send verification code error:', error)
      errorMessage.value = error.message || '发送验证码失败，请重试'
      Toast.show({
        content: errorMessage.value,
        icon: 'fail'
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 验证码登录
  const loginWithPhone = async (phoneNumber: string, code: string) => {
    try {
      isLoading.value = true

      // 如果是测试手机号，验证测试验证码
      if (isTestPhone(phoneNumber)) {
        if (!verifyTestCode(phoneNumber, code)) {
          throw new Error('验证码错误')
        }
        // 获取测试用户数据
        const testUser = getTestUser(phoneNumber)
        userInfo.value = testUser
        token.value = 'test_token'
        localStorage.setItem('token', token.value)
        return testUser
      }

      // 真实用户，调用 API
      const response = await authApi.loginWithPhone(phoneNumber, code)
      
      // 确保响应数据包含必要的字段
      if (!response.data || !response.data.token) {
        throw new Error('Invalid response from server')
      }

      // 更新状态
      userInfo.value = response.data.user
      token.value = response.data.token
      localStorage.setItem('token', token.value)
      errorMessage.value = ''

      return response.data.user
    } catch (error: any) {
      console.error('Login error:', error)
      errorMessage.value = error.message || '登录失败，请重试'
      Toast.show({
        content: errorMessage.value,
        icon: 'fail'
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 设置用户信息
  const setupUser = async (username: string, password: string) => {
    try {
      isLoading.value = true
      if (!userInfo.value?.phone) {
        Toast.show({
          content: '请先验证手机号',
          icon: 'fail'
        })
        throw new Error('请先验证手机号')
      }

      // 如果不是新用户，不允许设置信息
      if (!userInfo.value.isNewUser) {
        Toast.show({
          content: '用户已存在，无需设置信息',
          icon: 'fail'
        })
        throw new Error('用户已存在，无需设置信息')
      }

      // 如果是测试手机号，模拟设置用户信息
      if (isTestPhone(userInfo.value.phone)) {
        userInfo.value = {
          id: 1,
          phone: userInfo.value.phone,
          username,
          isNewUser: false
        }
        token.value = 'test_token_' + Date.now()
        localStorage.setItem('token', token.value)
        Toast.show({
          content: '设置成功',
          icon: 'success'
        })
        return userInfo.value
      }

      // 真实用户，调用 API
      const { data } = await authApi.setupUser(userInfo.value.phone, username, password)
      userInfo.value = data.user
      token.value = data.token
      localStorage.setItem('token', data.token)
      errorMessage.value = ''
      Toast.show({
        content: '设置成功',
        icon: 'success'
      })
      return data.user
    } catch (error: any) {
      console.error('Setup user failed:', error)
      errorMessage.value = error.message || '设置用户信息失败，请重试'
      Toast.show({
        content: errorMessage.value,
        icon: 'fail'
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 登出
  const logout = () => {
    userInfo.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  // 清除错误信息
  const clearError = () => {
    errorMessage.value = ''
  }

  return {
    // 状态
    phone,
    verificationCode,
    isLoading,
    errorMessage,
    userInfo,
    token,

    // 方法
    sendVerificationCode,
    loginWithPhone,
    setupUser,
    logout,
    clearError
  }
}) 