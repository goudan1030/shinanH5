<template>
  <SafeArea>
    <div class="page-container">
      <!-- 添加顶部渐变背景 -->
      <div class="gradient-header"></div>
      
      <div class="login-container">
        <h2 class="login-title">
          你好，<br>
          欢迎来到互助圈
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
          
          <!-- 隐私政策确认 -->
          <div class="privacy-agreement">
            <label class="checkbox-wrapper">
              <input 
                type="checkbox" 
                v-model="isAgreed"
                class="checkbox-input"
              >
              <span class="checkbox-custom"></span>
            </label>
            <span class="agreement-text">
              我已阅读并同意
              <a @click.prevent="handleOpenPrivacy" class="link">《隐私政策》</a>
              和
              <a @click.prevent="handleOpenTerms" class="link">《用户协议》</a>
            </span>
          </div>
          
          <!-- 获取验证码按钮 -->
          <button
            :disabled="!isPhoneValid || !isAgreed || store.isLoading"
            @click="handleGetCode"
            class="login-btn"
          >
            {{ store.isLoading ? '发送中...' : '获取验证码' }}
          </button>

          <!-- 微信登录按钮 (仅在微信环境下显示) -->
          <button
            v-if="isWechat"
            @click="handleWechatLogin"
            class="wechat-login-btn"
            :disabled="store.isLoading"
          >
            微信登录
          </button>

          <!-- 错误信息显示 -->
          <p v-if="store.errorMessage" class="error-message">
            {{ store.errorMessage }}
          </p>

          <!-- 添加账号密码登录按钮 -->
          <button
            @click="handlePasswordLogin"
            class="password-login-btn"
          >
            账号密码登录
          </button>
        </div>
      </div>
    </div>
  </SafeArea>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { isWechatBrowser } from '@/utils/environment'
import { useRouter } from 'vue-router'
import SafeArea from '@/components/layout/SafeArea.vue'

const router = useRouter()
const store = useAuthStore()
const phone = ref('')
const isWechat = isWechatBrowser()
const isAgreed = ref(false)

// 手机号验证
const isPhoneValid = computed(() => {
  return /^1[3-9]\d{9}$/.test(phone.value)
})

// 获取验证码并跳转
const handleGetCode = async () => {
  if (!isPhoneValid.value) return
  
  try {
    await store.sendVerificationCode(phone.value)
    // 只有发送成功才跳转
    router.push({
      name: 'verify-code',
      query: { phone: phone.value }
    })
  } catch (error) {
    console.error('Get code error:', error)
    // 发送失败时不跳转，错误信息已经在 store 中设置
  }
}

// 微信登录
const handleWechatLogin = async () => {
  await store.loginWithWechat()
}

// 打开隐私政策
const handleOpenPrivacy = () => {
  router.push('/privacy-policy')
}

// 打开用户协议
const handleOpenTerms = () => {
  router.push('/terms-of-service')
}

// 账号密码登录跳转
const handlePasswordLogin = () => {
  router.push('/password-login')
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

.wechat-login-btn {
  width: 100%;
  padding: 12px;
  background-color: #07C160;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.wechat-login-btn:disabled {
  background-color: #95d5b2;
  cursor: not-allowed;
}

.error-message {
  color: #F56C6C;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
}

.privacy-agreement {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
}

.checkbox-wrapper {
  position: relative;
  width: 16px;
  height: 16px;
  margin-right: 8px;
  flex-shrink: 0;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkbox-custom {
  position: absolute;
  top: 0;
  left: 0;
  height: 16px;
  width: 16px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 2px;
  transition: all 0.3s;
}

.checkbox-input:checked ~ .checkbox-custom {
  background-color: #02C588;
  border-color: #02C588;
}

.checkbox-custom:after {
  content: "";
  position: absolute;
  display: none;
  left: 5px;
  top: 2px;
  width: 3px;
  height: 7px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-input:checked ~ .checkbox-custom:after {
  display: block;
}

.agreement-text {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

.link {
  color: #02C588;
  text-decoration: none;
  cursor: pointer;
}

.link:hover {
  opacity: 0.8;
}

.password-login-btn {
  width: 100%;
  height: 44px;
  padding: 0;
  background-color: transparent;
  color: #02C588;
  border: none;
  font-size: 14px;
  cursor: pointer;
  margin-top: 0;
}

.password-login-btn:hover {
  opacity: 0.8;
}
</style> 