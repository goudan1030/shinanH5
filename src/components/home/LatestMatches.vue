<template>
  <div class="latest-matches">
    <Card title="最新匹配">
      <List>
        <List.Item
          v-for="match in matches"
          :key="match.id"
          :description="match.city"
          clickable
        >
          {{ match.match_no }}
        </List.Item>
      </List>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card, List } from 'antd-mobile'
defineProps({
  matches: Array
})
</script> 