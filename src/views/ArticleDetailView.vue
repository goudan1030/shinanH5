<template>
  <div class="article-detail">
    <!-- 导航栏 -->
    <NavBar title="文章详情" />
    
    <!-- 文章内容 -->
    <div class="article-content" v-if="article">
      <h1 class="title">{{ article.title }}</h1>
      <div class="meta">
        <span class="time">{{ formatTime(article.created_at) }}</span>
        <span class="views">阅读 {{ article.views }}</span>
      </div>
      <!-- 使用 v-html 渲染富文本内容 -->
      <div class="content" v-html="article.content"></div>
    </div>

    <!-- 加载状态 -->
    <van-loading v-else class="loading" size="24px" vertical>
      加载中...
    </van-loading>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Loading as VanLoading } from 'vant'
import NavBar from '@/components/common/NavBar.vue'
import { articleApi } from '@/api/article'
import type { Article } from '@/types/article'
import dayjs from 'dayjs'

const route = useRoute()
const article = ref<Article | null>(null)

const loadArticle = async () => {
  try {
    const id = Number(route.params.id)
    const res = await articleApi.getArticleById(id)
    if (res.success) {
      article.value = res.data
    }
  } catch (error) {
    console.error('获取文章详情失败:', error)
  }
}

const formatTime = (time: string) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm')
}

onMounted(() => {
  loadArticle()
})
</script>

<style scoped>
.article-detail {
  min-height: 100vh;
  background: #fff;
}

.article-content {
  padding: 20px 16px;
}

.title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
  margin: 0 0 12px;
}

.meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  color: #999;
  font-size: 14px;
}

.content {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
}

.content :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 12px 0;
}

.content :deep(p) {
  margin: 12px 0;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}
</style> 