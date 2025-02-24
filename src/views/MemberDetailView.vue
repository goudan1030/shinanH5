<template>
  <div class="member-detail">
    <NavBar title="会员详情" />
    
    <!-- 基本信息卡片 -->
    <div class="info-card">
      <template v-if="isLoading">
        <Skeleton title avatar :row="3" />
      </template>
      <template v-else>
        <!-- 用户基本信息 -->
        <div class="user-info">
          <div class="avatar-wrapper">
            <img :src="member?.avatar" class="avatar" />
            <div class="gender-tag" :class="member?.gender">
              {{ member?.gender === 'male' ? '男' : '女' }}
            </div>
          </div>
          <div class="info">
            <h3 class="nickname">{{ member?.nickname }}</h3>
            <div class="tags">
              <span class="tag">{{ getAge(member?.birth_year) }}岁</span>
              <span class="dot">·</span>
              <span class="tag">{{ formatEducation(member?.education) }}</span>
              <span class="dot">·</span>
              <span class="tag">{{ member?.occupation }}</span>
            </div>
            <p class="location">
              <Icon name="location" />
              {{ formatAddress(member?.province, member?.city, member?.district) }}
            </p>
          </div>
        </div>
        
        <!-- 详细资料 -->
        <div class="detail-info">
          <template v-if="!authStore.isLoggedIn && !isLoading">
            <div class="login-tip">
              <Icon name="lock" class="lock-icon" />
              <p>登录后可查看详细资料</p>
              <t-button block type="primary" @click="handleLogin">立即登录</t-button>
            </div>
          </template>
          <template v-else-if="!isLoading">
            <!-- 基本条件 -->
            <div class="section">
              <h4 class="section-title">基本条件</h4>
              <div class="condition-list">
                <div class="condition-item">
                  <label>身高</label>
                  <span>{{ member?.height }}cm</span>
                </div>
                <div class="condition-item">
                  <label>体重</label>
                  <span>{{ member?.weight }}kg</span>
                </div>
                <div class="condition-item">
                  <label>学历</label>
                  <span>{{ formatEducation(member?.education) }}</span>
                </div>
                <div class="condition-item">
                  <label>职业</label>
                  <span>{{ member?.occupation }}</span>
                </div>
                <div class="condition-item">
                  <label>婚史</label>
                  <span>{{ formatMarriageHistory(member?.marriage_history) }}</span>
                </div>
                <div class="condition-item">
                  <label>房车情况</label>
                  <span>{{ formatHouseCar(member?.house_car) }}</span>
                </div>
              </div>
            </div>

            <!-- 地址信息 -->
            <div class="section">
              <h4 class="section-title">地址信息</h4>
              <div class="address-list">
                <div class="address-item">
                  <label>现居地址</label>
                  <span>{{ formatAddress(member?.province, member?.city, member?.district) }}</span>
                </div>
                <div class="address-item">
                  <label>户籍地址</label>
                  <span>{{ formatAddress(member?.hukou_province, member?.hukou_city) }}</span>
                </div>
              </div>
            </div>

            <!-- 形婚要求 -->
            <div class="section">
              <h4 class="section-title">形婚要求</h4>
              <div class="requirement-tags">
                <span class="req-tag" v-if="member?.children_plan">
                  {{ formatChildrenPlan(member?.children_plan) }}
                </span>
                <span class="req-tag" v-if="member?.marriage_cert">
                  {{ formatMarriageCert(member?.marriage_cert) }}
                </span>
              </div>
              <div class="address-item" style="margin-top: 12px;">
                <label>目标区域</label>
                <span>{{ member?.target_area || '不限' }}</span>
              </div>
              <p class="description" v-if="member?.partner_requirement">
                {{ member?.partner_requirement }}
              </p>
            </div>

            <!-- 自我介绍 -->
            <div class="section">
              <h4 class="section-title">自我介绍</h4>
              <p class="description">{{ member?.self_description }}</p>
            </div>
          </template>
        </div>
      </template>
    </div>
    
    <!-- 底部操作栏 -->
    <DetailActionBar :member-id="route.params.id as string" />
    
    <!-- 为底部操作栏预留空间 -->
    <div class="bottom-space"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { memberApi } from '@/api/member'
