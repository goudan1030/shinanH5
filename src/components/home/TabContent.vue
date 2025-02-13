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
      <div class="member-list">
        <MemberCard
          v-for="member in members"
          :key="member.id"
          :member="member"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Banner from './Banner.vue'
import MemberCard from './MemberCard.vue'
import NewUserBenefit from './NewUserBenefit.vue'
import NewsCard from './NewsCard.vue'

const props = defineProps<{
  activeTab: string
}>()

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

// 模拟数据
const members = ref([
  {
    id: '1',
    avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    nickname: '阳光男孩',
    gender: 'male',
    city: '深圳',
    birthYear: 1985,
    birthMonth: 6,
    education: '本科',
    job: '产品经理',
    introduction: '身高178，计算机专业，深圳某互联网公司产品经理，喜欢运动和阅读。希望找一个温柔善良的女生共度余生。',
    childNeeds: ['想要孩子', '接受对方带孩子'],
    marriageNeeds: ['一年内领证', '共同生活'],
    updateTime: new Date('2024-01-20')
  },
  {
    id: '2',
    avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    nickname: '温柔女孩',
    gender: 'female',
    city: '北京',
    birthYear: 1990,
    birthMonth: 3,
    education: '研究生',
    job: '设计师',
    introduction: '身高165，性格开朗，喜欢旅行和美食。希望找一个成熟稳重的男生，共同经营美好生活。',
    childNeeds: ['暂不要孩子', '接受对方带孩子'],
    marriageNeeds: ['两年内领证', '共同生活'],
    updateTime: new Date('2024-02-15')
  },
  {
    id: '3',
    avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    nickname: '事业男',
    gender: 'male',
    city: '上海',
    birthYear: 1988,
    birthMonth: 9,
    education: '本科',
    job: '创业者',
    introduction: '身高180，创业公司CEO，工作稳定，有房有车。寻找一位善解人意的女生，共创美好未来。',
    childNeeds: ['想要孩子'],
    marriageNeeds: ['一年内领证', '共同生活'],
    updateTime: new Date('2024-02-18')
  },
  {
    id: '4',
    avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    nickname: '知性女生',
    gender: 'female',
    city: '广州',
    birthYear: 1992,
    birthMonth: 12,
    education: '研究生',
    job: '大学教师',
    introduction: '身高162，性格温和，喜欢读书和音乐。希望找一个有共同爱好的伴侣，共度美好时光。',
    childNeeds: ['想要孩子'],
    marriageNeeds: ['三年内领证'],
    updateTime: new Date('2024-02-19')
  },
  {
    id: '5',
    avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    nickname: '工程师',
    gender: 'male',
    city: '杭州',
    birthYear: 1989,
    birthMonth: 7,
    education: '本科',
    job: '软件工程师',
    introduction: '身高175，互联网公司高级工程师，性格随和，有稳定工作和房产。寻找一位温柔贤惠的女生。',
    childNeeds: ['想要孩子', '接受对方带孩子'],
    marriageNeeds: ['两年内领证', '共同生活'],
    updateTime: new Date()
  }
])

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
</style> 