<template>
  <van-pull-refresh 
    v-model="refreshing" 
    @refresh="onRefresh"
    :disabled="!canRefresh"
  >
    <div 
      class="tab-content" 
      ref="contentRef"
      @scroll="handleScroll"
    >
      <!-- Banner 区域 -->
      <Banner :type="activeTab" />

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
            v-for="news in newsData"
            :key="news.id"
            :news="news"
          />
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
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

// 添加下拉刷新相关状态
const refreshing = ref(false)
const contentRef = ref<HTMLElement | null>(null)

// 添加滚动相关状态
const scrollTop = ref(0)
const canRefresh = computed(() => scrollTop.value === 0)

// 处理滚动事件
const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement
  scrollTop.value = target.scrollTop
}

// 修改 props 和 emits 定义
interface Props {
  activeTab: 'latest' | 'hot' | 'news'
  members: any[]
  total: number
}

const props = defineProps<Props>()
const emit = defineEmits(['load', 'refresh'])

const PAGE_SIZE = 10
const currentPage = ref(1)
const isLoading = ref(false)
const loadingTrigger = ref<HTMLElement | null>(null)
const observer = ref<IntersectionObserver | null>(null)

// 计算属性
const displayMembers = computed(() => props.members)
const isFinished = computed(() => displayMembers.value.length >= props.total)
const showBenefit = computed(() => props.activeTab === 'latest')

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

// 资讯数据
const newsData = ref([
  {
    id: '1',
    coverUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
    title: '2024年婚恋市场分析：95后成为相亲主力军，这些新趋势值得关注',
    description: '深度解析当代年轻人的婚恋观念变化和择偶新趋势',
    publishTime: new Date('2024-02-20')
  },
  {
    id: '2',
    coverUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
    title: '如何在相亲过程中展现最真实的自己？专家给出这些建议',
    description: '婚恋心理专家分享相亲技巧和注意事项',
    publishTime: new Date('2024-02-19')
  },
  {
    id: '3',
    coverUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
    title: '数据说话：这些城市的单身青年最渴望脱单，你所在的城市排第几？',
    description: '2024年一线城市婚恋数据大揭秘',
    publishTime: new Date('2024-02-18')
  }
])

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

// 修改观察器配置
onMounted(() => {
  observer.value = new IntersectionObserver(async (entries) => {
    const target = entries[0]
    if (target.isIntersecting) {
      throttledLoad()
    }
  }, {
    threshold: 0.1,
    rootMargin: '100px 0px' // 提前 100px 触发加载
  })

  if (loadingTrigger.value) {
    observer.value.observe(loadingTrigger.value)
  }

  loadBanners()
  loadArticles()
})

// 在组件卸载时清理
onUnmounted(() => {
  if (observer.value) {
    observer.value.disconnect()
  }
  // 取消未执行的节流函数
  throttledLoad.cancel()
})

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

// 下拉刷新处理函数
const onRefresh = async () => {
  if (!canRefresh.value) {
    refreshing.value = false
    return
  }

  try {
    // 重置页码
    currentPage.value = 1
    // 触发外部刷新事件
    await emit('refresh')
  } finally {
    refreshing.value = false
  }
}

// 获取banner数据
const loadBanners = async () => {
  try {
    const res = await bannerApi.getBanners()
    if (res.success) {
      console.log('=== Banner数据 ===')
      console.log('最新Banner:', res.data.latest)
      console.log('热门Banner:', res.data.hot)
      console.log('弹窗Banner:', res.data.popup)
    }
  } catch (error) {
    console.error('获取Banner失败:', error)
  }
}

// 获取文章数据
const loadArticles = async () => {
  try {
    const res = await articleApi.getArticles({
      page: 1,
      pageSize: 10
    })
    if (res.success) {
      console.log('=== 文章数据 ===')
      console.log('文章列表:', res.data.list)
      console.log('总数:', res.data.total)
    }
  } catch (error) {
    console.error('获取文章失败:', error)
  }
}
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