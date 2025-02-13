<template>
  <div class="mine">
    <adm-nav-bar>我的</adm-nav-bar>
    <div class="content">
      <div class="user-info">
        <adm-avatar :src="userAvatar" />
        <div class="user-meta">
          <h3>{{ userName || '未登录' }}</h3>
          <p>{{ userDesc || '点击登录/注册' }}</p>
        </div>
      </div>

      <div class="menu-list">
        <adm-list>
          <adm-list-item
            title="我的资料"
            clickable
            @click="handleEditProfile"
          />
          <adm-list-item
            title="我的收藏"
            clickable
            @click="handleFavorites"
          />
          <adm-list-item
            title="设置"
            clickable
            @click="handleSettings"
          />
        </adm-list>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NavBar, Avatar, List } from 'antd-mobile'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const userAvatar = ref('/default-avatar.png')
const userName = ref('')
const userDesc = ref('')

const handleEditProfile = () => {
  router.push('/register-info')
}

const handleFavorites = () => {
  console.log('收藏功能开发中...')
}

const handleSettings = () => {
  console.log('设置功能开发中...')
}
</script>

<style scoped>
.mine {
  min-height: 100vh;
  background: #F7F8FC;
}

.content {
  padding: 16px;
}

.user-info {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.user-meta h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.user-meta p {
  margin: 4px 0 0;
  font-size: 14px;
  color: #999;
}

.menu-list {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}
</style> 