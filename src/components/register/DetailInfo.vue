<template>
  <div class="detail-info">
    <Form
      :model="formData"
      @submit="onSubmit"
    >
      <Form.Item
        label="身高"
        name="height"
        :rules="[{ required: true, message: '请填写身高' }]"
      >
        <Stepper
          v-model="formData.height"
          :min="140"
          :max="220"
          :step="1"
        >
          <template #default="{ value }">
            <Input
              readonly
              :value="value ? `${value}cm` : ''"
              placeholder="请选择身高"
            />
          </template>
        </Stepper>
      </Form.Item>

      <Form.Item
        label="学历"
        name="education"
        :rules="[{ required: true, message: '请选择学历' }]"
      >
        <Picker
          v-model="formData.education"
          :columns="[educationOptions]"
        >
          <template #default="{ open }">
            <Input
              readonly
              :value="formData.education"
              placeholder="请选择学历"
              @click="open"
            />
          </template>
        </Picker>
      </Form.Item>

      <Form.Item
        label="月收入"
        name="income"
        :rules="[{ required: true, message: '请选择月收入' }]"
      >
        <Picker
          v-model="formData.income"
          :columns="[incomeOptions]"
        >
          <template #default="{ open }">
            <Input
              readonly
              :value="formData.income"
              placeholder="请选择月收入"
              @click="open"
            />
          </template>
        </Picker>
      </Form.Item>

      <Form.Item
        label="职业"
        name="job"
        :rules="[{ required: true, message: '请填写职业' }]"
      >
        <Input v-model="formData.job" placeholder="请输入职业" />
      </Form.Item>

      <Form.Item
        label="个人介绍"
        name="introduction"
        :rules="[{ required: true, message: '请填写个人介绍' }]"
      >
        <TextArea
          v-model="formData.introduction"
          placeholder="请简单介绍一下自己"
          :rows="4"
          :maxlength="200"
          show-count
        />
      </Form.Item>

      <!-- 底部按钮 -->
      <div class="form-buttons">
        <Space direction="vertical" block>
          <Button block @click="handlePrev">上一步</Button>
          <Button block type="submit" color="primary">下一步</Button>
        </Space>
      </div>
    </Form>
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
  Space,
  Toast
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

:deep(.adm-textarea) {
  --font-size: 14px;
  background: var(--adm-color-box);
  padding: 8px;
}
</style> 