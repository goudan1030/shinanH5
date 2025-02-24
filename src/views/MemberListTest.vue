<template>
  <div class="member-list-test">
    <h2>会员列表测试页面</h2>
    
    <!-- 筛选表单 -->
    <el-form :inline="true" :model="filters">
      <el-form-item label="性别">
        <el-select v-model="filters.gender">
          <el-option label="不限" value="" />
          <el-option label="男" value="男" />
          <el-option label="女" value="女" />
        </el-select>
      </el-form-item>
      <!-- 其他筛选条件 -->
    </el-form>

    <!-- 会员列表 -->
    <el-table :data="members" border>
      <el-table-column prop="member_no" label="会员编号" />
      <el-table-column prop="gender" label="性别" />
      <el-table-column prop="birth_year" label="出生年份" />
      <el-table-column prop="height" label="身高" />
      <el-table-column prop="education" label="学历" />
      <el-table-column prop="occupation" label="职业" />
      <el-table-column prop="location" label="所在地" />
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="page"
      v-model:page-size="pageSize"
      :total="total"
      @current-change="loadMembers"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { memberApi } from '@/api/member'

const members = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)
const filters = ref({
  gender: '',
  ageStart: '',
  ageEnd: '',
  heightStart: '',
  heightEnd: '',
  education: '',
  location: ''
})

const loadMembers = async () => {
  try {
    const res = await memberApi.getPublicMembers({
      page: page.value,
      pageSize: pageSize.value,
      ...filters.value
    })
    members.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    console.error('加载会员列表失败:', error)
  }
}

onMounted(() => {
  loadMembers()
})
</script> 