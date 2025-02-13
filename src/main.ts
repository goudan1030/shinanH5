import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'vant/lib/index.css'
import './style.css'
import App from './App.vue'
import router from './router'

// 导入 antd-mobile 样式
import 'antd-mobile/es/global'
import 'antd-mobile/bundle/style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
