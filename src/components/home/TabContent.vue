<template>
  <van-pull-refresh 
    v-model="refreshing" 
    @refresh="onRefresh"
    :disabled="!canRefresh"
  >
    <!-- 内容区域 -->
    <div
      class="tab-content" 
      ref="contentRef"
      @scroll="handleScroll"
    >
      <!-- Banner 区域 -->
      <Banner :type="activeTab" :bannerData="bannerData" />

      <!-- 新人福利区域 - 只在"最新"标签页显示 -->
      <NewUserBenefit v-if="showBenefit" />

      <!-- 会员列表标题 -->
      <div class="section-title">
        {{ getSectionTitle }}
      </div>

      <!-- 根据标签页类型显示不同的内容 -->
      <template v-if="activeTab === 'news'">
        <div class="news-list">
          <NewsCard
            v-for="article in articles"
            :key="article.id"
            :news="article"
          />
          <!-- 加载更多触发器 -->
          <div 
            ref="loadingTrigger" 
            class="loading-trigger"
            v-show="!isArticleFinished"
          >
            <van-loading v-if="isLoading" type="spinner" size="24px" vertical>
              加载中...
            </van-loading>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="member-list">
          <MemberCard
            v-for="member in displayMembers"
            :key="member.member_no"
            :member="{
              id: member.member_no,
              avatar: member.avatar || '',
              nickname: member.nickname || '会员' + member.member_no,
              gender: member.gender,
              city: `${member.province || ''} ${member.city || ''}`,
              birthYear: member.birth_year,
              education: getEducationLabel(member.education),
              job: member.occupation,
              introduction: member.self_description,
              childNeeds: [getChildrenPlanLabel(member.children_plan)],
              marriageNeeds: [getMarriageCertLabel(member.marriage_cert)],
              updateTime: new Date(member.updated_at)
            }"
          />
        </div>
        <!-- 加载更多触发器 -->
        <div 
          ref="loadingTrigger" 
          class="loading-trigger"
          v-show="!isFinished"
        >
          <van-loading v-if="isLoading" type="spinner" size="24px" vertical>加载中...</van-loading>
        </div>
      </template>

      <!-- 返回顶部按钮 -->
      <van-back-top 
        :right="16" 
        :bottom="80"
        :offset="400"
        :immediate="false"
        target=".tab-content"
      >
        <div class="back-top-btn">
          <van-icon name="arrow-up" />
        </div>
      </van-back-top>
    </div>
  </van-pull-refresh>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, onActivated, onDeactivated, nextTick } from 'vue'
import { 
  Loading as VanLoading,
  PullRefresh as VanPullRefresh,
  BackTop as VanBackTop,
  Icon as VanIcon
} from 'vant'
import Banner from './Banner.vue'
import MemberCard from './MemberCard.vue'
import NewUserBenefit from './NewUserBenefit.vue'
import NewsCard from './NewsCard.vue'
import { throttle } from 'lodash-es'
import { bannerApi } from '@/api/banner'
import { articleApi } from '@/api/article'
import type { Article } from '@/types/article'
import { useHomeStore } from '@/stores/home'

// 添加下拉刷新相关状态
const refreshing = ref(false)
const contentRef = ref<HTMLElement | null>(null)

// 添加滚动相关状态
const scrollPosition = ref(0)
const canRefresh = computed(() => scrollPosition.value === 0)

// 添加滚动位置管理
const SCROLL_KEY = 'TAB_SCROLL_POSITIONS'

const scrollManager = {
  // 保存滚动位置
  save(tab: string, position: number) {
    try {
      const positions = JSON.parse(sessionStorage.getItem(SCROLL_KEY) || '{}')
      positions[tab] = position
      sessionStorage.setItem(SCROLL_KEY, JSON.stringify(positions))
      console.log('保存滚动位置:', tab, position)
    } catch (error) {
      console.error('保存滚动位置失败:', error)
    }
  },

  // 获取滚动位置
  get(tab: string): number {
    try {
      const positions = JSON.parse(sessionStorage.getItem(SCROLL_KEY) || '{}')
      return positions[tab] || 0
    } catch (error) {
      console.error('获取滚动位置失败:', error)
      return 0
    }
  },

  // 清除指定标签的滚动位置
  clear(tab: string) {
    try {
      const positions = JSON.parse(sessionStorage.getItem(SCROLL_KEY) || '{}')
      delete positions[tab]
      sessionStorage.setItem(SCROLL_KEY, JSON.stringify(positions))
    } catch (error) {
      console.error('清除滚动位置失败:', error)
    }
  }
}

// 添加一个变量来记录实际的滚动位置
const lastScrollPosition = ref<Record<string, number>>({})

// 修改 props 和 emits 定义
interface Props {
  activeTab: 'latest' | 'hot' | 'news'
  members: any[]
  total: number
}

