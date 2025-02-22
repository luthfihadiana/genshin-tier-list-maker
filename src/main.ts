import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import routes from './routes'
import { createWebHistory, createRouter } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App).use(router).mount('#app')
