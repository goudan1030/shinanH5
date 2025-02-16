<template>
  <div class="register-page">
    <NavBar title="信息登记" />
    
    <!-- 步骤条 -->
    <t-steps :current="currentStep" layout="horizontal">
      <t-step-item title="基本信息" />
      <t-step-item title="详细资料" />
      <t-step-item title="形婚需求" />
      <t-step-item title="联系方式" />
    </t-steps>
    
    <div class="form-wrapper">
      <t-form 
        :data="formData"
        @submit="onSubmit"
        class="register-form"
      >
        <!-- 性别 -->
        <t-form-item label="性别" name="gender" class="inline-form-item">
          <t-radio-group v-model="formData.gender">
            <t-radio value="male">男</t-radio>
            <t-radio value="female">女</t-radio>
          </t-radio-group>
        </t-form-item>
        
        <!-- 出生年月 -->
        <t-form-item label="出生年月" name="birthday" class="inline-form-item">
          <t-input
            v-model="formData.birthday"
            placeholder="请输入出生年月，如：1990-01"
            type="text"
          />
        </t-form-item>
        
        <!-- 身高 -->
        <t-form-item label="身高" name="height" class="inline-form-item">
          <t-input
            v-model="formData.height"
            type="number"
            placeholder="请输入身高"
          />
          <span class="unit">cm</span>
        </t-form-item>
        
        <!-- 体重 -->
        <t-form-item label="体重" name="weight" class="inline-form-item">
          <t-input
            v-model="formData.weight"
            type="number"
            placeholder="请输入体重"
          />
          <span class="unit">kg</span>
        </t-form-item>
        
        <!-- 学历 -->
        <t-form-item label="学历" name="education" class="inline-form-item">
          <t-picker
            v-model="formData.education"
            :columns="[educationOptions]"
          />
        </t-form-item>
        
        <!-- 职业 -->
        <t-form-item label="职业" name="occupation" class="inline-form-item">
          <t-input
            v-model="formData.occupation"
            placeholder="请输入您的职业"
          />
        </t-form-item>
        
        <!-- 感情状态 -->
        <t-form-item label="感情状态" name="relationship" class="inline-form-item">
          <t-radio-group v-model="formData.relationship">
            <t-radio value="single">单身</t-radio>
            <t-radio value="inRelationship">有对象</t-radio>
          </t-radio-group>
        </t-form-item>
        
        <!-- 婚姻状态 -->
        <t-form-item label="婚姻状态" name="maritalStatus" class="inline-form-item">
          <t-radio-group v-model="formData.maritalStatus">
            <t-radio value="never">未婚</t-radio>
            <t-radio value="divorced">离异</t-radio>
            <t-radio value="widowed">丧偶</t-radio>
          </t-radio-group>
        </t-form-item>
        
        <!-- 提交按钮 -->
        <t-button block theme="primary" type="submit">
          下一步
        </t-button>
      </t-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NavBar from '@/components/common/NavBar.vue'
import { 
  Steps as TSteps,
  StepItem as TStepItem,
  Form as TForm,
  FormItem as TFormItem,
  RadioGroup as TRadioGroup,
  Radio as TRadio,
  Picker as TPicker,
  Input as TInput,
  Button as TButton
} from 'tdesign-mobile-vue'

// 当前步骤
const currentStep = ref(0)

// 表单数据
const formData = ref({
  gender: '',
  birthday: '',
  height: '',
  weight: '',
  education: [] as string[],
  occupation: '',
  relationship: '',
  maritalStatus: ''
})

// 学历选项
const educationOptions = [
  { label: '高中及以下', value: '高中及以下' },
  { label: '大专', value: '大专' },
  { label: '本科', value: '本科' },
  { label: '硕士', value: '硕士' },
  { label: '博士', value: '博士' }
]

// 表单提交
const onSubmit = () => {
  // TODO: 验证表单
  currentStep.value++
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: var(--app-background);
  padding-top: 44px;
}

:deep(.t-steps) {
  background: #fff;
  padding: 16px;
  margin-bottom: 12px;
}

:deep(.t-step-item) {
  flex: 1;
}

:deep(.t-step-item__title) {
  font-size: 12px;
}

:deep(.t-step-item__dot) {
  width: 8px;
  height: 8px;
}

:deep(.t-step-item__line::after) {
  height: 1px;
}

.form-wrapper {
  background: #fff;
}

.register-form {
  max-width: 600px;
  margin: 0 auto;
}

.inline-form-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  border-bottom: 1px solid #f5f5f5;
}

:deep(.t-form-item__label) {
  min-width: 80px;
  font-size: 14px;
  color: #333;
  margin-right: 16px;
  text-align: left;
  display: flex;
  justify-content: flex-start;
}

:deep(.t-form-item__content) {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  max-width: 70%;
}

:deep(.t-input) {
  flex: 1;
  text-align: right;
  font-size: 14px;
}

:deep(.t-radio-group) {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  font-size: 14px;
}

:deep(.t-input input) {
  text-align: right;
  font-size: 14px;
  height: 48px;
}

:deep(.t-picker__main) {
  text-align: right;
  font-size: 14px;
  height: 48px;
}

.unit {
  margin-left: 8px;
  color: #666;
  min-width: 30px;
  font-size: 14px;
}

:deep(.t-button) {
  margin-top: 32px;
  font-size: 14px;
}

:deep(.t-form-item) {
  margin-bottom: 0;
}

:deep(.t-radio) {
  height: 48px;
  line-height: 48px;
}

/* 覆盖 TDesign 默认的标签样式 */
:deep(.t-form--label-right) {
  .t-form-item__label {
    text-align: left;
    justify-content: flex-start;
  }
}
</style> 