const props = defineProps<Props>()
const emit = defineEmits(['load', 'refresh', 'update:members', 'update:total'])

const PAGE_SIZE = 10
const currentPage = ref(1)
const isLoading = ref(false)
const loadingTrigger = ref<HTMLElement | null>(null)
const observer = ref<IntersectionObserver | null>(null)

// 计算属性
const displayMembers = computed(() => props.members)
const isFinished = computed(() => displayMembers.value.length >= props.total)
const showBenefit = computed(() => props.activeTab === 'latest')

// 文章列表数据
const articles = ref<Article[]>([])
const articleTotal = ref(0)
const articlePage = ref(1)
const isArticleFinished = computed(() => articles.value.length >= articleTotal.value)

// 根据不同标签页显示不同标题
const getSectionTitle = computed(() => {
  switch (props.activeTab) {
    case 'latest':
      return '最新信息'
    case 'hot':
      return '热门信息'
    case 'news':
      return '干货资讯'
    default:
      return ''
  }
})

// 添加节流的加载函数
const throttledLoad = throttle(async () => {
  if (isLoading.value || isFinished.value) return
  
  isLoading.value = true
  try {
    // 添加最小加载时间
    const loadStartTime = Date.now()
    await emit('load', currentPage.value + 1)
    
    // 确保加载动画至少显示 500ms
    const loadTime = Date.now() - loadStartTime
    if (loadTime < 500) {
      await new Promise(resolve => setTimeout(resolve, 500 - loadTime))
    }
    
    currentPage.value++
  } finally {
    isLoading.value = false
  }
}, 1000, { leading: true, trailing: false }) // 1秒内只触发一次，立即执行

// 修改滚动事件处理
const handleScroll = throttle((e: Event) => {
  const target = e.target as HTMLElement
  if (target?.scrollTop !== undefined) {
    const position = target.scrollTop
    // 保存到内存中
    lastScrollPosition.value[props.activeTab] = position
    scrollPosition.value = position
    // 实时保存到 sessionStorage
    scrollManager.save(props.activeTab, position)
    console.log('保存滚动位置:', props.activeTab, position)
  }
}, 100, { leading: true, trailing: true })

// 修改生命周期钩子
onMounted(() => {
  // 设置 Intersection Observer
  observer.value = new IntersectionObserver(async (entries) => {
    const target = entries[0]
    if (target.isIntersecting && !isLoading.value) {
      if (props.activeTab === 'news') {
        // 加载更多文章
        if (!isArticleFinished.value) {
          await loadArticles(articlePage.value + 1)
        }
      } else {
        // 加载更多会员
        if (!isFinished.value) {
          await throttledLoad()
        }
      }
    }
  }, {
    threshold: 0.1,
    rootMargin: '100px 0px'
  })

  if (loadingTrigger.value) {
    observer.value.observe(loadingTrigger.value)
  }

  // 直接加载数据，不再使用缓存控制器
  loadData()
})

// 修改滚动位置恢复逻辑
const restoreScrollPosition = () => {
  const position = scrollManager.get(props.activeTab)
  console.log('尝试恢复滚动位置:', props.activeTab, position)
  
  if (position > 0 && contentRef.value) {
    // 使用 nextTick 确保 DOM 更新后再设置滚动位置
    nextTick(() => {
      if (contentRef.value) {
        contentRef.value.scrollTop = position
        // 同时更新内存中的记录
        lastScrollPosition.value[props.activeTab] = position
        console.log('恢复滚动位置成功:', position)
        
        // 再次确认滚动位置
        setTimeout(() => {
          if (contentRef.value && contentRef.value.scrollTop !== position) {
            contentRef.value.scrollTop = position
            console.log('再次校正滚动位置:', position)
          }
        }, 100)
      }
    })
  }
}

// 修改生命周期钩子
onActivated(() => {
  console.log('组件激活')
  
  // 先恢复滚动位置
  restoreScrollPosition()
  
  // 数据加载完成后再次确认滚动位置
  loadData().then(() => {
    nextTick(() => {
      restoreScrollPosition()
    })
  })
})

onDeactivated(() => {
  console.log('组件失活')
  // 使用最后记录的有效滚动位置
  const position = lastScrollPosition.value[props.activeTab]
  if (position !== undefined) {
    scrollManager.save(props.activeTab, position)
    console.log('保存最后的有效滚动位置:', props.activeTab, position)
  }
})

const homeStore = useHomeStore()

// 添加 Banner 数据类型定义
const bannerData = ref<{
  latest: Banner[]
  hot: Banner[]
  popup: Banner[]
}>({
  latest: [],
  hot: [],
  popup: []
})

