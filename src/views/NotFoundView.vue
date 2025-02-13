<template>
  <div class="page-container">
    <div class="gradient-header"></div>
    
    <div class="not-found-container">
      <h2 class="not-found-title">404</h2>
      <p class="not-found-text">抱歉，页面未找到</p>
      
      <button
        @click="handleBack"
        class="back-btn"
      >
        返回首页
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const store = useAuthStore()

const handleBack = () => {
  if (store.token) {
    router.push('/home')
  } else {
    router.push('/login')
  }
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  position: relative;
  background-color: #fff;
}

.gradient-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(180deg, rgba(2, 197, 136, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
}

.not-found-container {
  position: relative;
  max-width: 400px;
  margin: 0 auto;
  padding: 150px 20px 40px;
  text-align: center;
}

.not-found-title {
  font-size: 72px;
  color: #02C588;
  margin-bottom: 20px;
}

.not-found-text {
  font-size: 18px;
  color: #666;
  margin-bottom: 40px;
}

.back-btn {
  width: 200px;
  height: 44px;
  padding: 0;
  background-color: #02C588;
  color: white;
  border: none;
  border-radius: 22px;
  font-size: 16px;
  cursor: pointer;
}

.back-btn:hover {
  opacity: 0.9;
}
</style> 