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
  /* 链接和文字按钮颜色 */
  --td-link-color: #02C588;
  --td-text-color-primary: #02C588;
  --td-text-color-brand: #02C588;
  
  /* 单选框相关变量 */
  --td-radio-checked-color: #02C588;
  --td-radio-dot-color: #02C588;
  --td-radio-hover-color: #02b37b;
  --td-radio-disabled-color: rgba(2, 197, 136, 0.4);
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

/* TDesign 步骤条样式覆盖 */
.t-step .t-step-item .t-step-item__circle.t-step-item__circle--process {
  background-color: #02C588 !important;
  border-color: #02C588 !important;
}

.t-step .t-step-item .t-step-item__title.t-step-item__title--process {
  color: #02C588 !important;
}

.t-step .t-step-item .t-step-item__circle.t-step-item__circle--finish {
  color: #02C588 !important;
  border-color: #02C588 !important;
}

.t-step .t-step-item .t-step-item__line.t-step-item__line--finish {
  background-color: #02C588 !important;
}

.t-step .t-step-item .t-step-item__title.t-step-item__title--finish {
  color: #333 !important;
}

/* 步骤条基础样式覆盖 */
.t-steps {
  --td-step-item-circle-size: 24px !important;
  --td-steps-item-process-circle-bg: #02C588 !important;
  --td-steps-item-process-circle-color: #fff !important;
  --td-steps-item-process-title-color: #02C588 !important;
  --td-steps-item-finish-circle-color: #02C588 !important;
  --td-steps-item-finish-line-color: #02C588 !important;
}

/* 单选框样式覆盖 */
.t-radio__icon {
  color: #02C588 !important;
}

.t-radio__input:checked + .t-radio__label .t-radio__icon {
  background-color: #02C588 !important;
  border-color: #02C588 !important;
}

.t-radio__input:checked + .t-radio__label {
  color: #02C588 !important;
}
</style>