// 修改 banner 加载函数
const loadBanners = async () => {
  // 检查缓存
  if (homeStore.bannerCache.data && 
      Date.now() - homeStore.bannerCache.timestamp < 5 * 60 * 1000) {
    console.log('使用缓存的 banner 数据')
    bannerData.value = homeStore.bannerCache.data
    return
  }

  console.log('从数据库加载 banner 数据')
  const res = await bannerApi.getBanners()
  if (res.success) {
    bannerData.value = res.data
    // 保存到缓存
    homeStore.setBannerCache(res.data)
  }
}

// 修改刷新处理
const onRefresh = async () => {
  if (!canRefresh.value) {
    refreshing.value = false
    return
  }

  try {
    // 清除缓存
    homeStore.clearBannerCache()
    // 重新加载数据
    await loadData()
    // 触发外部刷新事件
    await emit('refresh')
  } finally {
    refreshing.value = false
  }
}

// 修改数据加载函数
const loadData = async () => {
  try {
    isLoading.value = true
    
    // 并行加载数据以提高速度
    const promises = []
    
    if (props.activeTab !== 'news') {
      promises.push(loadBanners())  // 每次都重新加载 banner
    }
    
    if (props.activeTab === 'news') {
      promises.push(loadArticles(1))
    }
    
    await Promise.all(promises)
    
    // 重置页码
    currentPage.value = 1
  } finally {
    isLoading.value = false
  }
}

// 加载文章列表
const loadArticles = async (page = 1) => {
  try {
    const res = await articleApi.getArticles({
      page,
      pageSize: 10
    })
    if (res.success) {
      if (page === 1) {
        articles.value = res.data.list
      } else {
        articles.value.push(...res.data.list)
      }
      articleTotal.value = res.data.total
      articlePage.value = page
    }
  } catch (error) {
    console.error('获取文章失败:', error)
  }
}

// 修改映射函数以匹配数据库中的实际值
const getEducationLabel = (education: string) => {
  const map: Record<string, string> = {
    'HIGH_SCHOOL': '高中',
    'JUNIOR_COLLEGE': '大专',
    'BACHELOR': '本科',
    'MASTER': '硕士',
    'DOCTOR': '博士',
    'OTHER': '其他'
  }
  return map[education] || education
}

const getChildrenPlanLabel = (plan: string) => {
  const map: Record<string, string> = {
    'BOTH': '要孩子',
    'NONE': '不要孩子',
    'NEGOTIATE': '双方协商',
    'TOGETHER': '一起要'
  }
  return map[plan] || plan
}

const getMarriageCertLabel = (cert: string) => {
  const map: Record<string, string> = {
    'WANT': '要领证',
    'DONT_WANT': '不领证',
    'NEGOTIATE': '双方协商'
  }
  return map[cert] || cert
}

// 在组件卸载时清理
onUnmounted(() => {
  if (observer.value) {
    observer.value.disconnect()
  }
  // 取消未执行的节流函数
  throttledLoad.cancel()
  handleScroll.cancel()
})
</script>

<style scoped>
.tab-content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 50px; /* 为底部加载器预留空间 */
  height: calc(100vh - 100px); /* 添加固定高度 */
}

.content-area {
  padding: 16px;
}

/* 调整新人福利和会员列表的上边距 */
.member-list {
  margin-top: 16px;
}

/* 调整 Banner 和新人福利之间的间距 */
:deep(.benefit-card) {
  margin-top: 30px;
}

/* 如果新人福利显示，调整会员列表的间距 */
.member-list:not(:first-child) {
  margin-top: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  text-align: left;
  margin-top: 30px;
  margin-bottom: 16px;
}

.news-list {
  margin-top: 16px;
}

.load-more {
  text-align: center;
  margin: 20px 0;
}

:deep(.van-list) {
  min-height: 100px;
  overflow: visible;
}

:deep(.van-list__loading), :deep(.van-list__finished-text) {
  padding: 16px 0;
  color: #999;
  font-size: 14px;
  text-align: center;
}

.loading-trigger {
  height: 60px; /* 增加高度 */
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  margin: 10px 0;
  transition: opacity 0.3s; /* 添加过渡效果 */
}

/* 添加淡入淡出效果 */
.loading-trigger:not(:empty) {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 自定义返回顶部按钮样式 */
.back-top-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: #fff;
  background: #02C588;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(2, 197, 136, 0.3);
  transition: opacity 0.3s;
}

.back-top-btn:active {
  opacity: 0.8;
}

/* 自定义下拉刷新样式 */
:deep(.van-pull-refresh) {
  overflow: visible;
}

:deep(.van-pull-refresh__track) {
  min-height: calc(100vh - 100px);
  transition: transform 0.3s;
}

:deep(.van-pull-refresh__head) {
  color: #02C588;
  transition: height 0.3s;
}
</style> 