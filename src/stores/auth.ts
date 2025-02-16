import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi } from '@/api/auth'
import type { LoginResponse } from '@/api/auth'
import { Toast } from 'antd-mobile'
import { isTestPhone, verifyTestCode, getTestUser } from '@/utils/testData'
import type { UserInfo } from '@/types/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: (() => {
      const userStr = localStorage.getItem('userInfo')
      try {
        return userStr ? JSON.parse(userStr) : null
      } catch (e) {
        console.error('Failed to parse user info:', e)
        localStorage.removeItem('userInfo')
        return null
      }
    })(),
    phone: '',
    verificationCode: ref(''),
    isLoading: false,
    errorMessage: ''
  }),

  getters: {
    isLoggedIn(): boolean {
      return !!this.token && !!this.user
    },
    
    needSetup(): boolean {
      return this.isLoggedIn && (this.user?.needSetup || false)
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
        
        if (response.data) {
          const { token, user } = response.data
          this.setToken(token)
          this.setUserInfo(user)
          console.log('Login successful:', {
            isNewUser: user.isNewUser,
            needSetup: user.needSetup
          })
          return true
        }
        return false
      } catch (error: any) {
        console.error('Login error:', error)
        this.errorMessage = error.message || '登录失败'
        return false
      } finally {
        this.isLoading = false
      }
    },

    async setupUser(phone: string, username: string, password: string) {
      try {
        this.isLoading = true
        console.log('Setup user params:', { phone, username, password })
        
        const response = await authApi.setupUser({ 
          phone,
          username,
          password
        })
        
        if (response.success && response.data) {
          // 确保设置 token 和用户信息
          const { token, user } = response.data
          console.log('Setup successful:', { token: token.slice(0, 20), user })
          
          this.setToken(token)
          this.setUserInfo({
            ...user,
            needSetup: false  // 确保设置 needSetup 为 false
          })
          
          // 重新初始化用户状态
          await this.initialize()
          
          return true
        }
        return false
      } catch (error: any) {
        console.error('Setup user error:', error)
        this.errorMessage = error.message || '设置用户信息失败'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateUserInfo(username: string) {
      try {
        this.isLoading = true
        const response = await authApi.updateUser(username)
        
        if (response.success && response.data) {
          this.setUserInfo(response.data.user)
          return response
        } else {
          throw new Error(response.message || '更新用户信息失败')
        }
      } catch (error: any) {
        console.error('Update user error:', error)
        this.errorMessage = error.message || '更新用户信息失败，请重试'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    clearError() {
      this.errorMessage = ''
    },

    // 获取当前用户信息
    async getCurrentUser() {
      try {
        this.isLoading = true
        console.log('Getting current user with token:', this.token)
        const response = await authApi.getCurrentUser()
        
        console.log('Current user response:', response)
        
        if (response.success && response.data?.user) {
          const user = response.data.user
          console.log('Setting user info:', user)
          this.setUserInfo({
            ...user,
            needSetup: !user.username  // 根据是否有用户名来判断是否需要设置
          })
          return user
        }
        
        console.log('No user data, clearing auth')
        this.clearAuth()
        return null
      } catch (error) {
        console.error('Get current user error:', error)
        this.clearAuth()
        return null
      } finally {
        this.isLoading = false
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
      console.log('Checking user status:', {
        isLoggedIn: this.isLoggedIn,
        user: this.user,
        needSetup: this.user?.needSetup
      })
      
      if (!this.isLoggedIn) {
        return 'not-logged-in'
      }
      
      if (this.user?.needSetup) {
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
        if (response && response.token && response.user) {
          console.log('Login successful:', {
            token: response.token.slice(0, 20),
            user: response.user
          })
          
          this.setToken(response.token)
          this.setUserInfo(response.user)
          return true
        }
        
        this.errorMessage = '登录失败，请重试'
        return false
      } catch (error: any) {
        console.error('Password login error:', error)
        this.errorMessage = error.message || '登录失败'
        throw error
      } finally {
        this.isLoading = false
      }
    }
  }
}) 