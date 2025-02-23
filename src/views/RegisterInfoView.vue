<template>
  <div class="register-page">
    <NavBar title="信息登记" />
    
    <!-- 添加主色背景块 -->
    <div class="color-block"></div>
    
    <div class="form-container">
      <div class="form-title">个人资料</div>
      <t-form
        ref="form"
        :data="formData"
        :rules="rules"
        label-align="top"
        reset-type="empty"
        show-error-message
        scroll-to-first-error="auto"
        layout="vertical"
      >
        <!-- 性别 -->
        <t-form-item label="1. 性别" name="gender">
          <div class="picker-trigger" @click="showGenderPicker = true">
            {{ getGenderLabel(formData.gender) || '请选择性别' }}
          </div>
          <t-popup v-model:visible="showGenderPicker" placement="bottom">
            <t-picker
              v-model="formData.gender"
              :columns="[genderOptions]"
              @confirm="onGenderConfirm"
              @cancel="showGenderPicker = false"
              title="选择性别"
            />
          </t-popup>
        </t-form-item>
        
        <!-- 出生年月 -->
        <t-form-item label="2. 出生年月" name="birthday">
          <t-input
            v-model="formData.birthday"
            placeholder="请输入出生年月，如：1990-01"
            type="text"
            borderless
          />
        </t-form-item>
        
        <!-- 身高 -->
        <t-form-item label="3. 身高" name="height">
          <t-input
            v-model="formData.height"
            type="number"
            placeholder="请输入身高(cm)"
            borderless
          />
        </t-form-item>
        
        <!-- 体重 -->
        <t-form-item label="4. 体重" name="weight">
          <t-input
            v-model="formData.weight"
            type="number"
            placeholder="请输入体重(kg)"
            borderless
          />
        </t-form-item>
        
        <!-- 学历 -->
        <t-form-item label="5. 学历" name="education">
          <t-input
            v-model="formData.education"
            placeholder="请输入你的学历"
            type="text"
            borderless
          />
        </t-form-item>
        
        <!-- 职业 -->
        <t-form-item label="6. 职业" name="occupation">
          <t-input
            v-model="formData.occupation"
            placeholder="请输入你的职业"
            type="text"
            borderless
          />
        </t-form-item>
        
        <!-- 性取向 -->
        <t-form-item label="7. 性取向" name="orientation">
          <div class="picker-trigger" @click="showOrientationPicker = true">
            {{ getOrientationLabel(formData.orientation) || '请选择你的性取向' }}
          </div>
          <t-popup v-model:visible="showOrientationPicker" placement="bottom">
            <t-picker
              v-model="formData.orientation"
              :columns="[orientationOptions]"
              @confirm="onOrientationConfirm"
              @cancel="showOrientationPicker = false"
              title="选择性取向"
            />
          </t-popup>
        </t-form-item>
        
        <!-- 婚姻状态 -->
        <t-form-item label="8. 婚姻状态" name="maritalStatus">
          <div class="picker-trigger" @click="showMaritalPicker = true">
            {{ getMaritalLabel(formData.maritalStatus) || '请选择你的婚姻状态' }}
          </div>
          <t-popup v-model:visible="showMaritalPicker" placement="bottom">
            <t-picker
              v-model="formData.maritalStatus"
              :columns="[maritalStatusOptions]"
              @confirm="onMaritalConfirm"
              @cancel="showMaritalPicker = false"
              title="选择婚姻状态"
            />
          </t-popup>
        </t-form-item>
      </t-form>
    </div>

    <div class="form-container detail-container">
      <div class="form-title">详细信息</div>
      <t-form 
        ref="detailForm"
        :data="formData"
        :rules="rules"
        label-align="top"
        reset-type="empty"
        show-error-message
        scroll-to-first-error="auto"
        layout="vertical"
      >
        <!-- 常居住地 -->
        <t-form-item label="9. 常居住地" name="residence">
          <div class="picker-trigger" @click="showResidencePicker = true">
            {{ getAddressLabel(formData.residence) || '请选择常居住地' }}
          </div>
          <t-popup v-model:visible="showResidencePicker" placement="bottom">
            <t-picker
              v-model="formData.residence"
              :columns="[provinceOptions, cityOptions[0]]"
              @confirm="onResidenceConfirm"
              @cancel="showResidencePicker = false"
              title="选择常居住地"
            />
          </t-popup>
        </t-form-item>
        
        <!-- 户籍所在地 -->
        <t-form-item label="10. 户籍所在地" name="hometown">
          <div class="picker-trigger" @click="showHometownPicker = true">
            {{ getAddressLabel(formData.hometown) || '请选择户籍所在地' }}
          </div>
          <t-popup v-model:visible="showHometownPicker" placement="bottom">
            <t-picker
              v-model="formData.hometown"
              :columns="[provinceOptions, cityOptions[0]]"
              @confirm="onHometownConfirm"
              @cancel="showHometownPicker = false"
              title="选择户籍所在地"
            />
          </t-popup>
        </t-form-item>
        
        <!-- 房车情况 -->
        <t-form-item label="11. 房车情况" name="assets">
          <div class="picker-trigger" @click="showAssetsPicker = true">
            {{ getAssetsLabel(formData.assets) || '请选择房车情况' }}
          </div>
          <t-popup v-model:visible="showAssetsPicker" placement="bottom">
            <t-picker
              v-model="formData.assets"
              :columns="[assetsOptions]"
              @confirm="onAssetsConfirm"
              @cancel="showAssetsPicker = false"
              title="选择房车情况"
            />
          </t-popup>
        </t-form-item>
      </t-form>
    </div>

    <!-- 形婚需求 -->
    <div class="form-container detail-container">
      <div class="form-title">形婚需求</div>
      <t-form 
        ref="requirementForm"
        :data="formData"
        :rules="rules"
        label-align="top"
        reset-type="empty"
        show-error-message
        scroll-to-first-error="auto"
        layout="vertical"
      >
        <!-- 期望地区 -->
        <t-form-item label="12. 期望地区" name="expectedLocation">
          <t-input
            v-model="formData.expectedLocation"
            placeholder="请输入期望的形婚地区"
            type="text"
            borderless
          />
        </t-form-item>
        
        <!-- 领证意愿 -->
        <t-form-item label="13. 孩子意愿" name="childIntent">
          <div class="picker-trigger" @click="showMarriageIntentPicker = true">
            {{ getChildIntentLabel(formData.childIntent) || '请选择孩子意愿' }}
          </div>
          <t-popup v-model:visible="showMarriageIntentPicker" placement="bottom">
            <t-picker
              v-model="formData.childIntent"
              :columns="[childIntentOptions]"
              @confirm="onMarriageIntentConfirm"
              @cancel="showMarriageIntentPicker = false"
              title="选择孩子意愿"
            />
          </t-popup>
        </t-form-item>
        
        <!-- 领证需求 -->
        <t-form-item label="14. 领证需求" name="marriageRequirement">
          <div class="picker-trigger" @click="showMarriageRequirementPicker = true">
            {{ getMarriageRequirementLabel(formData.marriageRequirement) || '请选择领证需求' }}
          </div>
          <t-popup v-model:visible="showMarriageRequirementPicker" placement="bottom">
            <t-picker
              v-model="formData.marriageRequirement"
              :columns="[marriageRequirementOptions]"
              @confirm="onMarriageRequirementConfirm"
              @cancel="showMarriageRequirementPicker = false"
              title="选择领证需求"
            />
          </t-popup>
        </t-form-item>
        
        <!-- 自我介绍 -->
        <t-form-item label="15. 自我介绍" name="selfIntro">
          <t-textarea
            v-model="formData.selfIntro"
            placeholder="请简单介绍一下自己"
            :rows="4"
            borderless
            :maxlength="500"
          />
        </t-form-item>
        
        <!-- 期望对方 -->
        <t-form-item label="16. 期望对方" name="expectations">
          <t-textarea
            v-model="formData.expectations"
            placeholder="请描述一下期望的对象"
            :rows="4"
            borderless
            :maxlength="500"
          />
        </t-form-item>

        <!-- 提交按钮 -->
        <div class="button-group">
          <t-button theme="primary" size="large" @click="onSubmit">提交</t-button>
        </div>
      </t-form>
    </div>

    <!-- 底部文案说明 -->
    <div class="notice-text">
      <p>请认真填写个人信息，请保证个人信息的正确及完整性，如发现伪造个人信息产生严重恶性事件，本平台将保留诉讼权利！</p>
      <p>注意请形婚本人填写，如发现代为登记个人信息，将删除并永不服务！</p>
      <p>登记完成个人信息请告知小编，小编微信：<span class="highlight">lgbthelp</span></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import NavBar from '@/components/common/NavBar.vue'
