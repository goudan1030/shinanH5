<script setup lang="ts">
import { onMounted } from 'vue'
import axios from 'axios'

onMounted(async () => {
  try {
    console.log('Testing API connection...')
    console.log('API URL:', import.meta.env.VITE_API_URL)
    
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/test`)
    console.log('API test response:', response.data)
  } catch (error) {
    console.error('API test failed:', error)
    if (axios.isAxiosError(error)) {
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data
      })
    }
  }
})
</script>

<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style>
/* 重置默认样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #F7F8FC;  /* 修改背景色 */
}

#app {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
  background-color: #F7F8FC;  /* 修改背景色 */
}
</style>
