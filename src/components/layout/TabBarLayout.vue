<template>
  <div class="layout-container">
    <!-- 页面内容 -->
    <div class="page-content">
      <router-view></router-view>
    </div>

    <!-- 底部导航栏 -->
    <div class="tab-bar">
      <!-- 左侧两个标签 -->
      <div 
        v-for="tab in leftTabs" 
        :key="tab.key"
        class="tab-item"
        :class="{ active: activeTab === tab.key }"
        @click="handleTabClick(tab.key)"
      >
        <div class="tab-icon">
          <van-icon :name="tab.icon" />
        </div>
        <span class="tab-title">{{ tab.title }}</span>
      </div>

      <!-- 中间的特殊标签 -->
      <div class="tab-item tab-item-center" @click="handleAddClick">
        <div class="center-icon-wrapper">
          <van-icon name="plus" />
        </div>
      </div>

      <!-- 右侧两个标签 -->
      <div 
        v-for="tab in rightTabs" 
        :key="tab.key"
        class="tab-item"
        :class="{ active: activeTab === tab.key }"
        @click="handleTabClick(tab.key)"
      >
        <div class="tab-icon">
          <van-icon :name="tab.icon" />
        </div>
        <span class="tab-title">{{ tab.title }}</span>
      </div>
    </div>

    <!-- 底部安全区 -->
    <div class="safe-area-bottom"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, h, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Icon as VanIcon } from 'vant'
import {
  TabBar as TTabBar,
  TabBarItem as TTabBarItem,
} from 'tdesign-mobile-vue'
import {
  HomeIcon,
  ChatIcon,
  NotificationIcon,
  UserIcon,
} from 'tdesign-icons-vue-next'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const activeTab = ref('home')

// 根据当前路由设置激活的标签
const syncActiveTab = () => {
  const path = route.path
  if (path === '/') {
    activeTab.value = 'home'
  } else {
    // 移除开头的 '/' 得到路由名称
    activeTab.value = path.slice(1)
  }
}

// 组件挂载时同步一次
onMounted(() => {
  syncActiveTab()
})

// 监听路由变化
watch(() => route.path, () => {
  syncActiveTab()
})

const leftTabs = [
  { key: 'home', title: '首页', icon: 'home-o' },
  { key: 'groups', title: '群聊', icon: 'friends-o' }
]

const rightTabs = [
  { key: 'messages', title: '消息', icon: 'chat-o' },
  { key: 'mine', title: '我的', icon: 'user-o' }
]

const handleTabClick = (key: string) => {
  activeTab.value = key
  if (key !== 'home') {
    router.push(`/${key}`)
  } else {
    router.push('/')
  }
}

const handleAddClick = async () => {
  // TODO: 后续添加登录状态判断
  // 直接跳转到用户信息登记页面
  router.push('/register-info')
}

const handleTabChange = (value: string) => {
  if (value === activeTab.value) return
  
  if (value === 'home') {
    router.push('/')
  } else {
    router.push(`/${value}`)
  }
}
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--app-background);
}

.page-content {
  flex: 1;
  padding-top: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  position: relative;
  z-index: 1;
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 12px;
  cursor: pointer;
}

.tab-item.active {
  color: #02C588;
}

.tab-icon {
  font-size: 24px;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-title {
  line-height: 1;
}

/* 中间特殊标签的样式 */
.tab-item-center {
  margin-top: -20px;
}

.center-icon-wrapper {
  width: 44px;
  height: 44px;
  background: #02C588;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(2, 197, 136, 0.3);
}

.center-icon-wrapper .van-icon {
  font-size: 24px;
  color: white;
}

.safe-area-bottom {
  height: env(safe-area-inset-bottom);
  background: #fff;
}

:deep(.t-tab-bar) {
  --td-tab-bar-height: calc(50px + env(safe-area-inset-bottom));
  --td-tab-bar-active-color: #02C588;
  --td-tab-bar-active-bg-color: transparent;
}

:deep(.t-tab-bar-item) {
  font-size: 12px;
}

:deep(.t-tab-bar-item__icon) {
  font-size: 24px;
}
</style> 