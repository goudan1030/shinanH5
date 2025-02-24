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

  <!-- 添加客服弹窗 -->
  <ServicePopup v-model:visible="showServicePopup" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { showToast, Icon } from 'vant'
import { useAuthStore } from '@/stores/auth'
import { favoriteApi } from '@/api/favorite'
import ServicePopup from '@/components/common/ServicePopup.vue'

const props = defineProps<{
  memberId: string
}>()

const authStore = useAuthStore()
const isFavorite = ref(false)
const showServicePopup = ref(false)

// 检查收藏状态
const checkFavorite = async () => {
  if (!authStore.isLoggedIn) return
  
  try {
    const res = await favoriteApi.check(props.memberId, 'member')
    isFavorite.value = res.data
  } catch (error) {
    console.error('检查收藏状态失败:', error)
  }
}

// 处理收藏
const handleFavorite = async () => {
  if (!authStore.isLoggedIn) {
    showToast('请先登录')
    return
  }

  try {
    if (isFavorite.value) {
      await favoriteApi.remove(props.memberId, 'member')
      showToast('已取消收藏')
    } else {
      await favoriteApi.add(props.memberId, 'member')
      showToast('收藏成功')
    }
    isFavorite.value = !isFavorite.value
  } catch (error) {
    console.error('收藏操作失败:', error)
    showToast('操作失败,请重试')
  }
}

// 处理联系
const handleContact = () => {
  if (!authStore.isLoggedIn) {
    showToast('请先登录')
    return
  }
  // 显示客服二维码弹窗
  showServicePopup.value = true
}

// 组件挂载时检查收藏状态
onMounted(() => {
  checkFavorite()
})
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