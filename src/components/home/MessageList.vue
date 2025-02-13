<template>
  <div class="message-list">
    <List>
      <List.Item
        v-for="message in messages"
        :key="message.id"
        :description="message.time"
        clickable
      >
        {{ message.content }}
      </List.Item>
    </List>
  </div>
</template>

<script setup lang="ts">
import { List } from 'antd-mobile'
defineProps({
  messages: Array
})
</script> 