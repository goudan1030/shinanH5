<template>
  <div class="statistics">
    <div class="grid">
      <Card class="grid-item">
        <div class="stat-item">
          <div class="stat-value">{{ stats?.totalMembers || 0 }}</div>
          <div class="stat-label">总会员数</div>
        </div>
      </Card>
      <Card class="grid-item">
        <div class="stat-item">
          <div class="stat-value">{{ stats?.activeMembers || 0 }}</div>
          <div class="stat-label">活跃会员</div>
        </div>
      </Card>
      <Card class="grid-item">
        <div class="stat-item">
          <div class="stat-value">{{ stats?.todayNewMembers || 0 }}</div>
          <div class="stat-label">今日新增</div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card } from 'antd-mobile'
import { defineProps } from 'vue'

defineProps({
  stats: Object
})
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 12px;
}

.grid-item {
  width: 100%;
}

.stat-item {
  text-align: center;
  padding: 12px;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: #02C588;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}
</style> 