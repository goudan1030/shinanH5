<template>
  <div class="page-container">
    <div class="gradient-header"></div>
    
    <div class="setup-container">
      <h2 class="setup-title">设置账号信息</h2>
      
      <div class="setup-form">
        <!-- 用户名输入 -->
        <div class="form-item">
          <input
            v-model="username"
            type="text"
            placeholder="请设置用户名"
            class="input-field"
          >
        </div>

        <!-- 密码输入 -->
        <div class="form-item">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="请设置密码"
            class="input-field"
          >
          <span 
            class="password-toggle"
            @click="showPassword = !showPassword"
          >
            {{ showPassword ? '隐藏' : '显示' }}
          </span>
        </div>

        <!-- 确认密码 -->
        <div class="form-item">
          <input
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="请确认密码"
            class="input-field"
          >
          <span 
            class="password-toggle"
            @click="showConfirmPassword = !showConfirmPassword"
          >
            {{ showConfirmPassword ? '隐藏' : '显示' }}
          </span>
        </div>

        <!-- 提交按钮 -->
        <button
          :disabled="!isFormValid || store.isLoading"
          @click="handleSubmit"
          class="setup-btn"
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
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { Toast } from 'antd-mobile'

const router = useRouter()
const store = useAuthStore()
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// 表单验证
const isFormValid = computed(() => {
  return username.value.length >= 2 && 
         password.value.length >= 6 && 
         password.value === confirmPassword.value
})

// 提交表单
const handleSubmit = async () => {
  try {
    if (!username.value || !password.value) {
      Toast.show({
        content: '请填写完整信息',
        icon: 'fail'
      })
      return
    }

    if (password.value !== confirmPassword.value) {
      Toast.show({
        content: '两次输入的密码不一致',
        icon: 'fail'
      })
      return
    }

    store.isLoading = true
    await store.setupUser(username.value, password.value)
    // 设置成功后跳转到首页
    router.push('/home')
  } catch (error) {
    console.error('Setup failed:', error)
  } finally {
    store.isLoading = false
  }
}
</script>

<style scoped>
/* 复用之前的样式 */
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
  line-height: 1.4;
}

.form-item {
  margin-bottom: 20px;
  position: relative;
}

.input-field {
  width: 100%;
  height: 44px;
  border: none;
  border-bottom: 1px solid #ddd;
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

.password-toggle {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
}

.setup-btn {
  width: 100%;
  height: 44px;
  padding: 0;
  background-color: #02C588;
  color: white;
  border: none;
  border-radius: 22px;
  font-size: 16px;
  cursor: pointer;
  margin: 0 auto 15px;
  display: block;
}

.setup-btn:disabled {
  background-color: rgba(2, 197, 136, 0.5);
  cursor: not-allowed;
}

.error-message {
  color: #F56C6C;
  text-align: center;
  margin-top: 10px;
}
</style> 