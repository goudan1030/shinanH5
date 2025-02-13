<template>
  <div class="match-list">
    <PullToRefresh v-model="refreshing" @refresh="onRefresh">
      <List>
        <List.Item
          v-for="match in matches"
          :key="match.id"
          :description="match.city"
          clickable
        >
          {{ match.match_no }}
        </List.Item>
      </List>
    </PullToRefresh>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { List, PullToRefresh } from 'antd-mobile'

defineProps({
  matches: Array
})

const refreshing = ref(false)

const onRefresh = async () => {
  // 实现刷新逻辑
}
</script> 