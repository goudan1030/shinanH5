<template>
  <div class="page-container">
    <!-- 用户信息卡片 -->
    <div class="user-card">
      <template v-if="store.isLoggedIn">
        <div class="user-info" @click="handleEditProfile">
          <img 
            :src="store.user?.avatar || defaultAvatar" 
            class="avatar"
            alt="头像"
          >
          <div class="info">
            <h3 class="username">{{ store.user?.username || '未设置昵称' }}</h3>
            <p class="phone">{{ formatPhone(store.user?.phone) }}</p>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="user-info not-logged-in" @click="handleLogin">
          <img :src="defaultAvatar" class="avatar" alt="默认头像">
          <div class="info">
            <h3 class="username">未登录</h3>
            <p class="tip">点击登录</p>
          </div>
        </div>
      </template>
    </div>

    <!-- 功能菜单 -->
    <div class="menu-list">
      <t-cell-group>
        <t-cell
          title="我的资料"
          :left-icon="() => h(TIcon, { name: 'user' })"
          arrow
          @click="handleEditProfile"
        />
        <t-cell
          title="我的收藏"
          :left-icon="() => h(TIcon, { name: 'star-filled' })"
          arrow
          @click="handleFavorites"
        />
        <t-cell
          title="分享好友"
          :left-icon="() => h(TIcon, { name: 'share' })"
          arrow
          @click="handleShare"
        />
        <t-cell
          title="人工客服"
          :left-icon="() => h(TIcon, { name: 'service' })"
          arrow
          @click="handleService"
        />
        <t-cell
          title="关于我们"
          :left-icon="() => h(TIcon, { name: 'info-circle' })"
          arrow
          @click="handleAbout"
        />
        <t-cell
          title="设置"
          :left-icon="() => h(TIcon, { name: 'setting' })"
          arrow
          @click="handleSettings"
        />
      </t-cell-group>
    </div>
    
    <!-- 客服弹窗 -->
    <ServicePopup v-model:visible="showServicePopup" />
    
    <!-- 页脚 -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onMounted, h, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api/auth'
import { 
  CellGroup as TCellGroup,
  Cell as TCell,
  Icon as TIcon
} from 'tdesign-mobile-vue'
import UserCard from '@/components/mine/UserCard.vue'
import Footer from '@/components/common/Footer.vue'
import ServicePopup from '@/components/common/ServicePopup.vue'

const router = useRouter()
const store = useAuthStore()

// 使用 public 目录下的默认头像
const defaultAvatar = '/images/defaultavatar.svg'

// 格式化手机号
const formatPhone = (phone?: string) => {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 处理登录点击
const handleLogin = () => {
  router.push('/login')
}

const handleEditProfile = () => {
  router.push('/user-profile')
}

const handleFavorites = () => {
  router.push('/favorites')
}

const handleSettings = () => {
  router.push('/settings')
}

// 处理分享
const handleShare = () => {
  router.push('/share')
}

// 处理客服
const showServicePopup = ref(false)

const handleService = () => {
  showServicePopup.value = true
}

// 处理关于我们
const handleAbout = () => {
  router.push('/about')
}

// 组件挂载时刷新用户信息
onMounted(async () => {
  console.log('MineView mounted, current auth state:', {
    isLoggedIn: store.isLoggedIn,
    user: store.user
  })
  
  if (store.isLoggedIn) {
    // 刷新用户信息
    await store.getCurrentUser()
    console.log('User info refreshed:', store.user)
  }
})
</script>

<style scoped>
.page-container {
  min-height: 100vh;
}

.navbar {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  position: sticky;
  top: 0;
  z-index: 100;
}

.user-card {
  background: #fff;
  padding: 20px;
  margin-bottom: 10px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.not-logged-in {
  cursor: pointer;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.info {
  flex: 1;
}

.username {
  font-size: 18px;
  font-weight: 500;
  margin: 0 0 5px;
  color: #333;
  text-align: left;
}

.phone {
  font-size: 14px;
  color: #666;
  margin: 0;
  text-align: left;
}

.tip {
  font-size: 14px;
  color: #999;
  margin: 0;
  text-align: left;
}

.menu-list {
  margin-top: 16px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}

:deep(.t-cell) {
  padding: 16px;
}

:deep(.t-cell__title) {
  font-size: 16px;
  color: #333;
}

:deep(.t-cell__left) {
  margin-right: 12px;
}

:deep(.t-icon) {
  font-size: 20px;
  color: #666;
}
</style> 