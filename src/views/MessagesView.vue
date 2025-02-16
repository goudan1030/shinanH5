<template>
  <div class="messages">
    <div class="empty-state">
      <p>页面开发中...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.messages {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #999;
}
</style> 