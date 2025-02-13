<template>
  <div class="basic-info">
    <adm-form
      :model="formData"
      @submit="onSubmit"
    >
      <adm-form-item
        label="昵称"
        name="nickname"
        :rules="[{ required: true, message: '请填写昵称' }]"
      >
        <adm-input v-model="formData.nickname" placeholder="请输入昵称" />
      </adm-form-item>

      <adm-form-item
        label="性别"
        name="gender"
        :rules="[{ required: true, message: '请选择性别' }]"
      >
        <adm-radio-group v-model="formData.gender">
          <adm-radio value="male">男</adm-radio>
          <adm-radio value="female">女</adm-radio>
        </adm-radio-group>
      </adm-form-item>

      <adm-form-item
        label="出生日期"
        name="birthDate"
        :rules="[{ required: true, message: '请选择出生日期' }]"
      >
        <adm-date-picker
          v-model="formData.birthDate"
          :min="minDate"
          :max="maxDate"
          @confirm="onConfirmDate"
        >
          <template #default="{ open }">
            <adm-input
              readonly
              :value="formData.birthDate"
              placeholder="请选择出生日期"
              @click="open"
            />
          </template>
        </adm-date-picker>
      </adm-form-item>

      <adm-form-item
        label="所在城市"
        name="city"
        :rules="[{ required: true, message: '请选择所在城市' }]"
      >
        <adm-cascader
          v-model="formData.city"
          :options="cityOptions"
          placeholder="请选择所在城市"
        >
          <template #default="{ open }">
            <adm-input
              readonly
              :value="formData.cityText"
              placeholder="请选择所在城市"
              @click="open"
            />
          </template>
        </adm-cascader>
      </adm-form-item>

      <!-- 底部按钮 -->
      <div class="form-buttons">
        <adm-button block type="submit" color="primary">下一步</adm-button>
      </div>
    </adm-form>
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