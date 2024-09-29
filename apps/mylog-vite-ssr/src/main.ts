import { createSSRApp } from 'vue'
import App from './App.vue'
import router from './views/router'

// SSR中，每次请求都要有新的App实例，也会新创建一个Pinia
export function createApp() {
  const app = createSSRApp(App)
  app.use(router)
  return { app, router }
}
