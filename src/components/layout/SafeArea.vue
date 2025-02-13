<template>
  <div class="safe-area-container">
    <!-- 顶部安全区 -->
    <div class="safe-area-top"></div>
    
    <!-- 页面内容 -->
    <div class="safe-area-content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.safe-area-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: inherit;
}

.safe-area-top {
  padding-top: env(safe-area-inset-top);
  background: inherit;
}

.safe-area-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  height: calc(100vh - env(safe-area-inset-top));
}
</style> 