<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useAuthStore()

onMounted(async () => {
  console.log('App mounted')
  console.log('Initial state:', {
    token: store.token ? store.token.substring(0, 20) + '...' : null,
    user: store.user
  })
  
  const isLoggedIn = await store.initialize()
  
  console.log('App initialized:', {
    isLoggedIn,
    user: store.user,
    status: store.checkUserStatus()
  })
  
  // 根据登录状态和当前路由决定是否需要跳转
  const currentRoute = router.currentRoute.value
  if (!isLoggedIn && currentRoute.meta.requiresAuth) {
    console.log('Redirecting to login')
    router.push('/login')
  }
})
</script>

<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style>
/* 重置默认样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
}

/* 全局背景色 */
:root {
  --app-background: #F7F8FC;
  --primary-color: #02C588;
  --primary-color-hover: #02b37b;
}

body, #app {
  background-color: var(--app-background);
}

/* 确保所有页面容器也使用相同的背景色 */
.page-container {
  background-color: var(--app-background);
  min-height: 100vh;
}

/* TDesign 全局主题色覆盖 */
:root {
  --td-brand-color: #02C588;
  --td-brand-color-hover: #02b37b;
  --td-brand-color-active: #029e6d;
  --td-brand-color-disabled: rgba(2, 197, 136, 0.4);
  --td-brand-color-light: rgba(2, 197, 136, 0.1);
  --td-brand-color-focus: rgba(2, 197, 136, 0.2);
  
  /* 链接和文字按钮颜色 */
  --td-link-color: #02C588;
  --td-text-color-primary: #02C588;
  --td-text-color-brand: #02C588;
}

/* TDesign 按钮文字颜色覆盖 */
.t-button.t-button--text {
  color: #02C588;
}

.t-button.t-button--text:active {
  color: #02b37b;
}

/* 弹窗按钮文字颜色 */
.t-dialog__confirm {
  color: #02C588 !important;
}

.t-dialog__confirm:active {
  color: #02b37b !important;
}
</style>
