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
        
        <!-- 骨架屏 -->
        <template v-if="isLoading">
          <div class="skeleton-container">
            <van-skeleton title avatar :row="3" />
            <van-skeleton title avatar :row="3" />
            <van-skeleton title avatar :row="3" />
          </div>
        </template>
        
        <!-- 标签页内容 -->
        <template v-else>
          <TabContent 
            :active-tab="activeTopTab"
            :members="memberList"
            :total="total"
            @load="handleLoadMore"
            @refresh="handleRefresh"
          />
        </template>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon as VanIcon, showDialog, Skeleton as VanSkeleton } from 'vant'
import SafeArea from '@/components/layout/SafeArea.vue'
import TopTabs from '@/components/home/TopTabs.vue'
import TabContent from '@/components/home/TabContent.vue'
import { useAuthStore } from '@/stores/auth'
import { memberApi } from '@/api/member'
import { authApi } from '@/api/auth'
import {
  TabBar as TTabBar,
  TabBarItem as TTabBarItem,
  PullDownRefresh as TPullDownRefresh,
} from 'tdesign-mobile-vue'
import {
  HomeIcon,
  ChatIcon,
  NotificationIcon,
  UserIcon,
} from 'tdesign-icons-vue-next'
import type { ApiResponse, UserRegistrationStatus } from '@/types'

const router = useRouter()
const authStore = useAuthStore()
const activeTab = ref('home')
const activeTopTab = ref<'latest' | 'hot' | 'news'>('latest')
const refreshing = ref(false)
const stats = ref(null)

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

// 添加用户注册状态
const isUserRegistered = ref(false)

// 获取用户注册状态
const checkRegistrationStatus = async () => {
  try {
    const res = await authApi.getRegistrationStatus()
    if ('success' in res) {
      isUserRegistered.value = Boolean(res.data.registered)
      console.log('当前用户信息登记状态:', isUserRegistered.value ? '已登记' : '未登记')
    }
  } catch (error) {
    console.error('获取用户注册状态失败:', error)
  }
}

// 修改添加按钮点击处理
const handleAddClick = async () => {
  // 先检查登录状态
  if (!authStore.isLoggedIn) {
    showDialog({
      title: '提示',
      message: '请先登录后再操作',
      showCancelButton: true,
      confirmButtonText: '去登录',
      cancelButtonText: '取消',
      confirmButtonColor: '#02C588',
    }).then(() => {
      router.push('/login')
    }).catch(() => {})
    return
  }

  try {
    // 检查注册状态
    const res = await authApi.getRegistrationStatus()
    isUserRegistered.value = Boolean(res.data.registered)
    
    if (isUserRegistered.value) {
      showDialog({
        title: '提示',
        message: '你已经登记过信息，请勿重复登记',
        showCancelButton: true,
        confirmButtonText: '前往编辑',
        cancelButtonText: '取消',
        confirmButtonColor: '#02C588',
      }).then(() => {
        router.push('/user-profile')
      }).catch(() => {})
      return
    }
    
    // 只有未登记时才跳转
    await checkRegistrationStatus() // 再次确认状态
    if (!isUserRegistered.value) {
      router.push('/register-info')
    }
  } catch (error) {
    console.error('检查注册状态失败:', error)
    showDialog({
      title: '错误',
      message: '操作失败，请重试'
    })
  }
}

// 处理搜索点击
const handleSearch = () => {
  console.log('Search clicked')
}

// 处理筛选点击
const handleFilter = () => {
  console.log('Filter clicked')
}

// 定义会员列表的类型
interface Member {
  member_no: string
  nickname?: string
  gender: string
  province?: string
  city?: string
  birth_year: number
  education?: string
  occupation?: string
  self_description?: string
  children_plan?: string
  marriage_cert?: string
  updated_at: string
}

// 添加加载状态
const isLoading = ref(true)
const memberList = ref<Member[]>([])
const total = ref(0)

// 获取会员列表
const loadMembers = async () => {
  try {
    isLoading.value = true
    const res = await memberApi.getPublicMembers({
      page: 1,
      pageSize: 20,
      filters: {
        gender: '',
        ageStart: undefined,
        ageEnd: undefined,
        heightStart: undefined,
        heightEnd: undefined,
        education: '',
        location: ''
      }
    })
    
    if ('success' in res && res.success) {
      memberList.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    console.error('获取会员列表失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 刷新数据
const onRefresh = async () => {
  try {
    await loadMembers()
  } catch (error) {
    console.error('刷新失败:', error)
  } finally {
    refreshing.value = false
  }
}

// 添加加载更多处理函数
const handleLoadMore = async (page: number) => {
  try {
    const res = await memberApi.getPublicMembers({
      page,
      pageSize: 20,
      filters: {
        gender: '',
        ageStart: undefined,
        ageEnd: undefined,
        heightStart: undefined,
        heightEnd: undefined,
        education: '',
        location: ''
      }
    })
    
    if (res.success) {
      memberList.value = [...memberList.value, ...res.data.list]
      total.value = res.data.total
    }
    
    // 等待一下，让 UI 有时间更新
    await new Promise(resolve => setTimeout(resolve, 300))
  } catch (error) {
    console.error('加载更多会员失败:', error)
  }
}

// 添加刷新处理函数
const handleRefresh = async () => {
  try {
    const res = await memberApi.getPublicMembers({
      page: 1,
      pageSize: 20,
      filters: {
        gender: '',
        ageStart: undefined,
        ageEnd: undefined,
        heightStart: undefined,
        heightEnd: undefined,
        education: '',
        location: ''
      }
    })
    
    if (res.success) {
      memberList.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    console.error('刷新会员列表失败:', error)
  }
}

onMounted(async () => {
  await loadMembers()
  await checkRegistrationStatus()
})
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 0 16px 50px 16px; /* 添加左右内边距，保留底部内边距 */
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

:deep(.adm-pull-to-refresh) {
  min-height: calc(100vh - env(safe-area-inset-top));
}

.home {
  min-height: 100vh;
}

/* 自定义对话框样式 */
:deep(.t-dialog) {
  border-radius: 12px;
  width: 80%;
}

:deep(.t-dialog__title) {
  font-size: 16px;
  color: #333;
  padding: 20px 16px 0;
}

:deep(.t-dialog__content) {
  padding: 16px;
  font-size: 14px;
  color: #666;
  text-align: center;
}

:deep(.t-dialog__footer) {
  padding: 16px;
  border-top: 1px solid #f5f5f5;
}

:deep(.t-dialog__button) {
  height: 40px;
  font-size: 14px;
  border-radius: 20px;
}

:deep(.t-dialog__confirm-btn) {
  background: #02C588;
  color: #fff;
}

:deep(.t-dialog__cancel-btn) {
  color: #666;
  background: #f5f5f5;
}

/* 添加骨架屏样式 */
.skeleton-container {
  padding: 16px;
}

.skeleton-container :deep(.van-skeleton) {
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 12px;
}
</style> 