<template>
  <div class="page-container">
    <div class="gradient-header"></div>
    
    <div class="setup-container">
      <h2 class="setup-title">设置账号信息</h2>
      
      <div class="setup-form">
        <!-- 用户名输入框 -->
        <div class="form-item">
          <input
            v-model="username"
            type="text"
            placeholder="请输入用户名"
            maxlength="20"
            class="input-field"
          >
        </div>

        <!-- 密码输入框 -->
        <div class="form-item">
          <input
            v-model="password"
            type="password"
            placeholder="请设置密码"
            maxlength="20"
            class="input-field"
          >
        </div>

        <!-- 确认密码输入框 -->
        <div class="form-item">
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="请确认密码"
            maxlength="20"
            class="input-field"
          >
        </div>

        <!-- 提交按钮 -->
        <button
          :disabled="!isValid || store.isLoading"
          @click="handleSubmit"
          class="submit-btn"
        >
          {{ store.isLoading ? '提交中...' : '完成' }}
        </button>

        <!-- 错误信息显示 -->
        <p v-if="store.errorMessage" class="error-message">
          {{ store.errorMessage }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'
import { Toast } from 'antd-mobile'

const router = useRouter()
const route = useRoute()
const store = useAuthStore()
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// 表单验证
const isValid = computed(() => {
  return username.value.length >= 2 && 
         password.value.length >= 6 && 
         password.value === confirmPassword.value
})

// 提交表单
const handleSubmit = async () => {
  try {
    const phone = store.phone || route.query.phone as string

    if (!phone || !username.value || !password.value) {
      console.log('Setup params:', {
        phone,
        username: username.value,
        password: password.value
      })
      Toast.show({
        content: '请填写完整信息',
        icon: 'error'
      })
      return
    }

    if (password.value !== confirmPassword.value) {
      Toast.show({
        content: '两次输入的密码不一致',
        icon: 'error'
      })
      return
    }

    console.log('Submitting setup:', {
      phone,
      username: username.value
    })

    const success = await store.setupUser(phone, username.value, password.value)
    if (success) {
      Toast.show({
        content: '设置成功',
        icon: 'success'
      })
      
      // 强制清除并重新初始化
      store.clearAuth()
      await store.initialize()
      
      console.log('Setup complete, auth state:', {
        isLoggedIn: store.isLoggedIn,
        user: store.user
      })
      
      router.push('/')
    }
  } catch (error: any) {
    console.error('Setup failed:', error)
    Toast.show({
      content: error.message || '设置失败，请重试',
      icon: 'error'
    })
  }
}

// 在组件挂载时检查是否有手机号
onMounted(() => {
  const phone = store.phone || route.query.phone
  if (!phone) {
    console.error('No phone number found')
    Toast.show({
      content: '缺少手机号，请重新登录',
      icon: 'error'
    })
    router.push('/login')
  }
})
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  position: relative;
  background-color: #fff;
}

.gradient-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(180deg, rgba(2, 197, 136, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
}

.setup-container {
  position: relative;
  max-width: 400px;
  margin: 0 auto;
  padding: 150px 20px 40px;
}

.setup-title {
  text-align: left;
  margin-bottom: 40px;
  font-size: 24px;
  color: #000000;
  font-weight: 500;
}

.setup-form {
  margin-top: 30px;
}

.form-item {
  margin-bottom: 20px;
}

.input-field {
  width: 100%;
  height: 44px;
  border: none;
  border-bottom: 1px solid #DCDFE6;
  font-size: 16px;
  background: transparent;
  padding: 0;
  transition: border-color 0.3s;
}

.input-field:focus {
  outline: none;
  border-bottom-color: #02C588;
}

.input-field::placeholder {
  color: #999;
}

.submit-btn {
  width: 100%;
  height: 44px;
  padding: 0;
  background-color: #02C588;
  color: white;
  border: none;
  border-radius: 22px;
  font-size: 16px;
  cursor: pointer;
  margin: 30px auto 0;
  display: block;
}

.submit-btn:disabled {
  background-color: rgba(2, 197, 136, 0.5);
  cursor: not-allowed;
}

.error-message {
  color: #F56C6C;
  text-align: center;
  margin-top: 10px;
}
</style> 