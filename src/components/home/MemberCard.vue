<template>
  <div class="member-card">
    <!-- 用户基本信息区域 -->
    <div class="user-info">
      <div class="user-avatar">
        <img :src="member.avatar" :alt="member.nickname">
        <div class="gender-icon" :class="member.gender">
          <van-icon :name="member.gender === 'male' ? 'contact' : 'friends'" />
        </div>
      </div>
      <div class="user-meta">
        <!-- 昵称单独一行 -->
        <div class="nickname">{{ member.nickname }}</div>
        <!-- 详细信息一行，城市靠右 -->
        <div class="user-details">
          <div class="details-left">
            <span class="detail-item">{{ member.birthYear }}年</span>
            <span class="dot">·</span>
            <span class="detail-item">{{ member.education }}</span>
            <span class="dot">·</span>
            <span class="detail-item">{{ member.job }}</span>
          </div>
          <div class="location">{{ member.city }}</div>
        </div>
      </div>
    </div>

    <!-- 个人介绍 -->
    <div class="introduction">
      {{ member.introduction }}
    </div>

    <!-- 需求标签 -->
    <div class="tags">
      <div class="tag-group">
        <div class="tag-title">孩子需求：</div>
        <div class="tag-list">
          <van-tag 
            v-for="tag in member.childNeeds" 
            :key="tag"
            type="primary"
            plain
          >{{ tag }}</van-tag>
        </div>
      </div>
      <div class="tag-group">
        <div class="tag-title">领证需求：</div>
        <div class="tag-list">
          <van-tag 
            v-for="tag in member.marriageNeeds" 
            :key="tag"
            type="success"
            plain
          >{{ tag }}</van-tag>
        </div>
      </div>
    </div>

    <!-- 更新时间 -->
    <div class="update-time">
      {{ formatTime(member.updateTime) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon as VanIcon, Tag as VanTag } from 'vant'

interface Member {
  id: string
  avatar: string
  nickname: string
  gender: 'male' | 'female'
  city: string
  birthYear: number
  education: string
  job: string
  introduction: string
  childNeeds: string[]
  marriageNeeds: string[]
  updateTime: Date
}

defineProps<{
  member: Member
}>()

const formatTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  // 转换为分钟
  const minutes = Math.floor(diff / 1000 / 60)
  
  if (minutes === 0) {
    return '刚刚登记'
  }
  
  if (minutes < 60) {
    return `${minutes}分钟前`
  }
  
  // 转换为小时
  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours}小时前`
  }
  
  // 转换为天
  const days = Math.floor(hours / 24)
  if (days < 30) {
    return `${days}天前`
  }
  
  // 转换为月
  const months = Math.floor(days / 30)
  if (months < 12) {
    return `${months}个月前`
  }
  
  // 转换为年
  const years = Math.floor(months / 12)
  return `${years}年前`
}
</script>

<style scoped>
.member-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  text-align: left;
}

.user-info {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.user-avatar {
  position: relative;
  width: 48px;
  height: 48px;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 24px;
  object-fit: cover;
}

.gender-icon {
  position: absolute;
  right: -4px;
  bottom: -4px;
  width: 16px;
  height: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #fff;
}

.gender-icon.male {
  background: #2196F3;
}

.gender-icon.female {
  background: #FF4081;
}

.user-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nickname {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.user-details {
  display: flex;
  align-items: center;
  justify-content: space-between; /* 两端对齐 */
  font-size: 12px;
  color: #666;
}

.details-left {
  display: flex;
  align-items: center;
  gap: 4px;
}

.detail-item {
  white-space: nowrap;
}

.dot {
  color: #999;
}

.location {
  color: #999;
  font-size: 12px;
}

.update-time {
  font-size: 12px;
  color: #999;
  text-align: right;
  margin-top: 8px;
}

.introduction {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 12px;
  text-align: left;
}

.tags {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tag-group {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.tag-title {
  font-size: 12px;
  color: #999;
  white-space: nowrap;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  flex: 1;
  justify-content: flex-start;
}

:deep(.van-tag) {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
}
</style> 