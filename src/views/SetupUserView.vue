<template>
  <div class="page-container">
    <div class="gradient-header"></div>
    
    <div class="setup-container">
      <h2 class="setup-title">信息登记</h2>
      
      <div class="setup-form">
        <!-- 姓名输入框 -->
        <div class="form-item">
          <input
            v-model="name"
            type="text"
            placeholder="姓名（选填）"
            maxlength="20"
            class="input-field"
          >
        </div>

        <!-- 身份证输入框 -->
        <div class="form-item">
          <input
            v-model="idCard"
            type="text"
            placeholder="身份证号（选填）"
            maxlength="18"
            class="input-field"
          >
        </div>

        <!-- 地址输入框 -->
        <div class="form-item">
          <input
            v-model="address"
            type="text"
            placeholder="地址（选填）"
            maxlength="100"
            class="input-field"
          >
        </div>

        <!-- 提交按钮 -->
        <button
          :disabled="store.isLoading"
          @click="handleSubmit"
          class="submit-btn"
        >
          {{ store.isLoading ? '提交中...' : '保存' }}
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
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { Toast } from 'antd-mobile'

const router = useRouter()
const store = useAuthStore()
const name = ref('')
const idCard = ref('')
const address = ref('')

// 提交表单
const handleSubmit = async () => {
  try {
    if (!store.user?.phone) {
      Toast.show({
        content: '请先登录',
        icon: 'error'
      })
      router.push('/login')
      return
    }

    // 准备要保存的数据
    const memberData = {
      phone: store.user.phone,
      name: name.value || undefined,
      idCard: idCard.value || undefined,
      address: address.value || undefined
    }

    // 添加日志，确认数据
    console.log('提交前确认数据:', memberData)

    // 调用 store 的方法保存数据
    await store.saveMemberInfo(memberData)

    console.log('会员信息保存成功')
    Toast.show({
      content: '保存成功',
      icon: 'success'
    })

    // 等待 Toast 显示完成后再跳转
    setTimeout(() => {
      router.push('/')
    }, 1000)

  } catch (error: any) {
    console.error('保存失败:', error)
    Toast.show({
      content: error.message || '保存失败，请重试',
      icon: 'error'
    })
  }
}

// 在组件挂载时检查登录状态
onMounted(() => {
  if (!store.user?.phone) {
    console.error('未登录状态:', {
      isLoggedIn: store.isLoggedIn,
      user: store.user
    })
    Toast.show({
      content: '请先登录',
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