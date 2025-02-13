<template>
  <div class="latest-members">
    <Card title="最新会员">
      <List>
        <List.Item
          v-for="member in members"
          :key="member.id"
          :description="`${member.city} · ${member.gender === 'male' ? '男' : '女'}`"
        >
          {{ member.member_no }}
        </List.Item>
      </List>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card, List } from 'antd-mobile'
defineProps({
  members: Array
})
</script> 