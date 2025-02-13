<template>
  <div class="detail-info">
    <adm-form
      :model="formData"
      @submit="onSubmit"
    >
      <adm-form-item
        label="身高"
        name="height"
        :rules="[{ required: true, message: '请填写身高' }]"
      >
        <adm-stepper
          v-model="formData.height"
          :min="140"
          :max="220"
          :step="1"
        >
          <template #default="{ value }">
            <adm-input
              readonly
              :value="value ? `${value}cm` : ''"
              placeholder="请选择身高"
            />
          </template>
        </adm-stepper>
      </adm-form-item>

      <adm-form-item
        label="学历"
        name="education"
        :rules="[{ required: true, message: '请选择学历' }]"
      >
        <adm-picker
          v-model="formData.education"
          :columns="[educationOptions]"
        >
          <template #default="{ open }">
            <adm-input
              readonly
              :value="formData.education"
              placeholder="请选择学历"
              @click="open"
            />
          </template>
        </adm-picker>
      </adm-form-item>

      <adm-form-item
        label="月收入"
        name="income"
        :rules="[{ required: true, message: '请选择月收入' }]"
      >
        <adm-picker
          v-model="formData.income"
          :columns="[incomeOptions]"
        >
          <template #default="{ open }">
            <adm-input
              readonly
              :value="formData.income"
              placeholder="请选择月收入"
              @click="open"
            />
          </template>
        </adm-picker>
      </adm-form-item>

      <adm-form-item
        label="职业"
        name="job"
        :rules="[{ required: true, message: '请填写职业' }]"
      >
        <adm-input v-model="formData.job" placeholder="请输入职业" />
      </adm-form-item>

      <adm-form-item
        label="个人介绍"
        name="introduction"
        :rules="[{ required: true, message: '请填写个人介绍' }]"
      >
        <adm-text-area
          v-model="formData.introduction"
          placeholder="请简单介绍一下自己"
          :rows="4"
          :maxlength="200"
          show-count
        />
      </adm-form-item>

      <!-- 底部按钮 -->
      <div class="form-buttons">
        <adm-space direction="vertical" block>
          <adm-button block @click="handlePrev">上一步</adm-button>
          <adm-button block type="submit" color="primary">下一步</adm-button>
        </adm-space>
      </div>
    </adm-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { 
  Form,
  Input,
  TextArea,
  Picker,
  Stepper,
  Button,
  Space
} from 'antd-mobile'

const emit = defineEmits(['next', 'prev'])

const formData = reactive({
  height: undefined,
  education: '',
  income: '',
  job: '',
  introduction: ''
})

const educationOptions = [
  '高中及以下',
  '大专',
  '本科',
  '硕士',
  '博士'
]

const incomeOptions = [
  '3000以下',
  '3000-5000',
  '5000-8000',
  '8000-12000',
  '12000-20000',
  '20000以上'
]

const handlePrev = () => {
  emit('prev')
}

const onSubmit = () => {
  emit('next')
}
</script>

<style scoped>
.detail-info {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
}

.form-buttons {
  margin-top: 24px;
}

:deep(.adm-form-item) {
  margin-bottom: 16px;
}

:deep(.adm-text-area) {
  --font-size: 14px;
  background: var(--adm-color-box);
  padding: 8px;
}
</style> 