<template>
  <t-popup
    :visible="visible"
    @visible-change="handleVisibleChange"
    placement="center"
  >
    <div class="service-popup">
      <!-- 关闭按钮 -->
      <div class="close-btn" @click="handleClose">
        <t-icon name="close" />
      </div>
      
      <!-- 客服二维码 -->
      <div class="qrcode-container">
        <img 
          src="/images/service-qr.png" 
          alt="客服二维码"
          class="qrcode-image"
        >
      </div>
      
      <!-- 说明文字 -->
      <p class="service-text">扫码添加客服微信</p>
    </div>
  </t-popup>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { 
  Popup as TPopup,
  Icon as TIcon
} from 'tdesign-mobile-vue'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

const handleClose = () => {
  emit('update:visible', false)
}

const handleVisibleChange = (visible: boolean) => {
  emit('update:visible', visible)
}
</script>

<style scoped>
.service-popup {
  position: relative;
  width: 360px;
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  text-align: center;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.qrcode-container {
  margin: 12px 0 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.qrcode-image {
  width: 300px;
  height: 300px;
  object-fit: contain;
  max-width: 100%;
  max-height: 100%;
}

.service-text {
  font-size: 16px;
  color: #333;
  margin: 0;
  margin-top: 16px;
  font-weight: 500;
}

:deep(.t-icon) {
  font-size: 20px;
  color: #999;
}
</style> 