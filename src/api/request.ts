import axios from 'axios'
import type { ApiResponse } from './types'
import { useAuthStore } from '@/stores/auth'
import { Toast } from 'antd-mobile'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    console.log('Request:', {
      url: config.url,
      method: config.method,
      data: config.data
    })

    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
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
    console.error('Response error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    })

    // 处理特定错误
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
      Toast.show({
        content: '登录已过期，请重新登录',
        icon: 'fail'
      })
    } else {
      Toast.show({
        content: error.response?.data?.message || '请求失败',
        icon: 'fail'
      })
    }

    return Promise.reject(error.response?.data || error)
  }
)

export default request 