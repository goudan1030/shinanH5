<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { 
  Cell as TCell,
  CellGroup as TCellGroup,
  Button as TButton,
  Toast as TToast,
  Input as TInput
} from 'tdesign-mobile-vue'
import NavBar from '@/components/common/NavBar.vue'
import AvatarUpload from '@/components/common/AvatarUpload.vue'

const router = useRouter()
const authStore = useAuthStore()
const avatarUploadRef = ref()
const hasNewAvatar = ref(false)
const isLoading = ref(false)

// 表单数据
const username = ref(authStore.userInfo?.username || '')
const avatar = ref(authStore.userInfo?.avatar || '')

const handleAvatarChange = (file: File) => {
  console.log('头像文件已选择:', {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type
  })
  hasNewAvatar.value = true
}

const onSubmit = async () => {
  try {
    isLoading.value = true
    console.log('开始保存用户信息:', {
      hasNewAvatar: hasNewAvatar.value,
      currentAvatar: avatar.value,
      username: username.value
    })
    
    // 如果有新头像，先上传头像
    if (hasNewAvatar.value) {
      console.log('开始上传新头像...')
      // 等待头像上传完成并获取URL
      const uploadResult = await avatarUploadRef.value.upload()
      console.log('头像上传结果:', uploadResult)

      if (uploadResult?.avatarUrl) {
        // 更新本地头像状态
        avatar.value = uploadResult.avatarUrl
        console.log('更新本地头像状态:', avatar.value)

        // 更新 store 中的用户信息
        authStore.userInfo = {
          ...authStore.userInfo,
          avatar: uploadResult.avatarUrl
        }
        console.log('更新 store 中的用户信息:', authStore.userInfo)
      } else {
        console.warn('未获取到头像URL')
      }
    }
    
    // 更新用户信息
    console.log('开始更新用户信息到服务器...')
    await authStore.updateUserInfo(username.value)
    console.log('用户信息更新完成')
    
    TToast({
      message: '保存成功',
      theme: 'success',
      duration: 2000
    })
    
    router.back()
  } catch (error) {
    console.error('保存失败:', {
      error,
      errorMessage: error.message,
      errorStack: error.stack,
      errorResponse: error.response?.data
    })
    TToast({
      message: '保存失败，请重试',
      theme: 'error',
      duration: 2000
    })
  } finally {
    isLoading.value = false
  }
}

const onAvatarSuccess = (url: string) => {
  // This function is no longer used in the new onSubmit logic
}
</script>

<template>
  <div class="page-container">
    <NavBar title="个人信息" />
    
    <div class="form-container">
      <AvatarUpload
        ref="avatarUploadRef"
        v-model="avatar"
        @change="handleAvatarChange"
      />
      <t-cell-group>
        <t-cell title="用户名">
          <template #note>
            <t-input
              v-model="username"
              placeholder="请输入用户名"
              align="right"
              :borderless="true"
            />
          </template>
        </t-cell>
      </t-cell-group>

      <div class="button-container">
        <t-button
          block
          theme="primary"
          :loading="isLoading"
          @click="onSubmit"
          size="large"
        >
          保存
        </t-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: var(--app-background);
  padding-top: 44px;
}

.form-container {
  padding: 16px;
}

.button-container {
  margin-top: 32px;
  padding: 0 16px;
}

:deep(.t-cell) {
  padding: 0 16px;
  height: 54px;
}

:deep(.t-cell__title) {
  display: flex;
  align-items: center;
  height: 100%;
  font-size: 16px;
}

:deep(.t-input) {
  text-align: right;
  --td-font-size-m: 16px;
}

:deep(.t-button) {
  height: 48px;
  font-size: 16px;
}

:deep(.t-input__inner) {
  text-align: right;
}
</style> 