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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon as VanIcon } from 'vant'
import { Dialog } from 'antd-mobile'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const activeTab = ref('home')

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
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-content {
  flex: 1;
  padding-bottom: 50px;
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
</style> 