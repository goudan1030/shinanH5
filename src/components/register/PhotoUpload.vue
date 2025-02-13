<template>
  <div class="photo-upload">
    <div class="upload-tips">
      请上传您的真实照片，这将提高您的匹配成功率
    </div>

    <adm-form
      :model="formData"
      @submit="onSubmit"
    >
      <adm-form-item
        name="photos"
        :rules="[{ required: true, message: '请至少上传一张照片' }]"
      >
        <adm-image-uploader
          v-model:value="formData.photos"
          :max-count="6"
          :max-size="2 * 1024 * 1024"
          accept="image/*"
          upload-text="上传照片"
          @before-upload="beforeUpload"
          @on-exceed="onExceed"
          @on-oversize="onOversize"
        />
      </adm-form-item>

      <!-- 底部按钮 -->
      <div class="form-buttons">
        <adm-space direction="vertical" block>
          <adm-button block @click="handlePrev">上一步</adm-button>
          <adm-button block type="submit" color="primary">下一步</adm-button>
        </adm-space>
      </div>
    </adm-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { 
  Form,
  ImageUploader,
  Button,
  Space,
  Toast
} from 'antd-mobile'
import type { ImageUploadItem } from 'antd-mobile/es/components/image-uploader'

const emit = defineEmits(['next', 'prev'])

const formData = reactive({
  photos: [] as ImageUploadItem[]
})

const beforeUpload = async (file: File) => {
  // 检查文件类型
  if (!file.type.startsWith('image/')) {
    Toast.show({
      content: '只能上传图片文件!',
      position: 'center'
    })
    return null
  }
  return file
}

const onExceed = () => {
  Toast.show({
    content: '最多只能上传6张照片',
    position: 'center'
  })
}

const onOversize = () => {
  Toast.show({
    content: '图片大小不能超过2MB',
    position: 'center'
  })
}

const handlePrev = () => {
  emit('prev')
}

const onSubmit = () => {
  if (formData.photos.length === 0) {
    Toast.show({
      content: '请至少上传一张照片',
      position: 'center'
    })
    return
  }
  emit('next')
}
</script>

<style scoped>
.photo-upload {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
}

.upload-tips {
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
  text-align: center;
}

.form-buttons {
  margin-top: 24px;
}

:deep(.adm-form-item) {
  margin-bottom: 16px;
}

:deep(.adm-image-uploader) {
  --cell-size: 100px;
}

:deep(.adm-image-uploader-upload-button) {
  background-color: var(--adm-color-box);
  border-radius: 8px;
}
</style> 