import { useRouter } from 'vue-router'
import { 
  Form as TForm,
  FormItem as TFormItem,
  RadioGroup as TRadioGroup,
  Radio as TRadio,
  Button as TButton,
  Input as TInput,
  Picker as TPicker,
  Popup as TPopup,
  Textarea as TTextarea
} from 'tdesign-mobile-vue'
import { Toast } from 'antd-mobile'

const router = useRouter()
const form = ref<InstanceType<typeof TForm> | null>(null)
const detailForm = ref<InstanceType<typeof TForm> | null>(null)
const requirementForm = ref<InstanceType<typeof TForm> | null>(null)

// 表单数据
const formData = reactive({
  gender: [] as string[],
  birthday: '',
  height: '',
  weight: '',
  orientation: [] as string[],
  occupation: '',
  education: '',
  maritalStatus: [] as string[],
  residence: [] as string[],
  hometown: [] as string[],
  assets: [] as string[],
  expectedLocation: '',
  childIntent: [] as string[],
  marriageRequirement: [] as string[],
  selfIntro: '',
  expectations: ''
})

// 性别选项
const genderOptions = [
  { label: '男', value: 'male' },
  { label: '女', value: 'female' }
]

// 性取向选项
const orientationOptions = [
  { label: 'GAY', value: 'gay' },
  { label: 'LES', value: 'les' },
  { label: '无性恋', value: 'asexual' },
  { label: '其他', value: 'other' }
]

