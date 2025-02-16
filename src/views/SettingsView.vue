<template>
  <div class="settings">
    <NavBar title="设置" />
    
    <div class="content">
      <div class="menu-list">
        <t-cell-group>
          <t-cell
            title="账号安全"
            arrow
            @click="handleSecurity"
          />
          <t-cell
            title="隐私设置"
            arrow
            @click="handlePrivacy"
          />
          <t-cell
            title="关于我们"
            arrow
            @click="handleAbout"
          />
        </t-cell-group>
      </div>

      <!-- 退出登录按钮 -->
      <t-button
        block
        theme="danger"
        @click="handleLogout"
        class="logout-btn"
      >
        退出登录
      </t-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { 
  CellGroup as TCellGroup,
  Cell as TCell,
  Button as TButton,
  MessagePlugin,
  DialogPlugin,
} from 'tdesign-mobile-vue'
import NavBar from '@/components/common/NavBar.vue'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  DialogPlugin.confirm({
    title: '退出登录',
    content: '确定要退出登录吗？',
    confirmBtn: {
      content: '退出',
      variant: 'base',
      theme: 'danger'
    },
    cancelBtn: '取消',
    onConfirm: () => {
      authStore.logout()
      router.push('/login')
      MessagePlugin.success('已退出登录')
    },
    onCancel: () => {
      console.log('用户取消退出登录')
    }
  })
}

const handleSecurity = () => {
  // TODO: 实现账号安全页面跳转
}

const handlePrivacy = () => {
  // TODO: 实现隐私设置页面跳转
}

const handleAbout = () => {
  // TODO: 实现关于我们页面跳转
}
</script>

<style scoped>
.settings {
  min-height: 100vh;
  background: var(--app-background);
  padding-top: 44px;  /* 为 navbar 预留空间 */
}

.content {
  padding: 16px;
}

.menu-list {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.logout-btn {
  margin-top: 20px;
}

:deep(.t-cell) {
  padding: 16px;
}

:deep(.t-cell__title) {
  font-size: 16px;
  color: #333;
}

:deep(.t-button--primary) {
  background-color: #02C588;
  border-color: #02C588;
}

:deep(.t-button--primary:active) {
  background-color: #02b37b;
  border-color: #02b37b;
}

:deep(.t-cell--hover) {
  background-color: rgba(2, 197, 136, 0.06);
}

:deep(.t-cell__right-icon) {
  color: #02C588;
}

:deep(.t-dialog) {
  border-radius: 12px;
}

:deep(.t-dialog__header) {
  padding: 24px 24px 16px;
}

:deep(.t-dialog__body) {
  padding: 0 24px 24px;
  color: #666;
}

:deep(.t-dialog__footer) {
  padding: 0 16px 16px;
}

:deep(.t-button--danger) {
  background-color: #ff4d4f;
  border-color: #ff4d4f;
  color: white;
}

:deep(.t-dialog__confirm.t-button--primary) {
  background-color: #02C588;
  border-color: #02C588;
  color: white;
}

:deep(.t-dialog__confirm.t-button--primary:active) {
  background-color: #02b37b;
  border-color: #02b37b;
}
</style> 