import NavBar from '@/components/common/NavBar.vue'
import { showToast, Skeleton, Icon } from 'vant'
import type { Member } from '@/types'
import { 
  educationMap, 
  childrenPlanMap, 
  marriageCertMap,
  marriageHistoryMap,
  houseCarMap,
  getMappedValue 
} from '@/utils/memberMapping'
import DetailActionBar from '@/components/member/DetailActionBar.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const isLoading = ref(true)
const member = ref<Member | null>(null)

// 获取会员详情
const loadMemberDetail = async () => {
  try {
    isLoading.value = true
    const memberId = route.params.id as string
    const res = await memberApi.getMemberDetail(memberId)
    if (res.success) {
      member.value = res.data
    }
  } catch (error) {
    console.error('获取会员详情失败:', error)
    showToast('获取会员详情失败')
  } finally {
    isLoading.value = false
  }
}

// 计算年龄
const getAge = (birthYear: number) => {
  if (!birthYear) return ''
  return new Date().getFullYear() - birthYear
}

// 处理登录点击
const handleLogin = () => {
  router.push({
    path: '/login',
    query: { redirect: route.fullPath }
  })
}

// 添加格式化函数
const formatEducation = (education?: string) => getMappedValue(educationMap, education)
const formatChildrenPlan = (plan?: string) => getMappedValue(childrenPlanMap, plan)
const formatMarriageCert = (cert?: string) => getMappedValue(marriageCertMap, cert)
const formatMarriageHistory = (history?: string) => getMappedValue(marriageHistoryMap, history)
const formatHouseCar = (houseCar?: string) => getMappedValue(houseCarMap, houseCar)

// 格式化地址
const formatAddress = (province?: string, city?: string, district?: string): string => {
  const parts = [province, city, district].filter(Boolean)
  return parts.join(' ') || '暂无'
}

onMounted(() => {
  loadMemberDetail()
})
</script>

<style scoped>
.member-detail {
  min-height: 100vh;
  background: #f5f5f5;
  padding-top: 44px;
}

.info-card {
  margin: 16px;
  margin-bottom: 0;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.user-info {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.avatar-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.gender-tag {
  position: absolute;
  right: -4px;
  bottom: -4px;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  color: #fff;
}

.gender-tag.male {
  background: #2196F3;
}

.gender-tag.female {
  background: #FF4081;
}

.info {
  flex: 1;
  text-align: left;
}

.nickname {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px;
  color: #333;
}

.tags {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
}

.tag {
  font-size: 14px;
  color: #666;
}

.dot {
  color: #999;
}

.location {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #999;
  margin: 0;
}

.section {
  margin-bottom: 24px;
  text-align: left;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin: 0 0 16px;
  padding-left: 12px;
  border-left: 3px solid #02C588;
}

.condition-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.condition-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.condition-item label {
  font-size: 14px;
  color: #999;
}

.condition-item span {
  font-size: 14px;
  color: #333;
}

.requirement-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.req-tag {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 14px;
  color: #02C588;
  background: rgba(2, 197, 136, 0.1);
}

.description {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  margin: 0;
  white-space: pre-wrap;
}

.login-tip {
  text-align: center;
  padding: 32px 0;
}

.lock-icon {
  font-size: 32px;
  color: #999;
  margin-bottom: 12px;
}

.login-tip p {
  color: #999;
  margin-bottom: 16px;
}

:deep(.t-button) {
  height: 44px;
  font-size: 16px;
}

/* 添加地址列表样式 */
.address-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.address-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.address-item label {
  font-size: 14px;
  color: #999;
}

.address-item span {
  font-size: 14px;
  color: #333;
}

/* 让某些条件项占满整行 */
.condition-item.full-width {
  grid-column: 1 / -1;
}

/* 为底部操作栏预留空间 */
.bottom-space {
  height: 80px;
}
</style> 