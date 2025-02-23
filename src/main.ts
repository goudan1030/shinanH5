import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'vant/lib/index.css'
import './style.css'
import App from './App.vue'
import router from './router'

// 导入 antd-mobile 样式
import 'antd-mobile/es/global'
import 'antd-mobile/bundle/style.css'

// 导入 TDesign Mobile 样式
import 'tdesign-mobile-vue/es/style/index.css'
// 导入自定义主题覆盖
import './styles/tdesign-theme.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')
