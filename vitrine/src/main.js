import './index.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { setLogo } from '@/utils'

setLogo()

const app = createApp(App)
app.use(router).mount('#app')
