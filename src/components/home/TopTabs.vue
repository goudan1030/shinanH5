<template>
  <div class="top-tabs-container">
    <div class="tabs-wrapper">
      <!-- 标签页 -->
      <div class="tabs">
        <div 
          v-for="tab in tabs" 
          :key="tab.key"
          class="tab-item"
          :class="{ active: modelValue === tab.key }"
          @click="$emit('update:modelValue', tab.key)"
        >
          {{ tab.title }}
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <div class="filter-button" @click="$emit('filter')">
          <span class="filter-text">筛选</span>
          <van-icon name="filter-o" class="action-icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon as VanIcon } from 'vant'

defineProps<{
  modelValue: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search'): void
  (e: 'filter'): void
}>()

const tabs = [
  { key: 'hot', title: '热门' },
  { key: 'latest', title: '最新' },
  { key: 'news', title: '干货' }
]
</script>

<style scoped>
.top-tabs-container {
}

.tabs-wrapper {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 16px 0;
  height: 56px;
}

.tabs {
  display: flex;
  gap: 24px;
  height: 32px;
  align-items: flex-end;
}

.tab-item {
  font-size: 18px;
  color: #999;
  cursor: pointer;
  transition: all 0.3s;
  line-height: 1;
  padding-bottom: 2px;
}

.tab-item.active {
  font-size: 24px;
  color: #000;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  align-items: center;
  padding-bottom: 4px;
}

.filter-button {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.filter-text {
  font-size: 14px;
  color: #666;
}

.action-icon {
  font-size: 24px;
  color: #666;
}
</style> 