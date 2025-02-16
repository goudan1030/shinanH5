<template>
  <t-navbar
    :title="title"
    class="navbar"
  >
    <!-- 自定义左侧返回按钮 -->
    <template #left>
      <div class="back-btn" @click="handleBack">
        <t-icon name="chevron-left" />
      </div>
    </template>
  </t-navbar>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { 
  Navbar as TNavbar,
  Icon as TIcon
} from 'tdesign-mobile-vue'

defineProps<{
  title: string
}>()

const router = useRouter()

const handleBack = () => {
  router.back()
}
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  position: fixed;
  left: 0;
  right: 0;
}

:deep(.t-navbar) {
  height: 44px;
  border-bottom: 1px solid #f5f5f5;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  cursor: pointer;
}

.back-btn:active {
  opacity: 0.7;
}

:deep(.t-icon) {
  font-size: 20px;
  color: #333;
}

:deep(.t-navbar__title) {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}
</style> 