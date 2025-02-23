import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '@/api/auth'
import type { LoginResponse } from '@/api/auth'
import { Toast } from 'antd-mobile'
import { isTestPhone, verifyTestCode, getTestUser } from '@/utils/testData'
import type { UserInfo, MemberInfo } from '@/types/auth'
import { memberApi } from '@/api/member'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: null as UserInfo | null,
    phone: '',
    verificationCode: ref(''),
    isLoading: false,
    errorMessage: '',
    needSetup: false
  }),

  getters: {
    isLoggedIn(): boolean {
      return !!this.token && !!this.user
    },
    
    needSetup(): boolean {
      return this.isLoggedIn && (this.user?.needSetup || false)
    },

    isNeedSetup(): boolean {
      return this.user?.needSetup || false
    }
  },

  actions: {
    async initialize() {
      console.log('Initializing auth store...')
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          console.log('No token found, clearing auth')
          this.clearAuth()
          return false
        }

        console.log('Token found:', token.substring(0, 20) + '...')
        this.setToken(token)
        
        const user = await this.getCurrentUser()
        console.log('Initialize complete:', {
          token: this.token ? this.token.substring(0, 20) + '...' : null,
          user: this.user,
          isLoggedIn: this.isLoggedIn
        })
        
        return !!user
      } catch (error) {
        console.error('Initialize error:', error)
        this.clearAuth()
        return false
      }
    },

    setToken(token: string) {
      this.token = token
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    },

    setUserInfo(user: UserInfo | null) {
      console.log('Setting user info:', user)
      this.user = user
      if (user) {
        localStorage.setItem('userInfo', JSON.stringify(user))
      } else {
        localStorage.removeItem('userInfo')
      }
    },

    clearAuth() {
      console.log('Clearing auth state')
      this.token = ''
      this.user = null
      this.phone = ''
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    },

    async sendVerificationCode(phone: string) {
      try {
        this.isLoading = true
        console.log('Sending verification code to:', phone)

        await authApi.sendCode(phone)
        this.phone = phone
        this.errorMessage = ''
      } catch (error: any) {
        console.error('Send verification code error:', error)
        // 如果是超时错误，且用户已收到短信，视为成功
        if (error.message.includes('timeout')) {
          this.phone = phone
          this.errorMessage = ''
          return
        }
        this.errorMessage = error.message || '发送验证码失败，请重试'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async loginWithPhone(phone: string, code: string) {
      this.isLoading = true
      this.errorMessage = ''
      
      try {
        console.log('Attempting phone login:', { phone, code })
        const response = await authApi.loginWithPhone({ phone, code })
        
        console.log('Login response:', response)
        
        if (response.success) {
          // 如果需要设置账号信息
          if (response.data.needSetup) {
            console.log('User needs setup:', response.data)
            // 设置临时 token（如果有的话）
            if (response.data.token) {
              this.setToken(response.data.token)
            }
            
            this.setUserInfo({
              ...response.data.user,
              needSetup: true
            })
            return true
          }
          
          // 正常登录情况
          if (response.data.token && response.data.user) {
            const { token, user } = response.data
            console.log('Normal login:', {
              token: token.slice(0, 20),
              user
            })
            
            this.setToken(token)
            this.setUserInfo({
              ...user,
              needSetup: false
            })
            return true
          }
        }
        
        this.errorMessage = response.message || '登录失败：服务器响应异常'
        return false
      } catch (error: any) {
        console.error('Login error:', error)
        this.errorMessage = error.response?.data?.message || error.message || '登录失败'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async setupUser(phone: string, username: string, password: string) {
      try {
        this.isLoading = true
        console.log('Setup user params:', { phone, username, password })
        
        // 确保在发送请求时带上临时 token
        const token = this.token
        console.log('Setup with token:', token ? token.slice(0, 20) + '...' : 'no token')
        
        const response = await authApi.setupUser({ 
          phone,
          username,
          password
        }, token) // 传递 token 到 API 请求
        
        if (response.success && response.data) {
          // 确保设置 token 和用户信息
          const { token: newToken, user } = response.data
          console.log('Setup successful:', { 
            token: newToken.slice(0, 20), 
            user 
          })
          
          this.setToken(newToken)
          this.setUserInfo({
            ...user,
            needSetup: false  // 确保设置 needSetup 为 false
          })
          
          return true
        }
        return false
      } catch (error: any) {
        console.error('Setup user error:', error)
        // 如果是未登录错误，尝试使用手机号重新获取临时 token
        if (error.message === '未登录') {
          try {
            // 重新获取临时 token
            const tempResponse = await authApi.getTempToken(phone)
            if (tempResponse.success && tempResponse.data?.token) {
              this.setToken(tempResponse.data.token)
              // 重试设置用户信息
              return this.setupUser(phone, username, password)
            }
          } catch (retryError) {
            console.error('Retry setup failed:', retryError)
          }
        }
        this.errorMessage = error.message || '设置用户信息失败'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateUserInfo(data: { nickname?: string }) {
      try {
        const response = await authApi.updateUserInfo(data)
        if (response.success) {
          this.user = response.data.user
          return this.user
        }
        throw new Error(response.message || '更新失败')
      } catch (error) {
        console.error('更新用户信息失败:', error)
        throw error
      }
    },

    clearError() {
      this.errorMessage = ''
    },

    // 获取当前用户信息
    async getCurrentUser() {
      try {
        const response = await authApi.getCurrentUser()
        if (response.success) {
          this.user = response.data.user
          return this.user
        }
        return null
      } catch (error) {
        console.error('获取用户信息失败:', error)
        throw error
      }
    },

    // 检查登录状态
    async checkAuth() {
      if (!this.token) {
        return false
      }
      
      try {
        const user = await this.getCurrentUser()
        return !!user
      } catch (error) {
        console.error('Check auth error:', error)
        this.logout()
        return false
      }
    },

    // 添加检查用户状态的方法
    checkUserStatus() {
      if (!this.user) {
        return 'not-logged-in'
      }
      
      if (this.user.needSetup) {
        return 'need-setup'
      }
      
      return 'active'
    },

    async loginWithPassword(phone: string, password: string) {
      this.isLoading = true
      this.errorMessage = ''
      
      try {
        console.log('Attempting password login:', { phone })
        const response = await authApi.loginWithPassword(phone, password)
        
        console.log('Password login response:', response)
        
        // 检查 response 的结构
        if (response.data && response.data.token && response.data.user) {
          console.log('Login successful:', {
            token: response.data.token.slice(0, 20),
            user: response.data.user
          })
          
          this.setToken(response.data.token)
          this.setUserInfo(response.data.user)
          return true
        }
        
        this.errorMessage = response.message || '登录失败，请重试'
        return false
      } catch (error: any) {
        console.error('Password login error:', error)
        this.errorMessage = error.response?.data?.message || error.message || '登录失败'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // 添加微信登录方法
    async loginWithWechat() {
      this.isLoading = true
      try {
        // TODO: 实现微信登录逻辑
        console.log('微信登录')
      } catch (error: any) {
        this.errorMessage = error.message || '登录失败'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // 用户登出方法
    logout() {
      console.log('User logging out')
      this.clearAuth()
    },

    // 添加保存会员信息的方法
    async saveMemberInfo(data: MemberInfo) {
      try {
        this.isLoading = true
        this.errorMessage = ''

        console.log('Store层 - 开始保存会员信息:', data)
        const response = await memberApi.saveMemberInfo(data)

        if (!response.success) {
          throw new Error(response.message || '保存失败')
        }

        console.log('Store层 - 会员信息保存成功')
        return true
      } catch (error: any) {
        console.error('Store层 - 保存会员信息失败:', error)
        this.errorMessage = error.message || '保存失败，请重试'
        throw error
      } finally {
        this.isLoading = false
      }
    }
  }
})