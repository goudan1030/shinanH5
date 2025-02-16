<template>
  <div class="user-card">
    <div class="user-info" @click="handleClick">
      <t-avatar :image="avatar" size="large" />
      <div class="user-meta">
        <h3>{{ userInfo ? userInfo.username || '未设置昵称' : '未登录' }}</h3>
        <p>{{ userInfo ? '完善个人资料，提高匹配率' : '点击登录/注册' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Avatar as TAvatar } from 'tdesign-mobile-vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const userInfo = computed(() => authStore.userInfo)
const avatar = computed(() => '/default-avatar.png') // 暂时使用默认头像

const handleClick = () => {
  if (!userInfo.value) {
    router.push('/login')
  } else {
    router.push('/user-profile')
  }
}
</script>

<style scoped>
.user-card {
  padding: 20px;
  background: #fff;
  border-radius: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
}

.user-meta h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.4;
  text-align: left;
}

.user-meta p {
  margin: 4px 0 0;
  font-size: 14px;
  color: #999;
  line-height: 1.4;
  text-align: left;
}

:deep(.t-avatar) {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid #f5f5f5;
}
</style> 