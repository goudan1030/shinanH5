<template>
  <div class="page-container">
    <div class="gradient-header"></div>
    
    <div class="login-container">
      <h2 class="login-title">
        账号密码登录
      </h2>
      
      <div class="login-form">
        <!-- 手机号输入 -->
        <div class="form-item">
          <input
            v-model="phone"
            type="tel"
            placeholder="请输入手机号"
            maxlength="11"
            class="input-field"
          >
        </div>

        <!-- 密码输入 -->
        <div class="form-item">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="请输入密码"
            class="input-field"
          >
          <span 
            class="password-toggle"
            @click="showPassword = !showPassword"
          >
            {{ showPassword ? '隐藏' : '显示' }}
          </span>
        </div>

        <!-- 登录按钮 -->
        <button
          :disabled="!isFormValid || store.isLoading"
          @click="handleLogin"
          class="login-btn"
        >
          {{ store.isLoading ? '登录中...' : '登录' }}
        </button>

        <!-- 错误信息显示 -->
        <p v-if="store.errorMessage" class="error-message">
          {{ store.errorMessage }}
        </p>

        <!-- 返回验证码登录 -->
        <button
          @click="handleBackToSms"
          class="back-to-sms-btn"
        >
          验证码登录
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useAuthStore()
const phone = ref('')
const password = ref('')
const showPassword = ref(false)

// 表单验证
const isPhoneValid = computed(() => {
  return /^1[3-9]\d{9}$/.test(phone.value)
})

const isFormValid = computed(() => {
  return isPhoneValid.value && password.value.length >= 6
})

// 登录处理
const handleLogin = async () => {
  if (!isFormValid.value) return
  // TODO: 实现密码登录逻辑
}

// 返回验证码登录
const handleBackToSms = () => {
  router.push('/login')
}
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

.login-container {
  position: relative;
  max-width: 400px;
  margin: 0 auto;
  padding: 150px 20px 40px;
}

.login-title {
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

.login-btn {
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

.login-btn:disabled {
  background-color: rgba(2, 197, 136, 0.5);
  cursor: not-allowed;
}

.back-to-sms-btn {
  width: 100%;
  height: 44px;
  padding: 0;
  background-color: transparent;
  color: #02C588;
  border: none;
  font-size: 14px;
  cursor: pointer;
  margin-top: 20px;
}

.back-to-sms-btn:hover {
  opacity: 0.8;
}

.error-message {
  color: #F56C6C;
  text-align: center;
  margin-top: 10px;
}
</style> 