<template>
  <div class="news-card" @click="handleClick">
    <div class="news-cover">
      <img :src="news.cover_url" :alt="news.title">
    </div>
    <div class="news-content">
      <div class="news-title">{{ news.title }}</div>
      <div class="news-desc">{{ news.summary || '暂无简介' }}</div>
      <div class="news-time">
        {{ formatTime(news.created_at) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Article } from '@/types/article'
import dayjs from 'dayjs'

const props = defineProps<{
  news: Article
}>()

const router = useRouter()

const handleClick = () => {
  if (props.news.link_url) {
    window.open(props.news.link_url, '_blank')
  } else {
    router.push(`/article/${props.news.id}`)
  }
}

const formatTime = (time: string) => {
  return dayjs(time).format('YYYY-MM-DD')
}
</script>

<style scoped>
.news-card {
  background: #fff;
  border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
}

.news-cover {
  width: 100%;
  height: 160px;
  border-radius: 12px 12px 0 0;
  overflow: hidden;
}

.news-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.news-content {
  padding: 12px;
  text-align: left;
}

.news-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  line-height: 1.4;
  /* 标题最多两行 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.news-desc {
  font-size: 14px;
  color: #999;
  line-height: 1.4;
  margin-top: 4px;
  /* 描述最多一行 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.news-footer {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
}

.publish-time {
  font-size: 12px;
  color: #999;
}
</style> 