<template>
  <div class="register-page">
    <NavBar @back="handleBack">信息登记</NavBar>
    <!-- 顶部步骤条 -->
    <Steps :current="currentStep">
      <Steps.Step v-for="(step, index) in steps" :key="index" :title="step.text" />
    </Steps>
    
    <!-- 步骤内容区域 -->
    <div class="step-content">
      <component 
        :is="currentComponent" 
        @next="handleNext"
        @prev="handlePrev"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Steps, NavBar } from 'antd-mobile'
import { useRouter } from 'vue-router'
import BasicInfo from '@/components/register/BasicInfo.vue'
import DetailInfo from '@/components/register/DetailInfo.vue'
import PhotoUpload from '@/components/register/PhotoUpload.vue'
import Preferences from '@/components/register/Preferences.vue'

const router = useRouter()

const AdmSteps = Steps
const AdmStep = Steps.Step

const steps = [
  { text: '基本信息' },
  { text: '详细资料' },
  { text: '照片上传' },
  { text: '择偶意向' }
]

const currentStep = ref(0)

// 根据当前步骤返回对应的组件
const currentComponent = computed(() => {
  switch (currentStep.value) {
    case 0:
      return BasicInfo
    case 1:
      return DetailInfo
    case 2:
      return PhotoUpload
    case 3:
      return Preferences
    default:
      return BasicInfo
  }
})

// 处理下一步
const handleNext = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

// 处理上一步
const handlePrev = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

// 添加返回处理函数
const handleBack = () => {
  router.back()
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: #F7F8FC;
  padding: 24px;
}

.step-content {
  margin-top: 16px;
  padding: 0 16px;
}

:deep(.adm-steps) {
  padding: 24px 16px;
  background: #fff;
  margin-top: 12px;
}
</style> 