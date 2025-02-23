<template>
  <div class="page-container">
    <div class="gradient-header"></div>
    
    <div class="verify-container">
      <h2 class="verify-title">
        输入验证码<br>
        <span class="phone-number">{{ formatPhone }}</span>
      </h2>
      
      <div class="code-input-container">
        <input 
          v-for="(digit, index) in 6" 
          :key="index"
          ref="inputs"
          type="text"
          maxlength="1"
          :value="code[index] || ''"
          @input="handleInput($event, index)"
          @keydown="handleKeydown($event, index)"
          @paste="handlePaste"
          class="code-input"
        >
      </div>

      <p class="resend-tip">
        {{ countdown > 0 ? `${countdown}秒后可重新发送` : '没有收到验证码？' }}
        <button 
          v-if="countdown === 0"
          @click="handleResend" 
          class="resend-btn"
          :disabled="isLoading"
        >
          重新发送
        </button>
      </p>

      <p class="notice-text">未注册手机号验证后会自动创建账号</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Toast } from 'antd-mobile'

const router = useRouter()
const store = useAuthStore()
const inputs = ref<HTMLInputElement[]>([])
const code = ref('')
const countdown = ref(60)
const timer = ref<number | null>(null)
const isLoading = ref(false)
const codeArray = ref<string[]>(Array(6).fill(''))

const formatPhone = computed(() => {
  const phone = store.phone
  return phone ? `${phone.slice(0, 3)}****${phone.slice(-4)}` : ''
})

// 处理输入
const handleInput = async (event: Event, index: number) => {
  const input = event.target as HTMLInputElement
  const value = input.value

  // 确保只接受数字
  if (!/^\d*$/.test(value)) {
    input.value = ''
    return
  }

  // 更新验证码数组
  codeArray.value[index] = value
  
  // 更新完整的验证码字符串
  code.value = codeArray.value.join('')

  console.log('Current code:', code.value)

  // 如果是最后一位且验证码已满6位，自动提交
  if (index === 5 && code.value.length === 6) {
    await verifyCode()
  } else if (value && index < 5) {
    // 自动跳到下一个输入框
    inputs.value[index + 1]?.focus()
  }
}

// 处理键盘事件
const handleKeydown = (event: KeyboardEvent, index: number) => {
  if (event.key === 'Backspace' && !codeArray.value[index] && index > 0) {
    inputs.value[index - 1].focus()
  }
}

// 处理粘贴
const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text')
  if (!pastedData || !/^\d{6}$/.test(pastedData)) return

  // 更新验证码数组和显示
  const digits = pastedData.split('')
  codeArray.value = digits
  code.value = pastedData

  // 更新输入框显示
  digits.forEach((char, index) => {
    if (inputs.value[index]) {
      inputs.value[index].value = char
    }
  })

  verifyCode()
}

// 验证码验证
const verifyCode = async () => {
  try {
    console.log('Verifying code:', {
      phone: store.phone,
      code: code.value
    })
    
    const success = await store.loginWithPhone(store.phone, code.value)
    console.log('Login result:', {
      success,
      user: store.user,
      needSetup: store.user?.needSetup
    })

    if (success) {
      // 检查是否需要设置账号信息
      if (store.user?.needSetup) {
        console.log('需要设置账号信息，跳转到设置页面')
        await router.replace({
          name: 'setup-user',
          query: { phone: store.phone }
        })
      } else {
        console.log('登录成功，跳转到首页')
        await router.replace('/')
      }
    } else {
      Toast.show({
        content: store.errorMessage || '登录失败，请重试',
        icon: 'fail'
      })
    }
  } catch (error: any) {
    console.error('Verification failed:', error)
    Toast.show({
      content: error.message || '验证失败，请重试',
      icon: 'fail'
    })
  }
}

// 重新发送
const handleResend = async () => {
  try {
    isLoading.value = true
    console.log('Resending code to:', store.phone)
    await store.sendVerificationCode(store.phone)
    countdown.value = 60
    startCountdown()
    Toast.show({
      content: '验证码已重新发送',
      icon: 'success'
    })
  } catch (error: any) {
    console.error('Resend failed:', error)
    Toast.show({
      content: error.message || '发送失败，请重试',
      icon: 'fail'
    })
  } finally {
    isLoading.value = false
  }
}

// 倒计时
const startCountdown = () => {
  if (timer.value) clearInterval(timer.value)
  timer.value = window.setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else if (timer.value) {
      clearInterval(timer.value)
    }
  }, 1000)
}

onMounted(() => {
  if (!store.phone) {
    router.push('/login')
    return
  }
  startCountdown()
  // 自动聚焦第一个输入框
  inputs.value[0]?.focus()

  // 开发环境下显示测试验证码提示
  if (import.meta.env.DEV) {
    Toast.show({
      content: '开发模式：请输入测试验证码 666666',
      position: 'top',
      duration: 3000
    })
  }
})

onUnmounted(() => {
  if (timer.value) clearInterval(timer.value)
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

.verify-container {
  position: relative;
  max-width: 400px;
  margin: 0 auto;
  padding: 150px 20px 40px;
}

.verify-title {
  text-align: left;
  margin-bottom: 40px;
  font-size: 24px;
  color: #000000;
  font-weight: 500;
  line-height: 1.4;
}

.phone-number {
  font-size: 18px;
  color: #666666;
  font-weight: normal;
}

.code-input-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.code-input {
  width: 50px;
  height: 50px;
  border: 1px solid #DCDFE6;
  border-radius: 8px;
  text-align: center;
  font-size: 24px;
  color: #333;
  background: #fff;
  transition: all 0.3s;
}

.code-input:focus {
  border-color: #02C588;
  outline: none;
  box-shadow: 0 0 0 2px rgba(2, 197, 136, 0.2);
}

.resend-tip {
  text-align: center;
  color: #666666;
  font-size: 14px;
  margin-top: 20px;
}

.resend-btn {
  background: none;
  border: none;
  color: #02C588;
  cursor: pointer;
  padding: 0;
  font-size: 14px;
}

.resend-btn:disabled {
  color: #999;
  cursor: not-allowed;
}

.notice-text {
  position: fixed;
  bottom: 40px;
  left: 0;
  right: 0;
  text-align: center;
  color: #909399;
  font-size: 14px;
  padding: 0 20px;
}
</style> 