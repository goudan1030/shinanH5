<template>
  <div class="preferences">
    <Form
      :model="formData"
      @submit="onSubmit"
    >
      <Form.Item
        label="年龄要求"
        name="ageRange"
        :rules="[{ required: true, message: '请选择年龄要求' }]"
      >
        <Selector
          v-model="formData.ageRange"
          :options="ageOptions"
          multiple
        />
      </Form.Item>

      <Form.Item
        label="身高要求"
        name="heightRange"
        :rules="[{ required: true, message: '请选择身高要求' }]"
      >
        <Selector
          v-model="formData.heightRange"
          :options="heightOptions"
          multiple
        />
      </Form.Item>

      <Form.Item
        label="学历要求"
        name="education"
        :rules="[{ required: true, message: '请选择学历要求' }]"
      >
        <Selector
          v-model="formData.education"
          :options="educationOptions"
          multiple
        />
      </Form.Item>

      <Form.Item
        label="期望地区"
        name="location"
        :rules="[{ required: true, message: '请选择期望地区' }]"
      >
        <Cascader
          v-model="formData.location"
          :options="cityOptions"
          placeholder="请选择期望地区"
        >
          <template #default="{ open }">
            <Input
              readonly
              :value="formData.locationText"
              placeholder="请选择期望地区"
              @click="open"
            />
          </template>
        </Cascader>
      </Form.Item>

      <Form.Item
        label="月收入要求"
        name="income"
        :rules="[{ required: true, message: '请选择月收入要求' }]"
      >
        <Selector
          v-model="formData.income"
          :options="incomeOptions"
          multiple
        />
      </Form.Item>

      <!-- 底部按钮 -->
      <div class="form-buttons">
        <Space direction="vertical" block>
          <Button block @click="handlePrev">上一步</Button>
          <Button block type="submit" color="primary">完成</Button>
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
  Selector,
  Cascader,
  Button,
  Space
} from 'antd-mobile'

const emit = defineEmits(['next', 'prev'])

const formData = reactive({
  ageRange: [],
  heightRange: [],
  education: [],
  location: [],
  locationText: '',
  income: []
})

const ageOptions = [
  { label: '18-25岁', value: '18-25' },
  { label: '26-30岁', value: '26-30' },
  { label: '31-35岁', value: '31-35' },
  { label: '36-40岁', value: '36-40' },
  { label: '41岁以上', value: '41+' }
]

const heightOptions = [
  { label: '150-160cm', value: '150-160' },
  { label: '161-170cm', value: '161-170' },
  { label: '171-180cm', value: '171-180' },
  { label: '181-190cm', value: '181-190' },
  { label: '190cm以上', value: '190+' }
]

const educationOptions = [
  { label: '高中及以下', value: 'highschool' },
  { label: '大专', value: 'college' },
  { label: '本科', value: 'bachelor' },
  { label: '硕士', value: 'master' },
  { label: '博士', value: 'phd' }
]

const incomeOptions = [
  { label: '3000以下', value: '3000-' },
  { label: '3000-5000', value: '3000-5000' },
  { label: '5000-8000', value: '5000-8000' },
  { label: '8000-12000', value: '8000-12000' },
  { label: '12000-20000', value: '12000-20000' },
  { label: '20000以上', value: '20000+' }
]

// 示例城市数据
const cityOptions = [
  {
    label: '广东省',
    value: 'guangdong',
    children: [
      {
        label: '深圳市',
        value: 'shenzhen'
      },
      {
        label: '广州市',
        value: 'guangzhou'
      }
    ]
  }
]

const handlePrev = () => {
  emit('prev')
}

const onSubmit = () => {
  emit('next')
}
</script>

<style scoped>
.preferences {
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

:deep(.adm-selector) {
  --border-radius: 20px;
}

:deep(.adm-selector-item) {
  margin-right: 8px;
  margin-bottom: 8px;
}
</style> 