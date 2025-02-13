<template>
  <SafeArea>
    <div class="page-container">
      <!-- 内容区域 -->
      <div class="content">
        <!-- 顶部标签页 -->
        <TopTabs
          v-model="activeTopTab"
          @search="handleSearch"
          @filter="handleFilter"
        />
        
        <!-- 标签页内容 -->
        <TabContent :active-tab="activeTopTab" />
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
  </SafeArea>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Icon as VanIcon } from 'vant'
import SafeArea from '@/components/layout/SafeArea.vue'
import TopTabs from '@/components/home/TopTabs.vue'
import TabContent from '@/components/home/TabContent.vue'

const router = useRouter()
const activeTab = ref('home')
const activeTopTab = ref('latest')

const allTabs = [
  { key: 'home', title: '首页', icon: 'home-o' },
  { key: 'groups', title: '群聊', icon: 'friends-o' },
  { key: 'messages', title: '消息', icon: 'chat-o' },
  { key: 'mine', title: '我的', icon: 'user-o' }
]

// 分割左右两侧的标签
const leftTabs = computed(() => allTabs.slice(0, 2))
const rightTabs = computed(() => allTabs.slice(2))

const handleTabClick = (key: string) => {
  activeTab.value = key
  if (key !== 'home') {
    router.push(`/${key}`)
  }
}

const handleAddClick = () => {
  router.push('/register-info')
}

// 处理搜索点击
const handleSearch = () => {
  console.log('Search clicked')
}

// 处理筛选点击
const handleFilter = () => {
  console.log('Filter clicked')
}
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: #F7F8FC;
}

.content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 0 16px 50px 16px; /* 添加左右内边距，保留底部内边距 */
  background: #F7F8FC;
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: #fff;
  border-top: solid 1px #e5e5e5;
  display: flex;
  z-index: 100;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
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
  margin-top: -20px; /* 向上偏移 */
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
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: env(safe-area-inset-bottom);
  background: #fff;
  z-index: 99;
}
</style> 