import axios from 'axios'
import type { ApiError } from '@/types'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL,  // 这里已经包含了 /api 前缀
  timeout: 30000,  // 增加到 30 秒
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true  // 允许跨域请求携带凭证
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log('Request:', {
      url: config.url,
      method: config.method,
      data: config.data
    })
    return config
  },
  error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    console.log('Response:', response.data)
    return response.data
  },
  error => {
    // 如果是 401 错误，说明 token 无效或过期
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout() // 清除登录状态
      const router = useRouter()
      router.push({
        name: 'login',
        query: { redirect: router.currentRoute.value.fullPath }
      })
    }
    console.error('Response error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    })
    const apiError: ApiError = {
      message: error.response?.data?.message || '请求失败',
      code: error.response?.data?.code,
      details: error.response?.data?.details
    }
    return Promise.reject(apiError)
  }
)

export default request 