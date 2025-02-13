<template>
  <div class="basic-info">
    <Form>
      <Form.Item
        label="昵称"
        name="nickname"
        :rules="[{ required: true, message: '请填写昵称' }]"
      >
        <Input v-model="formData.nickname" placeholder="请输入昵称" />
      </Form.Item>

      <Form.Item
        label="性别"
        name="gender"
        :rules="[{ required: true, message: '请选择性别' }]"
      >
        <Radio.Group v-model="formData.gender">
          <Radio value="male">男</Radio>
          <Radio value="female">女</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        label="出生日期"
        name="birthDate"
        :rules="[{ required: true, message: '请选择出生日期' }]"
      >
        <DatePicker
          v-model="formData.birthDate"
          :min="minDate"
          :max="maxDate"
          @confirm="onConfirmDate"
        >
          <template #default="{ open }">
            <Input
              readonly
              :value="formData.birthDate"
              placeholder="请选择出生日期"
              @click="open"
            />
          </template>
        </DatePicker>
      </Form.Item>

      <Form.Item
        label="所在城市"
        name="city"
        :rules="[{ required: true, message: '请选择所在城市' }]"
      >
        <Cascader
          v-model="formData.city"
          :options="cityOptions"
          placeholder="请选择所在城市"
        >
          <template #default="{ open }">
            <Input
              readonly
              :value="formData.cityText"
              placeholder="请选择所在城市"
              @click="open"
            />
          </template>
        </Cascader>
      </Form.Item>

      <!-- 底部按钮 -->
      <div class="form-buttons">
        <Button block type="submit" color="primary">下一步</Button>
      </div>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Form, Input, Radio, DatePicker, Cascader, Button } from 'antd-mobile'

const emit = defineEmits(['next'])

const formData = reactive({
  nickname: '',
  gender: 'male',
  birthDate: '',
  city: [],
  cityText: ''
})

// 日期范围：18-60岁
const now = new Date()
const minDate = new Date(now.getFullYear() - 60, now.getMonth(), now.getDate())
const maxDate = new Date(now.getFullYear() - 18, now.getMonth(), now.getDate())

const onConfirmDate = (val: Date) => {
  formData.birthDate = val.toLocaleDateString('zh-CN')
}

// 城市选项（示例数据）
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

const onSubmit = () => {
  emit('next')
}
</script>

<style scoped>
.basic-info {
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

:deep(.adm-radio-group) {
  display: flex;
  gap: 24px;
}
</style> 