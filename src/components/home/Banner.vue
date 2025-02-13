<template>
  <div class="banner">
    <van-swipe class="banner-swipe" :autoplay="3000" indicator-color="#02C588">
      <van-swipe-item v-for="(item, index) in getBannerItems" :key="index">
        <div class="banner-content">
          <div class="banner-text">
            {{ item.title }}
          </div>
        </div>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Swipe as VanSwipe, SwipeItem as VanSwipeItem } from 'vant'

const props = defineProps<{
  type?: 'hot' | 'latest' | 'news'
}>()

// 根据不同类型返回不同的轮播数据
const getBannerItems = computed(() => {
  switch (props.type) {
    case 'hot':
      return [
        { title: '热门板块 Banner 1' },
        { title: '热门板块 Banner 2' },
        { title: '热门板块 Banner 3' }
      ]
    case 'latest':
      return [
        { title: '最新板块 Banner 1' },
        { title: '最新板块 Banner 2' },
        { title: '最新板块 Banner 3' }
      ]
    case 'news':
      return [
        { title: '干货板块 Banner 1' },
        { title: '干货板块 Banner 2' },
        { title: '干货板块 Banner 3' }
      ]
    default:
      return []
  }
})
</script>

<style scoped>
.banner {
  width: 100%;
  height: 120px;
  background: linear-gradient(180deg, #02C588 0%, #02B578 100%);
  border-radius: 10px;
  overflow: hidden;
}

.banner-swipe {
  height: 100%;
}

.banner-content {
  height: 100%;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-text {
  color: #fff;
  font-size: 16px;
  font-weight: 500;
}

:deep(.van-swipe__indicator) {
  width: 6px;
  height: 6px;
  opacity: 0.6;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.6);
  transition: all 0.3s;
}

:deep(.van-swipe__indicator--active) {
  width: 12px;
  opacity: 1;
  background-color: #fff;
}
</style> 