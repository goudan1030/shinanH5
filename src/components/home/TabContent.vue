<template>
  <div class="tab-content">
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
      <List
        v-model:loading="isLoading"
        :finished="isFinished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="true"
        :offset="300"
      >
        <div class="member-list">
          <MemberCard
            v-for="member in displayMembers"
            :key="member.member_no"
            :member="{
              id: member.member_no,
              avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
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
      </List>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { List } from 'vant'
import Banner from './Banner.vue'
import MemberCard from './MemberCard.vue'
import NewUserBenefit from './NewUserBenefit.vue'
import NewsCard from './NewsCard.vue'

// 定义 props 类型
interface Props {
  activeTab: 'latest' | 'hot' | 'news'
  members: any[]
  total: number
}

const props = defineProps<Props>()

const PAGE_SIZE = 10
const currentPage = ref(1)
const isLoading = ref(false)

// 只在"最新"标签页显示新人福利
const showBenefit = computed(() => {
  return props.activeTab === 'latest'
})

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

// 计算当前显示的会员列表
const displayMembers = computed(() => {
  return props.members.slice(0, currentPage.value * PAGE_SIZE)
})

const isFinished = computed(() => {
  return displayMembers.value.length >= props.members.length
})

// 加载更多数据
const onLoad = () => {
  if (isLoading.value || isFinished.value) return
  
  isLoading.value = true
  setTimeout(() => {
    currentPage.value++
    isLoading.value = false
  }, 300)
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
</script>

<style scoped>
.tab-content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
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
</style> 