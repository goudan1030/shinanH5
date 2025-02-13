<template>
  <div class="messages">
    <adm-nav-bar>消息</adm-nav-bar>
    <div class="content">
      <div class="empty-state">
        <p>消息功能开发中...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NavBar } from 'antd-mobile'
</script>

<style scoped>
.messages {
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