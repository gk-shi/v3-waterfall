import { createApp } from 'vue'
import App from './App.vue'
import V3waterfall from 'v3-waterfall'
import 'v3-waterfall/style.css'


createApp(App)
  .use(V3waterfall)
  .mount('#app')
