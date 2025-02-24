import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'vant/lib/index.css'
import './style.css'
import App from './App.vue'
import router from './router'

// 导入 Vant 组件和样式
import { Dialog } from 'vant'
import 'vant/lib/index.css'
import 'vant/es/dialog/style'

// 导入 TDesign
import TDesign from 'tdesign-mobile-vue'
import 'tdesign-mobile-vue/es/style/index.css'
import './styles/tdesign-theme.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(TDesign)
app.use(Dialog)

app.mount('#app')