// 婚姻状态选项
const maritalStatusOptions = [
  { label: '未婚', value: 'single' },
  { label: '有婚史', value: 'married' }
]

// 地址选项
const provinceOptions = [
  { label: '广东省', value: 'guangdong' },
  { label: '浙江省', value: 'zhejiang' }
]

// 将城市数据改为数组格式
const cityOptions = [
  [
    { label: '深圳市', value: 'shenzhen' },
    { label: '广州市', value: 'guangzhou' }
  ],
  [
    { label: '杭州市', value: 'hangzhou' },
    { label: '宁波市', value: 'ningbo' }
  ]
]

// 房车情况选项
const assetsOptions = [
  { label: '有房有车', value: 'both' },
  { label: '有房无车', value: 'house' },
  { label: '有车无房', value: 'car' },
  { label: '无房无车', value: 'none' }
]

// 领证意愿选项
const childIntentOptions = [
  { label: '要孩子', value: 'want' },
  { label: '不要孩子', value: 'noWant' },
  { label: '视情况而定', value: 'depends' }
]

// 领证需求选项
const marriageRequirementOptions = [
  { label: '必须领证', value: 'must' },
  { label: '不领证', value: 'no' },
  { label: '双方协商', value: 'negotiate' }
]

// 控制 Picker 显示
const showOrientationPicker = ref(false)
const showMaritalPicker = ref(false)
const showResidencePicker = ref(false)
const showHometownPicker = ref(false)
const showAssetsPicker = ref(false)
const showMarriageIntentPicker = ref(false)
const showMarriageRequirementPicker = ref(false)
const showGenderPicker = ref(false)

// Picker 确认事件处理
const onOrientationConfirm = (value: PickerValue[], context: { index: number[]; e: MouseEvent; label: string[] }) => {
  formData.orientation = value as string[]
  showOrientationPicker.value = false
}

const onMaritalConfirm = (value: PickerValue[], context: { index: number[]; e: MouseEvent; label: string[] }) => {
  formData.maritalStatus = value as string[]
  showMaritalPicker.value = false
}

const onResidenceConfirm = (value: PickerValue[], context: { index: number[]; e: MouseEvent; label: string[] }) => {
  formData.residence = value as string[]
  showResidencePicker.value = false
}

const onHometownConfirm = (value: PickerValue[], context: { index: number[]; e: MouseEvent; label: string[] }) => {
  formData.hometown = value as string[]
  showHometownPicker.value = false
}

const onAssetsConfirm = (value: PickerValue[], context: { index: number[]; e: MouseEvent; label: string[] }) => {
  formData.assets = value as string[]
  showAssetsPicker.value = false
}

const onMarriageIntentConfirm = (value: PickerValue[], context: { index: number[]; e: MouseEvent; label: string[] }) => {
  formData.childIntent = value as string[]
  showMarriageIntentPicker.value = false
}

