<template>
  <div class="action-bar">
    <div class="action-btn favorite" @click="handleFavorite">
      <Icon :name="isFavorite ? 'star' : 'star-o'" :class="{ active: isFavorite }" />
      <span>{{ isFavorite ? '已收藏' : '收藏' }}</span>
    </div>
    <div class="primary-btn" @click="handleContact">
      联系Ta
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { showToast, Icon } from 'vant'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{
  memberId: string
}>()

const authStore = useAuthStore()
const isFavorite = ref(false)

// 处理收藏
const handleFavorite = () => {
  if (!authStore.isLoggedIn) {
    showToast('请先登录')
    return
  }
  // TODO: 调用收藏API
  isFavorite.value = !isFavorite.value
  showToast(isFavorite.value ? '收藏成功' : '已取消收藏')
}

// 处理联系
const handleContact = () => {
  if (!authStore.isLoggedIn) {
    showToast('请先登录')
    return
  }
  // TODO: 显示联系方式
  showToast('暂未开放')
}
</script>

<style scoped>
.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 16px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.04);
  z-index: 100;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  color: #666;
  font-size: 12px;
}

.action-btn .van-icon {
  font-size: 24px;
  margin-bottom: 2px;
}

.action-btn .van-icon.active {
  color: #ff8f1f;
}

.primary-btn {
  flex: 1;
  margin-left: 16px;
  height: 44px;
  line-height: 44px;
  text-align: center;
  background: #02C588;
  color: #fff;
  border-radius: 22px;
  font-size: 16px;
}
</style> 