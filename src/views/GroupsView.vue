<template>
  <div class="groups">
    <adm-nav-bar>群聊</adm-nav-bar>
    <div class="content">
      <div class="empty-state">
        <p>群聊功能开发中...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NavBar } from 'antd-mobile'
</script>

<style scoped>
.groups {
  min-height: 100vh;
  background: #F7F8FC;
}

.content {
  padding: 16px;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #999;
}
</style> 