const onMarriageRequirementConfirm = (value: PickerValue[], context: { index: number[]; e: MouseEvent; label: string[] }) => {
  formData.marriageRequirement = value as string[]
  showMarriageRequirementPicker.value = false
}

const onGenderConfirm = (value: PickerValue[], context: { index: number[]; e: MouseEvent; label: string[] }) => {
  formData.gender = value as string[]
  showGenderPicker.value = false
}

// 获取选项标签
const getOrientationLabel = (value: string[]) => {
  if (!value.length) return ''
  const option = orientationOptions.find(opt => opt.value === value[0])
  return option ? option.label : ''
}

const getMaritalLabel = (value: string[]) => {
  if (!value.length) return ''
  const option = maritalStatusOptions.find(opt => opt.value === value[0])
  return option ? option.label : ''
}

// 获取地址标签
const getAddressLabel = (value: string[]) => {
  if (!value.length) return ''
  const provinceIndex = provinceOptions.findIndex(opt => opt.value === value[0])
  if (provinceIndex === -1) return ''
  
  const province = provinceOptions[provinceIndex]
  const city = cityOptions[provinceIndex]?.find(opt => opt.value === value[1])
  
  return province && city ? `${province.label} ${city.label}` : ''
}

// 获取房车情况标签
const getAssetsLabel = (value: string[]) => {
  if (!value.length) return ''
  const option = assetsOptions.find(opt => opt.value === value[0])
  return option ? option.label : ''
}

// 获取性别标签
const getGenderLabel = (value: string[]) => {
  if (!value.length) return ''
  const option = genderOptions.find(opt => opt.value === value[0])
  return option ? option.label : ''
}

// 获取领证意愿标签
const getChildIntentLabel = (value: string[]) => {
  if (!value.length) return ''
  const option = childIntentOptions.find(opt => opt.value === value[0])
  return option ? option.label : ''
}

// 获取领证需求标签
const getMarriageRequirementLabel = (value: string[]) => {
  if (!value.length) return ''
  const option = marriageRequirementOptions.find(opt => opt.value === value[0])
  return option ? option.label : ''
}

// 表单验证规则
const rules = {
  gender: [{ required: true, message: '请选择性别' }],
  birthday: [{ required: true, message: '请输入出生年月' }],
  height: [
    { required: true, message: '请输入身高' },
    { validator: (val: string) => Number(val) >= 140 && Number(val) <= 220, message: '身高范围为140-220cm' }
  ],
  weight: [
    { required: true, message: '请输入体重' },
    { validator: (val: string) => Number(val) >= 30 && Number(val) <= 150, message: '体重范围为30-150kg' }
  ],
  orientation: [{ required: true, message: '请选择性取向' }],
  occupation: [{ required: true, message: '请输入职业' }],
  education: [{ required: true, message: '请输入学历' }],
  maritalStatus: [{ required: true, message: '请选择婚姻状态' }],
  residence: [{ required: true, message: '请选择常居住地' }],
  hometown: [{ required: true, message: '请选择户籍所在地' }],
  assets: [{ required: true, message: '请选择房车情况' }],
  expectedLocation: [{ required: true, message: '请输入期望地区' }],
  childIntent: [{ required: true, message: '请选择孩子意愿' }],
  marriageRequirement: [{ required: true, message: '请选择领证需求' }],
  selfIntro: [{ required: true, message: '请填写自我介绍' }],
  expectations: [{ required: true, message: '请填写期望对方' }]
}

// 检查登录状态
const checkLogin = () => {
  // 从 localStorage 获取登录状态，实际项目中可能需要从 store 或其他地方获取
  const token = localStorage.getItem('token')
  if (!token) {
    Toast.show({
      content: '请先登录后再进行信息登记',
      afterClose: () => {
        router.push('/login')
      }
    })
    return false
  }
  return true
}

// 在组件挂载时检查登录状态
onMounted(() => {
  checkLogin()
})

