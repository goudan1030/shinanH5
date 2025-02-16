<template>
  <div class="avatar-upload">
    <div class="avatar-upload-container">
      <t-upload
        v-model="fileList"
        :action="uploadUrl"
        accept="image/*"
        :headers="headers"
        name="avatar"
        :with-credentials="true"
        :before-upload="beforeUpload"
        :loading="isUploading"
        :max="1"
        :auto-upload="false"
        @success="onSuccess"
        @fail="onFail"
        @progress="onProgress"
      >
        <template #default>
          <div class="upload-trigger">
            <t-avatar
              :image="previewUrl || currentAvatar"
              :fallback="'/images/defaultavatar.svg'"
              shape="circle"
              size="large"
              class="avatar-image"
            />
            <div class="upload-text">
              {{ isUploading ? '上传中...' : '点击上传头像' }}
            </div>
            <t-progress
              v-if="isUploading"
              :percentage="uploadProgress"
              theme="circle"
              size="small"
            />
          </div>
        </template>
      </t-upload>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  Upload as TUpload, 
  Avatar as TAvatar, 
  Toast as TToast,
  Progress as TProgress 
} from 'tdesign-mobile-vue'
import { useAuthStore } from '@/stores/auth'
import { userApi } from '@/api/user'

const props = defineProps<{
  modelValue?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'success', url: string): void
  (e: 'change', file: File): void
}>()

const authStore = useAuthStore()
const fileList = ref([])
const isUploading = ref(false)
const uploadProgress = ref(0)
const previewUrl = ref('')

// 从环境变量获取 API URL
const uploadUrl = `${import.meta.env.VITE_API_URL}/api/user/avatar`

const headers = computed(() => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
}))

const currentAvatar = computed(() => 
  props.modelValue || '/images/defaultavatar.svg'
)

const beforeUpload = (file: File) => {
  const isImage = /^image\//.test(file.type)
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    TToast({
      message: '只能上传图片文件',
      theme: 'error',
      duration: 2000
    })
    return false
  }

  if (!isLt5M) {
    TToast({
      message: '图片大小不能超过 5MB',
      theme: 'error',
      duration: 2000
    })
    return false
  }

  // 创建本地预览
  if (file instanceof Blob) {
    const reader = new FileReader()
    reader.onload = (e) => {
      previewUrl.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  // 触发 change 事件，通知父组件有文件选择
  emit('change', file)
  return true
}

const onProgress = (event: ProgressEvent) => {
  if (event.lengthComputable) {
    uploadProgress.value = Math.round((event.loaded / event.total) * 100)
  }
}

const onSuccess = (response: any) => {
  isUploading.value = false
  console.log('Upload response:', response)
  
  const result = response.response || response
  
  if (result.success) {
    const avatarUrl = result.data.avatarUrl
    // 更新本地头像显示
    fileList.value = []
    emit('update:modelValue', avatarUrl)
    emit('success', avatarUrl)
    
    // 更新用户信息
    authStore.userInfo = {
      ...authStore.userInfo,
      avatar: avatarUrl
    }
    
    // 保存到 localStorage
    localStorage.setItem('userInfo', JSON.stringify(authStore.userInfo))
    
    TToast({
      message: '上传成功',
      theme: 'success',
      duration: 2000
    })
  } else {
    console.error('Upload failed:', result)
    TToast({
      message: result.message || '上传失败',
      theme: 'error',
      duration: 2000
    })
  }
}

const onFail = (error: any) => {
  isUploading.value = false
  console.error('Upload failed:', error)
  
  const errorMessage = error?.response?.data?.message 
    || error?.message 
    || error?.toString() 
    || '上传失败，请重试'
  
  TToast({
    message: errorMessage,
    theme: 'error',
    duration: 2000
  })
}

const upload = async () => {
  console.log('开始上传头像...')
  try {
    if (!fileList.value.length) {
      console.warn('没有选择文件')
      return null
    }

    const file = fileList.value[0]
    // 获取原始文件对象
    const rawFile = file.raw
    if (!rawFile || !(rawFile instanceof File)) {
      console.warn('不是有效的文件对象:', file)
      return null
    }

    console.log('准备上传文件:', {
      fileName: rawFile.name,
      fileSize: rawFile.size,
      fileType: rawFile.type
    })

    const formData = new FormData()
    formData.append('avatar', rawFile, rawFile.name)

    console.log('发送上传请求...')
    const response = await userApi.uploadAvatar(formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    console.log('上传响应:', response)

    if (response.data?.avatarUrl) {
      console.log('上传成功，返回URL:', response.data.avatarUrl)
      return response.data
    }
    console.warn('上传响应中没有avatarUrl:', response)
    return null
  } catch (error) {
    console.error('头像上传失败:', {
      error,
      errorMessage: error.message,
      errorStack: error.stack,
      errorResponse: error.response?.data
    })
    throw error
  }
}

defineExpose({ upload })
</script>

<style scoped>
.avatar-upload {
  width: 100%;
  padding: 20px 16px;
  box-sizing: border-box;
}

.avatar-upload-container {
  max-width: 375px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
}

.upload-trigger {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.upload-text {
  font-size: 14px;
  color: #999;
}

:deep(.t-avatar) {
  width: 80px;
  height: 80px;
  border: 2px solid #f5f5f5;
  opacity: v-bind(isUploading ? 0.6 : 1);
  transition: opacity 0.3s;
}

:deep(.avatar-image) {
  object-fit: cover;
  background-size: cover;
  background-position: center;
}

:deep(.t-avatar__image) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

:deep(.t-progress) {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 覆盖 TUpload 的网格布局 */
:deep(.t-upload) {
  display: block !important;
  grid-template-columns: none !important;
}

:deep(.t-upload__grid) {
  display: block !important;
  grid-template-columns: none !important;
}

:deep(.t-upload__card) {
  width: auto !important;
  margin: 0 !important;
}

/* 隐藏多余的上传框 */
:deep(.t-upload__dragger) {
  display: none;
}

:deep(.t-upload__single) {
  width: auto;
  height: auto;
}

/* 确保上传区域居中 */
:deep(.t-upload__flow) {
  justify-content: center;
}
</style> 