// 表单提交
const onSubmit = async () => {
  try {
    // 提交前检查登录状态
    if (!checkLogin()) {
      return
    }

    // 验证所有表单
    const basicValid = await form.value?.validate?.() || []
    const detailValid = await detailForm.value?.validate?.() || []
    const requirementValid = await requirementForm.value?.validate?.() || []

    // 检查是否有验证错误
    if (basicValid.length > 0 || detailValid.length > 0 || requirementValid.length > 0) {
      Toast.show({
        content: '请完整填写所有必填项',
        icon: 'fail'
      })
      return
    }

    // 检查所有必填字段是否都有值
    const requiredFields = Object.keys(rules)
    for (const field of requiredFields) {
      const value = formData[field]
      if (!value || (Array.isArray(value) && value.length === 0)) {
        Toast.show({
          content: rules[field][0].message,
          icon: 'fail'
        })
        return
      }
    }

    // 所有字段验证通过，继续下一步
    console.log('表单验证通过:', formData)
    Toast.show({
      content: '提交成功',
      icon: 'success'
    })
    
  } catch (error: any) {
    Toast.show({
      content: error?.message || '表单验证失败',
      icon: 'fail'
    })
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: #F6F7FB;
  padding-top: 44px;
}

/* 主色背景块 */
.color-block {
  position: absolute;
  top: 44px;
  left: 0;
  right: 0;
  height: 100px;
  background-color: #02C588;
}

/* 表单容器样式 */
.form-container {
  position: relative;
  z-index: 1;
  margin: 20px 16px 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
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

/* 覆盖 TDesign 的表单标签样式 */
:deep(.t-form__label) {
  margin-bottom: 8px !important;
  color: #333;
  font-size: 14px;
  text-align: left !important;
  justify-content: flex-start !important;
}

:deep(.t-form-item__label) {
  min-width: 120px;
  font-size: 14px;
  color: #333;
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  padding-bottom: 8px;
  text-align: left;
  justify-content: flex-start;
  line-height: 1.4;
  height: auto;
}

/* 调整表单项的内边距，让 label 和内容之间有更好的间距 */
:deep(.t-form__item) {
  padding: 12px 16px;
  margin-bottom: 4px;
  padding-bottom: 16px;
}

:deep(.t-form__item--bordered) {
  padding: 12px 16px;
  margin-bottom: 4px;
  padding-bottom: 16px;
}

:deep(.t-input),
:deep(.t-radio-group) {
  height: 100%;
  display: flex;
  align-items: center;
}

:deep(.t-input) {
  flex: 1;
  font-size: 14px;
  background-color: #F8F9FA;
  border-radius: 4px;
}

:deep(.t-input input) {
  font-size: 14px;
  height: 40px;
  background-color: #F8F9FA;
  text-align: left;
  padding-left: 12px;
}

:deep(.t-button) {
  margin-top: 32px;
  font-size: 14px;
}

:deep(.t-button--primary) {
  background-color: #02C588;
  border: none;
  
  &:active {
    background-color: #02b37b !important;
    color: #fff !important;
    opacity: 0.9;
  }

  &::after {
    border: none !important;
  }
  
  &.t-button--hover::after {
    background-color: #02b37b !important;
  }
}

.button-group {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  
  .t-button {
    height: 44px;
    flex: 1;
    margin-top: 16px;
  }
}

/* 隐藏表单项的错误提示 */
:deep(.t-form__item-extra) {
  display: none !important;
}

/* 表单标题样式 */
.form-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  padding: 16px 16px 8px;
}

.picker-trigger {
  color: #666;
  font-size: 14px;
  height: 40px;
  display: flex;
  align-items: center;
  flex: 1;
  background-color: #F8F9FA;
  border-radius: 4px;
  padding: 0 12px;
  justify-content: flex-start;
}

:deep(.t-picker) {
  --td-picker-bg-color: #fff;
}

:deep(.t-picker__title) {
  color: #333;
  font-size: 16px;
  font-weight: 500;
}

.detail-container {
  margin-top: 12px;
}

/* 底部文案说明样式 */
.notice-text {
  padding: 16px;
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  text-align: justify;
  margin: 12px 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.notice-text p {
  margin-bottom: 8px;
}

.notice-text p:last-child {
  margin-bottom: 0;
}

.notice-text .highlight {
  color: #02C588;
  font-weight: 500;
}

/* 添加文本域样式 */
:deep(.t-textarea) {
  background-color: #F8F9FA;
  border-radius: 4px;
  padding: 12px;
  font-size: 14px;
  width: 100%;
  min-height: 120px;
  
  &::placeholder {
    color: #999;
  }
}

:deep(.t-textarea__inner) {
  background-color: transparent;
  width: 100%;
  min-height: 120px;
  line-height: 1.5;
  resize: none;
}

:deep(.t-textarea__inner textarea) {
  min-height: 120px !important;
  height: auto !important;
}
</style> 